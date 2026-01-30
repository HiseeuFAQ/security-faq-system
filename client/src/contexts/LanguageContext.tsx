import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    "header.title": "Security Camera FAQ",
    "header.subtitle": "Find answers to your questions instantly",
    "header.search": "Search FAQ...",
    "header.language": "中文",
    "nav.b2b": "For Businesses",
    "nav.b2c": "For Individuals",
    "nav.all": "All Categories",
    "footer.updated": "Last Updated",
    "footer.feedback": "Feedback",
    "footer.feedbackPlaceholder": "Tell us your question or suggestion...",
    "footer.submit": "Submit",
    "footer.submitting": "Submitting...",
    "footer.submitSuccess": "Thank you! We'll respond within 12 hours.",
    "footer.submitError": "Failed to submit. Please try again.",
    "footer.contact": "Contact Us",
    "footer.email": "Email",
    "footer.phone": "Phone",
    "footer.browserSupport": "This FAQ works on all modern browsers. Optimized for mobile, tablet, and desktop.",
    "search.noResults": "No results found. Please try different keywords or submit feedback.",
    "search.results": "Search Results",
    "search.clear": "Clear",
    "common.loading": "Loading...",
    "common.error": "An error occurred. Please refresh the page.",
  },
  zh: {
    "header.title": "安防监控 FAQ",
    "header.subtitle": "快速找到您的问题答案",
    "header.search": "搜索 FAQ...",
    "header.language": "EN",
    "nav.b2b": "企业客户",
    "nav.b2c": "个人客户",
    "nav.all": "全部分类",
    "footer.updated": "最后更新",
    "footer.feedback": "反馈",
    "footer.feedbackPlaceholder": "告诉我们您的问题或建议...",
    "footer.submit": "提交",
    "footer.submitting": "提交中...",
    "footer.submitSuccess": "感谢您！我们将在12小时内回复。",
    "footer.submitError": "提交失败，请重试。",
    "footer.contact": "联系我们",
    "footer.email": "邮箱",
    "footer.phone": "电话",
    "footer.browserSupport": "此 FAQ 支持所有主流浏览器。已针对手机、平板和电脑优化。",
    "search.noResults": "未找到结果。请尝试其他关键词或提交反馈。",
    "search.results": "搜索结果",
    "search.clear": "清除",
    "common.loading": "加载中...",
    "common.error": "发生错误。请刷新页面。",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("faq-language") as Language | null;
      return saved || "en";
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("faq-language", language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
