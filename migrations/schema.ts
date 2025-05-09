import { pgTable, foreignKey, unique, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const referralCodes = pgTable("referral_codes", {
	id: serial("id").primaryKey().notNull(),
	code: text("code").notNull(),
	creatorId: integer("creator_id").references(() => users.id),
	creatorTelegram: text("creator_telegram"),
	discountPercent: integer("discount_percent").default(5),
	commissionPercent: integer("commission_percent").default(10),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		referralCodesCodeUnique: unique("referral_codes_code_unique").on(table.code),
	}
});

export const leads = pgTable("leads", {
	id: serial("id").primaryKey().notNull(),
	telegram: text("telegram").notNull(),
	selectedServices: jsonb("selected_services").notNull(),
	totalValue: integer("total_value").notNull(),
	message: text("message"),
	createdAt: text("created_at").notNull(),
	referralCode: text("referral_code").references(() => referralCodes.code),
	discountApplied: integer("discount_applied").default(0),
});

export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	username: text("username").notNull(),
	password: text("password").notNull(),
	isAdmin: boolean("is_admin").default(false),
	telegramHandle: text("telegram_handle"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
},
(table) => {
	return {
		usersUsernameUnique: unique("users_username_unique").on(table.username),
	}
});

export const referralTracking = pgTable("referral_tracking", {
	id: serial("id").primaryKey().notNull(),
	referralCodeId: integer("referral_code_id").references(() => referralCodes.id),
	leadId: integer("lead_id").references(() => leads.id),
	commissionAmount: integer("commission_amount"),
	isPaid: boolean("is_paid").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const services = pgTable("services", {
	id: serial("id").primaryKey().notNull(),
	category: text("category").notNull(),
	name: text("name").notNull(),
	price: text("price").notNull(),
	description: text("description"),
	exampleType: text("example_type"),
	exampleContent: text("example_content"),
});

export const packages = pgTable("packages", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
	description: text("description"),
	originalPrice: integer("original_price").notNull(),
	discountPercent: integer("discount_percent").default(15),
	className: text("class_name"),
	buttonClassName: text("button_class_name"),
	discountBadgeClassName: text("discount_badge_class_name"),
});

export const packageServices = pgTable("package_services", {
	id: serial("id").primaryKey().notNull(),
	packageId: integer("package_id").references(() => packages.id),
	serviceId: integer("service_id").references(() => services.id),
	isHidden: boolean("is_hidden").default(false),
});