import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCategoryStore } from "@/store/categoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, X, FolderOpen, AlertCircle, Loader2, Sparkles, Tag, Layers } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Label } from "@/components/ui/label"; // Assuming shadcn Label exists or we use standard label

type Message = { text: string; type: "success" | "error" | "info" } | null;

const defaultFormData = {
    categoryName: "",
    description: "",
    isActive: false,
};

export const CategoryForm: React.FC<{ categoryId?: string }> = ({ categoryId }) => {
    const [formData, setFormData] = useState(defaultFormData);
    const [errors, setErrors] = useState<{ categoryName?: string; description?: string }>({});
    const [message, setMessage] = useState<Message>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [touched, setTouched] = useState<{ categoryName?: boolean; description?: boolean }>({});

    const navigate = useNavigate();
    const { id: paramId } = useParams();
    const actualCategoryId = categoryId || paramId;

    const {
        loading,
        currentCategory,
        fetchCategoryById,
        createCategory,
        updateCategory,
        clearCurrentCategory,
    } = useCategoryStore();

    // Validation function
    const validateField = (name: string, value: string) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'categoryName':
                if (!value.trim()) {
                    newErrors.categoryName = "Category name is required.";
                } else if (value.trim().length < 2) {
                    newErrors.categoryName = "Category name must be at least 2 characters long.";
                } else {
                    delete newErrors.categoryName;
                }
                break;

            case 'description':
                if (!value.trim()) {
                    newErrors.description = "Description is required.";
                } else if (value.trim().length < 10) {
                    newErrors.description = "Description must be at least 10 characters long.";
                } else {
                    delete newErrors.description;
                }
                break;

            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validate form
    const validateForm = () => {
        const newErrors: { categoryName?: string; description?: string } = {};

        if (!formData.categoryName.trim()) {
            newErrors.categoryName = "Category name is required.";
        } else if (formData.categoryName.trim().length < 2) {
            newErrors.categoryName = "Category name must be at least 2 characters long.";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required.";
        } else if (formData.description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters long.";
        }

        setErrors(newErrors);
        setTouched({ categoryName: true, description: true });
        return Object.keys(newErrors).length === 0;
    };

    // Load category when editing
    useEffect(() => {
        if (actualCategoryId) {
            fetchCategoryById(actualCategoryId);
            setIsEditMode(true);
        } else {
            clearCurrentCategory();
            setIsEditMode(false);
            setFormData(defaultFormData);
            setErrors({});
            setTouched({});
        }
    }, [actualCategoryId]);

    // When store updates currentCategory, sync to local form
    useEffect(() => {
        if (currentCategory && isEditMode) {
            setFormData({
                categoryName: currentCategory.categoryName,
                description: currentCategory.description,
                isActive: currentCategory.isActive,
            });
        }
    }, [currentCategory, isEditMode]);

    const showMessage = (text: string, type: "success" | "error" | "info") => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const value = target.type === "checkbox" ? target.checked : target.value;

        setFormData((prev) => ({ ...prev, [target.name]: value }));

        // Validate field on change if it's been touched
        if (touched[target.name as keyof typeof touched]) {
            validateField(target.name, value.toString());
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            if (isEditMode && actualCategoryId) {
                await updateCategory(actualCategoryId, formData);
                showMessage(`Category updated successfully!`, "success");
            } else {
                await createCategory(formData);
                showMessage(`Category created successfully!`, "success");
            }

            setTimeout(() => navigate("/manage/categories"), 1000);
        } catch (err: any) {
            showMessage(
                err.response?.data?.message || `Failed to ${isEditMode ? "update" : "create"} category. Please try again.`,
                "error"
            );
        }
    };

    if (loading && isEditMode && !currentCategory) {
        return (
            <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-t-4 border-fuchsia-500 animate-spin"></div>
                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-fuchsia-500 animate-pulse" />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-400">Loading Classification...</p>
            </div>
        );
    }

    const inputClasses = (hasError: boolean) =>
        `w-full h-11 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-fuchsia-200 transition-all rounded-xl font-bold text-slate-700 ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
        }`;

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] py-8 px-4 sm:px-6">
            {/* Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-fuchsia-500/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-pink-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="bg-white/50 backdrop-blur-md border-slate-200 text-slate-500 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5">
                                Content Management
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                            {isEditMode ? "Modify Category" : "New Category"}
                            <span className="text-slate-300">/</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-pink-600">Classification</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/manage/categories")}
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
                            Save Asset
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">

                    {/* CARD 1: IDENTITY (Hero) - Spans 8 cols */}
                    <Card className="md:col-span-8 border-none shadow-elegant bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500"></div>
                        <CardContent className="p-8">
                            <div className="flex flex-col sm:flex-row gap-8 items-start">
                                {/* Visual Icon Section */}
                                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                                    <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-fuchsia-50 to-pink-50 flex items-center justify-center border-4 border-white shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                        <FolderOpen className="h-10 w-10 text-fuchsia-300" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                </div>

                                {/* Identity Inputs */}
                                <div className="flex-grow space-y-4 w-full">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category Name</label>
                                            {errors.categoryName && <span className="text-xs font-bold text-red-500">{errors.categoryName}</span>}
                                        </div>
                                        <Input
                                            name="categoryName"
                                            value={formData.categoryName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={inputClasses(!!errors.categoryName)}
                                            placeholder="e.g. Mathematics"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Identifier Tag</label>
                                        </div>
                                        <div className="relative">
                                            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                disabled
                                                value={formData.categoryName ? formData.categoryName.toLowerCase().replace(/\s+/g, '-') : 'auto-generated-slug'}
                                                className="h-11 pl-10 bg-slate-100 border-transparent rounded-xl font-mono text-xs text-slate-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CARD 2: STATUS Widget - Spans 4 cols */}
                    <Card className={`md:col-span-4 border-none shadow-elegant rounded-[2rem] overflow-hidden relative group transition-all duration-500 ${formData.isActive ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' : 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-500'}`}>
                        <CardHeader className="p-6 pb-2 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                                    <Layers className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white">Visibility Status</h3>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 relative z-10 flex flex-col items-center justify-center h-[160px] gap-4">
                            <div className="text-center">
                                <span className={`text-4xl font-black tracking-tight ${formData.isActive ? 'text-white' : 'text-slate-400'}`}>
                                    {formData.isActive ? "ACTIVE" : "DRAFT"}
                                </span>
                                <p className={`text-xs font-bold uppercase tracking-widest mt-2 ${formData.isActive ? 'text-white/70' : 'text-slate-400'}`}>
                                    {formData.isActive ? "Visible to Students" : "Hidden from Catalog"}
                                </p>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-white/40"></div>
                            </label>
                        </CardContent>
                    </Card>

                    {/* CARD 3: Description - Spans 12 cols */}
                    <Card className="md:col-span-12 border-none shadow-elegant bg-white/60 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                        <CardHeader className="p-6 pb-2">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-fuchsia-600" />
                                <h3 className="text-lg font-bold text-slate-900">Description & Metadata</h3>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-1.5">
                                {errors.description && <span className="text-xs font-bold text-red-500 float-right">{errors.description}</span>}
                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Describe the learning objectives and scope of this category..."
                                    className={`w-full min-h-[140px] bg-white/50 border-slate-200/50 hover:border-fuchsia-200 focus:bg-white rounded-xl resize-none text-slate-700 font-medium leading-relaxed p-4 outline-none transition-all ${errors.description ? 'border-red-300' : ''}`}
                                />
                            </div>
                        </CardContent>
                    </Card>

                </form>
            </div>
        </div>
    );
};
