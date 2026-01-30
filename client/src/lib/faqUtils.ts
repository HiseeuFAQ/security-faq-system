import faqData from "../faq-data.json";

export type Language = "en" | "zh";

export interface FAQ {
  id: string;
  question: Record<Language, string>;
  answer: Record<Language, string>;
}

export interface Subcategory {
  id: string;
  label: Record<Language, string>;
  faqs: FAQ[];
}

export interface Category {
  id: string;
  label: Record<Language, string>;
  description: Record<Language, string>;
  subcategories: Subcategory[];
}

export interface FAQData {
  metadata: {
    version: string;
    lastUpdated: string;
    supportEmail: string;
  };
  categories: Category[];
}

// Type guard to ensure faqData is properly typed
const typedFaqData = (faqData as any) as FAQData;

export function getCategories(): Category[] {
  return typedFaqData.categories;
}

export function getCategoryById(id: string): Category | undefined {
  return typedFaqData.categories.find((cat) => cat.id === id);
}

export function getSubcategoryById(
  categoryId: string,
  subcategoryId: string
): Subcategory | undefined {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find((sub) => sub.id === subcategoryId);
}

export function getAllFAQs(): FAQ[] {
  const faqs: FAQ[] = [];
  typedFaqData.categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      faqs.push(...subcategory.faqs);
    });
  });
  return faqs;
}

export function searchFAQs(query: string, language: Language): FAQ[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const allFaqs = getAllFAQs();

  return allFaqs.filter((faq) => {
    const question = faq.question[language].toLowerCase();
    const answer = faq.answer[language].toLowerCase();
    return question.includes(lowerQuery) || answer.includes(lowerQuery);
  });
}

export function getLastUpdated(): string {
  return typedFaqData.metadata.lastUpdated;
}

export function getSupportEmail(): string {
  return typedFaqData.metadata.supportEmail;
}

// Get all FAQs for a specific category
export function getFAQsByCategory(categoryId: string): FAQ[] {
  const category = getCategoryById(categoryId);
  if (!category) return [];

  const faqs: FAQ[] = [];
  category.subcategories.forEach((subcategory) => {
    faqs.push(...subcategory.faqs);
  });
  return faqs;
}

// Get all FAQs for a specific subcategory
export function getFAQsBySubcategory(
  categoryId: string,
  subcategoryId: string
): FAQ[] {
  const subcategory = getSubcategoryById(categoryId, subcategoryId);
  return subcategory?.faqs || [];
}

// Fuzzy search for better UX
export function fuzzySearchFAQs(query: string, language: Language): FAQ[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const allFaqs = getAllFAQs();

  // First try exact substring match
  const exactMatches = allFaqs.filter((faq) => {
    const question = faq.question[language].toLowerCase();
    const answer = faq.answer[language].toLowerCase();
    return question.includes(lowerQuery) || answer.includes(lowerQuery);
  });

  if (exactMatches.length > 0) return exactMatches;

  // Then try partial word match
  const words = lowerQuery.split(/\s+/);
  const partialMatches = allFaqs.filter((faq) => {
    const question = faq.question[language].toLowerCase();
    const answer = faq.answer[language].toLowerCase();
    return words.some(
      (word) => question.includes(word) || answer.includes(word)
    );
  });

  return partialMatches;
}
