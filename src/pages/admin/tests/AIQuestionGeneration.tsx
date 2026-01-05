import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";
import { useTestStore } from "@/store/testStore";

export const AIQuestionGeneration: React.FC = () => {
    const navigate = useNavigate();
    const { createAITest, loading } = useTestStore();

    const [questionType, setQuestionType] = useState("");
    const [grade, setGrade] = useState("");
    const [stream, setStream] = useState("");
    const [generation_count, setGenerationCount] = useState("5");

    const gradeOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12","undergraduate", "graduate", "postgraduate", "phd", "postdoc"];
    const streamOptions = ["Science", "Commerce", "Arts", "General"];
    const questionTypeOptions = ["Aptitude", "Cognitive Ability", "Psychometric", "Reasoning"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!questionType || !grade || !stream) {
            alert("Please fill all fields.");
            return;
        }

        const aiPayload = {
            questionType,
            grade,
            stream,
            generation_count: parseInt(generation_count, 10),
        };

        await createAITest(aiPayload);
        navigate("/manage/tests");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-1 px-4">
            <div className="max-w-4xl mx-auto">
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="text-blue-600" />
                        <h1 className="text-2xl font-semibold">AI Question Generator</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Question Type */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium">Question Type</label>
                                <Select value={questionType} onValueChange={setQuestionType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select question type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {questionTypeOptions.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Generation Count */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">Number of Questions</label>
                                <Input
                                    type="number"
                                    value={generation_count}
                                    onChange={(e) => setGenerationCount(e.target.value)}
                                    min="1"
                                    max="500"
                                />
                            </div>
                        </div>


                        {/* Grade and Stream */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium">Grade Level</label>
                                <Select value={grade} onValueChange={setGrade}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select grade" />
                                    </SelectTrigger>
                                    <SelectContent
                                        className="z-[9999] max-h-[200px] overflow-y-auto"
                                        position="popper"
                                        side="bottom"
                                        sideOffset={4}
                                        avoidCollisions={false}
                                        align="start"
                                        asChild={false}
                                    >
                                        {gradeOptions.map((g) => (
                                            <SelectItem key={g} value={g}>
                                                Grade {g}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Stream</label>
                                <Select value={stream} onValueChange={setStream}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select stream" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {streamOptions.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end mt-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
                                    </>
                                ) : (
                                    "Generate Questions"
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};
