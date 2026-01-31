import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function FeedbackForm() {
  const { language, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Use tRPC mutation for feedback submission
  const submitFeedback = trpc.feedback.submit.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setEmail("");
      setMessage("");
    },
    onError: (error) => {
      toast.error(
        language === "en"
          ? "Failed to submit feedback. Please try again."
          : "反馈提交失败，请重试。"
      );
      console.error("Feedback submission error:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !message.trim()) {
      toast.error(
        language === "en"
          ? "Please fill in all fields"
          : "请填写所有字段"
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(
        language === "en"
          ? "Please enter a valid email address"
          : "请输入有效的电子邮件地址"
      );
      return;
    }

    // Validate message length
    if (message.length < 10) {
      toast.error(
        language === "en"
          ? "Message must be at least 10 characters"
          : "消息必须至少 10 个字符"
      );
      return;
    }

    // Submit feedback via tRPC
    submitFeedback.mutate({
      email,
      message,
      language: language as "en" | "zh",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          {t("footer.email")}
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={submitFeedback.isPending}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t("footer.feedback")}
        </label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("footer.feedbackPlaceholder")}
          disabled={submitFeedback.isPending}
          rows={4}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={submitFeedback.isPending}
        className="w-full"
      >
        {submitFeedback.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitFeedback.isPending ? t("footer.submitting") : t("footer.submit")}
      </Button>
    </form>
  );
}
