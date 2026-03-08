import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Language = "hi" | "ta" | "te" | "kn";

const keyboardLayouts: Record<Language, string[][]> = {
  hi: [
    ["ा", "ि", "ी", "ु", "ू", "ृ"],
    ["े", "ै", "ो", "ौ", "ं", "ः"],
    ["क", "ख", "ग", "घ", "ङ"],
    ["च", "छ", "ज", "झ", "ञ"],
    ["ट", "ठ", "ड", "ढ", "ण"],
    ["त", "थ", "द", "ध", "न"],
    ["प", "फ", "ब", "भ", "म"],
    ["य", "र", "ल", "व", "श"],
    ["ष", "स", "ह", "।", "॥"],
  ],
  ta: [
    ["ா", "ி", "ீ", "ு", "ூ"],
    ["ெ", "ே", "ை", "ொ", "ோ"],
    ["க", "ங", "ச", "ஞ", "ட"],
    ["ண", "த", "ந", "ப", "ம"],
    ["ய", "ர", "ல", "வ", "ழ"],
    ["ள", "ற", "ன", "ஜ", "ஸ"],
  ],
  te: [
    ["ా", "ి", "ీ", "ు", "ూ"],
    ["ృ", "ౄ", "ె", "ే", "ై"],
    ["ొ", "ో", "ౌ", "ం", "ః"],
    ["క", "ఖ", "గ", "ఘ", "ఙ"],
    ["చ", "ఛ", "జ", "ఝ", "ఞ"],
    ["ట", "ఠ", "డ", "ఢ", "ణ"],
    ["త", "థ", "ద", "ధ", "న"],
    ["ప", "ఫ", "బ", "భ", "మ"],
    ["య", "ర", "ల", "వ", "శ"],
    ["ష", "స", "హ", "ळ", "ఱ"],
  ],
  kn: [
    ["ಾ", "ಿ", "ೀ", "ು", "ೂ"],
    ["ೃ", "ೄ", "ೆ", "ೇ", "ೈ"],
    ["ೊ", "ೋ", "ೌ", "ಂ", "ಃ"],
    ["ಕ", "ಖ", "ಗ", "ಘ", "ಙ"],
    ["ಚ", "ಛ", "ಜ", "ಝ", "ಞ"],
    ["ಟ", "ಠ", "ಡ", "ಢ", "ಣ"],
    ["ತ", "ಥ", "ದ", "ಧ", "ನ"],
    ["ಪ", "ಫ", "ಬ", "ಭ", "ಮ"],
    ["ಯ", "ರ", "ಲ", "ವ", "ಶ"],
    ["ಷ", "ಸ", "ಹ", "ಳ", "ೞ"],
  ],
};

interface LanguageKeyboardProps {
  language: Language;
  onCharSelect: (char: string) => void;
}

export function LanguageKeyboard({ language, onCharSelect }: LanguageKeyboardProps) {
  const layout = keyboardLayouts[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 p-4 bg-background/30 backdrop-blur-sm border border-cyan-500/20 rounded-lg"
    >
      <div className="flex flex-col gap-2">
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-wrap gap-1 justify-center">
            {row.map((char, charIndex) => (
              <Button
                key={`${rowIndex}-${charIndex}`}
                onClick={() => onCharSelect(char)}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-sm font-semibold border-cyan-400/30 hover:bg-cyan-500/20 hover:border-cyan-400/60 text-cyan-100 transition-colors"
                data-testid={`keyboard-char-${char}`}
              >
                {char}
              </Button>
            ))}
          </div>
        ))}
      </div>
      <p className="text-xs text-cyan-300/60 mt-3 text-center">
        💡 Click characters to add to your prompt, or type directly
      </p>
    </motion.div>
  );
}
