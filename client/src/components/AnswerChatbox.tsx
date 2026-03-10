import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { type Generation } from "@shared/schema";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface AnswerChatboxProps {
  generation: Generation | null;
  isLoading?: boolean;
}

export function AnswerChatbox({ generation, isLoading }: AnswerChatboxProps) {
  const [copied, setCopied] = useState(false);

  if (!generation && !isLoading) return null;

  const handleCopy = () => {
    if (generation?.result) {
      navigator.clipboard.writeText(generation.result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <Card className="p-6 bg-background/40 border-cyan-500/20 shadow-xl">
        {/* Question */}
        {generation?.prompt && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-cyan-400">You asked:</span>
            </div>
            <p className="text-foreground text-base">{generation.prompt}</p>
          </div>
        )}

        {/* Answer or Loading */}
        <div className="border-t border-cyan-500/20 pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-cyan-400">AI Response:</span>
            {generation?.result && (
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors"
                title="Copy response"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-cyan-400" />
                )}
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-cyan-500/10 rounded animate-pulse" />
              <div className="h-4 bg-cyan-500/10 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-cyan-500/10 rounded animate-pulse w-4/6" />
            </div>
          ) : (
            <div className="text-foreground text-base leading-relaxed whitespace-pre-wrap">
              {generation?.result}
            </div>
          )}
        </div>

        {/* Metadata */}
        {generation && (
          <div className="mt-6 text-xs text-muted-foreground flex items-center justify-between">
            <span>ID: {generation.id}</span>
            <span>{new Date(generation.createdAt).toLocaleString()}</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
