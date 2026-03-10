import { GenerationForm } from "@/components/GenerationForm";
import { LanguageSelector } from "@/components/LanguageSelector";
import { AnswerChatbox } from "@/components/AnswerChatbox";
import { HistoryDashboard } from "@/components/HistoryDashboard";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { Bot } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { type Generation } from "@shared/schema";

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];
  const [showSplash, setShowSplash] = useState(true);
  const [currentGeneration, setCurrentGeneration] = useState<Generation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none animated-gradient-bg opacity-30" />
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 via-background/80 to-background z-0 pointer-events-none" />

      {/* AI Splash Screen */}
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-400 flex items-center justify-center shadow-2xl shadow-cyan-500/50"
            >
              <Bot className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white tracking-tight"
            >
              GPT-2
            </motion.h2>
          </motion.div>
        </motion.div>
      )}

      <div className="relative z-10">
        {/* Header with Language Selector and History Dashboard */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-12"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent tracking-tight">
                {t.title}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <LanguageSelector />
              <div className="text-sm text-muted-foreground">History</div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left: Form and Answer */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <GenerationForm
                onGenerationStart={() => setIsGenerating(true)}
                onGenerationComplete={(generation) => {
                  setCurrentGeneration(generation);
                  setIsGenerating(false);
                }}
              />

              {/* Answer Chatbox */}
              <AnswerChatbox generation={currentGeneration} isLoading={isGenerating} />
            </motion.div>

            {/* Right: History Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-8">
                <h2 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                  📋 {t.genHistory || "History"}
                </h2>
                <HistoryDashboard
                  onSelectGeneration={setCurrentGeneration}
                  selectedId={currentGeneration?.id}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
