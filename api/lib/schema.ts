import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
  telegramHandle: text("telegram_handle"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Service schema
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  description: text("description"),
  exampleType: text("example_type"), // can be 'link' or 'image'
  exampleContent: text("example_content"), // URL for link or image path
});

// Referral codes schema
export const referralCodes = pgTable("referral_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  creatorId: integer("creator_id").references(() => users.id),
  creatorTelegram: text("creator_telegram"),
  discountPercent: integer("discount_percent").default(5),
  commissionPercent: integer("commission_percent").default(10),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Lead schema
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  telegram: text("telegram").notNull(),
  selectedServices: jsonb("selected_services").notNull(), // Array of selected services
  totalValue: integer("total_value").notNull(),
  message: text("message"),
  createdAt: text("created_at").notNull(),
  referralCode: text("referral_code").references(() => referralCodes.code),
  discountApplied: integer("discount_applied").default(0),
});

// Referral tracking schema
export const referralTracking = pgTable("referral_tracking", {
  id: serial("id").primaryKey(),
  referralCodeId: integer("referral_code_id").references(() => referralCodes.id),
  leadId: integer("lead_id").references(() => leads.id),
  commissionAmount: integer("commission_amount"),
  isPaid: boolean("is_paid").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
  telegramHandle: true,
});

export const insertServiceSchema = createInsertSchema(services).pick({
  category: true,
  name: true,
  price: true,
  description: true,
  exampleType: true,
  exampleContent: true,
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  telegram: true,
  selectedServices: true,
  totalValue: true,
  message: true,
  createdAt: true,
  referralCode: true,
  discountApplied: true,
});

export const insertReferralCodeSchema = createInsertSchema(referralCodes).pick({
  code: true,
  creatorId: true,
  creatorTelegram: true,
  discountPercent: true,
  commissionPercent: true,
  isActive: true,
});

export const insertReferralTrackingSchema = createInsertSchema(referralTracking).pick({
  referralCodeId: true,
  leadId: true,
  commissionAmount: true,
  isPaid: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = {
  id: number;
  telegram: string;
  selectedServices: string | any[];
  totalValue: number;
  message: string | null;
  createdAt: string;
  referralCode: string | null;
  discountApplied: number | null;
};

export type InsertReferralCode = z.infer<typeof insertReferralCodeSchema>;
export type ReferralCode = typeof referralCodes.$inferSelect;

export type InsertReferralTracking = z.infer<typeof insertReferralTrackingSchema>;
export type ReferralTracking = typeof referralTracking.$inferSelect;

// Selected service type
export type SelectedService = {
  category: string;
  name: string;
  price: string | number;
}; 