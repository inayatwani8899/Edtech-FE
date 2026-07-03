import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Eye,
  BookOpen,
  ArrowUpDown,
  RefreshCw,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useQuestionStore } from "@/store/questionStore";
import { Badge } from "@/components/ui/badge";

export const QuestionsList: React.FC = () => {
  const navigate = useNavigate();
  const {
    questions,
    loading,
    currentPage,
    totalPages,
    limit,
    totalCount,
    searchTerm,
    sortBy,
    sortDirection,
    filters,
    tests,
    grades,
    categories,
    theories,
    tags,
    loadingTests,
    loadingGrades,
    loadingCategories,
    loadingTheories,
    loadingTags,

    setPage,
    setLimit,
    setSort,
    setSearchTerm,
    setFilterTestId,
    setFilterCategoryId,
    setFilterTheoryId,
    setFilterTagId,
    setFilterGradeId,
    setFilterIsActive,
    resetFilters,
    fetchQuestions,
    fetchTests,
    fetchGrades,
    deleteOpen,
    openDeleteDialog,
    closeDeleteDialog,
    deleteQuestion,
  } = useQuestionStore();

  useEffect(() => {
    fetchTests();
    fetchGrades();
    fetchQuestions();
  }, [fetchTests, fetchGrades, fetchQuestions]);

  const handleSort = (field: string) => {
    const isCurrent = sortBy === field;
    const direction = isCurrent && sortDirection === 'asc' ? 'desc' : 'asc';
    setSort(field, direction);
  };

  const handleRefresh = () => {
    fetchQuestions();
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="h-px w-6 bg-primary/40"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">Content Repository</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 mb-0.5">
              Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Questions</span>
            </h1>
            <p className="text-xs font-medium text-slate-500 max-w-2xl">
              Create, update, search, and categorize assessment questions dynamically.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-lg h-9"
              title="Refresh Questions List"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>

            <Button
              onClick={() => navigate("/manage/questions/add")}
              className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 rounded-lg h-9 px-4 transition-all hover:scale-105 active:scale-95 group"
            >
              <Plus className="h-3.5 w-3.5 mr-2 group-hover:rotate-90 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wide">Add Question</span>
            </Button>
          </div>
        </div>

        {/* Filters Panel Card */}
        <Card className="glass-card border-none shadow-elegant rounded-2xl mb-4 overflow-hidden">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              
              {/* Test Filter */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500">Test</label>
                <Select
                  value={filters.testId || "all"}
                  onValueChange={(val) => setFilterTestId(val === "all" ? "" : val)}
                  disabled={loadingTests}
                >
                  <SelectTrigger className="h-8 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-primary">
                    <SelectValue placeholder="All Tests" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg max-h-60">
                    <SelectItem value="all" className="text-xs font-medium">All Tests</SelectItem>
                    {tests.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)} className="text-xs font-medium">
                        {t.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500">Category</label>
                <Select
                  value={filters.categoryId || "all"}
                  onValueChange={(val) => setFilterCategoryId(val === "all" ? "" : val)}
                  disabled={!filters.testId || loadingCategories}
                >
                  <SelectTrigger className="h-8 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-primary disabled:bg-slate-100/50">
                    <SelectValue placeholder={!filters.testId ? "Select Test First" : "All Categories"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg max-h-60">
                    <SelectItem value="all" className="text-xs font-medium">All Categories</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)} className="text-xs font-medium">
                        {c.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Theory Filter */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500">Theory</label>
                <Select
                  value={filters.theoryId || "all"}
                  onValueChange={(val) => setFilterTheoryId(val === "all" ? "" : val)}
                  disabled={!filters.categoryId || loadingTheories}
                >
                  <SelectTrigger className="h-8 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-primary disabled:bg-slate-100/50">
                    <SelectValue placeholder={!filters.categoryId ? "Select Category First" : "All Theories"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg max-h-60">
                    <SelectItem value="all" className="text-xs font-medium">All Theories</SelectItem>
                    {theories.map((th) => (
                      <SelectItem key={th.id} value={String(th.id)} className="text-xs font-medium">
                        {th.theoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tag Filter */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500">Tag</label>
                <Select
                  value={filters.tagId || "all"}
                  onValueChange={(val) => setFilterTagId(val === "all" ? "" : val)}
                  disabled={!filters.theoryId || loadingTags}
                >
                  <SelectTrigger className="h-8 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-primary disabled:bg-slate-100/50">
                    <SelectValue placeholder={!filters.theoryId ? "Select Theory First" : "All Tags"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg max-h-60">
                    <SelectItem value="all" className="text-xs font-medium">All Tags</SelectItem>
                    {tags.map((tg) => (
                      <SelectItem key={tg.id} value={String(tg.id)} className="text-xs font-medium">
                        {tg.tagName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Grade Filter */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500">Grade</label>
                <Select
                  value={filters.gradeId || "all"}
                  onValueChange={(val) => setFilterGradeId(val === "all" ? "" : val)}
                  disabled={loadingGrades}
                >
                  <SelectTrigger className="h-8 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-primary">
                    <SelectValue placeholder="All Grades" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg max-h-60">
                    <SelectItem value="all" className="text-xs font-medium">All Grades</SelectItem>
                    {grades.map((g) => (
                      <SelectItem key={g.id} value={String(g.id)} className="text-xs font-medium">
                        {g.gradeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500">Status</label>
                <Select
                  value={filters.isActive}
                  onValueChange={setFilterIsActive}
                >
                  <SelectTrigger className="h-8 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-primary">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg max-h-60">
                    <SelectItem value="all" className="text-xs font-medium">All Statuses</SelectItem>
                    <SelectItem value="true" className="text-xs font-medium">Active</SelectItem>
                    <SelectItem value="false" className="text-xs font-medium">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-2 border-t border-slate-100">
              <div className="relative group w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search question text..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 pl-9 bg-white border border-slate-200 rounded-lg font-medium text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all w-full"
                />
              </div>

              <Button
                variant="ghost"
                onClick={resetFilters}
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors h-8 px-3 rounded-lg"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-32 space-y-6">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full border-t-4 border-primary animate-spin"></div>
                  <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full"></div>
                  <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
                </div>
                <div className="text-center">
                  <span className="text-lg font-black text-slate-400 uppercase tracking-[0.3em] block mb-1">Retrieving Records</span>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Loading questions...</span>
                </div>
              </div>
            ) : questions?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center px-10">
                <div className="bg-slate-50/80 p-12 rounded-[3rem] mb-8 relative group">
                  <HelpCircle className="h-24 w-24 text-slate-200 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">No Questions</h3>
                <p className="text-slate-400 font-medium max-w-sm text-lg mb-8 leading-relaxed">
                  {searchTerm || Object.values(filters).some(Boolean)
                    ? "No questions match your current search criteria or filters."
                    : "Create questions to populate your test configurations."}
                </p>
              </div>
            ) : (
              <div>
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow className="border-slate-200 hover:bg-transparent">
                        <TableHead 
                          onClick={() => handleSort('questiontext')}
                          className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors w-[25%]"
                        >
                          <span className="flex items-center gap-1.5">
                            Question Text <ArrowUpDown className="h-3 w-3" />
                          </span>
                        </TableHead>
                        <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[12%]">Test</TableHead>
                        <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[12%]">Category</TableHead>
                        <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[12%]">Theory</TableHead>
                        <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[12%]">Tag</TableHead>
                        <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[10%]">Grade</TableHead>
                        <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[7%]">Status</TableHead>
                        <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center w-[10%]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questions?.map((question) => (
                        <TableRow key={question.id} className="border-slate-100 hover:bg-slate-50/80 transition-all duration-200 group">
                          <TableCell className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-[10px] shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                                <FileText className="h-3 w-3" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                  {question.questionText}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs font-semibold text-slate-600 truncate max-w-[120px]" title={question.testName}>
                            {question.testName || "-"}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs font-semibold text-slate-600 truncate max-w-[120px]" title={question.categoryName}>
                            {question.categoryName || "-"}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs font-semibold text-slate-600 truncate max-w-[120px]" title={question.theoryName}>
                            {question.theoryName || "-"}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs font-semibold text-slate-600 truncate max-w-[120px]" title={question.tagName}>
                            {question.tagName || "-"}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs font-semibold text-slate-600">
                            {question.gradeName || "-"}
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-[9px] uppercase rounded-full font-bold ${question.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                              }`}>
                              {question.isActive ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/manage/questions/view/${question.id}`)}
                                className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-primary hover:bg-primary/5 hover:border-primary/30 transition-all"
                                title="View Details"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/manage/questions/edit/${question.id}`)}
                                className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                                title="Edit Question"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(question.id)}
                                className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-all"
                                title="Delete Question"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card Layout */}
                <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                  {questions?.map((question) => (
                    <Card key={question.id} className="border border-slate-200 shadow-sm overflow-hidden rounded-xl bg-white">
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className={`px-2 py-0.5 text-[9px] uppercase rounded-full font-bold ${question.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                              }`}>
                              {question.isActive ? "Active" : "Inactive"}
                            </span>
                            <div className="flex gap-2">
                              <button onClick={() => navigate(`/manage/questions/view/${question.id}`)} className="text-slate-400 hover:text-primary p-1">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button onClick={() => navigate(`/manage/questions/edit/${question.id}`)} className="text-slate-400 hover:text-indigo-600 p-1">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button onClick={() => openDeleteDialog(question.id)} className="text-slate-400 hover:text-rose-600 p-1">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-3">
                            {question.questionText}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-500">
                          <div>
                            <span className="block text-[8px] font-black text-slate-400 uppercase">Test</span>
                            <span className="truncate block max-w-[120px]">{question.testName || "-"}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-black text-slate-400 uppercase">Category</span>
                            <span className="truncate block max-w-[120px]">{question.categoryName || "-"}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-black text-slate-400 uppercase">Theory</span>
                            <span className="truncate block max-w-[120px]">{question.theoryName || "-"}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-black text-slate-400 uppercase">Tag</span>
                            <span className="truncate block max-w-[120px]">{question.tagName || "-"}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination Section */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-medium text-slate-500">
                    Showing <span className="font-bold text-slate-900">{questions?.length}</span> of{" "}
                    <span className="font-bold text-slate-900">{totalCount}</span> questions
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    limit={limit}
                    onLimitChange={setLimit}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={closeDeleteDialog}
        onConfirm={deleteQuestion}
        loading={loading}
        title="Delete Question Record"
        description="Are you sure you want to soft delete this question? Users won't see it in upcoming psychometric evaluations."
      />
    </div>
  );
};

export default QuestionsList;
