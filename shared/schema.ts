import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const generations = pgTable("generations", {
  id: serial("id").primaryKey(),
  trainingData: text("training_data").notNull(),
  prompt: text("prompt").notNull(),
  result: text("result").notNull(),
  language: text("language").notNull().default("en"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGenerationSchema = createInsertSchema(generations).pick({
  trainingData: true,
  prompt: true,
  language: true,
});

export type InsertGeneration = z.infer<typeof insertGenerationSchema>;
export type Generation = typeof generations.$inferSelect;
