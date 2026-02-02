import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, Upload, Save } from "lucide-react";

const LANGUAGES = {
  en: "English",
  zh: "中文",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ru: "Русский",
};

const PRODUCTS = ["wireless", "wired", "eseries"];
const SCENARIOS = ["home", "commercial", "industrial"];

interface FAQItem {
  id: string;
  productId: string;
  scenarioId: string;
  questions: Record<string, string>;
  answers: Record<string, string>;
  images?: string[];
}

export default function HiseeuAdmin() {
  const { language, setLanguage } = useLanguage();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFAQ, setNewFAQ] = useState<Partial<FAQItem>>({
    productId: "wireless",
    scenarioId: "home",
    questions: {},
    answers: {},
  });

  const handleAddFAQ = () => {
    if (
      newFAQ.questions &&
      newFAQ.answers &&
      newFAQ.productId &&
      newFAQ.scenarioId
    ) {
      const faqItem: FAQItem = {
        id: Date.now().toString(),
        productId: newFAQ.productId,
        scenarioId: newFAQ.scenarioId,
        questions: newFAQ.questions,
        answers: newFAQ.answers,
        images: newFAQ.images,
      };
      setFaqs([...faqs, faqItem]);
      setNewFAQ({
        productId: "wireless",
        scenarioId: "home",
        questions: {},
        answers: {},
      });
    }
  };

  const handleDeleteFAQ = (id: string) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real app, upload to S3 or backend
      const imageUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setNewFAQ({
        ...newFAQ,
        images: [...(newFAQ.images || []), ...imageUrls],
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Hiseeu FAQ 管理后台</h1>
          <div className="flex gap-2">
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <Button
                key={code}
                variant={language === code ? "default" : "outline"}
                onClick={() => setLanguage(code as any)}
                size="sm"
              >
                {name}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">添加 FAQ</TabsTrigger>
            <TabsTrigger value="manage">管理 FAQ</TabsTrigger>
          </TabsList>

          {/* Add FAQ Tab */}
          <TabsContent value="add" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">新增 FAQ</h2>

              {/* Product Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  产品分类
                </label>
                <select
                  value={newFAQ.productId}
                  onChange={(e) =>
                    setNewFAQ({ ...newFAQ, productId: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scenario Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  应用场景
                </label>
                <select
                  value={newFAQ.scenarioId}
                  onChange={(e) =>
                    setNewFAQ({ ...newFAQ, scenarioId: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  {SCENARIOS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Multilingual Questions and Answers */}
              <div className="space-y-4">
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <div key={code} className="space-y-2">
                    <h3 className="font-semibold text-sm">{name}</h3>
                    <Input
                      placeholder={`问题 (${name})`}
                      value={newFAQ.questions?.[code] || ""}
                      onChange={(e) =>
                        setNewFAQ({
                          ...newFAQ,
                          questions: {
                            ...newFAQ.questions,
                            [code]: e.target.value,
                          },
                        })
                      }
                      className="mb-2"
                    />
                    <textarea
                      placeholder={`答案 (${name})`}
                      value={newFAQ.answers?.[code] || ""}
                      onChange={(e) =>
                        setNewFAQ({
                          ...newFAQ,
                          answers: {
                            ...newFAQ.answers,
                            [code]: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border rounded h-24"
                    />
                  </div>
                ))}
              </div>

              {/* Image Upload */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">
                  上传图片
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border rounded"
                />
                {newFAQ.images && newFAQ.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {newFAQ.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`preview-${idx}`}
                        className="w-full h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <Button
                onClick={handleAddFAQ}
                className="mt-6 w-full"
                size="lg"
              >
                <Save className="mr-2 h-4 w-4" />
                保存 FAQ
              </Button>
            </Card>
          </TabsContent>

          {/* Manage FAQ Tab */}
          <TabsContent value="manage" className="space-y-4">
            {faqs.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground">
                暂无 FAQ 内容
              </Card>
            ) : (
              faqs.map((faq) => (
                <Card key={faq.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">
                        {faq.questions[language] || faq.questions.en}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        产品: {faq.productId} | 场景: {faq.scenarioId}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(faq.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteFAQ(faq.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm">
                    {faq.answers[language] || faq.answers.en}
                  </p>
                  {faq.images && faq.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      {faq.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`faq-${idx}`}
                          className="w-full h-24 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
