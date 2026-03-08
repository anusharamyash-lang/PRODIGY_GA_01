import { useLanguage } from "@/lib/language-context";
import { languageNames, type Language } from "@/lib/translations";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const languages: Language[] = ["en", "hi", "ta", "te", "kn"];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent" />
      <div className="flex gap-1">
        {languages.map((lang) => (
          <Button
            key={lang}
            onClick={() => setLanguage(lang)}
            variant={language === lang ? "default" : "ghost"}
            size="sm"
            className={`text-xs h-8 px-3 font-semibold transition-all ${
              language === lang
                ? "bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 text-white shadow-lg shadow-cyan-500/40"
                : "text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text hover:from-blue-500 hover:via-cyan-500 hover:to-blue-400"
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
