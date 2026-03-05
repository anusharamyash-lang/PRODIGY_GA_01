import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const generations = pgTable("generations", {
  id: serial("id").primaryKey(),
  trainingData: text("training_data").notNull(),
  prompt: text("prompt").notNull(),
  result: text("result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGenerationSchema = createInsertSchema(generations).pick({
  trainingData: true,
  prompt: true,
});

export type InsertGeneration = z.infer<typeof insertGenerationSchema>;
export type Generation = typeof generations.$inferSelect;
