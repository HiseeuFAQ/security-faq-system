import { useState, useCallback, useMemo } from "react";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { fuzzySearchFAQs, type FAQ } from "@/lib/faqUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FAQSearchProps {
  onSearchChange?: (results: FAQ[]) => void;
}

export default function FAQSearch({ onSearchChange }: FAQSearchProps) {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    setIsSearching(true);
    const results = fuzzySearchFAQs(query, language);
    setIsSearching(false);
    return results;
  }, [query, language]);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      const results = fuzzySearchFAQs(value, language);
      onSearchChange?.(results);
    },
    [language, onSearchChange]
  );

  const handleClear = () => {
    setQuery("");
    onSearchChange?.([]);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={t("header.search")}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10 h-11 text-base"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {query && (
        <div className="mt-2 text-sm text-muted-foreground">
          {isSearching ? (
            <span>{t("common.loading")}</span>
          ) : searchResults.length > 0 ? (
            <span>
              {t("search.results")}: {searchResults.length}
            </span>
          ) : (
            <span>{t("search.noResults")}</span>
          )}
        </div>
      )}
    </div>
  );
}
