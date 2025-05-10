import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { leads } from './schema.js';
import { eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const client = postgres(connectionString, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client);

export async function createLead(data: typeof leads.$inferInsert) {
  return db.insert(leads).values(data).returning();
}

export async function getLeads() {
  return db.select().from(leads);
}

export async function getLeadById(id: number) {
  return db.select().from(leads).where(eq(leads.id, id));
}

export async function updateLead(id: number, data: Partial<typeof leads.$inferInsert>) {
  return db.update(leads).set(data).where(eq(leads.id, id)).returning();
}

export async function deleteLead(id: number) {
  return db.delete(leads).where(eq(leads.id, id)).returning();
} 