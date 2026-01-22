import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTestStore } from "@/store/testStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Save,
    X,
    FileText,
    Clock,
    Globe,
    Lock,
    Loader2,
    BookOpenCheck
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

type Message = { text: string; type: "success" | "error" | "info" } | null;

const defaultFormData = {
    title: "",
    description: "",
    timeDuration: 0,
    isPublished: false,
};

export const ConfigurableTestForm: React.FC<{ testId?: string }> = ({ testId }) => {
    const [formData, setFormData] = useState(defaultFormData);
    const [message, setMessage] = useState<Message>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const navigate = useNavigate();
    const { id: paramId } = useParams();
    const actualTestId = testId || paramId;

    const {
        createConfigurableTest,
        fetchTestById,
        updateTest,
        currentTest,
        loading,
        clearCurrentTest,
    } = useTestStore();

    //Load test when editing
    useEffect(() => {
        if (actualTestId) {
            fetchTestById(actualTestId);
            setIsEditMode(true);
        } else {
            clearCurrentTest();
            setIsEditMode(false);
            setFormData(defaultFormData);
        }
    }, [actualTestId]);

    // When store updates currentTest, sync to local form
    useEffect(() => {
        if (currentTest && isEditMode) {
            setFormData({
                title: currentTest.title,
                description: currentTest.description,
                timeDuration: currentTest.timeDuration,
                isPublished: currentTest.isPublished,
            });
        }
    }, [currentTest]);

    const showMessage = (text: string, type: "success" | "error" | "info") => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const value =
            target.type === "checkbox"
                ? target.checked
                : target.type === "number"
                    ? parseFloat(target.value)
                    : target.value;

        setFormData((prev) => ({ ...prev, [target.name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            showMessage("Title and Description are required.", "error");
            return;
        }

        if (formData.timeDuration <= 0) {
            showMessage("Duration must be greater than 0.", "error");
            return;
        }

        try {
            if (isEditMode && actualTestId) {
                await updateTest(actualTestId, formData);
            } else {
                await createConfigurableTest(formData);
            }

            setTimeout(() => navigate("/manage/tests"), 1000);
        } catch (err) {
            showMessage(
                `Failed to ${isEditMode ? "update" : "create"} test. Please try again.`,
                "error"
            );
        }
    };

    if (loading && isEditMode && !currentTest) {
        return (
            <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-t-4 border-orange-500 animate-spin"></div>
                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-orange-500 animate-pulse" />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-400">Loading Assessment...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] py-8 px-4 sm:px-6">
            {/* Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-orange-500/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-amber-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="bg-white/50 backdrop-blur-md border-slate-200 text-slate-500 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5">
                                Assessment Engine
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                            {isEditMode ? "Edit Assessment" : "New Assessment"}
                            <span className="text-slate-300">/</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Definition</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/manage/tests")}
                            className="bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700 font-semibold h-10 px-5 transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-slate-900 text-white font-bold h-10 px-6 shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 rounded-xl"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Save Definition
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">

                    {/* CARD 1: IDENTITY (Hero) - Spans 8 cols */}
                    <Card className="md:col-span-8 border-none shadow-elegant bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500"></div>
                        <CardContent className="p-8">
                            <div className="flex flex-col sm:flex-row gap-8 items-start">
                                {/* Visual Icon Section */}
                                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                                    <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center border-4 border-white shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                        <FileText className="h-10 w-10 text-orange-300" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div className="text-center">
                                        <Badge className="bg-orange-100 text-orange-600 border-none">Test Definition</Badge>
                                    </div>
                                </div>

                                {/* Identity Inputs */}
                                <div className="flex-grow space-y-4 w-full">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Test Title</Label>
                                        <Input
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="h-11 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-orange-200 transition-all rounded-xl font-bold text-slate-700"
                                            placeholder="e.g. Physics Mid-Term A"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CARD 2: DURATION METRIC - Spans 4 cols */}
                    <Card className="md:col-span-4 border-none shadow-elegant bg-gradient-to-br from-slate-900 to-orange-950 text-white rounded-[2rem] overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <CardHeader className="p-6 pb-2 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                                    <Clock className="h-5 w-5 text-orange-300" />
                                </div>
                                <h3 className="text-lg font-bold">Duration Limit</h3>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 relative z-10 space-y-4">
                            <div className="text-center py-2">
                                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter">
                                    {formData.timeDuration}
                                </span>
                                <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mt-1">Minutes</p>
                            </div>
                            <Input
                                type="number"
                                name="timeDuration"
                                value={formData.timeDuration}
                                onChange={handleChange}
                                min={1}
                                className="bg-white/10 border-white/5 text-white font-bold h-10 text-center rounded-xl focus:bg-white/20"
                            />
                        </CardContent>
                    </Card>

                    {/* CARD 3: STATUS TOGGLE - Spans 4 cols */}
                    <Card className={`md:col-span-4 border-none shadow-elegant rounded-[2rem] overflow-hidden relative group transition-all duration-500 ${formData.isPublished ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-500'}`}>
                        <CardHeader className="p-6 pb-2 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                                    {formData.isPublished ? <Globe className="h-5 w-5 text-white" /> : <Lock className="h-5 w-5 text-slate-500" />}
                                </div>
                                <h3 className="text-lg font-bold">Availability</h3>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 relative z-10 flex flex-col items-center justify-center h-[140px] gap-4">
                            <div className="text-center">
                                <span className={`text-2xl font-black tracking-tight ${formData.isPublished ? 'text-white' : 'text-slate-500'}`}>
                                    {formData.isPublished ? "PUBLISHED" : "PRIVATE"}
                                </span>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isPublished"
                                    checked={formData.isPublished}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-white/40"></div>
                            </label>
                        </CardContent>
                    </Card>

                    {/* CARD 4: Description - Spans 8 cols */}
                    <Card className="md:col-span-8 border-none shadow-elegant bg-white/60 backdrop-blur-xl rounded-[2rem] overflow-hidden flex flex-col">
                        <CardHeader className="p-6 pb-2">
                            <div className="flex items-center gap-2">
                                <BookOpenCheck className="h-5 w-5 text-amber-600" />
                                <h3 className="text-lg font-bold text-slate-900">Content Overview</h3>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 flex-grow">
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Outline the topics covered in this assessment..."
                                className="w-full h-full min-h-[140px] bg-white/50 border-slate-200/50 hover:border-amber-200 focus:bg-white rounded-xl resize-none text-slate-700 font-medium leading-relaxed p-4 outline-none transition-all"
                            />
                        </CardContent>
                    </Card>

                </form>
            </div>
        </div>
    );
};
