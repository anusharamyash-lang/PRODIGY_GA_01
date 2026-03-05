import { z } from "zod";
import { insertGenerationSchema, generations } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  generations: {
    list: {
      method: "GET" as const,
      path: "/api/generations" as const,
      responses: {
        200: z.array(z.custom<typeof generations.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/generations" as const,
      input: insertGenerationSchema,
      responses: {
        201: z.custom<typeof generations.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>,
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type GenerationInput = z.infer<typeof api.generations.create.input>;
export type GenerationResponse = z.infer<
  typeof api.generations.create.responses[201]
>;
export type GenerationsListResponse = z.infer<
  typeof api.generations.list.responses[200]
>;
export type ValidationError = z.infer<typeof errorSchemas.validation>;
export type InternalError = z.infer<typeof errorSchemas.internal>;
