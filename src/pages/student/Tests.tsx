import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Search,
  Lock,
  BookOpen,
  AlertTriangle,
  Play,
  RefreshCw,
  FileText,
  Zap,
  TrendingUp
} from "lucide-react";
import { useTestStore } from "@/store/testStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const Tests = () => {
  const { isTestPaid } = usePaymentStore();
  const { user } = useAuthStore();
  const { getPublishedTests, publishedTests, testTakingLoading } = useTestStore();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState<"latest" | "az" | "duration">("latest");
  const [processingTestId, setProcessingTestId] = useState<string | null>(null);
  const [paidStatus, setPaidStatus] = useState<Record<string, boolean>>({});
  const [paidLoading, setPaidLoading] = useState(false);

  // Fetch tests once on mount
  useEffect(() => {
    getPublishedTests();
  }, []);

  // Fetch paid statuses in parallel
  useEffect(() => {
    const tests = Array.isArray(publishedTests) ? publishedTests.filter(t => t && t.id) : [];
    if (!user?.id || tests.length === 0) return;

    const fetchAll = async () => {
      setPaidLoading(true);
      try {
        const results = await Promise.all(
          tests.map((test) => isTestPaid(String(user.id), test.id))
        );
        const map: Record<string, boolean> = {};
        tests.forEach((test, i) => {
          map[test.id] = results[i];
        });
        setPaidStatus(map);
      } catch (err) {
        console.error("Failed to load paid status map:", err);
      } finally {
        setPaidLoading(false);
      }
    };

    fetchAll();
  }, [user?.id, publishedTests]);

  // Filtering Logic
  const filtered = (publishedTests || []).filter((t) => {
    if (!t) return false;
    const q = searchTerm.toLowerCase();
    const matchSearch =
      !q ||
      t.title?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q);

    const matchTab =
      activeTab === "all" ||
      (activeTab === "completed" && (t as any).completed) ||
      (activeTab === "available" && !(t as any).completed);

    return matchSearch && matchTab;
  });

  // Sorting Logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "az") {
      return (a.title || "").localeCompare(b.title || "");
    }
    if (sortBy === "duration") {
      return (a.timeDuration || 0) - (b.timeDuration || 0);
    }
    const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
    const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
    return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
  });

  const isLoading = testTakingLoading;
  const isSyncingData = paidLoading;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
          <div className="space-y-0.5">
            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">Assessments</h1>
            <p className="text-[14px] font-medium text-[#6B7280]">Professional evaluations and psychometric tests</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 h-[42px] w-full sm:w-[180px] md:w-[220px] border-[#E5E7EB] bg-white rounded-[12px] text-[13px] text-[#111827] placeholder:text-[#6B7280] focus-visible:ring-[#4F46E5]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-[12px] border border-[#E5E7EB]">
              {[
                { id: "all", label: "All" },
                { id: "available", label: "Available" },
                { id: "completed", label: "Completed" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-white text-[#4F46E5] shadow-sm font-semibold"
                      : "text-[#6B7280] hover:text-[#111827]"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-[42px] rounded-[12px] border-[#E5E7EB] bg-white text-[12px] font-semibold text-[#111827] px-3 gap-1.5"
                >
                  <TrendingUp className="h-4 w-4 text-[#6B7280]" />
                  <span>Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-[12px] border-[#E5E7EB] bg-white">
                <DropdownMenuItem onClick={() => setSortBy("latest")} className="text-[12px] font-medium text-[#111827]">
                  Latest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("az")} className="text-[12px] font-medium text-[#111827]">
                  A-Z
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("duration")} className="text-[12px] font-medium text-[#111827]">
                  Duration
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-[#E5E7EB] rounded-[12px] p-4 h-[220px] w-full max-w-[320px] flex flex-col justify-between animate-pulse"
              >
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 w-16 bg-slate-200 rounded" />
                    <div className="h-4 w-12 bg-slate-200 rounded" />
                  </div>
                  <div className="h-5 w-32 bg-slate-200 rounded" />
                  <div className="h-3.5 w-full bg-slate-200 rounded" />
                  <div className="h-3.5 w-2/3 bg-slate-200 rounded" />
                </div>
                <div className="h-[36px] w-full bg-slate-200 rounded-[12px]" />
              </div>
            ))}
          </div>
        ) : (!publishedTests || publishedTests.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-[#E5E7EB] rounded-[12px] bg-white">
            <div className="h-12 w-12 rounded-[12px] bg-indigo-50 flex items-center justify-center text-[#4F46E5] mb-3">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-[14px] font-bold text-[#111827] mb-1">
              No Assessments Available
            </h3>
            <p className="text-[13px] text-[#6B7280] max-w-sm mb-4">
              You currently do not have any assessments assigned. Please check again later.
            </p>
            <Button
              onClick={() => getPublishedTests()}
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-[12px] h-[42px] px-4 text-[13px] font-semibold gap-1.5 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-[#E5E7EB] rounded-[12px] bg-white">
            <div className="h-12 w-12 rounded-[12px] bg-indigo-50 flex items-center justify-center text-[#4F46E5] mb-3">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-[14px] font-bold text-[#111827] mb-1">
              No Results Found
            </h3>
            <p className="text-[13px] text-[#6B7280] max-w-sm mb-4">
              No assessments match your current filters or search terms.
            </p>
            <Button
              onClick={() => {
                setActiveTab("all");
                setSearchTerm("");
                getPublishedTests();
              }}
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-[12px] h-[42px] px-4 text-[13px] font-semibold gap-1.5 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center sm:justify-items-start">
            {sorted.map((test) => {
              const isPaid = paidStatus[test.id];
              const completed = (test as any).completed;
              const inProgress = !(test as any).completed && ((test as any).inProgress || (test as any).attempts > 0 || (test as any).progress > 0);
              
              let statusLabel = "Available";
              let statusBadgeCls = "bg-[#E0E7FF] text-[#3730A3]";
              if (completed) {
                statusLabel = "Completed";
                statusBadgeCls = "bg-[#DCFCE7] text-[#166534]";
              } else if (inProgress) {
                statusLabel = "In Progress";
                statusBadgeCls = "bg-[#FEF3C7] text-[#92400E]";
              }

              return (
                <div
                  key={test.id}
                  className="group bg-white border border-[#E5E7EB] rounded-[12px] p-4 h-[220px] w-full max-w-[320px] flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.02] relative overflow-hidden"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider bg-[#F1F5F9] px-2 py-0.5 rounded-[6px]">
                        {test.category || "Standard"}
                      </span>
                      <Badge variant="outline" className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-[6px] border-0", statusBadgeCls)}>
                        {statusLabel}
                      </Badge>
                    </div>

                    <h3 className="text-[14px] font-bold text-[#111827] line-clamp-1 group-hover:text-[#4F46E5] transition-colors leading-tight">
                      {test.title}
                    </h3>
                    <p className="text-[12px] text-[#6B7280] line-clamp-2 leading-relaxed">
                      {test.description || "Evaluate your cognitive skills and personality traits with this assessment."}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="border-t border-[#E5E7EB]" />

                    <div className="flex items-center justify-between text-[12px] text-[#6B7280] font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[#6B7280]" />
                        {test.timeDuration} min
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-[#6B7280]" />
                        {test.questionCount || test.totalQuestions || "80"} Questions
                      </span>
                      <span>•</span>
                      <span className={cn("font-bold", completed ? "text-[#22C55E]" : "text-[#4F46E5]")}>
                        {statusLabel}
                      </span>
                    </div>

                    <div className="border-t border-[#E5E7EB]" />

                    <div>
                      {!user ? (
                        <Button
                          onClick={() => navigate("/login")}
                          className="w-full bg-[#111827] hover:bg-black text-white rounded-[12px] h-[36px] text-[12px] font-semibold gap-1.5"
                        >
                          <Lock className="h-3.5 w-3.5" />
                          Login to Unlock
                        </Button>
                      ) : completed ? (
                        <Button
                          onClick={() => navigate("/results")}
                          className="w-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#111827] rounded-[12px] h-[36px] text-[12px] font-semibold gap-1.5 border border-[#E5E7EB]"
                        >
                          <FileText className="h-3.5 w-3.5 text-[#22C55E]" />
                          View Report
                        </Button>
                      ) : inProgress ? (
                        <Button
                          disabled={processingTestId === test.id}
                          onClick={() => {
                            setProcessingTestId(test.id);
                            navigate(`/test/${test.id}`);
                          }}
                          className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-[12px] h-[36px] text-[12px] font-semibold gap-1.5"
                        >
                          {processingTestId === test.id ? (
                            <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Zap className="h-3.5 w-3.5" />
                          )}
                          Continue Test
                        </Button>
                      ) : (
                        <Button
                          disabled={processingTestId === test.id}
                          onClick={() => {
                            setProcessingTestId(test.id);
                            navigate(`/test/${test.id}`);
                          }}
                          className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-[12px] h-[36px] text-[12px] font-semibold gap-1.5"
                        >
                          {processingTestId === test.id ? (
                            <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : !isPaid ? (
                            <Lock className="h-3.5 w-3.5" />
                          ) : (
                            <Play className="h-3.5 w-3.5" />
                          )}
                          {!isPaid ? "Unlock Test" : "Start Assessment"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};