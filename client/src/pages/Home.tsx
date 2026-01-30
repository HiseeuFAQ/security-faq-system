import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getCategories,
  getFAQsBySubcategory,
  getLastUpdated,
  getSupportEmail,
  type FAQ,
} from "@/lib/faqUtils";
import FAQSearch from "@/components/FAQSearch";
import CategoryNav from "@/components/CategoryNav";
import FAQList from "@/components/FAQList";
import FeedbackForm from "@/components/FeedbackForm";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Design Philosophy: Modern Professional Style
 * - Deep blue primary color (#1e40af) for trust and professionalism
 * - Clean typography with clear hierarchy
 * - Strategic whitespace for readability
 * - Smooth transitions and interactions
 * - Responsive layout: sidebar on desktop, hamburger on mobile
 */

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const categories = getCategories();
  const [selectedCategory, setSelectedCategory] = useState(
    categories[0]?.id || "b2b"
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    categories[0]?.subcategories[0]?.id || ""
  );
  const [searchResults, setSearchResults] = useState<FAQ[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentFAQs = useMemo(() => {
    if (isSearching && searchResults.length > 0) {
      return searchResults;
    }
    return getFAQsBySubcategory(selectedCategory, selectedSubcategory);
  }, [selectedCategory, selectedSubcategory, searchResults, isSearching]);

  const handleSearchChange = (results: FAQ[]) => {
    setSearchResults(results);
    setIsSearching(results.length > 0);
  };

  const handleCategoryChange = (categoryId: string, subcategoryId?: string) => {
    setSelectedCategory(categoryId);
    const category = categories.find((c) => c.id === categoryId);
    if (subcategoryId) {
      setSelectedSubcategory(subcategoryId);
    } else if (category?.subcategories[0]) {
      setSelectedSubcategory(category.subcategories[0].id);
    }
    setIsSearching(false);
    setSearchResults([]);
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo and Title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-primary">
                {t("header.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("header.subtitle")}
              </p>
            </div>

            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="whitespace-nowrap"
            >
              {t("header.language")}
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <FAQSearch onSearchChange={handleSearchChange} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside
            className={cn(
              "lg:col-span-1",
              "fixed inset-0 top-[140px] left-0 right-0 bottom-0 z-30 lg:static lg:top-auto lg:inset-auto lg:z-auto",
              "bg-background lg:bg-transparent",
              "overflow-y-auto lg:overflow-visible",
              "transition-opacity duration-200",
              mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"
            )}
          >
            <div className="p-4 lg:p-0">
              <CategoryNav
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                onCategoryChange={handleCategoryChange}
                onClose={() => setMobileMenuOpen(false)}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-2">
            <div className="space-y-6">
              {/* Category Header */}
              {!isSearching && (
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {
                      categories
                        .find((c) => c.id === selectedCategory)
                        ?.subcategories.find((s) => s.id === selectedSubcategory)
                        ?.label[language]
                    }
                  </h2>
                  <p className="text-muted-foreground">
                    {
                      categories
                        .find((c) => c.id === selectedCategory)
                        ?.subcategories.find((s) => s.id === selectedSubcategory)
                        ?.label[language]
                    }
                  </p>
                </div>
              )}

              {/* Search Results Header */}
              {isSearching && (
                <div>
                  <h2 className="text-3xl font-bold text-foreground">
                    {t("search.results")}
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    {searchResults.length}{" "}
                    {language === "en" ? "results found" : "个结果"}
                  </p>
                </div>
              )}

              {/* FAQ List */}
              <FAQList faqs={currentFAQs} />
            </div>
          </main>

          {/* Right Sidebar - Feedback Form */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Feedback Section */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {t("footer.feedback")}
                </h3>
                <FeedbackForm />
              </div>

              {/* Info Section */}
              <div className="bg-muted/50 rounded-lg p-6 space-y-4 text-sm">
                <div>
                  <p className="font-medium text-foreground mb-1">
                    {t("footer.updated")}
                  </p>
                  <p className="text-muted-foreground">{getLastUpdated()}</p>
                </div>

                <div>
                  <p className="font-medium text-foreground mb-1">
                    {t("footer.contact")}
                  </p>
                  <p className="text-muted-foreground break-all">
                    {getSupportEmail()}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-foreground mb-1">
                    {language === "en" ? "Browser Support" : "浏览器支持"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {t("footer.browserSupport")}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-12">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                {t("header.title")}
              </h4>
              <p>{t("header.subtitle")}</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">
                {t("footer.contact")}
              </h4>
              <p>{getSupportEmail()}</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">
                {language === "en" ? "Version" : "版本"}
              </h4>
              <p>FAQ System v1.0.0</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
            <p>© 2026 Security Camera FAQ System. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[140px] bg-black/50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
