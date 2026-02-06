import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  HelpCircle,
  Camera,
  Cpu,
  Wrench,
  Home,
  Star,
  Zap,
  Battery,
  ChevronRight,
  Globe,
  Mail,
  MessageSquare,
  Clock,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { productSeries, type ProductSeries } from "@/data/products";
import { faqCategories, searchFAQs, type FAQ, type FAQCategory } from "@/data/faqs";

// Language type
type Language = "en" | "zh";

// Translations
const translations = {
  en: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about Hiseeu security cameras and systems",
    searchPlaceholder: "Search for answers...",
    selectCategory: "Please Select a Category:",
    productSeries: "Product Series",
    productSeriesDesc: "Explore our product lines and their unique advantages",
    faqCategories: "FAQ Categories",
    noResults: "No results found. Try different keywords.",
    searchResults: "Search Results",
    clearSearch: "Clear Search",
    lastUpdated: "Last Updated",
    feedbackTitle: "Can't find what you're looking for?",
    feedbackDesc: "Leave us a message and we'll get back to you within 24-48 hours.",
    feedbackPlaceholder: "Describe your question or issue...",
    emailPlaceholder: "Your email (optional)",
    submitFeedback: "Submit Feedback",
    feedbackSuccess: "Thank you! Your feedback has been submitted.",
    contactTitle: "Contact Us",
    contactEmail: "support@hiseeu.com",
    compatibilityNote: "Compatible with all major browsers. Works on desktop, mobile, and tablet.",
    viewProducts: "View Products",
    viewFAQs: "View FAQs",
    backToTop: "Back to Top",
    language: "中文",
  },
  zh: {
    title: "常见问题",
    subtitle: "查找关于Hiseeu安防摄像头和系统的常见问题解答",
    searchPlaceholder: "搜索答案...",
    selectCategory: "请选择分类：",
    productSeries: "产品系列",
    productSeriesDesc: "探索我们的产品线及其独特优势",
    faqCategories: "问题分类",
    noResults: "未找到结果，请尝试其他关键词。",
    searchResults: "搜索结果",
    clearSearch: "清除搜索",
    lastUpdated: "最后更新",
    feedbackTitle: "找不到您需要的答案？",
    feedbackDesc: "给我们留言，我们将在24-48小时内回复您。",
    feedbackPlaceholder: "描述您的问题...",
    emailPlaceholder: "您的邮箱（可选）",
    submitFeedback: "提交反馈",
    feedbackSuccess: "感谢您！您的反馈已提交。",
    contactTitle: "联系我们",
    contactEmail: "support@hiseeu.com",
    compatibilityNote: "兼容所有主流浏览器，支持电脑、手机和平板访问。",
    viewProducts: "查看产品",
    viewFAQs: "查看问题",
    backToTop: "返回顶部",
    language: "English",
  },
};

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  "help-circle": <HelpCircle className="h-8 w-8" />,
  camera: <Camera className="h-8 w-8" />,
  cpu: <Cpu className="h-8 w-8" />,
  tool: <Wrench className="h-8 w-8" />,
  wrench: <Wrench className="h-8 w-8" />,
  home: <Home className="h-8 w-8" />,
};

// Series icons mapping
const seriesIcons: Record<string, React.ReactNode> = {
  star: <Star className="h-10 w-10" />,
  zap: <Zap className="h-10 w-10" />,
  battery: <Battery className="h-10 w-10" />,
};

export default function FAQHomeLorex() {
  const [language, setLanguage] = useState<Language>("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const t = translations[language];

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchFAQs(searchQuery, language);
  }, [searchQuery, language]);

  const isSearching = searchQuery.trim().length > 0;

  // Handle feedback submission
  const handleFeedbackSubmit = () => {
    if (feedbackMessage.trim()) {
      // In production, this would send to backend
      console.log("Feedback submitted:", { message: feedbackMessage, email: feedbackEmail });
      setFeedbackSubmitted(true);
      setFeedbackMessage("");
      setFeedbackEmail("");
      setTimeout(() => setFeedbackSubmitted(false), 3000);
    }
  };

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en");
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/faq" className="flex items-center gap-2">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663286627763/juwKpCJmdTyiWSOD.png" 
                alt="Hiseeu" 
                className="h-10 w-auto"
              />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-10 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {t.language}
            </Button>
          </div>

          {/* Search Bar - Mobile */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-10 w-full border-gray-300"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results */}
        {isSearching && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {t.searchResults} ({searchResults.length})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-blue-600 hover:text-blue-700"
              >
                {t.clearSearch}
              </Button>
            </div>
            {searchResults.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-2">
                {searchResults.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="border border-gray-200 rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-blue-600">
                      {faq.question[language]}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed">
                      {faq.answer[language]}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-gray-500 text-center py-8">{t.noResults}</p>
            )}
          </section>
        )}

        {/* Category Selection */}
        {!isSearching && (
          <>
            <section className="mb-12">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                {t.selectCategory}
              </h2>

              {/* Product Series Cards */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  {t.productSeries}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {productSeries.map((series) => (
                    <Link key={series.id} href={`/products/${series.id}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                              {seriesIcons[series.icon] || <Star className="h-10 w-10" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-900 mb-2">
                                {series.name[language]}
                              </h4>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {series.description[language]}
                              </p>
                              <div className="mt-3 flex items-center text-blue-600 text-sm font-medium">
                                {t.viewProducts}
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              {/* FAQ Category Cards */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  {t.faqCategories}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {faqCategories.map((category) => (
                    <Card
                      key={category.id}
                      className={`cursor-pointer transition-all ${
                        activeCategory === category.id
                          ? "border-2 border-blue-500 shadow-lg"
                          : "hover:shadow-md hover:border-gray-300"
                      }`}
                      onClick={() =>
                        setActiveCategory(
                          activeCategory === category.id ? null : category.id
                        )
                      }
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
                            {categoryIcons[category.icon] || (
                              <HelpCircle className="h-8 w-8" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1">
                              {category.name[language]}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {category.description[language]}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ Content by Category */}
            {activeCategory && (
              <section className="mb-12">
                {faqCategories
                  .filter((cat) => cat.id === activeCategory)
                  .map((category) => (
                    <div key={category.id}>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {category.name[language]}
                      </h2>
                      <Accordion type="single" collapsible className="space-y-2">
                        {category.faqs
                          .sort((a, b) => b.priority - a.priority)
                          .map((faq) => (
                            <AccordionItem
                              key={faq.id}
                              value={faq.id}
                              className="border border-gray-200 rounded-lg px-4"
                            >
                              <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-blue-600">
                                {faq.question[language]}
                              </AccordionTrigger>
                              <AccordionContent className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {faq.answer[language]}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                      </Accordion>
                    </div>
                  ))}
              </section>
            )}

            {/* All FAQs Preview (when no category selected) */}
            {!activeCategory && (
              <section className="mb-12">
                {faqCategories.map((category) => (
                  <div key={category.id} className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-gray-500">
                        {categoryIcons[category.icon] || (
                          <HelpCircle className="h-5 w-5" />
                        )}
                      </span>
                      {category.name[language]}
                    </h2>
                    <Accordion type="single" collapsible className="space-y-2">
                      {category.faqs
                        .sort((a, b) => b.priority - a.priority)
                        .slice(0, 3)
                        .map((faq) => (
                          <AccordionItem
                            key={faq.id}
                            value={faq.id}
                            className="border border-gray-200 rounded-lg px-4"
                          >
                            <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-blue-600 text-sm md:text-base">
                              {faq.question[language]}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 leading-relaxed text-sm">
                              {faq.answer[language]}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                    </Accordion>
                    {category.faqs.length > 3 && (
                      <Button
                        variant="link"
                        className="mt-2 text-blue-600 p-0"
                        onClick={() => setActiveCategory(category.id)}
                      >
                        {t.viewFAQs} ({category.faqs.length})
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </main>

      {/* Feedback Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <MessageSquare className="h-10 w-10 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t.feedbackTitle}
            </h2>
            <p className="text-gray-600">{t.feedbackDesc}</p>
          </div>

          {feedbackSubmitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-green-700 font-medium">{t.feedbackSuccess}</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <Textarea
                placeholder={t.feedbackPlaceholder}
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                className="mb-4 min-h-[120px]"
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleFeedbackSubmit}
                  disabled={!feedbackMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {t.submitFeedback}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Last Updated */}
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">{t.lastUpdated}</h3>
                <p className="text-gray-400 text-sm">
                  {new Date().toLocaleDateString(language === "en" ? "en-US" : "zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">{t.contactTitle}</h3>
                <a
                  href={`mailto:${t.contactEmail}`}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  {t.contactEmail}
                </a>
              </div>
            </div>

            {/* Compatibility */}
            <div className="flex items-start gap-3">
              <div className="flex gap-2 text-gray-400">
                <Monitor className="h-5 w-5" />
                <Smartphone className="h-5 w-5" />
                <Tablet className="h-5 w-5" />
              </div>
              <p className="text-gray-400 text-sm">{t.compatibilityNote}</p>
            </div>
          </div>

          {/* Back to Top */}
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              className="text-gray-400 hover:text-white"
            >
              {t.backToTop}
            </Button>
          </div>

          {/* Copyright */}
          <div className="mt-4 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Hiseeu. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
