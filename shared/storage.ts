import { 
  users, type User, type InsertUser,
  leads, type Lead, type InsertLead, 
  services, type Service, type InsertService,
  referralCodes, type ReferralCode, type InsertReferralCode,
  referralTracking, type ReferralTracking, type InsertReferralTracking
} from "./schema";
import { db } from "../server/db";
import { eq, and, desc, isNull } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  getUserByTelegramHandle(telegramHandle: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  createLead(lead: InsertLead): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
  getLeadsByReferralCode(referralCode: string): Promise<Lead[]>;
  
  getAllServices(): Promise<Service[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  deleteService(id: number): Promise<boolean>;
  
  // Referral code methods
  createReferralCode(referralCode: InsertReferralCode): Promise<ReferralCode>;
  getReferralCodeByCode(code: string): Promise<ReferralCode | undefined>;
  getAllReferralCodes(): Promise<ReferralCode[]>;
  updateReferralCode(id: number, data: Partial<InsertReferralCode>): Promise<ReferralCode | undefined>;
  deleteReferralCode(id: number): Promise<boolean>;
  
  // Referral tracking methods
  createReferralTracking(tracking: InsertReferralTracking): Promise<ReferralTracking>;
  getReferralTrackingByLeadId(leadId: number): Promise<ReferralTracking | undefined>;
  getReferralTrackingsByReferralCodeId(referralCodeId: number): Promise<ReferralTracking[]>;
  updateReferralTrackingPaymentStatus(id: number, isPaid: boolean): Promise<ReferralTracking | undefined>;
  createAdmin(username: string, password: string): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByTelegramHandle(telegramHandle: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.telegramHandle, telegramHandle));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    try {
      const [updatedUser] = await db
        .update(users)
        .set(userData)
        .where(eq(users.id, id))
        .returning();
      return updatedUser;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      return undefined;
    }
  }

  // Lead methods
  async createLead(insertLead: InsertLead): Promise<Lead> {
    // Handle null values for optional fields
    const values = {
      ...insertLead,
      message: insertLead.message ?? null,
      referralCode: insertLead.referralCode ?? null,
      discountApplied: insertLead.discountApplied ?? 0,
    };
    
    const [lead] = await db
      .insert(leads)
      .values(values)
      .returning();
    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLeadsByReferralCode(referralCode: string): Promise<Lead[]> {
    return await db.select().from(leads)
      .where(eq(leads.referralCode, referralCode))
      .orderBy(desc(leads.createdAt));
  }

  // Service methods
  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.category, category));
  }
  
  async deleteService(id: number): Promise<boolean> {
    try {
      const result = await db.delete(services).where(eq(services.id, id));
      return true;
    } catch (error) {
      console.error(`Error deleting service with ID ${id}:`, error);
      return false;
    }
  }

  // Referral code methods
  async createReferralCode(referralCode: InsertReferralCode): Promise<ReferralCode> {
    const [code] = await db
      .insert(referralCodes)
      .values(referralCode)
      .returning();
    return code;
  }

  async getReferralCodeByCode(code: string): Promise<ReferralCode | undefined> {
    const [referralCode] = await db.select().from(referralCodes).where(eq(referralCodes.code, code));
    return referralCode || undefined;
  }

  async getAllReferralCodes(): Promise<ReferralCode[]> {
    return await db.select().from(referralCodes);
  }

  async updateReferralCode(id: number, data: Partial<InsertReferralCode>): Promise<ReferralCode | undefined> {
    try {
      const [updatedCode] = await db
        .update(referralCodes)
        .set(data)
        .where(eq(referralCodes.id, id))
        .returning();
      return updatedCode;
    } catch (error) {
      console.error(`Error updating referral code with ID ${id}:`, error);
      return undefined;
    }
  }

  async deleteReferralCode(id: number): Promise<boolean> {
    try {
      await db.delete(referralCodes).where(eq(referralCodes.id, id));
      return true;
    } catch (error) {
      console.error(`Error deleting referral code with ID ${id}:`, error);
      return false;
    }
  }

  // Referral tracking methods
  async createReferralTracking(tracking: InsertReferralTracking): Promise<ReferralTracking> {
    const [newTracking] = await db
      .insert(referralTracking)
      .values(tracking)
      .returning();
    return newTracking;
  }

  async getReferralTrackingByLeadId(leadId: number): Promise<ReferralTracking | undefined> {
    const [tracking] = await db.select().from(referralTracking).where(eq(referralTracking.leadId, leadId));
    return tracking || undefined;
  }

  async getReferralTrackingsByReferralCodeId(referralCodeId: number): Promise<ReferralTracking[]> {
    return await db.select().from(referralTracking)
      .where(eq(referralTracking.referralCodeId, referralCodeId))
      .orderBy(desc(referralTracking.createdAt));
  }

  async updateReferralTrackingPaymentStatus(id: number, isPaid: boolean): Promise<ReferralTracking | undefined> {
    try {
      const [updatedTracking] = await db
        .update(referralTracking)
        .set({ isPaid })
        .where(eq(referralTracking.id, id))
        .returning();
      return updatedTracking;
    } catch (error) {
      console.error(`Error updating referral tracking payment status with ID ${id}:`, error);
      return undefined;
    }
  }
  
  // Helper method to seed initial service data
  async seedServices(serviceData: InsertService[]): Promise<void> {
    // Check if services table is empty
    const existingServices = await db.select().from(services);
    
    if (existingServices.length === 0) {
      // Seed the services table
      await db.insert(services).values(serviceData);
    }
  }

  async createAdmin(username: string, password: string): Promise<User> {
    const [admin] = await db.insert(users).values({
      username,
      password,
      isAdmin: true,
      createdAt: new Date()
    }).returning();
    return admin;
  }
}

export const storage = new DatabaseStorage(); 