import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuestionStore, QuestionOptionAdmin } from "@/store/questionStore";
import {
  Save,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  FileText,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const initialOptions = (): QuestionOptionAdmin[] => [
  { optionText: "", score: 0, isCorrect: false },
  { optionText: "", score: 0, isCorrect: false },
  { optionText: "", score: 0, isCorrect: false },
  { optionText: "", score: 0, isCorrect: false },
  { optionText: "", score: 0, isCorrect: false },
];

const optionLetters = ["A", "B", "C", "D", "E"];

export const QuestionForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;
  const isViewMode = window.location.pathname.includes("/view/");

  const {
    loading,
    saving,
    currentQuestion,
    tests,
    grades,
    formCategories,
    formTheories,
    formTags,
    loadingTests,
    loadingGrades,
    loadingFormCategories,
    loadingFormTheories,
    loadingFormTags,

    fetchTests,
    fetchGrades,
    loadFormCategories,
    loadFormTheories,
    loadFormTags,
    fetchQuestionById,
    createQuestion,
    updateQuestion,
    clearCurrentQuestion,
    clearFormCascading,
  } = useQuestionStore();

  const [questionText, setQuestionText] = useState("");
  const [testId, setTestId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [theoryId, setTheoryId] = useState("");
  const [tagId, setTagId] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isReversed, setIsReversed] = useState(false);
  const [options, setOptions] = useState<QuestionOptionAdmin[]>(initialOptions());

  useEffect(() => {
    fetchTests();
    fetchGrades();

    if (isEditMode && id) {
      fetchQuestionById(id);
    } else {
      clearCurrentQuestion();
      clearFormCascading();
      setQuestionText("");
      setTestId("");
      setCategoryId("");
      setTheoryId("");
      setTagId("");
      setGradeId("");
      setIsActive(true);
      setIsReversed(false);
      setOptions(initialOptions());
    }

    return () => {
      clearCurrentQuestion();
      clearFormCascading();
    };
  }, [id, isEditMode, fetchTests, fetchGrades, fetchQuestionById, clearCurrentQuestion, clearFormCascading]);

  useEffect(() => {
    if (currentQuestion && isEditMode) {
      setQuestionText(currentQuestion.questionText);
      setTestId(String(currentQuestion.testId));
      setCategoryId(String(currentQuestion.categoryId));
      setTheoryId(String(currentQuestion.theoryId));
      setTagId(String(currentQuestion.tagId));
      setGradeId(String(currentQuestion.gradeId));
      setIsActive(currentQuestion.isActive);
      setIsReversed(!!currentQuestion.isReversed);

      if (currentQuestion.options && currentQuestion.options.length === 5) {
        setOptions(currentQuestion.options);
      } else if (currentQuestion.options && currentQuestion.options.length > 0) {
        const filled = [...currentQuestion.options];
        while (filled.length < 5) {
          filled.push({ optionText: "", score: 0, isCorrect: false });
        }
        setOptions(filled.slice(0, 5));
      }
    }
  }, [currentQuestion, isEditMode]);

  const handleTestChange = async (newTestId: string) => {
    if (isViewMode) return;
    setTestId(newTestId);
    setCategoryId("");
    setTheoryId("");
    setTagId("");
    if (newTestId) {
      loadFormCategories(newTestId);
    }
  };

  const handleCategoryChange = async (newCategoryId: string) => {
    if (isViewMode) return;
    setCategoryId(newCategoryId);
    setTheoryId("");
    setTagId("");
    if (newCategoryId) {
      loadFormTheories(newCategoryId);
    }
  };

  const handleTheoryChange = async (newTheoryId: string) => {
    if (isViewMode) return;
    setTheoryId(newTheoryId);
    setTagId("");
    if (newTheoryId) {
      loadFormTags(newTheoryId);
    }
  };

  const handleOptionTextChange = (index: number, text: string) => {
    if (isViewMode) return;
    setOptions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], optionText: text };
      return copy;
    });
  };

  const handleOptionScoreChange = (index: number, scoreVal: string) => {
    if (isViewMode) return;
    const scoreNum = Number(scoreVal) || 0;
    setOptions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], score: scoreNum };
      return copy;
    });
  };

  const handleOptionCorrectChange = (index: number, checked: boolean) => {
    if (isViewMode) return;
    setOptions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], isCorrect: checked };
      return copy;
    });
  };

  const validateForm = () => {
    if (!questionText.trim()) {
      toast.error("Question text is required");
      return false;
    }
    if (!testId) {
      toast.error("Test selection is required");
      return false;
    }
    if (!categoryId) {
      toast.error("Category selection is required");
      return false;
    }
    if (!theoryId) {
      toast.error("Psychometric Theory selection is required");
      return false;
    }
    if (!tagId) {
      toast.error("Psychometric Tag selection is required");
      return false;
    }
    if (!gradeId) {
      toast.error("Grade selection is required");
      return false;
    }

    for (let i = 0; i < 5; i++) {
      const opt = options[i];
      if (!opt.optionText.trim()) {
        toast.error(`Option ${optionLetters[i]} must have valid text content.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;
    if (!validateForm()) return;

    const payload = {
      questionText,
      testId,
      categoryId,
      theoryId,
      tagId,
      gradeId,
      isActive,
      isReversed,
      options,
    };

    try {
      if (isEditMode && id) {
        await updateQuestion(id, payload);
        toast.success("Question synchronized successfully");
      } else {
        await createQuestion(payload);
        toast.success("Question registered successfully");
      }
      navigate("/manage/questions");
    } catch (err) {
      console.error("Submit failed", err);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hydrating Form Details...</span>
        </div>
      </div>
    );
  }

  if (isViewMode && currentQuestion) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC] relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none z-0" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          {/* Header Block */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => navigate("/manage/questions")}
                className="h-8 w-8 rounded-lg border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-sm"
                title="Return to questions repository"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="h-px w-4 bg-primary/40"></div>
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">
                    Record View
                  </span>
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Question <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Details</span>
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-indigo-200 bg-indigo-50/50 text-indigo-700 font-bold text-[10px] py-1 px-3.5 uppercase tracking-wider rounded-md animate-none">
                Read-Only Profile
              </Badge>
              <Badge variant="outline" className={`${currentQuestion.isActive ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'} font-bold text-[10px] py-1 px-3.5 uppercase tracking-wider rounded-md animate-none`}>
                {currentQuestion.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2 cols width on large screens */}
            <div className="lg:col-span-2 space-y-6">
              {/* Question Text Card */}
              <Card className="glass-card border-none shadow-elegant rounded-2xl p-6 relative overflow-hidden bg-white">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                  <FileText className="h-48 w-48 text-slate-900" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-[10px] font-black uppercase tracking-wider">Psychometric Query Content</span>
                  </div>
                  <blockquote className="border-l-4 border-indigo-500 pl-4 py-1">
                    <p className="text-base font-extrabold text-slate-800 dark:text-slate-200 leading-relaxed italic">
                      "{currentQuestion.questionText}"
                    </p>
                  </blockquote>

                  {/* Operational Settings details */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 text-xs font-semibold text-slate-700">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      <span>Scoring Direction: {currentQuestion.isReversed ? "Reverse Scored" : "Standard Scored"}</span>
                    </div>
                    {currentQuestion.createdAt && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 text-xs font-semibold text-slate-700">
                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                        <span>Registered: {new Date(currentQuestion.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Options display card */}
              <Card className="glass-card border-none shadow-elegant rounded-2xl p-6 space-y-4 bg-white">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="h-5 w-5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-[9px]">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider">Options & Evaluation Metrics</h2>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options && currentQuestion.options.map((option, index) => (
                    <div
                      key={option.id ?? index}
                      className={cn(
                        "p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-200",
                        option.isCorrect 
                          ? "bg-emerald-50/30 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/30" 
                          : "bg-slate-50/30 border-slate-100 dark:bg-slate-950/20 dark:border-slate-800"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-7 w-7 rounded-lg flex items-center justify-center font-black text-xs shadow-sm shrink-0",
                          option.isCorrect 
                            ? "bg-emerald-500 text-white" 
                            : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                        )}>
                          {optionLetters[index] ?? String(index + 1)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {option.optionText}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Score Metric</span>
                        <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-extrabold text-slate-800 dark:text-slate-200 dark:bg-slate-900 shadow-sm">
                          {option.score} Points
                        </div>
                        {option.isCorrect && (
                          <Badge className="bg-emerald-500 text-white text-[9px] uppercase font-black tracking-wider rounded-md px-2 py-0.5 animate-none">
                            Target Match
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - 1 col width on large screens */}
            <div className="space-y-6">
              {/* Metadata Alignments Card */}
              <Card className="glass-card border-none shadow-elegant rounded-2xl p-6 space-y-4 bg-white">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="h-5 w-5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-[9px]">
                    <HelpCircle className="h-3 w-3" />
                  </div>
                  <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider">Alignments</h2>
                </div>

                <div className="space-y-4">
                  {/* Test metadata */}
                  <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100/60">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Assessment (Test)</span>
                    <span className="text-xs font-bold text-slate-700 truncate block">{currentQuestion.testName || "-"}</span>
                  </div>

                  {/* Grade metadata */}
                  <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100/60">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Target Grade Level</span>
                    <span className="text-xs font-bold text-slate-700 truncate block">{currentQuestion.gradeName || "-"}</span>
                  </div>

                  {/* Category metadata */}
                  <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100/60">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Taxonomy Category</span>
                    <span className="text-xs font-bold text-slate-700 truncate block">{currentQuestion.categoryName || "-"}</span>
                  </div>

                  {/* Psychometric Theory metadata */}
                  <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100/60">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Psychometric Theory</span>
                    <span className="text-xs font-bold text-slate-700 truncate block">{currentQuestion.theoryName || "-"}</span>
                  </div>

                  {/* Psychometric Tag metadata */}
                  <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100/60">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Theoretical Dimension (Tag)</span>
                    <span className="text-xs font-bold text-slate-700 truncate block">{currentQuestion.tagName || "-"}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Form Actions footer */}
          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/manage/questions")}
              className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-lg h-9 px-6 font-bold text-xs uppercase tracking-wider shadow-sm"
            >
              Return to Repository
            </Button>
            <Button
              type="button"
              onClick={() => navigate(`/manage/questions/edit/${currentQuestion.id}`)}
              className="bg-indigo-650 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-650/10 rounded-lg h-9 px-6 transition-all hover:scale-105 active:scale-95 font-bold text-xs uppercase tracking-wider"
            >
              Modify Details
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Header Block */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => navigate("/manage/questions")}
              className="h-8 w-8 rounded-lg border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-sm"
              title="Return to questions repository"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="h-px w-4 bg-primary/40"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">
                  {isViewMode ? "Record View" : isEditMode ? "Adjustment Protocol" : "Draft Creation"}
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                {isViewMode ? (
                  <>Question <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Details</span></>
                ) : isEditMode ? (
                  <>Edit <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Question</span></>
                ) : (
                  <>Add <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Question</span></>
                )}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isViewMode && (
              <Badge variant="outline" className="border-indigo-200 bg-indigo-50/50 text-indigo-700 font-bold text-[10px] py-1 px-3.5 uppercase tracking-wider rounded-md">
                Read-Only Profile
              </Badge>
            )}
            <Badge variant="outline" className={`${isActive ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'} font-bold text-[10px] py-1 px-3.5 uppercase tracking-wider rounded-md`}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        {/* Unified Responsive Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Side: Question Details & Selectors */}
            <div className="space-y-6">
              <Card className="glass-card border-none shadow-elegant rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                  <div className="h-4.5 w-4.5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-[8px]">
                    <FileText className="h-3 w-3" />
                  </div>
                  <h2 className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Evaluation Context</h2>
                </div>

                {/* Question Textarea */}
                <div className="space-y-1">
                  <Label className="text-[9px] font-black uppercase text-slate-500">Question Text</Label>
                  <Textarea
                    placeholder="Enter the assessment question text content..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    disabled={isViewMode}
                    rows={2.5}
                    className="bg-white border-slate-200 focus:ring-primary/20 focus:border-primary text-xs font-semibold placeholder:text-slate-400 rounded-lg resize-none leading-relaxed"
                  />
                </div>

                {/* Status Switch */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-slate-800">Operational Status</Label>
                    <p className="text-[10px] text-slate-400 font-medium">Toggle availability for test iterations.</p>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={setIsActive}
                    disabled={isViewMode}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>

                {/* Scoring Direction Switch */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-slate-800">Scoring Direction (Reverse)</Label>
                    <p className="text-[10px] text-slate-400 font-medium">Flag if this item utilizes reverse scoring.</p>
                  </div>
                  <Switch
                    checked={isReversed}
                    onCheckedChange={setIsReversed}
                    disabled={isViewMode}
                    className="data-[state=checked]:bg-indigo-600"
                  />
                </div>
              </Card>

              {/* Taxonomy Selectors */}
              <Card className="glass-card border-none shadow-elegant rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                  <div className="h-4.5 w-4.5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-[8px]">
                    <HelpCircle className="h-3 w-3" />
                  </div>
                  <h2 className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Taxonomy Alignments</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Test Selection */}
                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase text-slate-500">Assessment (Test)</Label>
                    <Select
                      value={testId}
                      onValueChange={handleTestChange}
                      disabled={isViewMode || loadingTests}
                    >
                      <SelectTrigger className="h-8 bg-white border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                        <SelectValue placeholder="Select Test..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg max-h-60">
                        {tests.map((t) => (
                          <SelectItem key={t.id} value={String(t.id)} className="text-xs font-medium">
                            {t.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Grade Selection */}
                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase text-slate-500">Grade Level</Label>
                    <Select
                      value={gradeId}
                      onValueChange={setGradeId}
                      disabled={isViewMode || loadingGrades}
                    >
                      <SelectTrigger className="h-8 bg-white border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
                        <SelectValue placeholder="Select Grade..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg max-h-60">
                        {grades.map((g) => (
                          <SelectItem key={g.id} value={String(g.id)} className="text-xs font-medium">
                            {g.gradeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase text-slate-500">Taxonomy Category</Label>
                    <Select
                      value={categoryId}
                      onValueChange={handleCategoryChange}
                      disabled={isViewMode || !testId || loadingFormCategories}
                    >
                      <SelectTrigger className="h-8 bg-white border-slate-200 rounded-lg text-xs font-semibold text-slate-700 disabled:bg-slate-100/50">
                        <SelectValue placeholder={!testId ? "Select Test First" : "Select Category..."} />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg max-h-60">
                        {formCategories.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)} className="text-xs font-medium">
                            {c.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Psychometric Theory Selection */}
                  <div className="space-y-1">
                    <Label className="text-[9px] font-black uppercase text-slate-500">Psychometric Theory</Label>
                    <Select
                      value={theoryId}
                      onValueChange={handleTheoryChange}
                      disabled={isViewMode || !categoryId || loadingFormTheories}
                    >
                      <SelectTrigger className="h-8 bg-white border-slate-200 rounded-lg text-xs font-semibold text-slate-700 disabled:bg-slate-100/50">
                        <SelectValue placeholder={!categoryId ? "Select Category First" : "Select Theory..."} />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg max-h-60">
                        {formTheories.map((th) => (
                          <SelectItem key={th.id} value={String(th.id)} className="text-xs font-medium">
                            {th.theoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Psychometric Tag Selection */}
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[9px] font-black uppercase text-slate-500">Theoretical Dimension (Tag)</Label>
                    <Select
                      value={tagId}
                      onValueChange={setTagId}
                      disabled={isViewMode || !theoryId || loadingFormTags}
                    >
                      <SelectTrigger className="h-8 bg-white border-slate-200 rounded-lg text-xs font-semibold text-slate-700 disabled:bg-slate-100/50">
                        <SelectValue placeholder={!theoryId ? "Select Theory First" : "Select Psychometric Tag..."} />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg max-h-60">
                        {formTags.map((tg) => (
                          <SelectItem key={tg.id} value={String(tg.id)} className="text-xs font-medium">
                            {tg.tagName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Side: Options Setup */}
            <div>
              <Card className="glass-card border-none shadow-elegant rounded-2xl p-5 space-y-4 h-full">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="h-5 w-5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-[9px]">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <h2 className="text-xs font-black uppercase text-slate-800 tracking-wider">Options Setup (Exactly 5)</h2>
                </div>

                <div className="space-y-4">
                  {options.map((option, index) => (
                    <div key={index} className="p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-indigo-500 text-white font-black text-[10px] rounded-md px-2 py-0.5 animate-none">
                          Option {optionLetters[index]}
                        </Badge>

                        <div className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            id={`option-correct-${index}`}
                            checked={option.isCorrect}
                            onChange={(e) => handleOptionCorrectChange(index, e.target.checked)}
                            disabled={isViewMode}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer disabled:cursor-not-allowed"
                          />
                          <Label htmlFor={`option-correct-${index}`} className="text-[10px] font-black uppercase text-slate-500 cursor-pointer select-none">
                            Correct Answer
                          </Label>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-2">
                        {/* Option Text Input */}
                        <div className="col-span-4">
                          <Input
                            placeholder="Enter option text..."
                            value={option.optionText}
                            onChange={(e) => handleOptionTextChange(index, e.target.value)}
                            disabled={isViewMode}
                            className="h-8 bg-white text-xs font-semibold border-slate-200 focus:ring-indigo-500"
                          />
                        </div>

                        {/* Option Score Input */}
                        <div className="col-span-1">
                          <Input
                            type="number"
                            placeholder="Score"
                            value={option.score}
                            onChange={(e) => handleOptionScoreChange(index, e.target.value)}
                            disabled={isViewMode}
                            className="h-8 bg-white text-xs font-bold text-center border-slate-200 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Form Actions footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/manage/questions")}
              className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-lg h-8 px-5 font-bold text-xs uppercase tracking-wider"
            >
              Cancel
            </Button>
            
            {!isViewMode && (
              <Button
                type="submit"
                disabled={saving}
                className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 rounded-lg h-8 px-6 transition-all hover:scale-105 active:scale-95 group font-bold text-xs uppercase tracking-wider"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                    Synchronizing...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5 mr-2 group-hover:scale-110 transition-transform" />
                    Save Question
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
