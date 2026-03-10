import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Sparkles, MessageSquare } from "lucide-react";
import { insertGenerationSchema, type InsertGeneration } from "@shared/schema";
import { useCreateGeneration } from "@/hooks/use-generations";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { LanguageKeyboard } from "./LanguageKeyboard";
import type { Language } from "@/lib/translations";

export function GenerationForm() {
  const createMutation = useCreateGeneration();
  const { language } = useLanguage();
  const t = translations[language];
  const [isFocused, setIsFocused] = useState<"prompt" | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<InsertGeneration>({
    resolver: zodResolver(insertGenerationSchema),
    defaultValues: {
      trainingData: "",
      prompt: "",
    },
  });

  const onSubmit = (data: InsertGeneration) => {
    createMutation.mutate({
      ...data,
      trainingData: "",
      language: language,
    }, {
      onSuccess: () => {
        form.setValue("prompt", "");
      }
    });
  };

  const handleCharSelect = (char: string) => {
    const currentValue = form.getValues("prompt");
    const textarea = textareaRef.current;
    
    if (textarea) {
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const newText = currentValue.substring(0, start) + char + currentValue.substring(end);
      
      form.setValue("prompt", newText, { shouldValidate: true });
      
      setTimeout(() => {
        if (textarea) {
          textarea.focus();
          const newPosition = start + char.length;
          textarea.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    form.setValue("prompt", e.target.value, { shouldValidate: true });
  };

  return (
    <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-white/5 shadow-2xl relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 group-hover:bg-primary/20" />
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        <div className="space-y-3">
          <Label 
            htmlFor="prompt" 
            className="text-base font-medium flex items-center gap-2 text-zinc-200"
          >
            <MessageSquare className="w-4 h-4 text-primary" />
            {t.prompt}
          </Label>
          <p className="text-sm text-muted-foreground">
            {t.promptDesc}
          </p>
          <div className="relative">
            <Textarea
              ref={textareaRef}
              id="prompt"
              placeholder={language !== "en" ? `Use the keyboard below to type in ${language === "hi" ? "हिंदी" : language === "ta" ? "தமிழ்" : language === "te" ? "తెలుగు" : "ಕನ್ನಡ"}` : t.promptPlaceholder}
              lang={language}
              inputMode={language === "en" ? "text" : "none"}
              autoCapitalize="sentences"
              spellCheck={language === "en" ? "true" : "false"}
              readOnly={language !== "en"}
              className={`
                min-h-[100px] bg-background/50 border-white/10
                focus-visible:ring-1 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500/50
                transition-all duration-300 resize-y
                ${language !== "en" ? 'cursor-pointer' : 'cursor-text'}
                ${isFocused === 'prompt' ? 'shadow-[0_0_15px_rgba(34,211,238,0.2)]' : ''}
              `}
              value={form.watch("prompt")}
              onChange={language === "en" ? handleTextChange : undefined}
              onFocus={() => setIsFocused("prompt")}
              onBlur={() => setIsFocused(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)();
                }
              }}
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground/50 pointer-events-none">
              Cmd/Ctrl + Enter to generate
            </div>
            {language !== "en" && (
              <div className="mt-2 text-xs text-cyan-300/70 flex items-center gap-1">
                <span className="inline-flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                💡 Use the digital keyboard below to type in {language === "hi" ? "हिंदी" : language === "ta" ? "தமிழ்" : language === "te" ? "తెలుగు" : "ಕನ್ನಡ"}
              </div>
            )}
          </div>

          {language !== "en" && (
            <LanguageKeyboard 
              language={language as "hi" | "ta" | "te" | "kn"} 
              onCharSelect={handleCharSelect}
            />
          )}
          {form.formState.errors.prompt && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.prompt.message}
            </p>
          )}
        </div>

        <div className="pt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            {createMutation.isPending && (
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-primary"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Model is fine-tuning & generating...
              </motion.span>
            )}
          </div>
          
          <Button 
            type="submit" 
            size="lg"
            disabled={createMutation.isPending || !form.formState.isValid}
            className="min-w-[160px] bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t.processing}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                {t.generate}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
