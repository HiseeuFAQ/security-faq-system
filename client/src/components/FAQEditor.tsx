import { useState, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, X, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface FAQEditorProps {
  faqId?: number;
  onSuccess?: () => void;
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ru", label: "Русский" },
];

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

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    ["clean"],
  ],
};

interface FormData {
  productType: "wireless" | "wired" | "eseries";
  scenario: "home" | "commercial" | "industrial";
  questions: Record<string, string>;
  answers: Record<string, string>;
  featuredImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  status: "draft" | "published";
}

export default function FAQEditor({ faqId, onSuccess }: FAQEditorProps) {
  const [formData, setFormData] = useState<FormData>({
    productType: "wireless",
    scenario: "home",
    questions: Object.fromEntries(LANGUAGES.map((l) => [l.code, ""])),
    answers: Object.fromEntries(LANGUAGES.map((l) => [l.code, ""])),
    status: "draft",
  });

  const [images, setImages] = useState<
    Array<{ id?: number; imageUrl: string; altText?: string; caption?: string; displayOrder?: number }>
  >([]);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch existing FAQ if editing
  const { data: existingFAQ } = trpc.faq.getById.useQuery(
    { id: faqId! },
    { enabled: !!faqId }
  );

  // Initialize form with existing FAQ
  if (existingFAQ && !formData.questions.en) {
    setFormData({
      productType: existingFAQ.productType as any,
      scenario: existingFAQ.scenario as any,
      questions: existingFAQ.questions,
      answers: existingFAQ.answers,
      featuredImageUrl: existingFAQ.featuredImageUrl || undefined,
      seoTitle: existingFAQ.seoTitle || undefined,
      seoDescription: existingFAQ.seoDescription || undefined,
      tags: existingFAQ.tags,
      status: existingFAQ.status as any,
    });
    setImages((existingFAQ.images || []).map((img) => ({
      ...img,
      altText: img.altText || undefined,
      caption: img.caption || undefined,
      displayOrder: img.displayOrder || undefined,
    })));
  }

  // tRPC mutations
  const createMutation = trpc.faq.create.useMutation();
  const updateMutation = trpc.faq.update.useMutation();
  const uploadImageMutation = trpc.faq.uploadImage.useMutation();
  const deleteImageMutation = trpc.faq.deleteImage.useMutation();

  const handleQuestionChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: {
        ...prev.questions,
        [currentLanguage]: value,
      },
    }));
  }, [currentLanguage]);

  const handleAnswerChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentLanguage]: value,
      },
    }));
  }, [currentLanguage]);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || !faqId) return;

      setUploadingImage(true);
      try {
        for (const file of Array.from(files)) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            if (event.target?.result) {
              const base64 = (event.target.result as string).split(",")[1];
              const result = await uploadImageMutation.mutateAsync({
                faqId,
                fileName: file.name,
                fileData: base64,
                altText: "",
                caption: "",
              });
              setImages((prev) => [...prev, {
                id: result.id,
                imageUrl: result.imageUrl,
                altText: result.altText || undefined,
                caption: result.caption || undefined,
                displayOrder: result.displayOrder || undefined,
              }]);
            }
          };
          reader.readAsDataURL(file);
        }
      } finally {
        setUploadingImage(false);
      }
    },
    [faqId, uploadImageMutation]
  );

  const handleDeleteImage = async (imageId?: number) => {
    if (!imageId || !faqId) return;
    try {
      await deleteImageMutation.mutateAsync({ imageId, faqId });
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  const handleSave = async (publish: boolean = false) => {
    setIsLoading(true);
    try {
      const status: "draft" | "published" = publish ? "published" : "draft";
      const payload = {
        ...formData,
        status,
        tags: formData.tags?.filter((t) => t.trim()) || [],
      };

      if (faqId) {
        await updateMutation.mutateAsync({
          id: faqId,
          ...payload,
          changeSummary: publish ? "Published" : "Saved",
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to save FAQ:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{faqId ? "Edit FAQ" : "Create New FAQ"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Type
              </label>
              <Select
                value={formData.productType}
                onValueChange={(value: any) =>
                  setFormData((prev) => ({ ...prev, productType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCTS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Scenario</label>
              <Select
                value={formData.scenario}
                onValueChange={(value: any) =>
                  setFormData((prev) => ({ ...prev, scenario: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCENARIOS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SEO Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                SEO Title
              </label>
              <Input
                value={formData.seoTitle || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seoTitle: e.target.value,
                  }))
                }
                placeholder="SEO-friendly title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                SEO Description
              </label>
              <Textarea
                value={formData.seoDescription || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seoDescription: e.target.value,
                  }))
                }
                placeholder="SEO description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <Input
                value={formData.tags?.join(", ") || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tags: e.target.value.split(",").map((t) => t.trim()),
                  }))
                }
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          {/* Multi-language Content */}
          <div>
            <label className="block text-sm font-medium mb-4">
              Questions & Answers
            </label>
            <Tabs value={currentLanguage} onValueChange={setCurrentLanguage}>
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
                {LANGUAGES.map((lang) => (
                  <TabsTrigger key={lang.code} value={lang.code}>
                    {lang.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {LANGUAGES.map((lang) => (
                <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Question ({lang.label})
                    </label>
                    <Input
                      value={formData.questions[lang.code] || ""}
                      onChange={(e) => {
                        if (currentLanguage !== lang.code) {
                          setCurrentLanguage(lang.code);
                        }
                        handleQuestionChange(e.target.value);
                      }}
                      placeholder={`Enter question in ${lang.label}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Answer ({lang.label})
                    </label>
                    <ReactQuill
                      value={formData.answers[lang.code] || ""}
                      onChange={(value) => {
                        if (currentLanguage !== lang.code) {
                          setCurrentLanguage(lang.code);
                        }
                        handleAnswerChange(value);
                      }}
                      modules={quillModules}
                      theme="snow"
                      className="bg-white"
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Image Management */}
          {faqId && (
            <div>
              <label className="block text-sm font-medium mb-4">Images</label>
              <div className="space-y-4">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Uploading...
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Click to upload images
                        </span>
                      </>
                    )}
                  </label>
                </div>

                {/* Image List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {images.map((img) => (
                    <div
                      key={img.id || img.imageUrl}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.altText || ""}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3 space-y-2">
                        <Input
                          value={img.altText || ""}
                          onChange={(e) => {
                            const idx = images.findIndex((i) => (i.id || i.imageUrl) === (img.id || img.imageUrl));
                            if (idx >= 0) {
                              const updated = [...images];
                              updated[idx] = { ...updated[idx], altText: e.target.value || undefined };
                              setImages(updated);
                            }
                          }}
                          placeholder="Alt text"
                          className="text-sm"
                        />
                        <Input
                          value={img.caption || ""}
                          onChange={(e) => {
                            const idx = images.findIndex((i) => (i.id || i.imageUrl) === (img.id || img.imageUrl));
                            if (idx >= 0) {
                              const updated = [...images];
                              updated[idx] = { ...updated[idx], caption: e.target.value || undefined };
                              setImages(updated);
                            }
                          }}
                          placeholder="Caption"
                          className="text-sm"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteImage(img.id)}
                          className="w-full"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={() => handleSave(false)}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save as Draft
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Publish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
