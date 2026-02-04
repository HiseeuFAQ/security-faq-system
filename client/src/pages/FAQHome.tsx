import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Filter, Loader2, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { Streamdown } from "streamdown";

const PRODUCTS = [
  { value: "wireless", label: "Wireless Series" },
  { value: "wired", label: "Wired Series" },
  { value: "eseries", label: "E-Series" },
];

const SCENARIOS = [
  { value: "home", label: "Home (B2C)" },
  { value: "commercial", label: "Commercial (B2B)" },
  { value: "industrial", label: "Industrial (B2B)" },
];

export default function FAQHome() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [productFilter, setProductFilter] = useState<string>("");
  const [scenarioFilter, setScenarioFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Query published FAQs
  const { data: faqData, isLoading } = trpc.faq.list.useQuery({
    status: "published",
    productType: productFilter || undefined,
    scenario: scenarioFilter || undefined,
    search: searchQuery || undefined,
    page,
    limit: 20,
  });

  // Compute stats
  const stats = useMemo(() => {
    if (!faqData) return { total: 0, products: {}, scenarios: {} };

    const products: Record<string, number> = {};
    const scenarios: Record<string, number> = {};

    faqData.items?.forEach((faq) => {
      products[faq.productType] = (products[faq.productType] || 0) + 1;
      scenarios[faq.scenario] = (scenarios[faq.scenario] || 0) + 1;
    });

    return {
      total: faqData.total || 0,
      products,
      scenarios,
    };
  }, [faqData]);

  const isFiltered =
    !!searchQuery || !!productFilter || !!scenarioFilter;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container max-w-6xl mx-auto px-4 py-8 sm:py-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Hiseeu FAQ</h1>
              <p className="text-muted-foreground mt-2">
                Find answers to your questions instantly
              </p>
            </div>
            {user?.role === "admin" && (
              <Button
                onClick={() => setLocation("/admin/faq")}
                variant="outline"
              >
                Manage FAQs
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product
                  </label>
                  <Select
                    value={productFilter}
                    onValueChange={(value) => {
                      setProductFilter(value);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Products" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Products</SelectItem>
                      {PRODUCTS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                          {stats.products[p.value] && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({stats.products[p.value]})
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Scenario Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Scenario
                  </label>
                  <Select
                    value={scenarioFilter}
                    onValueChange={(value) => {
                      setScenarioFilter(value);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Scenarios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Scenarios</SelectItem>
                      {SCENARIOS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                          {stats.scenarios[s.value] && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({stats.scenarios[s.value]})
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                {isFiltered && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setProductFilter("");
                      setScenarioFilter("");
                      setPage(1);
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                )}

                {/* Stats */}
                <div className="pt-4 border-t space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">{stats.total}</span>
                    <span className="text-muted-foreground"> FAQs available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - FAQs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-12 h-11"
              />
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">Loading FAQs...</p>
                </div>
              </div>
            ) : faqData?.items && faqData.items.length > 0 ? (
              <div className="space-y-4">
                {/* Results Info */}
                <div className="text-sm text-muted-foreground">
                  Showing {faqData.items.length} of {faqData.total} results
                </div>

                {/* FAQ Accordion */}
                <Accordion
                  type="single"
                  collapsible
                  value={expandedFAQ || ""}
                  onValueChange={setExpandedFAQ}
                >
                  {faqData.items.map((faq) => {
                    const question =
                      (faq.questions as Record<string, string>)?.en ||
                      "Untitled";
                    const answer =
                      (faq.answers as Record<string, string>)?.en ||
                      "No answer available";

                    return (
                      <AccordionItem
                        key={faq.id}
                        value={`faq-${faq.id}`}
                        className="border rounded-lg mb-3 px-4"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-start gap-3 text-left flex-1">
                            <ChevronRight className="w-5 h-5 flex-shrink-0 mt-0.5 text-muted-foreground transition-transform" />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base leading-snug">
                                {question}
                              </h3>
                              <div className="flex gap-2 mt-2 flex-wrap">
                                <Badge variant="secondary" className="text-xs">
                                  {PRODUCTS.find(
                                    (p) => p.value === faq.productType
                                  )?.label}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {SCENARIOS.find(
                                    (s) => s.value === faq.scenario
                                  )?.label}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-0 pb-4">
                          <div className="ml-8 prose prose-sm dark:prose-invert max-w-none">
                            <Streamdown>{answer}</Streamdown>
                          </div>
                          {faq.images && faq.images.length > 0 && (
                            <div className="mt-4 ml-8 space-y-3">
                              {faq.images.map((img) => (
                                <figure key={img.id}>
                                  <img
                                    src={img.imageUrl}
                                    alt={img.altText || ""}
                                    className="rounded-lg max-w-full h-auto"
                                  />
                                  {img.caption && (
                                    <figcaption className="text-sm text-muted-foreground mt-2">
                                      {img.caption}
                                    </figcaption>
                                  )}
                                </figure>
                              ))}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-6">
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {Math.ceil((faqData.total || 0) / 20)}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= Math.ceil((faqData.total || 0) / 20)}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    {isFiltered
                      ? "No FAQs match your filters. Try adjusting your search."
                      : "No FAQs available yet."}
                  </p>
                  {isFiltered && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setProductFilter("");
                        setScenarioFilter("");
                        setPage(1);
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
