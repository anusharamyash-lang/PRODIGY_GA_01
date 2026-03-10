import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGenerations } from "@/hooks/use-generations";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { type Generation } from "@shared/schema";
import { Clock } from "lucide-react";

interface HistoryDashboardProps {
  onSelectGeneration: (generation: Generation) => void;
  selectedId?: number;
}

export function HistoryDashboard({ onSelectGeneration, selectedId }: HistoryDashboardProps) {
  const { data: generations = [], isLoading } = useGenerations();
  const { language } = useLanguage();
  const t = translations[language];

  const filteredGenerations = generations.filter(g => g.language === language);

  if (isLoading) {
    return (
      <div className="w-full max-w-xs space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-cyan-500/10 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (filteredGenerations.length === 0) {
    return (
      <Card className="p-4 bg-background/40 border-cyan-500/20">
        <p className="text-sm text-muted-foreground text-center">{t.noHistory || "No history"}</p>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-xs space-y-2 max-h-[600px] overflow-y-auto pr-2">
      {filteredGenerations.map((generation, index) => (
        <motion.div
          key={generation.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelectGeneration(generation)}
        >
          <Card
            className={`p-3 cursor-pointer transition-all border-l-4 ${
              selectedId === generation.id
                ? "bg-cyan-500/20 border-l-cyan-400 border-cyan-500/40"
                : "bg-background/40 border-l-cyan-500/20 border-cyan-500/20 hover:bg-background/60"
            }`}
          >
            <div className="space-y-2">
              {generation.prompt && (
                <p className="text-xs text-foreground font-medium truncate">
                  {generation.prompt.substring(0, 50)}
                  {generation.prompt.length > 50 ? "..." : ""}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {new Date(generation.createdAt).toLocaleDateString()}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
