import React, { useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import {
    Loader2,
    BookOpen,
    ChevronDown,
    ChevronRight,
    AlertCircle,
    Sparkles,
    Tag,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuestionBankStore } from "@/store/questionBankStore";
import { QuestionBankItem } from "@/types/types";

const OptionRow: React.FC<{ text: string; score?: number; isCorrect?: boolean; index: number }> = ({
    text, score, isCorrect, index,
}) => (
    <div className={`flex items-center gap-3 p-2 rounded-lg border text-xs ${isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-100"}`}>
        <span className="h-5 w-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-black text-slate-500 flex-shrink-0">
            {String.fromCharCode(65 + index)}
        </span>
        <span className="flex-1 font-medium text-slate-700">{text}</span>
        {score !== undefined && (
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {score > 0 ? `+${score}` : score}
            </span>
        )}
        {isCorrect
            ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
            : <XCircle className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />}
    </div>
);

const ExpandedDetail: React.FC<{ question: QuestionBankItem }> = ({ question }) => (
    <div className="bg-slate-50/60 border-t border-slate-100 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Options */}
            {question.options?.length > 0 && (
                <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Answer Options</p>
                    <div className="space-y-1.5">
                        {question.options.map((opt, i) => (
                            <OptionRow key={i} text={opt.optionText} score={opt.score} isCorrect={opt.isCorrect} index={i} />
                        ))}
                    </div>
                </div>
            )}

            {/* Metadata */}
            <div className="space-y-3">
                {question.reverseQuestion && (
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Reverse Question</p>
                        <p className="text-xs font-medium text-slate-600 bg-white border border-slate-100 rounded-lg p-2.5 leading-relaxed">{question.reverseQuestion}</p>
                    </div>
                )}
                {question.theory && (
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Theory / Explanation</p>
                        <p className="text-xs font-medium text-slate-600 bg-white border border-slate-100 rounded-lg p-2.5 leading-relaxed line-clamp-4">{question.theory}</p>
                    </div>
                )}
                {question.tag && (
                    <div className="flex items-center gap-2">
                        <Tag className="h-3 w-3 text-slate-400" />
                        <Badge variant="secondary" className="bg-violet-50 text-violet-700 border-none text-[9px] font-bold">{question.tag}</Badge>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export const QuestionBankList: React.FC = () => {
    const {
        questions,
        loading,
        error,
        currentPage,
        totalPages,
        totalCount,
        limit,
        expandedId,
        setPage,
        setLimit,
        setExpandedId,
        fetchQuestions,
    } = useQuestionBankStore();

    useEffect(() => {
        fetchQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-violet-50/70 to-transparent pointer-events-none z-0" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-violet-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }} />
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="h-px w-6 bg-primary/40" />
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">Assessment Library</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 mb-0.5">
                            Question <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-600">Bank</span>
                        </h1>
                        <p className="text-xs font-medium text-slate-500 max-w-2xl">
                            Browse all questions available in the platform assessment library.
                        </p>
                    </div>
                </div>

                {/* Error banner */}
                {error && !loading && (
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{error}</span>
                        <Button variant="ghost" size="sm" onClick={fetchQuestions} className="ml-auto text-rose-700 hover:bg-rose-100 h-7 px-3 text-xs font-bold">
                            Retry
                        </Button>
                    </div>
                )}

                <Card className="glass-card border-none shadow-elegant rounded-2xl overflow-hidden">
                    <CardHeader className="p-3 border-b border-slate-50">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-500">
                                {totalCount > 0 ? <><span className="text-slate-900 font-black">{totalCount}</span> questions indexed</> : "Loading..."}
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex flex-col justify-center items-center py-32 space-y-6">
                                <div className="relative">
                                    <div className="h-20 w-20 rounded-full border-t-4 border-primary animate-spin" />
                                    <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
                                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
                                </div>
                                <div className="text-center">
                                    <span className="text-lg font-black text-slate-400 uppercase tracking-[0.3em] block mb-1">Loading Questions</span>
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Fetching from assessment library...</span>
                                </div>
                            </div>
                        ) : questions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 text-center px-10">
                                <div className="bg-slate-50/80 p-12 rounded-[3rem] mb-8">
                                    <BookOpen className="h-24 w-24 text-slate-200" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">No Questions Found</h3>
                                <p className="text-slate-400 font-medium max-w-sm text-lg leading-relaxed">
                                    The question bank is empty or questions haven't been added yet.
                                </p>
                            </div>
                        ) : (
                            <div>
                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow className="border-slate-200 hover:bg-transparent">
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-8" />
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">#</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider w-[50%]">Question</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Category</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Options</TableHead>
                                                <TableHead className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {questions.map((q, idx) => (
                                                <React.Fragment key={q.id}>
                                                    <TableRow
                                                        className="border-slate-100 hover:bg-slate-50/70 transition-all duration-200 cursor-pointer"
                                                        onClick={() => toggleExpand(q.id)}
                                                    >
                                                        <TableCell className="px-4 py-2 w-8">
                                                            <div className="text-slate-400 transition-transform duration-200">
                                                                {expandedId === q.id
                                                                    ? <ChevronDown className="h-3.5 w-3.5 text-primary" />
                                                                    : <ChevronRight className="h-3.5 w-3.5" />}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="px-4 py-2 text-xs font-bold text-slate-400">
                                                            {(currentPage - 1) * limit + idx + 1}
                                                        </TableCell>
                                                        <TableCell className="px-4 py-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                                                    <BookOpen className="h-3 w-3 text-white" />
                                                                </div>
                                                                <p className="text-xs font-semibold text-slate-800 line-clamp-2 max-w-sm">
                                                                    {q.questionText}
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="px-4 py-2">
                                                            {q.categoryName
                                                                ? <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-none text-[9px] font-bold">{q.categoryName}</Badge>
                                                                : <span className="text-slate-300 text-xs italic">—</span>}
                                                        </TableCell>
                                                        <TableCell className="px-4 py-2">
                                                            <span className="text-xs font-bold text-slate-600">{q.options?.length ?? 0}</span>
                                                        </TableCell>
                                                        <TableCell className="px-4 py-2">
                                                            <span className={`px-2 py-0.5 text-[9px] uppercase rounded-full font-bold ${q.isActive !== false ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                                                {q.isActive !== false ? "Active" : "Inactive"}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                    {expandedId === q.id && (
                                                        <TableRow key={`${q.id}-detail`} className="border-slate-100">
                                                            <TableCell colSpan={6} className="p-0">
                                                                <ExpandedDetail question={q} />
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
                                    {questions.map((q, idx) => (
                                        <Card key={q.id} className="border border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
                                            <CardContent className="p-0">
                                                <button
                                                    type="button"
                                                    className="w-full flex items-start gap-3 p-4 text-left"
                                                    onClick={() => toggleExpand(q.id)}
                                                >
                                                    <span className="text-[10px] font-black text-slate-300 mt-0.5 flex-shrink-0">
                                                        #{(currentPage - 1) * limit + idx + 1}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-slate-800 line-clamp-3 mb-2">{q.questionText}</p>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            {q.categoryName && (
                                                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-none text-[9px] font-bold">{q.categoryName}</Badge>
                                                            )}
                                                            <span className="text-[9px] text-slate-400 font-bold">{q.options?.length ?? 0} options</span>
                                                        </div>
                                                    </div>
                                                    {expandedId === q.id
                                                        ? <ChevronDown className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                                        : <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />}
                                                </button>
                                                {expandedId === q.id && <ExpandedDetail question={q} />}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Pagination Footer */}
                                <div className="p-2 border-t border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-white rounded-md shadow-sm border border-slate-200">
                                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-0.5">Question Index</p>
                                            <p className="text-xs font-bold text-slate-700">
                                                Showing <span className="text-primary">{((currentPage - 1) * limit) + 1}–{Math.min(currentPage * limit, totalCount)}</span> of {totalCount}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-1 rounded-lg shadow-sm border border-slate-200 scale-90 origin-right">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setPage}
                                            limit={limit}
                                            onLimitChange={setLimit}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default QuestionBankList;
