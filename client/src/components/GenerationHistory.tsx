import { useGenerations } from "@/hooks/use-generations";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Terminal, ChevronRight, FileText, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function GenerationHistory() {
  const { data: generations, isLoading, error } = useGenerations();
  const { language } = useLanguage();
  const t = translations[language];
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-5 border-white/5 bg-card/30">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-lg bg-white/5" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/4 bg-white/5" />
                <Skeleton className="h-20 w-full bg-white/5" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 border-destructive/20 bg-destructive/5 text-center">
        <p className="text-destructive">Failed to load generation history.</p>
      </Card>
    );
  }

  if (!generations || generations.length === 0) {
    return (
      <Card className="p-12 border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
          <Terminal className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-zinc-200">{t.noHistory}</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {t.noHistoryDesc}
          </p>
        </div>
      </Card>
    );
  }

  // Sort by newest first
  const sortedGenerations = [...generations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
      <div className="space-y-4 pb-8">
        <AnimatePresence>
          {sortedGenerations.map((gen, idx) => (
            <motion.div
              key={gen.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card 
                className={`
                  p-5 border-white/5 transition-all duration-300 cursor-pointer group
                  ${expandedId === gen.id ? 'bg-card/60 shadow-lg border-primary/20' : 'bg-card/30 hover:bg-card/50 hover:border-white/10'}
                `}
                onClick={() => setExpandedId(expandedId === gen.id ? null : gen.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                    <Terminal className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-background/50 text-xs font-normal border-white/10">
                          {t.id}: #{gen.id}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {format(new Date(gen.createdAt), "MMM d, h:mm a")}
                        </div>
                      </div>
                      <ChevronRight 
                        className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${expandedId === gen.id ? 'rotate-90 text-primary' : 'group-hover:text-zinc-300'}`} 
                      />
                    </div>
                    
                    <h4 className="text-zinc-200 font-medium truncate mb-2">
                      {gen.prompt}
                    </h4>
                    
                    <div className="bg-background/50 rounded-md p-3 border border-white/5 relative group/code">
                      <p className="text-sm font-mono text-zinc-300 line-clamp-3 whitespace-pre-wrap">
                        {gen.result}
                      </p>
                      
                      {/* Gradient fade out for long text when collapsed */}
                      {expandedId !== gen.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/80 to-transparent rounded-b-md" />
                      )}
                    </div>

                    <AnimatePresence>
                      {expandedId === gen.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 mt-4 border-t border-white/5 space-y-4">
                            <div>
                              <h5 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                                <FileText className="w-3 h-3" />
                                {t.fullOutput}
                              </h5>
                              <div className="bg-black/40 rounded-md p-4 border border-white/5">
                                <p className="text-sm font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                  {gen.result}
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Database className="w-3 h-3" />
                                {t.trainingUsed}
                              </h5>
                              <div className="bg-white/[0.02] rounded-md p-3 border border-white/5">
                                <p className="text-xs font-mono text-muted-foreground whitespace-pre-wrap max-h-32 overflow-y-auto custom-scrollbar">
                                  {gen.trainingData}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}
