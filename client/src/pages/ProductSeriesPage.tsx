import { useState, useMemo } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Camera,
  ChevronRight,
  ChevronLeft,
  Globe,
  Star,
  Zap,
  Battery,
  Video,
  Shield,
  Wifi,
  Moon,
  Brain,
  Mic,
  Eye,
  Rotate3D,
  Database,
  Monitor,
  Grid3X3,
  Plug,
  Sun,
  Minimize2,
  Wrench,
  DollarSign,
  Save,
  Box,
  Layers,
  Play,
  Move,
  Link2,
  Cloud,
  Bell,
  Contrast,
  ZoomIn,
  Minimize,
} from "lucide-react";
import { productSeries, getProductsBySeries, type Product, type ProductSeries as ProductSeriesType } from "@/data/products";

// Language type
type Language = "en" | "zh";

// Translations
const translations = {
  en: {
    backToFAQ: "Back to FAQ",
    searchPlaceholder: "Search products...",
    products: "Products",
    viewDetails: "View Details",
    coreAdvantages: "Core Advantages",
    specifications: "Specifications",
    noProducts: "No products found in this series.",
    language: "中文",
    cameras: "Cameras",
    nvrs: "NVRs",
    accessories: "Accessories",
    allProducts: "All Products",
  },
  zh: {
    backToFAQ: "返回FAQ",
    searchPlaceholder: "搜索产品...",
    products: "产品",
    viewDetails: "查看详情",
    coreAdvantages: "核心优势",
    specifications: "规格参数",
    noProducts: "该系列暂无产品。",
    language: "English",
    cameras: "摄像头",
    nvrs: "录像机",
    accessories: "配件",
    allProducts: "全部产品",
  },
};

// Icon mapping for advantages
const advantageIcons: Record<string, React.ReactNode> = {
  battery: <Battery className="h-6 w-6" />,
  video: <Video className="h-6 w-6" />,
  brain: <Brain className="h-6 w-6" />,
  tool: <Wrench className="h-6 w-6" />,
  scan: <Eye className="h-6 w-6" />,
  eye: <Eye className="h-6 w-6" />,
  mic: <Mic className="h-6 w-6" />,
  shield: <Shield className="h-6 w-6" />,
  wifi: <Wifi className="h-6 w-6" />,
  moon: <Moon className="h-6 w-6" />,
  rotate: <Rotate3D className="h-6 w-6" />,
  monitor: <Monitor className="h-6 w-6" />,
  grid: <Grid3X3 className="h-6 w-6" />,
  database: <Database className="h-6 w-6" />,
  globe: <Globe className="h-6 w-6" />,
  box: <Box className="h-6 w-6" />,
  layers: <Layers className="h-6 w-6" />,
  play: <Play className="h-6 w-6" />,
  dollar: <DollarSign className="h-6 w-6" />,
  save: <Save className="h-6 w-6" />,
  sun: <Sun className="h-6 w-6" />,
  compress: <Minimize className="h-6 w-6" />,
  plug: <Plug className="h-6 w-6" />,
  zoom: <ZoomIn className="h-6 w-6" />,
  contrast: <Contrast className="h-6 w-6" />,
  minimize: <Minimize2 className="h-6 w-6" />,
  cloud: <Cloud className="h-6 w-6" />,
  bell: <Bell className="h-6 w-6" />,
  move: <Move className="h-6 w-6" />,
  link: <Link2 className="h-6 w-6" />,
  "eye-off": <Eye className="h-6 w-6" />,
};

// Series icons
const seriesIcons: Record<string, React.ReactNode> = {
  star: <Star className="h-8 w-8" />,
  zap: <Zap className="h-8 w-8" />,
  battery: <Battery className="h-8 w-8" />,
};

// Series colors
const seriesColors: Record<string, { bg: string; text: string; border: string }> = {
  "x-series": { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  "y-series": { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  "e-series": { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
};

// Product type badges
const productTypeBadges: Record<string, { en: string; zh: string; color: string }> = {
  camera: { en: "Camera", zh: "摄像头", color: "bg-blue-100 text-blue-700" },
  nvr: { en: "NVR", zh: "录像机", color: "bg-purple-100 text-purple-700" },
  accessory: { en: "Accessory", zh: "配件", color: "bg-gray-100 text-gray-700" },
};

export default function ProductSeriesPage() {
  const params = useParams();
  const seriesId = params.seriesId || "e-series";
  
  const [language, setLanguage] = useState<Language>("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const t = translations[language];

  // Get current series
  const currentSeries = productSeries.find((s) => s.id === seriesId);
  const products = getProductsBySeries(seriesId);
  const colors = seriesColors[seriesId] || seriesColors["e-series"];

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = products;
    
    // Filter by type
    if (filterType !== "all") {
      result = result.filter((p) => p.type === filterType);
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.model.toLowerCase().includes(query) ||
          p.name[language].toLowerCase().includes(query) ||
          p.summary[language].toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [products, filterType, searchQuery, language]);

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en");
  };

  if (!currentSeries) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Series not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back & Logo */}
            <div className="flex items-center gap-4">
              <Link href="/faq">
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t.backToFAQ}
                </Button>
              </Link>
              <div className="hidden sm:flex items-center">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663286627763/juwKpCJmdTyiWSOD.png" 
                  alt="Hiseeu" 
                  className="h-8 w-auto"
                />
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            {/* Language Toggle */}
            <Button variant="outline" size="sm" onClick={toggleLanguage}>
              <Globe className="h-4 w-4 mr-2" />
              {t.language}
            </Button>
          </div>
        </div>
      </header>

      {/* Series Hero */}
      <section className={`${colors.bg} py-8 md:py-12 border-b ${colors.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl ${colors.bg} ${colors.text} border ${colors.border}`}>
              {seriesIcons[currentSeries.icon] || <Star className="h-8 w-8" />}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {currentSeries.name[language]}
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} {t.products}
              </p>
            </div>
          </div>
          <p className="text-gray-700 max-w-3xl">
            {currentSeries.description[language]}
          </p>

          {/* Series Navigation */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            {productSeries.map((series) => (
              <Link key={series.id} href={`/products/${series.id}`}>
                <Button
                  variant={series.id === seriesId ? "default" : "outline"}
                  size="sm"
                  className={series.id === seriesId ? "bg-blue-600" : ""}
                >
                  {series.name[language]}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
            >
              {t.allProducts}
            </Button>
            <Button
              variant={filterType === "camera" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("camera")}
            >
              {t.cameras}
            </Button>
            <Button
              variant={filterType === "nvr" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("nvr")}
            >
              {t.nvrs}
            </Button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t.noProducts}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                language={language}
                isExpanded={expandedProduct === product.id}
                onToggle={() =>
                  setExpandedProduct(
                    expandedProduct === product.id ? null : product.id
                  )
                }
                colors={colors}
                t={t}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Product Card Component
interface ProductCardProps {
  product: Product;
  language: Language;
  isExpanded: boolean;
  onToggle: () => void;
  colors: { bg: string; text: string; border: string };
  t: typeof translations.en;
}

function ProductCard({ product, language, isExpanded, onToggle, colors, t }: ProductCardProps) {
  const typeBadge = productTypeBadges[product.type];

  return (
    <Card className={`overflow-hidden transition-all ${isExpanded ? "shadow-lg" : "hover:shadow-md"}`}>
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          {/* Product Image Placeholder */}
          <div className={`w-full md:w-48 h-32 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Camera className={`h-16 w-16 ${colors.text} opacity-50`} />
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={typeBadge.color}>
                    {typeBadge[language]}
                  </Badge>
                  <span className="text-sm text-gray-500">{product.model}</span>
                </div>
                <CardTitle className="text-xl mb-2">
                  {product.name[language]}
                </CardTitle>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.summary[language]}
                </p>
              </div>
            </div>

            {/* Quick Specs Preview */}
            <div className="flex flex-wrap gap-2 mt-4">
              {product.specs.slice(0, 4).map((spec, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {spec.key}: {spec.value[language]}
                </Badge>
              ))}
            </div>

            {/* Expand Button */}
            <Button
              variant="link"
              className="mt-4 p-0 text-blue-600"
              onClick={onToggle}
            >
              {isExpanded ? (
                <>
                  {language === "en" ? "Show Less" : "收起"}
                  <ChevronLeft className="h-4 w-4 ml-1 rotate-90" />
                </>
              ) : (
                <>
                  {t.viewDetails}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Expanded Content */}
      {isExpanded && (
        <CardContent className="pt-0 border-t">
          {/* Core Advantages */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              {t.coreAdvantages}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.advantages.map((advantage, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-white ${colors.text}`}>
                      {advantageIcons[advantage.icon] || <Star className="h-6 w-6" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {advantage.title[language]}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {advantage.description[language]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Specifications */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Grid3X3 className="h-5 w-5 text-blue-500" />
              {t.specifications}
            </h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {product.specs.map((spec, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 font-medium text-gray-700 w-1/3">
                        {spec.key}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {spec.value[language]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
