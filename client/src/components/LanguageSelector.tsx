import { useLanguage } from "@/lib/language-context";
import { languageNames, type Language } from "@/lib/translations";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const languages: Language[] = ["en", "hi", "ta", "te", "kn"];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent" />
      <div className="flex gap-1">
        {languages.map((lang) => (
          <Button
            key={lang}
            onClick={() => setLanguage(lang)}
            variant={language === lang ? "default" : "ghost"}
            size="sm"
            className={`text-xs h-8 px-3 font-semibold transition-all ${
              language === lang
                ? "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-lg shadow-purple-500/40"
                : "text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500"
            }`}
            data-testid={`language-${lang}`}
          >
            {languageNames[lang]}
          </Button>
        ))}
      </div>
    </div>
  );
}
