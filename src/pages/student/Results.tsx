
import { useState, useEffect } from "react";
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
  ChevronUp
} from "lucide-react";
import api from "@/api/axios";

// Interface matching your API response
interface UserTestSubmission {
  testId: number;
  testTitle: string;
  testDescription: string;
  totalQuestions: number;
  attemptCount: number;
  lastAttemptDate: string;
}

interface SortConfig {
  key: keyof UserTestSubmission | 'category';
  direction: 'asc' | 'desc';
}

export const Results = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");
  const [downloadingReports, setDownloadingReports] = useState<{ [key: number]: boolean }>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'lastAttemptDate', direction: 'desc' });
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
    fetchUserSubmissions({ page: 1, limit: 10 });

    // Cleanup on unmount
    return () => {
      clearUserSubmissions();
    };
  }, []);

  // Handle pagination
  const handlePageChange = (page: number) => {
    fetchUserSubmissions({
      page,
      limit: userSubmissions?.pageSize || 10
    });
  };

  // Handle retry
  const handleRetry = () => {
    fetchUserSubmissions({
      page: userSubmissions?.pageNumber || 1,
      limit: userSubmissions?.pageSize || 10
    });
  };

  // Download report when we have reportId
  const downloadReportWithReportId = async (reportId: number, testTitle: string) => {
    if (!reportId) {
      alert("Report not available for this attempt.");
      return;
    }

    setDownloadingReports(prev => ({ ...prev, [reportId]: true }));

    try {
      const response = await api.get(`/ReportGeneration/download/${reportId}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${testTitle.replace(/\s+/g, "_")}_Report_${reportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
      alert("Failed to download report. Please try again.");
    } finally {
      setDownloadingReports(prev => ({ ...prev, [reportId]: false }));
    }
  };

  // When we have only attemptId
  const downloadReport = async (attemptId: number, testTitle: string) => {
    if (!attemptId) {
      alert("Invalid attempt selected.");
      return;
    }

    setDownloadingReports(prev => ({ ...prev, [attemptId]: true }));
    try {
      const generateResponse = await api.post(`/ReportGeneration/generate`, {
        attemptId: attemptId
      });
      const reportId = generateResponse?.data?.data?.report_Id;
      if (!reportId) {
        throw new Error("Report ID not received from generate API");
      }
      const response = await api.get(`/ReportGeneration/download/${reportId}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `${testTitle.replace(/\s+/g, "_")}_Report_${attemptId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileURL);

    } catch (error) {
      console.error(error);
      alert("Failed to download report. Please try again.");
    } finally {
      setDownloadingReports(prev => ({ ...prev, [attemptId]: false }));
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

  // Filter submissions based on selected filters
  const filteredSubmissions = userSubmissions?.items.filter(submission => {
    if (selectedCategory !== "all") {
      const categoryMap: { [key: string]: string } = {
        'aptitude': 'psychometric',
        'personality': 'personality',
        'interest': 'interest',
        'eq': 'emotional'
      };

      if (selectedCategory in categoryMap) {
        return submission.testTitle.toLowerCase().includes(categoryMap[selectedCategory]);
      }
    }
    return true;
  }) || [];

  // Sort submissions
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    if (sortConfig.key === 'category') {
      const categoryA = getCategoryBadge(a.testTitle).label;
      const categoryB = getCategoryBadge(b.testTitle).label;
      if (categoryA < categoryB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (categoryA > categoryB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle sort
  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

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

  // Calculate statistics from actual data
  const totalTests = userSubmissions?.totalCount || 0;
  const averageAttempts = userSubmissions?.items.length
    ? Math.round(userSubmissions.items.reduce((sum, submission) => sum + submission.attemptCount, 0) / userSubmissions.items.length)
    : 0;

  // Loading state
  if (userSubmissionsLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Test Results</h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-lg">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-lg text-gray-600 font-medium">Loading your test submissions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (userSubmissionsError) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Test Results</h1>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load results</h3>
            <p className="text-muted-foreground mb-4">{userSubmissionsError}</p>
            <Button onClick={handleRetry}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Test Results</h1>
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg p-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="flex items-center gap-2"
            >
              <Table className="h-4 w-4" />
              Table
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              Cards
            </Button>
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="aptitude">Aptitude</SelectItem>
              <SelectItem value="personality">Personality</SelectItem>
              <SelectItem value="interest">Interest</SelectItem>
              <SelectItem value="eq">EQ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Tests Taken</p>
                <p className="text-2xl font-bold">{totalTests}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Attempts</p>
                <p className="text-2xl font-bold">
                  {userSubmissions?.items.reduce((sum, submission) => sum + submission.attemptCount, 0) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg. Attempts</p>
                <p className="text-2xl font-bold">{averageAttempts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="detailed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="detailed" className="space-y-6">
          {viewMode === 'table' ? (
            /* Table View */
            <Card>
              <CardHeader>
                <CardTitle>Test Submissions</CardTitle>
                <CardDescription>
                  Your complete test history with detailed information and download options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th
                          className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/80"
                          onClick={() => handleSort('testTitle')}
                        >
                          <div className="flex items-center gap-2">
                            Test Name
                            {sortConfig.key === 'testTitle' && (
                              sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th
                          className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/80"
                          onClick={() => handleSort('category')}
                        >
                          <div className="flex items-center gap-2">
                            Category
                            {sortConfig.key === 'category' && (
                              sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th
                          className="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-muted/80"
                          onClick={() => handleSort('attemptCount')}
                        >
                          <div className="flex items-center gap-2">
                            Attempts
                            {sortConfig.key === 'attemptCount' && (
                              sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th
                          className="h-12 px-8 text-left align-middle font-medium cursor-pointer hover:bg-muted/80"
                          onClick={() => handleSort('lastAttemptDate')}
                        >
                          <div className="flex items-center gap-2">
                            Last Attempt
                            {sortConfig.key === 'lastAttemptDate' && (
                              sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Questions</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSubmissions.map((submission) => {
                        const category = getCategoryBadge(submission.testTitle);
                        return (
                          <tr key={submission.testId} className="border-b hover:bg-muted/50">
                            <td className="p-4 align-middle">
                              <div>
                                <div className="font-medium">{submission.testTitle}</div>
                                <div className="text-sm text-muted-foreground line-clamp-2">
                                  {submission.testDescription}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <Badge variant={category.variant}>
                                {category.label}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{submission.attemptCount}</span>
                                {/* <Progress
                                  value={Math.min((submission.attemptCount / 10) * 100, 100)}
                                  className="w-20 h-2"
                                /> */}
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4" />
                                {formatDate(submission.lastAttemptDate)}
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              {submission.totalQuestions}
                            </td>
                            <td className="p-4 align-middle">
                              {submission?.testAttempts?.length > 0 ? (
                                <Select
                                  onValueChange={(attemptId) => {
                                    const attempt = submission.testAttempts.find(a => String(a.attemptId) === String(attemptId));
                                    if (!attempt) return;

                                    if (attempt.reportId) {
                                      downloadReportWithReportId(attempt.reportId, submission.testTitle);
                                    } else if (attempt.attemptId) {
                                      downloadReport(attempt.attemptId, submission.testTitle);
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Download Report" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Select Attempt</SelectLabel>
                                      {submission.testAttempts.map((attempt, index) => {
                                        const isDownloading = downloadingReports[attempt.attemptId || attempt.reportId];
                                        return (
                                          <SelectItem
                                            key={attempt.attemptId}
                                            value={String(attempt.attemptId)}
                                            disabled={isDownloading}
                                          >
                                            <div className="flex items-center justify-between w-full">
                                              <span>
                                                {isDownloading ? "Downloading..." : `Attempt ${attempt?.attemptNumber || index + 1}`}
                                              </span>
                                            </div>
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Button variant="outline" size="sm" disabled>
                                  No Reports
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {sortedSubmissions.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            No test submissions found for the selected filters
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {userSubmissions && userSubmissions.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-6">
                    <Button
                      variant="outline"
                      disabled={!userSubmissions.hasPreviousPage}
                      onClick={() => handlePageChange(userSubmissions.pageNumber - 1)}
                    >
                      Previous
                    </Button>

                    <span className="text-sm text-muted-foreground">
                      Page {userSubmissions.pageNumber} of {userSubmissions.totalPages}
                    </span>

                    <Button
                      variant="outline"
                      disabled={!userSubmissions.hasNextPage}
                      onClick={() => handlePageChange(userSubmissions.pageNumber + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Card View */
            <div className="grid gap-6">
              {sortedSubmissions.map((submission) => {
                const category = getCategoryBadge(submission.testTitle);
                return (
                  <Card key={submission.testId}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-5">
                            <CardTitle className="" title={submission.testTitle}>
                              {submission.testTitle}
                            </CardTitle>
                            <Badge variant={category.variant}>
                              {category.label}
                            </Badge>
                          </div>
                          <CardDescription className="truncate">
                            Last attempt on {formatDate(submission.lastAttemptDate)} • {submission.totalQuestions} questions
                          </CardDescription>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                          <div className="text-2xl font-bold text-primary">
                            {submission.attemptCount}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {submission.attemptCount === 1 ? 'attempt' : 'attempts'}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Attempt Progress</span>
                            <span className="text-sm">{submission.attemptCount} attempts</span>
                          </div>
                          <Progress value={Math.min((submission.attemptCount / 5) * 100, 100)} />
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Test Details</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p><strong>Description:</strong> {submission.testDescription}</p>
                            <p><strong>Total Questions:</strong> {submission.totalQuestions}</p>
                            <p><strong>Last Attempt:</strong> {formatDate(submission.lastAttemptDate)}</p>
                          </div>
                        </div>

                        {submission?.testAttempts?.length > 0 && (
                          <Select
                            onValueChange={(attemptId) => {
                              const attempt = submission.testAttempts.find(a => String(a.attemptId) === String(attemptId));
                              if (!attempt) return;

                              if (attempt.reportId) {
                                downloadReportWithReportId(attempt.reportId, submission.testTitle);
                              } else if (attempt.attemptId) {
                                downloadReport(attempt.attemptId, submission.testTitle);
                              }
                            }}
                          >
                            <SelectTrigger className="w-[220px]">
                              <SelectValue placeholder="Download Report" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Select Attempt</SelectLabel>
                                {submission.testAttempts.map((attempt, index) => {
                                  const isDownloading = downloadingReports[attempt.attemptId || attempt.reportId];
                                  return (
                                    <SelectItem
                                      key={attempt.attemptId}
                                      value={String(attempt.attemptId)}
                                      disabled={isDownloading}
                                      className="flex justify-between items-center"
                                    >
                                      <div className="flex items-center justify-between w-full">
                                        <span>
                                          {isDownloading ? "Downloading..." : `Attempt ${attempt?.attemptNumber || index + 1}`}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview content remains the same */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Attempts Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedSubmissions.slice(0, 5).map((submission) => (
                    <div key={submission?.testId}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium truncate" title={submission?.testTitle}>
                          {submission?.testTitle}
                        </span>
                        <span className="text-sm">{submission?.attemptCount} attempts</span>
                      </div>
                      {/* <Progress
                        value={Math.min((submission?.attemptCount / 10) * 100, 100)}
                        className="h-2"
                      /> */}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Test Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedSubmissions.slice(0, 4).map((submission) => {
                    const category = getCategoryBadge(submission?.testTitle);
                    return (
                      <div key={submission.testId} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate" title={submission?.testTitle}>
                              {submission.testTitle}
                            </p>
                            <Badge variant={category?.variant} className="text-xs">
                              {category?.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{formatDate(submission?.lastAttemptDate)}</span>
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-2 flex-shrink-0">
                          {submission.attemptCount} {submission.attemptCount === 1 ? 'attempt' : 'attempts'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* AI Insights content remains the same */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Test Activity Insights
              </CardTitle>
              <CardDescription>
                Analysis based on your test submission patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold mb-2">📊 Test Engagement</h4>
                  <p className="text-sm">
                    You've completed {totalTests} tests with an average of {averageAttempts} attempts per test.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold mb-2">🎯 Consistency Analysis</h4>
                  <p className="text-sm">
                    {userSubmissions?.items && userSubmissions.items.length > 0
                      ? `Your recent test activity shows consistent engagement. Keep up the good work in developing your skills through regular practice.`
                      : `Start taking tests to build your assessment history and gain valuable insights.`
                    }
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold mb-2">💡 Improvement Tips</h4>
                  <p className="text-sm">
                    {userSubmissions?.items && userSubmissions.items.some(s => s.attemptCount > 1)
                      ? `You're showing good persistence by retaking tests. Consider focusing on areas where you've made multiple attempts to track your improvement over time.`
                      : `Try retaking tests to measure your progress and identify areas for continuous improvement.`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};