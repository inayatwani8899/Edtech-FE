
import { useState, useEffect } from "react";
// @ts-ignore
import html2pdf from "html2pdf.js";
import { useTestStore } from "@/store/testStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Download,
  TrendingUp,
  Award,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Brain,
  AlertCircle,
  FileText,
  Loader2,
  Table,
  List,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles
} from "lucide-react";
import api from "@/api/axios";

// Interface matching your new API response
interface UserTestSubmission {
  reportId: number;
  testId: number;
  testName: string;
  totalQuestions: number;
  attemptNumber: number;
  format: string;
  createdDate: string;
}

interface SortConfig {
  key: keyof UserTestSubmission | 'category';
  direction: 'asc' | 'desc';
}

export const Results = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");
  const [downloadingReports, setDownloadingReports] = useState<{ [key: number]: boolean }>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdDate', direction: 'desc' });
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Get data from store
  const {
    userSubmissions,
    userSubmissionsLoading,
    userSubmissionsError,
    fetchUserSubmissions,
    clearUserSubmissions
  } = useTestStore();

  useEffect(() => {
    // Fetch user submissions when component mounts
    fetchUserSubmissions({ pageNumber: 1, pageSize: 5, sortBy: sortConfig.key, sortDirection: sortConfig.direction });

    // Cleanup on unmount
    return () => {
      clearUserSubmissions();
    };
  }, []);

  // Handle pagination
  const handlePageChange = (page: number) => {
    fetchUserSubmissions({
      pageNumber: page,
      pageSize: userSubmissions?.pageSize || 10,
      sortBy: sortConfig.key,
      sortDirection: sortConfig.direction
    });
  };

  // Handle retry
  const handleRetry = () => {
    fetchUserSubmissions({
      pageNumber: 1,
      pageSize: 10,
      sortBy: sortConfig.key,
      sortDirection: sortConfig.direction
    });
  };

  // Download report when we have reportId
  // Download report when we have reportId
  const downloadReportWithReportId = async (reportId: number, testTitle: string) => {
    if (!reportId) {
      alert("Report not available for this attempt.");
      return;
    }

    setDownloadingReports(prev => ({ ...prev, [reportId]: true }));

    try {
      // 1. Fetch the HTML content
      const response = await api.get(`/tests/report/${reportId}/html`);
      let htmlContent = response.data;

      // 2. Pre-process HTML: Move styles from <head> to <body> to ensure html2canvas sees them
      // This is a common fix for styles being lost in iframe captures
      const styleMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/i);
      if (styleMatch) {
        const styleBlock = styleMatch[0];
        // Remove style from head (optional, but cleaner)
        // htmlContent = htmlContent.replace(styleBlock, ''); 
        // Inject style at the beginning of body
        htmlContent = htmlContent.replace('<body>', `<body>${styleBlock}`);
      }

      // 3. Create an iframe to render the content
      const iframe = document.createElement('iframe');
      Object.assign(iframe.style, {
        position: 'fixed',
        left: '0',
        top: '0',
        width: '210mm',
        height: '297mm', // Start A4 size
        border: 'none',
        zIndex: '-1000',
        visibility: 'visible'
      });
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error("Could not create iframe document");
      }

      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      // 4. Wait for rendering
      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Report render timed out, trying to print anyway...");
          resolve();
        }, 10000); // 10s wait for AI/Images

        const checkRender = setInterval(() => {
          try {
            // @ts-ignore
            if (iframe.contentWindow?.RENDER_COMPLETE === true) {
              clearInterval(checkRender);
              clearTimeout(timeout);
              resolve();
            }
          } catch (e) { }
        }, 500);
      });

      // 5. Configure PDF options
      const opt = {
        margin: 0,
        filename: `${testTitle.replace(/\s+/g, "_")}_Report_${reportId}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          scrollY: 0,
          window: iframe.contentWindow as any // Important for finding resources
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // 5. Generate and download PDF from iframe body
      // We target the body which contains the .page elements
      // @ts-ignore
      await html2pdf().set(opt).from(iframeDoc.body).save();

      // Cleanup
      document.body.removeChild(iframe);

    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to download report. Please try again.");
    } finally {
      setDownloadingReports(prev => ({ ...prev, [reportId]: false }));
    }
  };



  // Get category badge color based on test title
  const getCategoryBadge = (testTitle: string) => {
    const title = testTitle.toLowerCase();
    if (title.includes('psychometric') || title.includes('cognitive') || title.includes('aptitude')) {
      return { label: 'Aptitude', variant: 'default' as const };
    } else if (title.includes('personality')) {
      return { label: 'Personality', variant: 'secondary' as const };
    } else if (title.includes('interest')) {
      return { label: 'Interest', variant: 'outline' as const };
    } else if (title.includes('emotional') || title.includes('eq')) {
      return { label: 'EQ', variant: 'destructive' as const };
    }
    return { label: 'General', variant: 'default' as const };
  };

  // Handle sort
  const handleSort = (key: SortConfig['key']) => {
    const newDirection = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction: newDirection });

    fetchUserSubmissions({
      pageNumber: 1,
      pageSize: userSubmissions?.pageSize || 10,
      sortBy: key,
      sortDirection: newDirection
    });
  };

  // Submissions data from server (already sorted, filtered and paginated)
  const sortedSubmissions = userSubmissions?.data || [];
  const submissions = sortedSubmissions; // For backward compatibility with other uses in the file

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate statistics
  const totalAttempts = userSubmissions?.totalRecords || 0;
  const uniqueTests = submissions.length > 0
    ? new Set(submissions.map(s => s.testId)).size
    : 0;
  const averageQuestions = submissions.length > 0
    ? Math.round(submissions.reduce((sum, s) => sum + s.totalQuestions, 0) / submissions.length)
    : 0;

  // Loading state
  if (userSubmissionsLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden flex items-center justify-center">
        {/* Dynamic Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl flex flex-col items-center border border-white/20">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-slate-600 font-medium">Loading your test submissions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (userSubmissionsError) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden flex items-center justify-center p-6">
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-white/20">
          <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Failed to load results</h3>
          <p className="text-slate-500 mb-6">{userSubmissionsError}</p>
          <Button onClick={handleRetry} size="lg" className="rounded-xl shadow-lg shadow-primary/20">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative z-10 space-y-6 md:space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-6 bg-primary/30"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Performance Insights</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">
              Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dashboard</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Analyze your assessments and track your growth
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* View Mode Toggle */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 flex w-full sm:w-auto">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className={`flex-1 sm:flex-none rounded-lg px-4 gap-2 transition-all duration-300 ${viewMode === 'table' ? 'shadow-md font-bold' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Table className="h-4 w-4" />
                <span className="hidden xs:inline">Table</span>
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className={`flex-1 sm:flex-none rounded-lg px-4 gap-2 transition-all duration-300 ${viewMode === 'cards' ? 'shadow-md font-bold' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <List className="h-4 w-4" />
                <span className="hidden xs:inline">Cards</span>
              </Button>
            </div>

            {/* Category Filter */}
            <div className="min-w-[180px]">
              <Select value={selectedCategory} onValueChange={(val) => {
                setSelectedCategory(val);
                const searchMap: { [key: string]: string } = {
                  'aptitude': 'psychometric',
                  'personality': 'personality',
                  'interest': 'interest',
                  'eq': 'emotional'
                };
                fetchUserSubmissions({
                  pageNumber: 1,
                  pageSize: userSubmissions?.pageSize || 10,
                  sortBy: sortConfig.key,
                  sortDirection: sortConfig.direction,
                  search: val === 'all' ? '' : (searchMap[val] || val)
                });
              }}>
                <SelectTrigger className="w-full bg-white border-slate-200 rounded-xl shadow-sm h-10 ring-offset-0 focus:ring-0">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="aptitude">Aptitude</SelectItem>
                  <SelectItem value="personality">Personality</SelectItem>
                  <SelectItem value="interest">Interest</SelectItem>
                  <SelectItem value="eq">EQ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Attempts', value: totalAttempts, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Unique Tests', value: uniqueTests, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Avg. Questions', value: averageQuestions, icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50' }
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm backdrop-blur-md bg-white/70 group hover:translate-y-[-2px] transition-all duration-300 rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`${stat.bg} p-2 rounded-lg transition-transform group-hover:scale-105`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
                    <p className="text-xl font-black text-slate-800">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="detailed" className="space-y-6 md:space-y-8">
          <TabsList className="bg-slate-100/50 p-1 rounded-2xl w-full justify-start overflow-x-auto no-scrollbar md:w-auto">
            <TabsTrigger
              value="detailed"
              className="rounded-xl px-4 md:px-6 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all text-xs md:text-sm"
            >
              Detailed Results
            </TabsTrigger>
            <TabsTrigger
              value="overview"
              className="rounded-xl px-4 md:px-6 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all text-xs md:text-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="rounded-xl px-4 md:px-6 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all text-xs md:text-sm"
            >
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detailed" className="space-y-4">
            {viewMode === 'table' ? (
              /* Table View */
              <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-white/50 border-b border-slate-100 py-5 px-6">
                  <CardTitle className="text-lg font-bold text-slate-800">Test Submissions</CardTitle>
                  <CardDescription className="text-sm text-slate-500 font-medium">
                    Your complete test history with detailed reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th
                            className="h-12 px-6 align-middle cursor-pointer hover:bg-slate-100/50 transition-colors"
                            onClick={() => handleSort('testName')}
                          >
                            <div className="flex items-center gap-2">
                              Test Name
                              {sortConfig.key === 'testName' && (
                                sortConfig.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                              )}
                            </div>
                          </th>
                          <th
                            className="h-12 px-6 align-middle cursor-pointer hover:bg-slate-100/50 transition-colors"
                            onClick={() => handleSort('category')}
                          >
                            <div className="flex items-center gap-2">
                              Category
                              {sortConfig.key === 'category' && (
                                sortConfig.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                              )}
                            </div>
                          </th>
                          <th
                            className="h-12 px-6 align-middle cursor-pointer hover:bg-slate-100/50 transition-colors"
                            onClick={() => handleSort('attemptNumber')}
                          >
                            <div className="flex items-center gap-2">
                              Attempt #
                              {sortConfig.key === 'attemptNumber' && (

                                sortConfig.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                              )}
                            </div>
                          </th>
                          <th
                            className="h-12 px-6 align-middle cursor-pointer hover:bg-slate-100/50 transition-colors"
                            onClick={() => handleSort('createdDate')}
                          >
                            <div className="flex items-center gap-2">
                              Date
                              {sortConfig.key === 'createdDate' && (
                                sortConfig.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                              )}
                            </div>
                          </th>
                          <th className="h-12 px-6 align-middle">Questions</th>
                          <th className="h-12 px-6 align-middle text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sortedSubmissions.map((submission) => {
                          const category = getCategoryBadge(submission.testName);
                          const isDownloading = downloadingReports[submission.reportId];

                          return (
                            <tr key={submission.reportId} className="hover:bg-blue-50/30 transition-colors duration-200">
                              <td className="px-6 py-4 align-middle">
                                <div className="max-w-[300px]">
                                  <div className="font-bold text-slate-800 text-sm">{submission.testName}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 align-middle">
                                <Badge variant={category.variant} className="rounded-md px-2 py-0 text-[10px] font-bold">
                                  {category.label}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 align-middle">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs">
                                    Attempt {submission.attemptNumber}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 align-middle">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                  {formatDate(submission.createdDate)}
                                </div>
                              </td>
                              <td className="px-6 py-4 align-middle text-xs font-medium text-slate-600">
                                {submission.totalQuestions}
                              </td>
                              <td className="px-6 py-4 align-middle text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl hover:bg-primary hover:text-white transition-all gap-2"
                                  onClick={() => downloadReportWithReportId(submission.reportId, submission.testName)}
                                  disabled={isDownloading}
                                >
                                  {isDownloading ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Download className="h-3 w-3" />
                                  )}
                                  Report
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                        {sortedSubmissions.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-12 text-center text-slate-500 font-medium">
                              No test submissions found for the selected filters
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {/* Pagination Controls */}
                  {userSubmissions && userSubmissions.totalRecords > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
                      <div className="text-xs font-medium text-slate-500">
                        Showing {(userSubmissions.pageNumber - 1) * userSubmissions.pageSize + 1} to {Math.min(userSubmissions.pageNumber * userSubmissions.pageSize, userSubmissions.totalRecords)} of {userSubmissions.totalRecords} results
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={userSubmissions.pageNumber <= 1}
                          onClick={() => handlePageChange(userSubmissions.pageNumber - 1)}
                          className="rounded-lg h-8 text-xs font-bold"
                        >
                          Previous
                        </Button>
                        {Array.from({ length: Math.min(5, userSubmissions.totalPages) }, (_, i) => {
                          // Simple pagination logic to show limited page numbers
                          let pageNum = i + 1;
                          if (userSubmissions.totalPages > 5 && userSubmissions.pageNumber > 3) {
                            pageNum = userSubmissions.pageNumber - 2 + i;
                            if (pageNum > userSubmissions.totalPages) {
                              return null;
                            }
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={userSubmissions.pageNumber === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className="rounded-lg h-8 w-8 p-0 text-xs font-bold shadow-sm"
                            >
                              {pageNum}
                            </Button>
                          );
                        }).filter(Boolean)}
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={userSubmissions.pageNumber >= userSubmissions.totalPages}
                          onClick={() => handlePageChange(userSubmissions.pageNumber + 1)}
                          className="rounded-lg h-8 text-xs font-bold"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              /* Card View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedSubmissions.map((submission) => {
                  const category = getCategoryBadge(submission.testName);
                  const isDownloading = downloadingReports[submission.reportId];

                  return (
                    <Card key={submission.reportId} className="group hover:shadow-2xl transition-all duration-300 border-none shadow-soft bg-white rounded-2xl overflow-hidden">
                      <CardHeader className="pb-4 relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant={category.variant} className="rounded-md">
                                {category.label}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg font-bold text-slate-800 line-clamp-1 mb-2 group-hover:text-primary transition-colors" title={submission.testName}>
                              {submission.testName}
                            </CardTitle>
                          </div>
                          <div className="text-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="text-xl font-black text-primary">
                              #{submission.attemptNumber}
                            </div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">
                              Attempt
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-5">
                          <div className="bg-slate-50 rounded-xl p-3 text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-medium">Questions:</span>
                              <span className="text-slate-800 font-bold">{submission.totalQuestions}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-medium">Date:</span>
                              <span className="text-slate-800 font-bold">{formatDate(submission.createdDate)}</span>
                            </div>
                          </div>

                          <Button
                            className="w-full rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 gap-2"
                            onClick={() => downloadReportWithReportId(submission.reportId, submission.testName)}
                            disabled={isDownloading}
                          >
                            {isDownloading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                            Download Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white py-4 px-6 border-b border-slate-100">
                  <CardTitle className="flex items-center text-lg font-bold text-slate-800">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
                      <PieChart className="h-4 w-4" />
                    </div>
                    Attempts Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-5">
                    {sortedSubmissions.slice(0, 5).map((submission, idx) => (
                      <div key={submission?.reportId} className="group">
                        <div className="flex justify-between mb-1.5 items-center">
                          <span className="text-xs font-bold text-slate-700 truncate group-hover:text-primary transition-colors" title={submission?.testName}>
                            {idx + 1}. {submission?.testName}
                          </span>
                          <Badge variant="outline" className="text-[10px] text-slate-500 bg-slate-50 h-5 border-slate-100">Attempt {submission?.attemptNumber}</Badge>
                        </div>
                        <Progress
                          value={Math.min((submission?.attemptNumber / 10) * 100, 100)}
                          className="h-1.5 bg-slate-100 [&>div]:bg-gradient-to-r from-blue-500 to-indigo-500"
                        />
                      </div>
                    ))}
                    {sortedSubmissions.length === 0 && <p className="text-center text-slate-500 py-4 text-sm font-medium">No data available</p>}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white py-4 px-6 border-b border-slate-100">
                  <CardTitle className="flex items-center text-lg font-bold text-slate-800">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg mr-3">
                      <Clock className="h-4 w-4" />
                    </div>
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {sortedSubmissions.slice(0, 4).map((submission) => {
                      const category = getCategoryBadge(submission?.testName);
                      return (
                        <div key={submission.reportId} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-default">
                          <div className="flex-1 min-w-0 mr-4">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-bold text-slate-800 text-xs truncate" title={submission?.testName}>
                                {submission.testName}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={category?.variant} className="text-[9px] px-1.5 py-0 h-4 font-bold rounded">
                                {category?.label}
                              </Badge>
                              <p className="text-[10px] text-slate-500 font-medium flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(submission?.createdDate)}
                              </p>
                            </div>
                          </div>
                          <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-600 text-[10px]">
                            #{submission.attemptNumber}
                          </div>
                        </div>
                      );
                    })}
                    {sortedSubmissions.length === 0 && <p className="text-center text-slate-500 py-4 text-sm font-medium">No recent activity</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-slate-900 text-white rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

              <CardHeader className="relative z-10 py-6 px-8">
                <CardTitle className="flex items-center text-xl font-bold">
                  <div className="p-2 bg-primary/20 rounded-xl mr-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  Performance Insights
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm font-medium mt-1">
                  AI-driven analysis of your test submission patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 p-8 pt-0 space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-primary">
                      <BarChart3 className="h-4 w-4" />
                      Engagement
                    </h4>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      You've completed <span className="font-bold text-white text-sm mx-0.5">{totalAttempts}</span> attempts across <span className="font-bold text-white text-sm mx-0.5">{uniqueTests}</span> assessments.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-emerald-400">
                      <Target className="h-4 w-4" />
                      Consistency
                    </h4>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {submissions && submissions.length > 0
                        ? `Your activity shows steady progress. You're building a strong assessment profile.`
                        : `Start taking assessments to build your performance history.`
                      }
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-yellow-400">
                      <Brain className="h-4 w-4" />
                      Strategy
                    </h4>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {submissions && submissions.length > 1
                        ? `Persistence pays off! Your multiple attempts show commitment to mastery.`
                        : `Consider retaking key assessments to track your improvement over time.`
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};