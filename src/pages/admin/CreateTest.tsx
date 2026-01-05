import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { Plus, Trash2, Clock, FileText, List, Sparkles, Wand2, Loader2 } from 'lucide-react';
import { useTestStore } from '@/store/testStore';

const CreateTestPage: React.FC = () => {
    const navigate = useNavigate();
    const { createTest, createAITest, loading, error, clearError } = useTestStore();

    const [creationMethod, setCreationMethod] = useState<"manual" | "ai">("manual");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [questions, setQuestions] = useState([{
        text: "",
        options: ["", ""],
        correctAnswer: ""
    }]);

    // AI Generation Fields
    const [generation_count, setGenerationCount] = useState("1");
    const [grade, setGrade] = useState("");
    const [stream, setStream] = useState("");
    const [include_reverse_scored, setIncludeReverseScored] = useState(false);
    const [similarity_threshold, setSimilarityThreshold] = useState(0.8);

    const handleQuestionChange = (index: number, field: string, value: string) => {
        const newQuestions = [...questions];
        (newQuestions[index] as any)[field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const addOption = (qIndex: number) => {
        if (questions[qIndex].options.length < 5) {
            const newQuestions = [...questions];
            newQuestions[qIndex].options.push("");
            setQuestions(newQuestions);
        }
    };

    const removeOption = (qIndex: number, oIndex: number) => {
        if (questions[qIndex].options.length > 2) {
            const newQuestions = [...questions];
            newQuestions[qIndex].options.splice(oIndex, 1);

            if (newQuestions[qIndex].correctAnswer === oIndex.toString()) {
                newQuestions[qIndex].correctAnswer = "";
            } else if (newQuestions[qIndex].correctAnswer && parseInt(newQuestions[qIndex].correctAnswer) > oIndex) {
                newQuestions[qIndex].correctAnswer = (parseInt(newQuestions[qIndex].correctAnswer) - 1).toString();
            }

            setQuestions(newQuestions);
        }
    };

    const addQuestion = () => {
        setQuestions([...questions, {
            text: "",
            options: ["", ""],
            correctAnswer: ""
        }]);
    };

    const removeQuestion = (qIndex: number) => {
        if (questions.length > 1) {
            const newQuestions = questions.filter((_, index) => index !== qIndex);
            setQuestions(newQuestions);
        }
    };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     if (creationMethod === "manual") {
    //         // Manual creation validation
    //         const isValid = questions.every(q =>
    //             q.text.trim() &&
    //             q.options.filter(opt => opt.trim()).length >= 2 &&
    //             q.correctAnswer !== ""
    //         );

    //         if (!isValid) {
    //             alert("Please ensure all questions have at least 2 options filled and a correct answer selected.");
    //             return;
    //         }

    //         // Prepare manual test payload
    //         const manualPayload = {
    //             title,
    //             description,
    //             duration: duration ? Number(duration) : null,
    //             questions: questions,
    //             creationMethod: "manual" as const
    //         };

    //         try {
    //             await createTest(manualPayload);
    //             alert("Test created successfully!");
    //             navigate("/manage/tests");
    //         } catch (err) {
    //             // Error handled by store
    //             console.error("Failed to create test:", err);
    //         }

    //     } else {
    //         // AI generation validation
    //         if (!grade) {
    //             alert("Please select a grade level for AI generation.");
    //             return;
    //         }
    //         if (Number(generation_count) < 1 || Number(generation_count) > 500) {
    //             alert("Please enter a valid number of questions (1-500).");
    //             return;
    //         }

    //         // Prepare AI test payload - flat structure as per your interface
    //         const aiPayload = {
    //             title,
    //             description,
    //             creationMethod: "ai" as const,
    //             duration: duration ? Number(duration) : null,
    //             generation_count,
    //             grade,
    //             stream: stream || null,
    //             include_reverse_scored,
    //             similarity_threshold
    //         };

    //         try {
    //             await createAITest(aiPayload);
    //             alert("AI test generated successfully!");
    //             navigate("/manage/tests");
    //         } catch (err) {
    //             // Error handled by store
    //             console.error("Failed to create AI test:", err);
    //         }
    //     }
    // };
    // In your handleSubmit function, update the manual payload creation:
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (creationMethod === "manual") {
            // Manual creation validation
            const isValid = questions.every(q =>
                q.text.trim() &&
                q.options.filter(opt => opt.trim()).length >= 2 &&
                q.correctAnswer !== ""
            );

            if (!isValid) {
                alert("Please ensure all questions have at least 2 options filled and a correct answer selected.");
                return;
            }

            // Prepare manual test payload with correct type
            const manualPayload = {
                title,
                description,
                duration: duration ? Number(duration) : null,
                questions: questions.map((q, index) => ({
                    ...q,
                    correctAnswer: q.correctAnswer
                })),
                creationMethod: "manual" as const
            };

            try {
                // await createTest(manualPayload);
                navigate("/manage/tests");
            } catch (err) {
                // Error handled by store
                console.error("Failed to create test:", err);
            }

        } else {
            // AI generation validation
            if (!grade) {
                alert("Please select a grade level for AI generation.");
                return;
            }
            if (Number(generation_count) < 1 || Number(generation_count) > 500) {
                alert("Please enter a valid number of questions (1-500).");
                return;
            }

            // Prepare AI test payload
            const aiPayload = {
                    generation_count,
                    grade,
                    stream: stream || null,
                    include_reverse_scored,
                    similarity_threshold
            };

            try {
                await createAITest(aiPayload);
                // alert("AI test generated successfully!");
                navigate("/manage/tests");
            } catch (err) {
                // Error handled by store
                console.error("Failed to create AI test:", err);
            }
        }
    };
    const gradeOptions = ["7", "8", "9", "10", "11", "12"];
    const streamOptions = ["Science", "Commerce", "Arts", "General"];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}


                {/* Error Display */}
                {/* {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-red-600 font-medium">{error}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearError}
                                className="text-red-600 hover:text-red-700"
                            >
                                Dismiss
                            </Button>
                        </div>
                    </div>
                )} */}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Creation Method Selection */}
                    <Card className="p-6 shadow-sm border-0">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Create New Test</h1>
                            <p className="mt-2 text-gray-600">Build a comprehensive assessment for your candidates</p>
                        </div>
                        <div className="flex items-center gap-3 mb-6">
                            <Wand2 className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-900">Creation Method</h2>
                        </div>

                        <RadioGroup
                            value={creationMethod}
                            onValueChange={(value: "manual" | "ai") => setCreationMethod(value)}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {/* Manual Creation Option */}
                            <div>
                                <RadioGroupItem value="manual" id="manual" className="sr-only" />
                                <Label
                                    htmlFor="manual"
                                    className={`flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${creationMethod === "manual"
                                        ? "border-blue-500 bg-blue-50 shadow-md"
                                        : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${creationMethod === "manual" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                                            }`}>
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <span className="font-semibold text-gray-900">Create Manually</span>
                                    </div>
                                    <p className="text-sm text-gray-600 text-left">
                                        Build your test question by question with full control over content and structure.
                                    </p>
                                </Label>
                            </div>

                            {/* AI Generation Option */}
                            <div>
                                <RadioGroupItem value="ai" id="ai" className="sr-only" />
                                <Label
                                    htmlFor="ai"
                                    className={`flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${creationMethod === "ai"
                                        ? "border-purple-500 bg-purple-50 shadow-md"
                                        : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${creationMethod === "ai" ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"
                                            }`}>
                                            <Sparkles className="h-4 w-4" />
                                        </div>
                                        <span className="font-semibold text-gray-900">Generate with AI</span>
                                    </div>
                                    <p className="text-sm text-gray-600 text-left">
                                        Use AI to automatically generate questions based on grade level and subject.
                                    </p>
                                </Label>
                            </div>
                        </RadioGroup>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content - 2/3 width */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Test Details Card */}
                            <Card className="p-6 shadow-sm border-0">
                                <div className="flex items-center gap-3 mb-6">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Test Details</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Test Title *
                                        </label>
                                        <Input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g., Cognitive Aptitude Assessment"
                                            required
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            rows={4}
                                            placeholder="Describe what this test measures and what candidates should expect..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Duration (minutes)
                                            </label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    type="number"
                                                    value={duration}
                                                    onChange={(e) => setDuration(e.target.value)}
                                                    placeholder="No time limit"
                                                    min="1"
                                                    className="w-full pl-10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* AI Generation Configuration */}
                            {creationMethod === "ai" && (
                                <Card className="p-6 shadow-sm border-0 border-l-4 border-purple-500">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Sparkles className="h-5 w-5 text-purple-600" />
                                        <h2 className="text-xl font-semibold text-gray-900">AI Generation Settings</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="generationCount" className="text-sm font-medium">
                                                Number of Questions *
                                            </Label>
                                            <Input
                                                id="generationCount"
                                                type="number"
                                                min="1"
                                                max="500"
                                                value={generation_count}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value === "" || (Number(value) >= 1 && Number(value) <= 500)) {
                                                        setGenerationCount(value);
                                                    }
                                                }}
                                                placeholder="5"
                                                className="w-full"
                                            />
                                            <p className="text-xs text-gray-500">Between 1 and 500 questions</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="grade" className="text-sm font-medium">
                                                Grade Level *
                                            </Label>
                                            <Select value={grade} onValueChange={setGrade}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select grade" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {gradeOptions.map((gradeOption) => (
                                                        <SelectItem key={gradeOption} value={gradeOption}>
                                                            Grade {gradeOption}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="stream" className="text-sm font-medium">
                                                Stream (Optional)
                                            </Label>
                                            <Select value={stream} onValueChange={setStream}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select stream" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {streamOptions.map((streamOption) => (
                                                        <SelectItem key={streamOption} value={streamOption}>
                                                            {streamOption}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="similarityThreshold" className="text-sm font-medium">
                                                Similarity Threshold
                                            </Label>
                                            <div className="space-y-2">
                                                <Input
                                                    id="similarityThreshold"
                                                    type="range"
                                                    min="0.1"
                                                    max="1"
                                                    step="0.1"
                                                    value={similarity_threshold}
                                                    onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                                                    className="w-full"
                                                />
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>Low ({similarity_threshold})</span>
                                                    <span>Duplicate Detection</span>
                                                    <span>High ({similarity_threshold})</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center space-x-2">
                                        <Checkbox
                                            id="includeReverseScored"
                                            checked={include_reverse_scored}
                                            onCheckedChange={(checked) => setIncludeReverseScored(checked as boolean)}
                                        />
                                        <Label htmlFor="includeReverseScored" className="text-sm font-medium cursor-pointer">
                                            Include Reverse Scored Questions
                                        </Label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Reverse scored questions help identify inconsistent responses and improve test reliability.
                                    </p>
                                </Card>
                            )}

                            {/* Manual Questions Section */}
                            {creationMethod === "manual" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <List className="h-5 w-5 text-blue-600" />
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                Questions ({questions.length})
                                            </h2>
                                        </div>
                                    </div>

                                    {questions.map((q, qIndex) => (
                                        <Card key={qIndex} className="p-6 shadow-sm border-0">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                                                        {qIndex + 1}
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Question {qIndex + 1}
                                                    </h3>
                                                </div>

                                                {questions.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeQuestion(qIndex)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Question Text *
                                                    </label>
                                                    <Input
                                                        value={q.text}
                                                        onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
                                                        placeholder="Enter your question here..."
                                                        required
                                                        className="w-full"
                                                    />
                                                </div>

                                                <div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Options ({q.options.length}/5) *
                                                        </label>
                                                        <span className="text-xs text-gray-500">
                                                            Select the correct answer
                                                        </span>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {q.options.map((opt, oIndex) => (
                                                            <div key={oIndex} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                                                <div className="flex items-center gap-3 flex-1">
                                                                    <div className="flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                                                                        {String.fromCharCode(65 + oIndex)}
                                                                    </div>
                                                                    <Input
                                                                        value={opt}
                                                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                                        placeholder={`Option ${oIndex + 1}`}
                                                                        required
                                                                        className="flex-1 border-0 shadow-none focus:ring-0 p-0"
                                                                    />
                                                                </div>

                                                                <div className="flex items-center gap-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            type="radio"
                                                                            name={`correctAnswer-${qIndex}`}
                                                                            checked={q.correctAnswer === oIndex.toString()}
                                                                            onChange={() => handleQuestionChange(qIndex, "correctAnswer", oIndex.toString())}
                                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                                            required
                                                                        />
                                                                        <span className="text-sm text-gray-600 whitespace-nowrap">Correct</span>
                                                                    </div>

                                                                    {q.options.length > 2 && (
                                                                        <Button
                                                                            type="button"
                                                                            onClick={() => removeOption(qIndex, oIndex)}
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-gray-400 hover:text-red-600 p-1"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {q.options.length < 5 && (
                                                        <Button
                                                            type="button"
                                                            onClick={() => addOption(qIndex)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="mt-3"
                                                        >
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Add Option
                                                        </Button>
                                                    )}
                                                </div>

                                                {q.correctAnswer === "" && (
                                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                        <p className="text-sm text-yellow-700 flex items-center gap-2">
                                                            Please select the correct answer for this question
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    ))}

                                    {/* Add Question Button */}
                                    <Button
                                        type="button"
                                        onClick={addQuestion}
                                        variant="outline"
                                        className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700"
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
                                        Add New Question
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - 1/3 width */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 space-y-6">
                                {/* Test Summary Card */}
                                <Card className="p-6 shadow-sm border-0">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Summary</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Creation:</span>
                                            <span className="text-sm font-medium capitalize">
                                                {creationMethod}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Title:</span>
                                            <span className="text-sm font-medium text-right max-w-[150px] truncate">
                                                {title || "Untitled"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Questions:</span>
                                            <span className="text-sm font-medium">
                                                {creationMethod === "manual" ? questions.length : generation_count}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm text-gray-600">Time Limit:</span>
                                            <span className="text-sm font-medium">
                                                {duration ? `${duration} mins` : 'None'}
                                            </span>
                                        </div>
                                        {creationMethod === "ai" && (
                                            <>
                                                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                                                    <span className="text-sm text-gray-600">Grade:</span>
                                                    <span className="text-sm font-medium">
                                                        {grade || "Not set"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-sm text-gray-600">Reverse Scored:</span>
                                                    <span className="text-sm font-medium">
                                                        {include_reverse_scored ? "Yes" : "No"}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </Card>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <Button
                                        type="button"
                                        onClick={() => navigate("/manage/tests")}
                                        variant="outline"
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className={`w-full ${creationMethod === "ai"
                                            ? "bg-purple-600 hover:bg-purple-700"
                                            : "bg-blue-600 hover:bg-blue-700"
                                            }`}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                {creationMethod === "ai" ? "Generating..." : "Creating..."}
                                            </>
                                        ) : (
                                            creationMethod === "ai" ? "Generate Test" : "Save Test"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTestPage;