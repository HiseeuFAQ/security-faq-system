import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useRoute, useLocation } from "wouter";
import FAQEditor from "@/components/FAQEditor";

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

export default function FAQManagement() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/admin/faq/:id");

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");
  const [productFilter, setProductFilter] = useState<string>("");
  const [scenarioFilter, setScenarioFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  // Dialog states
  const [editingFAQId, setEditingFAQId] = useState<number | null>(null);
  const [deletingFAQId, setDeletingFAQId] = useState<number | null>(null);
  const [publishingFAQId, setPublishingFAQId] = useState<number | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState<number | null>(null);

  // tRPC queries and mutations
  const { data: faqList, isLoading, refetch } = trpc.faq.list.useQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
    productType: productFilter || undefined,
    scenario: scenarioFilter || undefined,
    search: searchQuery || undefined,
    page,
    limit: 10,
  });

  const { data: versionHistory } = trpc.faq.getVersionHistory.useQuery(
    { faqId: showVersionHistory! },
    { enabled: !!showVersionHistory }
  );

  const deleteMutation = trpc.faq.delete.useMutation();
  const publishMutation = trpc.faq.publish.useMutation();
  const unpublishMutation = trpc.faq.unpublish.useMutation();

  // Check admin access
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Access Denied</h3>
                <p className="text-sm text-muted-foreground">
                  Only administrators can access this page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle delete
  const handleDelete = async (faqId: number) => {
    try {
      await deleteMutation.mutateAsync({ id: faqId });
      setDeletingFAQId(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
    }
  };

  // Handle publish/unpublish
  const handlePublish = async (faqId: number, publish: boolean) => {
    try {
      if (publish) {
        await publishMutation.mutateAsync({ id: faqId });
      } else {
        await unpublishMutation.mutateAsync({ id: faqId });
      }
      setPublishingFAQId(null);
      refetch();
    } catch (error) {
      console.error("Failed to update FAQ status:", error);
    }
  };

  // If editing a specific FAQ
  if (match && params?.id) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto py-6">
          <Button
            variant="outline"
            onClick={() => setLocation("/admin/faq")}
            className="mb-6"
          >
            ← Back to List
          </Button>
          <FAQEditor
            faqId={parseInt(params.id)}
            onSuccess={() => {
              setLocation("/admin/faq");
              refetch();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">FAQ Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage your FAQ content, publish updates, and track versions
            </p>
          </div>
          <Button onClick={() => setLocation("/admin/faq/new")} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Create FAQ
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by question..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select
                  value={statusFilter}
                  onValueChange={(value: any) => {
                    setStatusFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Product Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Product</label>
                <Select
                  value={productFilter}
                  onValueChange={(value) => {
                    setProductFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Products</SelectItem>
                    {PRODUCTS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Scenario Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Scenario</label>
                <Select
                  value={scenarioFilter}
                  onValueChange={(value) => {
                    setScenarioFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Scenarios</SelectItem>
                    {SCENARIOS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ List Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              FAQs ({faqList?.total || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : faqList?.items && faqList.items.length > 0 ? (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Scenario</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {faqList.items.map((faq) => (
                        <TableRow key={faq.id}>
                          <TableCell className="max-w-xs truncate">
                            <div className="font-medium">
                              {(faq.questions as Record<string, string>)?.en || "Untitled"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {PRODUCTS.find((p) => p.value === faq.productType)?.label}
                          </TableCell>
                          <TableCell>
                            {SCENARIOS.find((s) => s.value === faq.scenario)?.label}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={faq.status === "published" ? "default" : "secondary"}
                            >
                              {faq.status === "published" ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Published
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Draft
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>v{faq.version}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(faq.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Publish/Unpublish Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPublishingFAQId(faq.id)}
                                title={
                                  faq.status === "published"
                                    ? "Unpublish"
                                    : "Publish"
                                }
                              >
                                {faq.status === "published" ? (
                                  <Eye className="w-4 h-4" />
                                ) : (
                                  <EyeOff className="w-4 h-4" />
                                )}
                              </Button>

                              {/* Edit Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setLocation(`/admin/faq/${faq.id}`)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>

                              {/* Delete Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeletingFAQId(faq.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {Math.ceil((faqList.total || 0) / 10)}
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
                      disabled={page >= Math.ceil((faqList.total || 0) / 10)}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No FAQs found</p>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/admin/faq/new")}
                  className="mt-4"
                >
                  Create your first FAQ
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deletingFAQId} onOpenChange={() => setDeletingFAQId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete FAQ</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this FAQ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeletingFAQId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deletingFAQId && handleDelete(deletingFAQId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Publish Confirmation Dialog */}
        <Dialog open={!!publishingFAQId} onOpenChange={() => setPublishingFAQId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {faqList?.items?.find((f) => f.id === publishingFAQId)?.status ===
                "published"
                  ? "Unpublish FAQ"
                  : "Publish FAQ"}
              </DialogTitle>
              <DialogDescription>
                {faqList?.items?.find((f) => f.id === publishingFAQId)?.status ===
                "published"
                  ? "This FAQ will no longer be visible to users."
                  : "This FAQ will be visible to all users."}
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setPublishingFAQId(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const faq = faqList?.items?.find((f) => f.id === publishingFAQId);
                  if (faq) {
                    handlePublish(faq.id, faq.status !== "published");
                  }
                }}
                disabled={publishMutation.isPending || unpublishMutation.isPending}
              >
                {(publishMutation.isPending || unpublishMutation.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {faqList?.items?.find((f) => f.id === publishingFAQId)?.status ===
                "published"
                  ? "Unpublish"
                  : "Publish"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Version History Dialog */}
        <Dialog open={!!showVersionHistory} onOpenChange={() => setShowVersionHistory(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Version History</DialogTitle>
            </DialogHeader>
            {versionHistory && versionHistory.versions && versionHistory.versions.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {versionHistory.versions.map((version: any) => (
                  <div
                    key={version.id}
                    className="border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Version {version.version}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(version.changedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{version.changeSummary}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No version history available</p>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
