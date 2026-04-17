import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCategoryStore } from "@/store/categoryStore";
import { 
    Save, 
    X, 
    FolderOpen, 
    AlertCircle, 
    Loader2, 
    Sparkles, 
    Tag, 
    Layers,
    ArrowLeft,
    Shield,
    CheckCircle2,
    Activity,
    Settings2,
    Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const defaultFormData = {
    categoryName: "",
    description: "",
    isActive: false,
};

export const CategoryForm: React.FC<{ categoryId?: string }> = ({ categoryId }) => {
    const [formData, setFormData] = useState(defaultFormData);
    const [isEditMode, setIsEditMode] = useState(false);

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

    useEffect(() => {
        if (actualCategoryId) {
            fetchCategoryById(actualCategoryId);
            setIsEditMode(true);
        } else {
            clearCurrentCategory();
            setIsEditMode(false);
            setFormData(defaultFormData);
        }
    }, [actualCategoryId, fetchCategoryById, clearCurrentCategory]);

    useEffect(() => {
        if (currentCategory && isEditMode) {
            setFormData({
                categoryName: currentCategory.categoryName,
                description: currentCategory.description,
                isActive: currentCategory.isActive,
            });
        }
    }, [currentCategory, isEditMode]);

    const handleChange = (name: string, value: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.categoryName.trim() || formData.categoryName.length < 2) {
            toast.error("Valid classification label required");
            return false;
        }
        if (!formData.description.trim() || formData.description.length < 10) {
            toast.error("Contextual protocol (description) must be at least 10 chars");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (isEditMode && actualCategoryId) {
                await updateCategory(actualCategoryId, formData);
                toast.success("Classification synchronized");
            } else {
                await createCategory(formData);
                toast.success("New asset classification initialized");
            }
            setTimeout(() => navigate("/manage/categories"), 1000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Protocol synchronization failed");
        }
    };

    if (loading && isEditMode && !currentCategory) {
        return (
            <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-fuchsia-600" />
                    <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-fuchsia-100 border-t-transparent animate-pulse"></div>
                </div>
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Accessing Classification Matrix...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] px-4 overflow-x-hidden">
            <div className="max-w-5xl mx-auto relative z-10">
                {/* CONDENSED HEADER */}
                <div className="flex items-center justify-between gap-3 mb-3 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 border border-slate-100" onClick={() => navigate("/manage/categories")}>
                            <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                                {isEditMode ? "Modify Asset" : "New Classification"}
                            </h1>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Content & Metadata Orchestration</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/manage/categories")}
                            className="text-slate-500 hover:bg-slate-100 font-bold text-[10px] h-7 px-3 rounded-lg"
                        >
                            Abort
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-slate-900 text-white font-bold text-[10px] h-7 px-4 rounded-lg shadow-md hover:bg-slate-800 transition-all flex items-center gap-1.5"
                        >
                            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                            {isEditMode ? "Sync Asset" : "Initialize"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN: ASSET STATUS */}
                    <div className="lg:col-span-3">
                        <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden border border-slate-100/50">
                            <div className="h-16 bg-slate-900 relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            </div>
                            <CardContent className="px-4 pb-4 -mt-8 relative z-10 text-center">
                                <div className="h-16 w-16 rounded-2xl bg-white p-1 shadow-lg border border-slate-50 mx-auto mb-3">
                                    <div className="h-full w-full rounded-xl bg-slate-50 flex items-center justify-center">
                                        <Palette className="h-8 w-8 text-fuchsia-300" />
                                    </div>
                                </div>
                                <h2 className="text-base font-black text-slate-900 truncate mb-1 px-2">
                                    {formData.categoryName || "Unlabeled"}
                                </h2>
                                <Badge variant="secondary" className="bg-fuchsia-50 text-fuchsia-600 font-bold uppercase tracking-widest text-[8px] mb-4 border-none">
                                    Classification Asset
                                </Badge>

                                <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-50">
                                    <div className={`p-2.5 rounded-xl border transition-all duration-300 ${formData.isActive ? 'bg-emerald-50 border-emerald-100 shadow-sm shadow-emerald-500/5' : 'bg-slate-50 border-slate-100'}`}>
                                        <span className="text-[8px] font-black text-slate-400 uppercase block tracking-widest mb-1 text-center">Stream Status</span>
                                        <div className="flex items-center justify-center gap-2">
                                            {formData.isActive ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <Activity className="h-3 w-3 text-slate-300" />}
                                            <span className={`text-[10px] font-black uppercase ${formData.isActive ? "text-emerald-600" : "text-slate-400"}`}>
                                                {formData.isActive ? "Active Feed" : "Passive Archive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-1.5 text-left">
                                    <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Quick Switch</Label>
                                    <div className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all group cursor-pointer" onClick={() => handleChange("isActive", !formData.isActive)}>
                                        <span className="text-[10px] font-black text-slate-500 uppercase">Live Visibility</span>
                                        <Switch 
                                            checked={formData.isActive} 
                                            onCheckedChange={(checked) => handleChange("isActive", checked)} 
                                            className="data-[state=checked]:bg-fuchsia-500"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: CLASSIFICATION CORE */}
                    <div className="lg:col-span-9">
                        <Card className="border-none shadow-elegant bg-white rounded-3xl border border-slate-100/50 overflow-hidden h-full">
                            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                <div className="flex items-center gap-2.5">
                                    <Settings2 className="h-4 w-4 text-fuchsia-600" />
                                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Asset Parameters & Context</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-fuchsia-500 animate-pulse"></div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol Active</span>
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="space-y-1.5 col-span-full">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Classification Label (Name)</Label>
                                        <div className="relative group">
                                            <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-fuchsia-500 transition-colors" />
                                            <Input 
                                                name="categoryName"
                                                value={formData.categoryName} 
                                                onChange={(e) => handleChange("categoryName", e.target.value)} 
                                                className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-fuchsia-100 rounded-xl font-bold text-sm transition-all shadow-sm" 
                                                placeholder="e.g. Cognitive Psychology" 
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 pt-2">
                                        <Label className="text-[10px] font-bold text-fuchsia-600 uppercase tracking-tight ml-1">Resource Slug (Auto)</Label>
                                        <div className="relative group/slug">
                                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fuchsia-300 group-focus-within/slug:text-fuchsia-600 transition-colors" />
                                            <Input
                                                disabled
                                                value={formData.categoryName ? formData.categoryName.toLowerCase().replace(/\s+/g, '-') : 'pending-initialization'}
                                                className="h-10 pl-9 bg-fuchsia-50/30 border-fuchsia-100/50 rounded-xl font-mono text-[10px] font-black text-fuchsia-400 uppercase tracking-widest cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 pt-2">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Asset Security</Label>
                                        <div className="h-10 bg-slate-50/50 border border-slate-200/50 rounded-xl flex items-center justify-between px-4">
                                            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Registry Locked</span>
                                            <Shield className="h-3.5 w-3.5 text-slate-300" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 col-span-full pt-2">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Contextual Manifest (Description)</Label>
                                        <div className="relative group">
                                            <Sparkles className="absolute left-4 top-4 h-4 w-4 text-slate-300 group-focus-within:text-fuchsia-500 transition-colors" />
                                            <Textarea 
                                                name="description" 
                                                value={formData.description} 
                                                onChange={(e) => handleChange("description", e.target.value)} 
                                                className="w-full min-h-[140px] pl-10 bg-slate-50/50 border-slate-200/50 rounded-2xl p-4 text-sm font-medium leading-relaxed resize-none transition-all focus:bg-white focus:ring-2 focus:ring-fuchsia-100 shadow-sm" 
                                                placeholder="Define the scope and objectives for this classification segment..." 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* SYNC STRIP */}
                        {isEditMode && (
                            <div className="mt-6 p-4 rounded-3xl bg-fuchsia-600 text-white flex items-center justify-between shadow-xl shadow-fuchsia-600/20 group animate-in slide-in-from-bottom-5 duration-500">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                                        <Layers className="h-5 w-5 text-fuchsia-100" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black tracking-tight leading-none mb-1">Asset Hierarchy Sync</h4>
                                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Classification valid for global indexing</p>
                                    </div>
                                </div>
                                <Button onClick={handleSubmit} className="bg-white text-fuchsia-600 font-black text-[10px] uppercase tracking-widest h-9 px-6 rounded-xl hover:bg-slate-50 transition-all shadow-lg active:scale-95">
                                    Push Asset
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="h-16"></div>
        </div>
    );
};
