import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type GenerationInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useGenerations() {
  return useQuery({
    queryKey: [api.generations.list.path],
    queryFn: async () => {
      const res = await fetch(api.generations.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch generations");
      const data = await res.json();
      return parseWithLogging(api.generations.list.responses[200], data, "generations.list");
    },
  });
}

export function useCreateGeneration() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GenerationInput) => {
      const validated = api.generations.create.input.parse(data);
      const res = await fetch(api.generations.create.path, {
        method: api.generations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = parseWithLogging(api.generations.create.responses[400], await res.json(), "generations.create.400");
          throw new Error(error.message);
        }
        if (res.status === 500) {
          const error = parseWithLogging(api.generations.create.responses[500], await res.json(), "generations.create.500");
          throw new Error(error.message);
        }
        throw new Error("Failed to generate text");
      }

      const responseData = await res.json();
      return parseWithLogging(api.generations.create.responses[201], responseData, "generations.create.201");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.generations.list.path] });
      toast({
        title: "Generation Complete",
        description: "The model has successfully processed your prompt.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
