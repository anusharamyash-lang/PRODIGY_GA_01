import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.generations.list.path, async (req, res) => {
    try {
      const generations = await storage.getGenerations();
      res.json(generations);
    } catch (error) {
      console.error("Failed to list generations:", error);
      res.status(500).json({ message: "Failed to fetch generations" });
    }
  });

  app.post(api.generations.create.path, async (req, res) => {
    try {
      const input = api.generations.create.input.parse(req.body);
      
      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          {
            role: "system",
            content: `You are an AI model that mimics the style, tone, and structure of the provided training data.
            Generate text based on the user prompt, ensuring it aligns perfectly with the provided examples.
            
            Training Data Context:
            ${input.trainingData}
            `
          },
          {
            role: "user",
            content: input.prompt
          }
        ],
        max_completion_tokens: 8192,
      });

      const resultText = response.choices[0]?.message?.content || "";

      const generation = await storage.createGeneration({
        ...input,
        result: resultText,
      });

      res.status(201).json(generation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
          field: error.errors[0].path.join('.'),
        });
      }
      console.error("OpenAI or DB error:", error);
      res.status(500).json({ message: "Failed to generate text" });
    }
  });

  return httpServer;
}
