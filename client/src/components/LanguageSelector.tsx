import { useLanguage } from "@/lib/language-context";
import { languageNames, type Language } from "@/lib/translations";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const languages: Language[] = ["en", "es", "fr", "de", "zh"];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <div className="flex gap-1">
        {languages.map((lang) => (
          <Button
            key={lang}
            onClick={() => setLanguage(lang)}
            variant={language === lang ? "default" : "ghost"}
            size="sm"
            className="text-xs h-8 px-2"
            data-testid={`language-${lang}`}
          >
            {languageNames[lang]}
          </Button>
        ))}
      </div>
    </div>
  );
}
