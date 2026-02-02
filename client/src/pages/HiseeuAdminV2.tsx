import { useState } from "react";
import { useHiseeuLanguage } from "@/contexts/HiseeuLanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Trash2, Upload, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQEntry {
  id: string;
  product: "wireless" | "wired" | "eseries";
  scenario: "home" | "commercial" | "industrial";
  type: "b2c" | "b2b";
  questions: Record<string, string>;
  answers: Record<string, string>;
  images: string[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export default function HiseeuAdminV2() {
  const { language, setLanguage, t } = useHiseeuLanguage();
  const [activeTab, setActiveTab] = useState("list");
  const [entries, setEntries] = useState<FAQEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    product: "wireless" as const,
    scenario: "home" as const,
    type: "b2c" as const,
    questions: {
      en: "",
      zh: "",
      es: "",
      fr: "",
      de: "",
      ru: ""
    },
    answers: {
      en: "",
      zh: "",
      es: "",
      fr: "",
      de: "",
      ru: ""
    },
    images: [] as string[],
    status: "draft" as const
  });

  const languages = [
    { code: "en", label: "English" },
    { code: "zh", label: "中文" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
    { code: "ru", label: "Русский" }
  ];

  const products = [
    { id: "wireless", label: "Wireless Series" },
    { id: "wired", label: "Wired Series" },
    { id: "eseries", label: "E-Series" }
  ];

  const scenarios = [
    { id: "home", label: "Home (B2C)" },
    { id: "commercial", label: "Commercial (B2B)" },
    { id: "industrial", label: "Industrial (B2B)" }
  ];

  const handleSave = () => {
    if (editingId) {
      setEntries(entries.map(e => 
        e.id === editingId 
          ? { ...e, ...formData, updatedAt: new Date().toISOString() }
          : e
      ));
    } else {
      setEntries([...entries, {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    }
    resetForm();
  };

  const handleEdit = (entry: FAQEntry) => {
    setFormData({
      product: entry.product as "wireless",
      scenario: entry.scenario as "home",
      type: entry.type as "b2c",
      questions: entry.questions as any,
      answers: entry.answers as any,
      images: entry.images,
      status: entry.status as "draft"
    });
    setEditingId(entry.id);
    setActiveTab("edit");
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, event.target?.result as string]
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const resetForm = () => {
    setFormData({
      product: "wireless",
      scenario: "home",
      type: "b2c",
      questions: { en: "", zh: "", es: "", fr: "", de: "", ru: "" },
      answers: { en: "", zh: "", es: "", fr: "", de: "", ru: "" },
      images: [],
      status: "draft"
    });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-blue-900">Hiseeu FAQ Admin</h1>
            <div className="flex gap-2">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={cn(
                    "px-3 py-2 rounded text-sm font-medium transition-colors",
                    language === lang.code
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">FAQ List ({entries.length})</TabsTrigger>
            <TabsTrigger value="edit">
              {editingId ? "Edit FAQ" : "Add New FAQ"}
            </TabsTrigger>
          </TabsList>

          {/* FAQ List Tab */}
          <TabsContent value="list" className="space-y-4">
            {entries.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  No FAQ entries yet. Click "Add New FAQ" to create one.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {entries.map(entry => (
                  <Card key={entry.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {entry.questions[language as keyof typeof entry.questions] || entry.questions.en}
                          </CardTitle>
                          <div className="flex gap-2 mt-2 text-sm text-gray-600">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {products.find(p => p.id === entry.product)?.label}
                            </span>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                              {scenarios.find(s => s.id === entry.scenario)?.label}
                            </span>
                            <span className={cn(
                              "px-2 py-1 rounded",
                              entry.status === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            )}>
                              {entry.status === "published" ? "Published" : "Draft"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(entry)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 line-clamp-2">
                        {entry.answers[language as keyof typeof entry.answers] || entry.answers.en}
                      </p>
                      {entry.images.length > 0 && (
                        <div className="mt-4 flex gap-2 flex-wrap">
                          {entry.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Image ${idx + 1}`}
                              className="h-20 w-20 object-cover rounded border"
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Edit/Add Tab */}
          <TabsContent value="edit">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingId ? "Edit FAQ" : "Add New FAQ"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product and Scenario Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product</label>
                    <select
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Scenario</label>
                    <select
                      value={formData.scenario}
                      onChange={(e) => setFormData({ ...formData, scenario: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {scenarios.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: (e.target.value === "published" ? "draft" : "draft") })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                {/* Multilingual Content */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Content in All Languages</h3>
                  {languages.map(lang => (
                    <div key={lang.code} className="space-y-2 p-4 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-medium">{lang.label}</label>
                      <Input
                        placeholder={`Question in ${lang.label}`}
                        value={formData.questions[lang.code as keyof typeof formData.questions]}
                        onChange={(e) => setFormData({
                          ...formData,
                          questions: {
                            ...formData.questions,
                            [lang.code]: e.target.value
                          }
                        })}
                        className="mb-2"
                      />
                      <textarea
                        placeholder={`Answer in ${lang.label}`}
                        value={formData.answers[lang.code as keyof typeof formData.answers]}
                        onChange={(e) => setFormData({
                          ...formData,
                          answers: {
                            ...formData.answers,
                            [lang.code]: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                      />
                    </div>
                  ))}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700">Click to upload</span>
                      <span className="text-gray-600"> or drag and drop</span>
                    </label>
                  </div>
                  {formData.images.length > 0 && (
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={img}
                            alt={`Preview ${idx + 1}`}
                            className="h-24 w-24 object-cover rounded border"
                          />
                          <button
                            onClick={() => setFormData({
                              ...formData,
                              images: formData.images.filter((_, i) => i !== idx)
                            })}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {editingId ? "Update FAQ" : "Save FAQ"}
                  </Button>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
