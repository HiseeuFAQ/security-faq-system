import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCategories, type Category } from "@/lib/faqUtils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  selectedCategory: string;
  selectedSubcategory: string;
  onCategoryChange: (categoryId: string, subcategoryId?: string) => void;
  onClose?: () => void;
}

export default function CategoryNav({
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  onClose,
}: CategoryNavProps) {
  const { language, t } = useLanguage();
  const categories = getCategories();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    selectedCategory
  );

  const handleCategoryClick = (categoryId: string) => {
    setExpandedCategory(
      expandedCategory === categoryId ? null : categoryId
    );
    if (expandedCategory !== categoryId) {
      const category = categories.find((c) => c.id === categoryId);
      if (category && category.subcategories.length > 0) {
        onCategoryChange(categoryId, category.subcategories[0].id);
      } else {
        onCategoryChange(categoryId);
      }
    }
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    onCategoryChange(categoryId, subcategoryId);
    onClose?.();
  };

  return (
    <nav className="w-full space-y-1">
      {categories.map((category) => (
        <div key={category.id}>
          <button
            onClick={() => handleCategoryClick(category.id)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 text-left font-medium transition-colors rounded-lg",
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-foreground"
            )}
          >
            <span>{category.label[language]}</span>
            {expandedCategory === category.id ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {expandedCategory === category.id && (
            <div className="pl-4 space-y-1 mt-1">
              {category.subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  onClick={() =>
                    handleSubcategoryClick(category.id, subcategory.id)
                  }
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm rounded-lg transition-colors",
                    selectedSubcategory === subcategory.id &&
                      selectedCategory === category.id
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {subcategory.label[language]}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
