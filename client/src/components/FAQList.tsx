import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { type FAQ } from "@/lib/faqUtils";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQListProps {
  faqs: FAQ[];
  isLoading?: boolean;
}

export default function FAQList({ faqs, isLoading }: FAQListProps) {
  const { language, t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-muted animate-pulse h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{t("search.noResults")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <div
          key={faq.id}
          className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors bg-card"
        >
          <button
            onClick={() =>
              setExpandedId(expandedId === faq.id ? null : faq.id)
            }
            className="w-full px-6 py-4 text-left flex items-start justify-between gap-4 hover:bg-muted/50 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {faq.question[language]}
              </h3>
            </div>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 mt-0.5",
                expandedId === faq.id && "rotate-180"
              )}
            />
          </button>

          {expandedId === faq.id && (
            <div className="px-6 py-4 bg-muted/30 border-t border-border">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {faq.answer[language]}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
