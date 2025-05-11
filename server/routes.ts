import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import "express-session";
import { storage } from "../api/lib/storage";
import { z } from "zod";
import { 
  insertLeadSchema, 
  insertReferralCodeSchema, 
  insertReferralTrackingSchema, 
  insertUserSchema,
  type SelectedService, 
  type InsertService, 
  type InsertReferralCode,
  type InsertReferralTracking,
  type InsertUser,
  type Service,
  services
} from "@shared/schema";
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';
import { sendTelegramNotification, sendDirectTelegramMessage } from "../api/lib/telegram";
import axios from "axios";
import express from 'express';
import { Router } from "express";
import { db } from "../api/lib/db";

// Validate Telegram handle format
const telegramHandleSchema = z.string().min(2).startsWith('@');

// Create admin validation schema
const adminAuthSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

// Referral code validation schema
const referralCodeSchema = z.object({
  code: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/),
  creatorTelegram: telegramHandleSchema,
  discountPercent: z.number().int().min(0).max(50).optional(),
  commissionPercent: z.number().int().min(0).max(50).optional(),
});

// Prepare service data for database seeding
function prepareServicesToSeed(): InsertService[] {
  try {
    // Read and parse the CSV file
    const csvPath = join(process.cwd(), 'services - services.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    console.log('📄 Reading CSV file...');
    
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relaxColumnCount: true
    });
    
    console.log(`📊 Parsed ${records.length} records from CSV`);
    console.log('📝 Sample record:', records[0]);

    // Convert CSV records to InsertService format
    return records.map((record: any) => {
      // Log raw values for debugging
      console.log('Raw record values:', {
        category: record.category,
        name: record.name,
        price: record.price,
        description: record.description,
        exampleType: record.exampleType,
        exampleContent: record.exampleContent
      });

      // Keep the original price value, including 'tbd'
      const price = record.price?.trim() || null;

      const service = {
        category: record.category.trim(),
        name: record.name.trim(),
        price: price,
        description: record.description?.trim() || null,
        exampleType: record.exampleType?.trim() || null,
        exampleContent: record.exampleContent?.trim()?.replace(/attached_assets\\/g, '/service-examples/') || null
      };

      console.log('Processed service:', service);
      return service;
    });
  } catch (error) {
    console.error('Error reading services CSV:', error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed the database with services if needed
  try {
    await (storage as any).seedServices(prepareServicesToSeed());
    console.log('Services seeding check completed');
  } catch (error) {
    console.error('Error checking/seeding services:', error);
  }

  // Temporary endpoint to force reseed services
  app.post('/api/admin/reseed-services', async (_req: Request, res: Response) => {
    try {
      // Delete all services
      await db.delete(services);
      console.log('Deleted all services');

      // Seed with fresh data
      await (storage as any).seedServices(prepareServicesToSeed());
      console.log('Reseeded services');

      res.json({ message: 'Services reseeded successfully' });
    } catch (error) {
      console.error('Error reseeding services:', error);
      res.status(500).json({ error: 'Failed to reseed services' });
    }
  });

  // API endpoint to get all services
  app.get('/api/services', async (_req: Request, res: Response) => {
    try {
      const allServices = await storage.getAllServices();
      
      // Group services by category
      const servicesByCategory: Record<string, Service[]> = {};
      allServices.forEach((service: Service) => {
        if (!servicesByCategory[service.category]) {
          servicesByCategory[service.category] = [];
        }
        servicesByCategory[service.category].push(service);
      });
      
      res.json({
        categories: Object.keys(servicesByCategory),
        services: servicesByCategory
      });
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // API endpoint to get all service categories
  app.get('/api/categories', async (_req: Request, res: Response) => {
    try {
      const allServices = await storage.getAllServices();
      
      // Extract unique categories
      const categoriesSet = new Set<string>();
      allServices.forEach(service => {
        categoriesSet.add(service.category);
      });
      const categories = Array.from(categoriesSet);
      
      // Get the minimum price for each category
      const categoryMinPrices: Record<string, number | null> = {};
      
      categories.forEach(category => {
        const servicesInCategory = allServices.filter(service => service.category === category);
        const prices = servicesInCategory
          .map(service => {
            const price = service.price;
            if (typeof price === 'string') {
              // Handle ranges like "200-400" or just numbers as strings
              if (price.includes('-')) {
                return parseInt(price.split('-')[0], 10);
              }
              return parseInt(price, 10);
            }
            return price;
          })
          .filter(price => !isNaN(price));
        
        if (prices.length > 0) {
          categoryMinPrices[category] = Math.min(...prices);
        } else {
          categoryMinPrices[category] = null; // No numeric price found
        }
      });
      
      return res.status(200).json({
        categories,
        categoryMinPrices
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({
        message: "Failed to fetch categories. Please try again later."
      });
    }
  });

  // API endpoint to get services by category
  app.get('/api/services/:category', async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const allServices = await storage.getAllServices();
      
      const servicesInCategory = allServices.filter((service: Service) => service.category === category);
      
      const formattedServices = servicesInCategory
        .map((service: Service) => {
          return {
            ...service,
            price: parseFloat(service.price.toString())
          };
        });
      
      // Calculate total price
      const prices = formattedServices
        .map(service => service.price)
        .filter((price: number) => !isNaN(price));
      
      const totalPrice = prices.reduce((sum, price) => sum + price, 0);
      
      res.json({
        services: formattedServices,
        totalPrice
      });
    } catch (error) {
      console.error("Error fetching services by category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // API endpoint to delete a service
  app.delete('/api/services/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          message: "Invalid service ID"
        });
      }
      
      const success = await storage.deleteService(id);
      
      if (success) {
        return res.status(200).json({
          message: "Service deleted successfully"
        });
      } else {
        return res.status(404).json({
          message: "Service not found or could not be deleted"
        });
      }
    } catch (error) {
      console.error(`Error deleting service with ID ${req.params.id}:`, error);
      return res.status(500).json({
        message: "Failed to delete service. Please try again later."
      });
    }
  });

  // API endpoint to submit interest form
  app.post('/api/leads', async (req: Request, res: Response) => {
    try {
      const { telegram, message, selectedServices, totalValue } = req.body;

      // Validate telegram handle
      const telegramResult = z.string().startsWith('@').safeParse(telegram);
      if (!telegramResult.success) {
        return res.status(400).json({
          message: "Invalid Telegram handle. Must start with @"
        });
      }

      // Validate selected services
      if (!Array.isArray(selectedServices) || selectedServices.length === 0) {
        return res.status(400).json({
          message: "You must select at least one service"
        });
      }

      // Convert selected services to JSON string for storage if needed
      const servicesJson = typeof selectedServices === 'string' 
        ? selectedServices
        : JSON.stringify(selectedServices);

      // Create the lead
      const lead = await storage.createLead({
        telegram,
        message: message || null,
        selectedServices: servicesJson,
        totalValue: Number(totalValue) || 0,
        createdAt: new Date().toISOString()
      });

      // Send notification to Telegram
      try {
        const telegramResult = await sendTelegramNotification(lead);
        console.log('Telegram notification result:', telegramResult);
      } catch (error) {
        console.error('Error sending Telegram notification:', error);
        // Continue execution even if notification fails
      }

      return res.status(201).json({
        message: "Interest submitted successfully",
        lead
      });
    } catch (error) {
      console.error("Error submitting interest:", error);
      return res.status(500).json({
        message: "Failed to submit interest. Please try again later."
      });
    }
  });

  // API endpoint to get all leads
  app.get('/api/leads', async (_req: Request, res: Response) => {
    try {
      const leads = await storage.getAllLeads();
      return res.status(200).json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      return res.status(500).json({
        message: "Failed to fetch leads. Please try again later."
      });
    }
  });

  // API endpoint to submit specific service request
  app.post('/api/service-requests', async (req: Request, res: Response) => {
    try {
      const { telegram, requestedService } = req.body;

      // Validate telegram handle
      const telegramResult = z.string().startsWith('@').safeParse(telegram);
      if (!telegramResult.success) {
        return res.status(400).json({
          message: "Invalid Telegram handle. Must start with @"
        });
      }

      if (!requestedService || typeof requestedService !== 'string' || requestedService.trim().length < 3) {
        return res.status(400).json({
          message: "Please provide a description of the service you're looking for"
        });
      }

      // Check referral code if provided
      let referralInfo = '';
      if (req.body.referralCode) {
        const referralCode = await storage.getReferralCodeByCode(req.body.referralCode);
        if (referralCode) {
          referralInfo = `\nReferral Code: ${req.body.referralCode}\nReferred by: ${referralCode.creatorTelegram}`;
        }
      }

      // Send notification to Telegram about the service request
      try {
        const message = `
🔍 New Custom Service Request! 🔍

Telegram: ${telegram}
Requested Service:
${requestedService}${referralInfo}
`;

        // Use the Telegram bot to send the notification
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        if (!botToken || !chatId) {
          console.log('Telegram notification skipped: Bot token or chat ID not provided');
          return res.status(500).json({
            message: "Service request notification failed. Please try again."
          });
        }

        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await axios.post(telegramUrl, {
          chat_id: chatId,
          text: message
        });

        if (response.data.ok) {
          console.log('Service request notification sent successfully');
          return res.status(201).json({
            message: "Service request submitted successfully"
          });
        } else {
          console.error('Failed to send service request notification:', response.data);
          return res.status(500).json({
            message: "Service request notification failed. Please try again."
          });
        }
      } catch (error) {
        console.error('Error sending service request notification:', error);
        return res.status(500).json({
          message: "Service request notification failed. Please try again."
        });
      }
    } catch (error) {
      console.error("Error submitting service request:", error);
      return res.status(500).json({
        message: "Failed to submit service request. Please try again later."
      });
    }
  });

  // ===== REFERRAL SYSTEM ROUTES =====

  // Check if a referral code is valid
  app.get('/api/referral-code/:code', async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      
      if (!code || typeof code !== 'string') {
        return res.status(400).json({ 
          message: "Invalid referral code format",
          valid: false
        });
      }

      const referralCode = await storage.getReferralCodeByCode(code);

      if (!referralCode || !referralCode.isActive) {
        return res.status(404).json({ 
          message: "Referral code not found or inactive", 
          valid: false
        });
      }

      return res.status(200).json({
        valid: true,
        discount: referralCode.discountPercent,
        message: `Referral code valid! You'll receive ${referralCode.discountPercent}% discount.`
      });
    } catch (error) {
      console.error("Error validating referral code:", error);
      return res.status(500).json({
        message: "Failed to validate referral code. Please try again later.",
        valid: false
      });
    }
  });

  // Submit lead with referral code
  app.post('/api/leads-with-referral', async (req: Request, res: Response) => {
    try {
      const { telegram, message, selectedServices, totalValue, referralCode } = req.body;
      
      // Validate telegram handle
      const telegramResult = telegramHandleSchema.safeParse(telegram);
      if (!telegramResult.success) {
        return res.status(400).json({
          message: "Invalid Telegram handle. Must start with @"
        });
      }

      // Validate selected services
      if (!Array.isArray(selectedServices) || selectedServices.length === 0) {
        return res.status(400).json({
          message: "You must select at least one service"
        });
      }

      let discountAmount = 0;
      let referralCodeData = null;
      
      // Verify referral code if provided
      if (referralCode) {
        referralCodeData = await storage.getReferralCodeByCode(referralCode);
        
        if (!referralCodeData || !referralCodeData.isActive) {
          return res.status(400).json({
            message: "Invalid or inactive referral code"
          });
        }
        
        // Calculate discount (5% by default or configured amount)
        const discountPercent = referralCodeData.discountPercent || 5;
        discountAmount = Math.round((totalValue * discountPercent) / 100);
      }
      
      // Convert selected services to JSON string for storage if needed
      const servicesJson = typeof selectedServices === 'string' 
        ? selectedServices
        : JSON.stringify(selectedServices);

      // Create the lead
      const lead = await storage.createLead({
        telegram,
        message: message || null,
        selectedServices: servicesJson,
        totalValue: Number(totalValue) || 0,
        createdAt: new Date().toISOString(),
        referralCode: referralCode || null,
        discountApplied: discountAmount
      });

      // If referral code was used, create a tracking record
      if (referralCodeData) {
        // Calculate commission (10% by default or configured amount)
        const commissionPercent = referralCodeData.commissionPercent || 10;
        const commissionAmount = Math.round((totalValue * commissionPercent) / 100);
        
        await storage.createReferralTracking({
          referralCodeId: referralCodeData.id,
          leadId: lead.id,
          commissionAmount,
          isPaid: false
        });
        
        // Notify referrer about commission earned
        try {
          const message = `🎉 Referral Commission Alert! 🎉\n\nSomeone just used your referral code: ${referralCode}\nCommission amount: $${commissionAmount}\n\nThe lead will be contacted soon.`;

          if (referralCodeData.creatorTelegram) {
            await sendDirectTelegramMessage(
              referralCodeData.creatorTelegram,
              message
            );
          }
        } catch (notificationError) {
          console.error('Error sending referrer notification:', notificationError);
          // Continue execution even if notification fails
        }
      }

      // Send notification to admin with referral info
      try {
        let telegramMessage = '';
        
        if (referralCode) {
          telegramMessage = `
💼 New Lead (Referral)! 💼

Telegram: ${telegram}
Total Value: $${totalValue} 
Discount Applied: $${discountAmount} (${referralCodeData?.discountPercent || 5}%)
Final Price: $${totalValue - discountAmount}
Referral Code: ${referralCode}
Referred by: ${referralCodeData?.creatorTelegram || 'Unknown'}

Selected Services:
${typeof selectedServices === 'string' 
  ? selectedServices
  : selectedServices.map((service: SelectedService) => 
    `- ${service.category} / ${service.name}: ${service.price}`
  ).join('\\n')}

${message ? `Message:\\n${message}` : ''}
`;
        } else {
          telegramMessage = `
💼 New Lead! 💼

Telegram: ${telegram}
Total Value: $${totalValue}

Selected Services:
${typeof selectedServices === 'string' 
  ? selectedServices
  : selectedServices.map((service: SelectedService) => 
    `- ${service.category} / ${service.name}: ${service.price}`
  ).join('\\n')}

${message ? `Message:\\n${message}` : ''}
`;
        }
        
        const telegramResult = await sendTelegramNotification({ 
          ...lead, 
          customMessage: telegramMessage 
        } as any);
        console.log('Telegram notification result:', telegramResult);
      } catch (error) {
        console.error('Error sending Telegram notification:', error);
        // Continue execution even if notification fails
      }

      return res.status(201).json({
        message: "Interest submitted successfully",
        lead,
        discountApplied: discountAmount
      });
    } catch (error) {
      console.error("Error submitting interest with referral:", error);
      return res.status(500).json({
        message: "Failed to submit interest. Please try again later."
      });
    }
  });

  // ===== ADMIN ROUTES =====

  // Admin login
  // Create admin account
  app.post('/api/admin/create', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      const result = adminAuthSchema.safeParse({ username, password });
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid username or password format" 
        });
      }

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({
          message: "Username already exists"
        });
      }

      const admin = await storage.createAdmin(username, password);
      return res.status(201).json({
        message: "Admin account created successfully"
      });
    } catch (error) {
      console.error("Error creating admin:", error);
      return res.status(500).json({
        message: "Failed to create admin account"
      });
    }
  });

  app.post('/api/admin/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      // Validate request body
      const result = adminAuthSchema.safeParse({ username, password });
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid username or password format" 
        });
      }
      
      // Find user by username
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password || !user.isAdmin) {
        return res.status(401).json({ 
          message: "Invalid credentials or not an admin user" 
        });
      }
      
      // Set session data
      if (req.session) {
        req.session.userId = user.id;
        req.session.isAdmin = true;
      }
      
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
        }
      });
    } catch (error) {
      console.error("Error during admin login:", error);
      return res.status(500).json({
        message: "Failed to login. Please try again later."
      });
    }
  });
  
  // Admin logout
  app.post('/api/admin/logout', (req: Request, res: Response) => {
    if (req.session) {
      req.session.destroy((err: Error | null) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({
            message: "Failed to logout. Please try again."
          });
        }
        
        res.clearCookie('connect.sid');
        return res.status(200).json({
          message: "Logout successful"
        });
      });
    } else {
      return res.status(200).json({
        message: "Already logged out"
      });
    }
  });
  
  // Create a new referral code
  app.post('/api/admin/referral-codes', async (req: Request, res: Response) => {
    try {
      // Check if admin is logged in
      if (!req.session?.isAdmin) {
        return res.status(401).json({
          message: "Unauthorized. Admin login required."
        });
      }
      
      const { code, creatorTelegram, discountPercent, commissionPercent } = req.body;
      
      // Validate request body
      const result = referralCodeSchema.safeParse({
        code, 
        creatorTelegram,
        discountPercent: discountPercent || 5,
        commissionPercent: commissionPercent || 10
      });
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid referral code data", 
          errors: result.error.errors 
        });
      }
      
      // Check if code already exists
      const existingCode = await storage.getReferralCodeByCode(code);
      if (existingCode) {
        return res.status(409).json({
          message: "Referral code already exists"
        });
      }
      
      // Create new referral code
      const newReferralCode = await storage.createReferralCode({
        code,
        creatorTelegram,
        discountPercent: discountPercent || 5,
        commissionPercent: commissionPercent || 10,
        isActive: true
      });
      
      return res.status(201).json({
        message: "Referral code created successfully",
        referralCode: newReferralCode
      });
    } catch (error) {
      console.error("Error creating referral code:", error);
      return res.status(500).json({
        message: "Failed to create referral code. Please try again later."
      });
    }
  });
  
  // Get all referral codes
  app.get('/api/admin/referral-codes', async (req: Request, res: Response) => {
    try {
      // Check if admin is logged in
      if (!req.session?.isAdmin) {
        return res.status(401).json({
          message: "Unauthorized. Admin login required."
        });
      }
      
      const referralCodes = await storage.getAllReferralCodes();
      return res.status(200).json(referralCodes);
    } catch (error) {
      console.error("Error fetching referral codes:", error);
      return res.status(500).json({
        message: "Failed to fetch referral codes. Please try again later."
      });
    }
  });
  
  // Update referral code
  app.put('/api/admin/referral-codes/:id', async (req: Request, res: Response) => {
    try {
      // Check if admin is logged in
      if (!req.session?.isAdmin) {
        return res.status(401).json({
          message: "Unauthorized. Admin login required."
        });
      }
      
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          message: "Invalid referral code ID"
        });
      }
      
      const { discountPercent, commissionPercent, isActive } = req.body;
      
      // Update referral code
      const updatedReferralCode = await storage.updateReferralCode(id, {
        discountPercent,
        commissionPercent,
        isActive
      });
      
      if (!updatedReferralCode) {
        return res.status(404).json({
          message: "Referral code not found"
        });
      }
      
      return res.status(200).json({
        message: "Referral code updated successfully",
        referralCode: updatedReferralCode
      });
    } catch (error) {
      console.error(`Error updating referral code with ID ${req.params.id}:`, error);
      return res.status(500).json({
        message: "Failed to update referral code. Please try again later."
      });
    }
  });
  
  // Delete referral code
  app.delete('/api/admin/referral-codes/:id', async (req: Request, res: Response) => {
    try {
      // Check if admin is logged in
      if (!req.session?.isAdmin) {
        return res.status(401).json({
          message: "Unauthorized. Admin login required."
        });
      }
      
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          message: "Invalid referral code ID"
        });
      }
      
      const success = await storage.deleteReferralCode(id);
      
      if (!success) {
        return res.status(404).json({
          message: "Referral code not found or could not be deleted"
        });
      }
      
      return res.status(200).json({
        message: "Referral code deleted successfully"
      });
    } catch (error) {
      console.error(`Error deleting referral code with ID ${req.params.id}:`, error);
      return res.status(500).json({
        message: "Failed to delete referral code. Please try again later."
      });
    }
  });
  
  // Get leads by referral code
  app.get('/api/admin/referral-leads/:code', async (req: Request, res: Response) => {
    try {
      // Check if admin is logged in
      if (!req.session?.isAdmin) {
        return res.status(401).json({
          message: "Unauthorized. Admin login required."
        });
      }
      
      const { code } = req.params;
      
      if (!code) {
        return res.status(400).json({
          message: "Referral code is required"
        });
      }
      
      const leads = await storage.getLeadsByReferralCode(code);
      
      return res.status(200).json(leads);
    } catch (error) {
      console.error(`Error fetching leads for referral code ${req.params.code}:`, error);
      return res.status(500).json({
        message: "Failed to fetch leads. Please try again later."
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

export function setupRoutes(router: Router) {
  router.get("/api/services", async (req, res) => {
    try {
      const allServices = await storage.getAllServices();
      
      // Group services by category
      const servicesByCategory: Record<string, Service[]> = {};
      allServices.forEach((service: Service) => {
        if (!servicesByCategory[service.category]) {
          servicesByCategory[service.category] = [];
        }
        servicesByCategory[service.category].push(service);
      });
      
      res.json({
        categories: Object.keys(servicesByCategory),
        services: servicesByCategory
      });
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/api/services/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const allServices = await storage.getAllServices();
      
      const servicesInCategory = allServices.filter((service: Service) => service.category === category);
      
      const formattedServices = servicesInCategory
        .map((service: Service) => {
          return {
            ...service,
            price: parseFloat(service.price.toString())
          };
        });
      
      // Calculate total price
      const prices = formattedServices
        .map(service => service.price)
        .filter((price: number) => !isNaN(price));
      
      const totalPrice = prices.reduce((sum, price) => sum + price, 0);
      
      res.json({
        services: formattedServices,
        totalPrice
      });
    } catch (error) {
      console.error("Error fetching services by category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
