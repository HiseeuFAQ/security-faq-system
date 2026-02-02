import React, { createContext, useContext, useState, ReactNode } from "react";
import hiseeuFaqData from "@/hiseeu-faq-data.json";

type Language = "en" | "zh" | "es" | "fr" | "de" | "ru";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: typeof hiseeuFaqData.translations[Language];
}

const HiseeuLanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function HiseeuLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const translations = hiseeuFaqData.translations[language];

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations;

    for (const k of keys) {
      value = value?.[k];
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <HiseeuLanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </HiseeuLanguageContext.Provider>
  );
}

export function useHiseeuLanguage() {
  const context = useContext(HiseeuLanguageContext);
  if (!context) {
    throw new Error("useHiseeuLanguage must be used within HiseeuLanguageProvider");
  }
  return context;
}
