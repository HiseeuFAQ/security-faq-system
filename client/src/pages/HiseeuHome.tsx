import { useState, useMemo } from "react";
import { useHiseeuLanguage } from "@/contexts/HiseeuLanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Menu, X } from "lucide-react";
import hiseeuFaqData from "@/hiseeu-faq-data.json";

type Language = "en" | "zh" | "es" | "fr" | "de" | "ru";

export default function HiseeuHome() {
  const { language, setLanguage, t } = useHiseeuLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const languages: { code: Language; name: string }[] = [
    { code: "en", name: "EN" },
    { code: "zh", name: "中文" },
    { code: "es", name: "ES" },
    { code: "fr", name: "FR" },
    { code: "de", name: "DE" },
    { code: "ru", name: "RU" },
  ];

  // Filter FAQs based on search, product, and scenario
  const filteredFaqs = useMemo(() => {
    return hiseeuFaqData.faqs.filter((faq) => {
      const matchesSearch =
        searchQuery === "" ||
        faq.content[language]?.question
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        faq.content[language]?.answer
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesProduct = !selectedProduct || faq.product === selectedProduct;
      const matchesScenario = !selectedScenario || faq.scenario === selectedScenario;

      return matchesSearch && matchesProduct && matchesScenario;
    });
  }, [searchQuery, selectedProduct, selectedScenario, language]);

  const getProductName = (productKey: string) => {
    const product = hiseeuFaqData.products.find((p) => p.key === productKey);
    return product?.names[language] || productKey;
  };

  const getScenarioName = (scenarioKey: string) => {
    const scenario = hiseeuFaqData.scenarios.find((s) => s.key === scenarioKey);
    return scenario?.names[language] || scenarioKey;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo & Title */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-blue-900">
                {t("siteTitle")}
              </h1>
              <p className="text-sm text-slate-600">{t("siteSubtitle")}</p>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language Selector */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      language === lang.code
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>

              {/* Official Website Button */}
              <a
                href={hiseeuFaqData.metadata.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {t("officialWebsite")}
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-slate-200 space-y-3">
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-1 ${
                      language === lang.code
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
              <a
                href={hiseeuFaqData.metadata.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium text-center"
              >
                {t("officialWebsite")}
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 sticky top-24">
              {/* Products */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  {t("products")}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                      selectedProduct === null
                        ? "bg-blue-100 text-blue-900 font-medium"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    All Products
                  </button>
                  {hiseeuFaqData.products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product.key)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                        selectedProduct === product.key
                          ? "bg-blue-100 text-blue-900 font-medium"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {product.names[language]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scenarios */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  {t("scenarios")}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedScenario(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                      selectedScenario === null
                        ? "bg-blue-100 text-blue-900 font-medium"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    All Scenarios
                  </button>
                  {hiseeuFaqData.scenarios.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => setSelectedScenario(scenario.key)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                        selectedScenario === scenario.key
                          ? "bg-blue-100 text-blue-900 font-medium"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {scenario.names[language]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - FAQ List */}
          <div className="lg:col-span-3">
            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <Card
                    key={faq.id}
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() =>
                      setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                    }
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            {faq.content[language]?.question}
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {getProductName(faq.product)}
                            </span>
                            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                              {getScenarioName(faq.scenario)}
                            </span>
                          </div>
                        </div>
                        <div className="text-2xl text-slate-400 flex-shrink-0">
                          {expandedFaq === faq.id ? "−" : "+"}
                        </div>
                      </div>

                      {/* Expanded Answer */}
                      {expandedFaq === faq.id && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {faq.content[language]?.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-slate-600 text-lg">{t("noResults")}</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Hiseeu</h4>
              <p className="text-sm">{t("siteSubtitle")}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t("contactUs")}</h4>
              <p className="text-sm">{hiseeuFaqData.metadata.supportEmail}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">{t("browserSupport")}</h4>
              <p className="text-sm">Chrome, Firefox, Safari, Edge</p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              {t("lastUpdated")}: {hiseeuFaqData.metadata.lastUpdated}
            </p>
            <p className="text-sm mt-4 md:mt-0">© 2026 Hiseeu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
