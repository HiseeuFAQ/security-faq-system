import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [expandedTemplates, setExpandedTemplates] = useState<Set<number>>(new Set());

  // Fetch feedbacks
  const { data: feedbacks = [], isLoading: feedbacksLoading } = trpc.feedback.list.useQuery();

  // Fetch auto-reply templates
  const { data: templates = [], isLoading: templatesLoading } = trpc.autoReply.templates.useQuery();

  // Initialize default templates
  const initTemplates = trpc.autoReply.initializeDefaults.useMutation({
    onSuccess: () => {
      toast.success("Default templates initialized successfully");
    },
    onError: () => {
      toast.error("Failed to initialize templates");
    },
  });

  const toggleTemplateExpand = (id: number) => {
    const newSet = new Set(expandedTemplates);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedTemplates(newSet);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800">Pending</Badge>;
      case "read":
        return <Badge variant="outline" className="bg-blue-50 text-blue-800">Read</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-50 text-green-800">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAutoReplyStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-600">Auto-Reply Sent</Badge>;
      case "pending_review":
        return <Badge className="bg-yellow-600">Pending Review</Badge>;
      case "no_match":
        return <Badge variant="outline">No Auto-Reply</Badge>;
      case "error":
        return <Badge className="bg-red-600">Auto-Reply Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage feedback and auto-reply templates</p>
        </div>

        <Tabs defaultValue="feedbacks" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="feedbacks">
              Feedbacks ({feedbacks.length})
            </TabsTrigger>
            <TabsTrigger value="templates">
              Auto-Reply Templates ({templates.length})
            </TabsTrigger>
          </TabsList>

          {/* Feedbacks Tab */}
          <TabsContent value="feedbacks" className="space-y-4">
            {feedbacksLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : feedbacks.length === 0 ? (
              <Card className="p-8 text-center">
                <Mail className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No feedbacks yet</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {feedbacks.map((feedback: any) => (
                  <Card key={feedback.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-semibold text-slate-900">{feedback.email}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(feedback.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(feedback.status)}
                        {feedback.language === "zh" && (
                          <Badge variant="outline">中文</Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-700 mb-4 line-clamp-3">{feedback.message}</p>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFeedback(
                        selectedFeedback?.id === feedback.id ? null : feedback
                      )}
                    >
                      {selectedFeedback?.id === feedback.id ? "Hide" : "View"} Details
                    </Button>

                    {selectedFeedback?.id === feedback.id && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="bg-slate-50 p-4 rounded-lg mb-4">
                          <p className="text-sm font-medium text-slate-900 mb-2">Full Message:</p>
                          <p className="text-slate-700 whitespace-pre-wrap">{feedback.message}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-slate-900">Email</p>
                            <p className="text-slate-600">{feedback.email}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Language</p>
                            <p className="text-slate-600">
                              {feedback.language === "en" ? "English" : "中文"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Status</p>
                            <p className="text-slate-600">{feedback.status}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Submitted</p>
                            <p className="text-slate-600">
                              {new Date(feedback.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Auto-Reply Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-slate-600">
                {templates.length} template{templates.length !== 1 ? "s" : ""} configured
              </p>
              <Button
                onClick={() => initTemplates.mutate()}
                disabled={initTemplates.isPending}
                size="sm"
              >
                {initTemplates.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Initialize Defaults
              </Button>
            </div>

            {templatesLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : templates.length === 0 ? (
              <Card className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">No templates configured</p>
                <Button onClick={() => initTemplates.mutate()}>
                  Create Default Templates
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {templates.map((template: any) => (
                  <Card key={template.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-slate-900">
                            {template.titleEn}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                          {template.enabled === "true" ? (
                            <Badge className="bg-green-600 text-xs">Enabled</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Disabled</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">{template.titleZh}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTemplateExpand(template.id)}
                      >
                        {expandedTemplates.has(template.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Keywords */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-slate-900 mb-2">Keywords:</p>
                      <div className="flex flex-wrap gap-2">
                        {JSON.parse(template.keywords).map((keyword: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedTemplates.has(template.id) && (
                      <div className="border-t border-slate-200 pt-4 space-y-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900 mb-2">
                            English Response:
                          </p>
                          <div className="bg-slate-50 p-3 rounded text-sm text-slate-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                            {template.responseEn}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 mb-2">
                            Chinese Response:
                          </p>
                          <div className="bg-slate-50 p-3 rounded text-sm text-slate-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                            {template.responseZh}
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
