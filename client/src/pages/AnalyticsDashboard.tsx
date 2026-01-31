import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Loader2, TrendingUp, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const translations = {
  en: {
    title: "Analytics Dashboard",
    subtitle: "FAQ Performance & Feedback Insights",
    topFAQs: "Top Viewed FAQs",
    feedbackStats: "Feedback Statistics",
    autoReplyPerformance: "Auto-Reply Performance",
    totalViews: "Total Views",
    viewsToday: "Views Today",
    viewsThisWeek: "Views This Week",
    viewsThisMonth: "Views This Month",
    totalFeedbacks: "Total Feedbacks",
    feedbacksToday: "Today",
    feedbacksThisWeek: "This Week",
    feedbacksThisMonth: "This Month",
    pending: "Pending",
    resolved: "Resolved",
    successRate: "Success Rate",
    avgResponseTime: "Avg Response Time",
    hours: "hours",
    noData: "No data available",
    refresh: "Refresh",
    question: "Question",
    category: "Category",
    views: "Views",
    status: "Status",
  },
  zh: {
    title: "数据分析仪表板",
    subtitle: "FAQ 性能与反馈洞察",
    topFAQs: "最热门 FAQ",
    feedbackStats: "反馈统计",
    autoReplyPerformance: "自动回复性能",
    totalViews: "总浏览量",
    viewsToday: "今天浏览",
    viewsThisWeek: "本周浏览",
    viewsThisMonth: "本月浏览",
    totalFeedbacks: "总反馈数",
    feedbacksToday: "今天",
    feedbacksThisWeek: "本周",
    feedbacksThisMonth: "本月",
    pending: "待处理",
    resolved: "已解决",
    successRate: "成功率",
    avgResponseTime: "平均响应时间",
    hours: "小时",
    noData: "暂无数据",
    refresh: "刷新",
    question: "问题",
    category: "分类",
    views: "浏览量",
    status: "状态",
  },
};

export default function AnalyticsDashboard() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const [selectedCategory, setSelectedCategory] = useState("b2b");
  const topFAQsQuery = trpc.analytics.topFAQs.useQuery();
  const feedbackStatsQuery = trpc.analytics.feedbackStats.useQuery();
  const categoryFAQsQuery = trpc.analytics.faqsByCategory.useQuery({ category: selectedCategory });

  const handleRefresh = () => {
    topFAQsQuery.refetch();
    feedbackStatsQuery.refetch();
    categoryFAQsQuery.refetch();
  };

  const topFAQs = topFAQsQuery.data || [];
  const feedbackStats = feedbackStatsQuery.data;
  const categoryFAQs = categoryFAQsQuery.data || [];

  // Prepare data for charts
  const topFAQsChartData = topFAQs.slice(0, 5).map((faq) => ({
    name: language === "en" ? faq.faqQuestionEn?.substring(0, 30) : faq.faqQuestionZh?.substring(0, 30),
    views: faq.totalViews,
  }));

  const feedbackTrendData = [
    { period: language === "en" ? "Today" : "今天", count: feedbackStats?.feedbacksToday || 0 },
    { period: language === "en" ? "This Week" : "本周", count: feedbackStats?.feedbacksThisWeek || 0 },
    { period: language === "en" ? "This Month" : "本月", count: feedbackStats?.feedbacksThisMonth || 0 },
  ];

  const feedbackStatusData = [
    { name: language === "en" ? "Pending" : "待处理", value: feedbackStats?.pendingFeedbacks || 0 },
    { name: language === "en" ? "Resolved" : "已解决", value: feedbackStats?.resolvedFeedbacks || 0 },
  ];

  const COLORS = ["#ef4444", "#22c55e"];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Refresh Button */}
        <div className="mb-6">
          <Button onClick={handleRefresh} disabled={topFAQsQuery.isLoading || feedbackStatsQuery.isLoading}>
            {topFAQsQuery.isLoading || feedbackStatsQuery.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "en" ? "Loading..." : "加载中..."}
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                {t.refresh}
              </>
            )}
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t.totalViews}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {topFAQs.reduce((sum, faq) => sum + (faq.totalViews || 0), 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t.totalFeedbacks}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{feedbackStats?.totalFeedbacks || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t.successRate}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{feedbackStats?.autoReplySuccessRate || 0}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t.avgResponseTime}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedbackStats?.averageResponseTime || 0} {t.hours}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top FAQs Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t.topFAQs}</CardTitle>
            </CardHeader>
            <CardContent>
              {topFAQsChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topFAQsChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#1e40af" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">{t.noData}</div>
              )}
            </CardContent>
          </Card>

          {/* Feedback Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t.feedbackStats}</CardTitle>
            </CardHeader>
            <CardContent>
              {feedbackTrendData.some((d) => d.count > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={feedbackTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#1e40af" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">{t.noData}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Feedback Status Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{t.autoReplyPerformance}</CardTitle>
            </CardHeader>
            <CardContent>
              {feedbackStatusData.some((d) => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={feedbackStatusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                      {feedbackStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">{t.noData}</div>
              )}
            </CardContent>
          </Card>

          {/* Top FAQs Table */}
          <Card>
            <CardHeader>
              <CardTitle>{t.topFAQs}</CardTitle>
            </CardHeader>
            <CardContent>
              {topFAQs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">{t.question}</th>
                        <th className="text-right py-2 px-2">{t.views}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topFAQs.slice(0, 10).map((faq) => (
                        <tr key={faq.faqId} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-2 text-left">
                            {language === "en" ? faq.faqQuestionEn?.substring(0, 50) : faq.faqQuestionZh?.substring(0, 50)}
                            ...
                          </td>
                          <td className="py-2 px-2 text-right font-semibold">{faq.totalViews}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">{t.noData}</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
