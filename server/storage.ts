import { type Generation, type InsertGeneration, generations } from "@shared/schema";
import { db } from "./db";
import { desc } from "drizzle-orm";

export interface IStorage {
  getGenerations(): Promise<Generation[]>;
  createGeneration(generation: InsertGeneration & { result: string }): Promise<Generation>;
}

export class DatabaseStorage implements IStorage {
  async getGenerations(): Promise<Generation[]> {
    return await db.select().from(generations).orderBy(desc(generations.createdAt));
  }

  async createGeneration(generation: InsertGeneration & { result: string }): Promise<Generation> {
    const [created] = await db
      .insert(generations)
      .values(generation)
      .returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
