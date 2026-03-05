import { GenerationForm } from "@/components/GenerationForm";
import { GenerationHistory } from "@/components/GenerationHistory";
import { BrainCircuit, Cpu, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none animated-gradient-bg opacity-30" />
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 via-background/80 to-background z-0 pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <header className="mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-display text-white tracking-tight">
                Nexus<span className="text-primary">Tune</span>
              </h1>
              <p className="text-muted-foreground mt-1 font-medium">Interactive Model Fine-Tuning Simulator</p>
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-400 max-w-2xl leading-relaxed text-lg"
          >
            Train a simulated language model on your custom data. Provide examples of the style, 
            tone, or format you desire, and watch as it generates contextual responses matching your specifications.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4 text-zinc-300">
                <Cpu className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold font-display">Configure Model</h2>
              </div>
              <GenerationForm />
            </motion.div>
            
            {/* Educational snippet */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-6 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-4"
            >
              <div className="bg-primary/20 p-2 rounded-full shrink-0 mt-1">
                <BrainCircuit className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-primary mb-1">How it works</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Fine-tuning adapts a pre-trained model (like GPT-2) to a specific task or style. 
                  By providing training data in the left panel, you are effectively shifting the model's 
                  internal weights to favor the patterns, vocabulary, and structure present in your examples.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-5 h-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="h-full flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Terminal className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold font-display">Generation History</h2>
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground flex items-center gap-1">
                  Live Output <span className="relative flex h-2 w-2 ml-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                </div>
              </div>
              <div className="flex-1 bg-background/20 backdrop-blur-xl border border-white/5 rounded-2xl p-2 shadow-2xl relative">
                {/* Decorative subtle border top */}
                <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <GenerationHistory />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
