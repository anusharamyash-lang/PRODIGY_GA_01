import { GenerationForm } from "@/components/GenerationForm";
import { GenerationHistory } from "@/components/GenerationHistory";
import { Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none animated-gradient-bg opacity-30" />
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 via-background/80 to-background z-0 pointer-events-none" />

      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">GPT-2</h1>
          </div>
          <p className="text-muted-foreground text-lg">Fine-tune text generation with your custom training data</p>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <GenerationForm />
        </motion.div>

        {/* History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-background/20 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-zinc-200 mb-4">Generation History</h2>
            <GenerationHistory />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
