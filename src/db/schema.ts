import {
  pgTable,
  serial,
  text,
  numeric,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  principal: numeric("principal", { precision: 14, scale: 2 }).notNull(),
  interestRate: numeric("interest_rate", { precision: 7, scale: 4 }).notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  finalAmount: numeric("final_amount", { precision: 14, scale: 2 }).notNull(),
  totalInterest: numeric("total_interest", { precision: 14, scale: 2 }).notNull(),
  years: integer("years").notNull().default(0),
  months: integer("months").notNull().default(0),
  days: integer("days").notNull().default(0),
  breakdown: jsonb("breakdown").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Calculation = typeof calculations.$inferSelect;
export type NewCalculation = typeof calculations.$inferInsert;
