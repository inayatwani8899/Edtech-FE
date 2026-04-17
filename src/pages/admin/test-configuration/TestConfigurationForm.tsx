import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTestStore } from "@/store/testStore";
import { useUserStore } from "@/store/userStore";
import { useTestConfigurationStore } from "@/store/testConfigurationStore";
import { 
    Plus, 
    Trash2, 
    Save, 
    X, 
    Settings2, 
    Sliders, 
    DollarSign, 
    ScrollText, 
    Loader2, 
    PlayCircle, 
    Hash,
    ArrowLeft,
    Shield,
    Sparkles,
    CheckCircle2,
    Activity,
    Layers,
    LayoutDashboard,
    Coins
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type RolePrice = {
  roleId: string;
  price: number;
};

const defaultFormData = {
  rolePrices: [{ roleId: "", price: 0 }] as RolePrice[],
  testId: "",
  questionsPerPage: 5,
  submitType: "PerPage" as "PerPage" | "OneGo",
  allowMultiplePurchases: false,
  canResume: false,
  testInstructions: "",
};

export const TestConfigurationForm: React.FC<{ configId?: string }> = ({ configId }) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const actualConfigId = configId || paramId;

  const { tests, fetchTests } = useTestStore();
  const {
    loading,
    currentConfiguration,
    fetchConfigurationById,
    createConfiguration,
    updateConfiguration,
    clearCurrentConfiguration,
  } = useTestConfigurationStore();
  const { roles, fetchRoles } = useUserStore();

  useEffect(() => {
    fetchTests();
    fetchRoles();
  }, [fetchTests, fetchRoles]);

  useEffect(() => {
    if (actualConfigId) {
      fetchConfigurationById(actualConfigId);
      setIsEditMode(true);
    } else {
      clearCurrentConfiguration();
      setFormData(defaultFormData);
      setIsEditMode(false);
    }
  }, [actualConfigId, fetchConfigurationById, clearCurrentConfiguration]);

  useEffect(() => {
    if (currentConfiguration && isEditMode) {
      setFormData({
        rolePrices: currentConfiguration.rolePrices?.length > 0
          ? currentConfiguration.rolePrices
          : [{ roleId: "", price: 0 }],
        testId: currentConfiguration.testId,
        questionsPerPage: currentConfiguration.questionsPerPage,
        submitType: currentConfiguration.submitType,
        allowMultiplePurchases: currentConfiguration.allowMultiplePurchases,
        canResume: currentConfiguration.canResume,
        testInstructions: currentConfiguration.testInstructions,
      });
    }
  }, [currentConfiguration, isEditMode]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRolePriceChange = (index: number, field: keyof RolePrice, value: any) => {
    setFormData(prev => ({
      ...prev,
      rolePrices: prev.rolePrices.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addRolePrice = () => {
    setFormData(prev => ({
      ...prev,
      rolePrices: [...prev.rolePrices, { roleId: "", price: 0 }]
    }));
  };

  const removeRolePrice = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rolePrices: prev.rolePrices.filter((_, i) => i !== index)
    }));
  };

  const getAvailableRoles = (currentIndex: number) => {
    return roles.filter(role => {
      return !formData.rolePrices.some((rp, index) =>
        index !== currentIndex && rp.roleId === String(role.id)
      );
    });
  };

  const validateForm = () => {
    if (!formData.testId) {
      toast.error("Resource designation required (Select Test)");
      return false;
    }
    if (formData.rolePrices.some(rp => !rp.roleId || rp.price < 0)) {
      toast.error("Invalid matrix segments identified");
      return false;
    }
    if (formData.questionsPerPage <= 0) {
      toast.error("Pagination value must be positive");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditMode && actualConfigId) {
        await updateConfiguration(actualConfigId, formData);
        toast.success("Deployment rule synchronized");
      } else {
        await createConfiguration(formData);
        toast.success("New distribution protocol initialized");
      }
      setTimeout(() => navigate("/manage/test-configurations"), 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Sync protocol rejected");
    }
  };

  if (loading && isEditMode && !currentConfiguration) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-600" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-cyan-100 border-t-transparent animate-pulse"></div>
        </div>
        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Accessing Rule Parameters...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] px-4 overflow-x-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* CONDENSED HEADER */}
        <div className="flex items-center justify-between gap-3 mb-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 border border-slate-100" onClick={() => navigate("/manage/test-configurations")}>
                    <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <div>
                    <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                        {isEditMode ? "Update Strategic Rule" : "Define Deployment"}
                    </h1>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Distribution & Revenue Strategy</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate("/manage/test-configurations")} className="text-slate-500 hover:bg-slate-100 font-bold text-[10px] h-7 px-3 rounded-lg">
                    Abort
                </Button>
                <Button onClick={handleSubmit} className="bg-slate-900 text-white font-bold text-[10px] h-7 px-4 rounded-lg shadow-md hover:bg-slate-800 transition-all flex items-center gap-1.5">
                    {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                    {isEditMode ? "Sync Rule" : "Initialize"}
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
            {/* LEFT COLUMN: STRATEGY SUMMARY */}
            <div className="lg:col-span-3">
                <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden border border-slate-100/50 flex flex-col h-full">
                    <div className="h-16 bg-slate-900 relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    </div>
                    <CardContent className="px-4 pb-4 -mt-8 relative z-10 text-center flex-grow">
                        <div className="h-16 w-16 rounded-2xl bg-white p-1 shadow-lg border border-slate-50 mx-auto mb-3">
                            <div className="h-full w-full rounded-xl bg-slate-50 flex items-center justify-center">
                                <LayoutDashboard className="h-8 w-8 text-cyan-300" />
                            </div>
                        </div>
                        <h2 className="text-base font-black text-slate-900 truncate mb-1 px-2">
                            {tests.find(t => String(t.id) === formData.testId)?.title || "Deployment Rule"}
                        </h2>
                        <Badge variant="secondary" className="bg-cyan-50 text-cyan-600 font-bold uppercase tracking-widest text-[8px] mb-6 border-none">
                            Active Distribution
                        </Badge>

                        <div className="space-y-3 pt-4 border-t border-slate-50 text-left">
                            <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Behavioral Policy</Label>
                            
                            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 transition-all">
                                <span className="text-[10px] font-black text-slate-500 uppercase">Suspend Ability</span>
                                <Switch 
                                    checked={formData.canResume} 
                                    onCheckedChange={(checked) => handleChange("canResume", checked)} 
                                    className="data-[state=checked]:bg-cyan-500"
                                />
                            </div>

                            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 transition-all">
                                <span className="text-[10px] font-black text-slate-500 uppercase">Cyclic Attempts</span>
                                <Switch 
                                    checked={formData.allowMultiplePurchases} 
                                    onCheckedChange={(checked) => handleChange("allowMultiplePurchases", checked)} 
                                    className="data-[state=checked]:bg-cyan-500"
                                />
                            </div>
                        </div>

                        <div className="mt-8 space-y-1.5 text-left">
                            <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Target Resource</Label>
                            <Select value={formData.testId} onValueChange={(val) => handleChange("testId", val)}>
                                <SelectTrigger className="w-full h-9 bg-slate-100/50 border-transparent rounded-xl px-3 text-[10px] font-bold text-slate-600 focus:ring-0">
                                    <SelectValue placeholder="Link Assessment..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                    {tests.map(test => (
                                        <SelectItem key={test?.id} value={String(test?.id)} className="text-[10px] font-bold">{test.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT COLUMN: REVENUE & CONFIGURATION */}
            <div className="lg:col-span-9 space-y-6">
                {/* PRICING MATRIX TABLE */}
                <Card className="border-none shadow-elegant bg-white rounded-3xl border border-slate-100/50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <div className="flex items-center gap-2.5">
                            <Coins className="h-4 w-4 text-emerald-500" />
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Revenue Allocation Matrix</h3>
                        </div>
                        <Button 
                            type="button" 
                            onClick={addRolePrice} 
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none font-black text-[9px] uppercase h-7 px-3 rounded-lg flex items-center gap-1.5 transition-all active:scale-95"
                        >
                            <Plus className="h-3 w-3" /> Insert Segment
                        </Button>
                    </div>
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead className="bg-[#FAFAFA] border-b border-slate-50">
                                <tr>
                                    <th className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-left px-6 py-3 whitespace-nowrap">Participant Role</th>
                                    <th className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-left px-6 py-3 whitespace-nowrap">Acquisition Price (₹)</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {formData.rolePrices.map((rolePrice, index) => (
                                    <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-3">
                                            <Select 
                                                value={rolePrice.roleId} 
                                                onValueChange={(val) => handleRolePriceChange(index, "roleId", val)}
                                            >
                                                <SelectTrigger className="h-10 bg-slate-100/30 border-transparent hover:bg-white hover:border-slate-200 transition-all rounded-xl text-xs font-bold text-slate-700 w-full focus:ring-0">
                                                    <SelectValue placeholder="Identify Role..." />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    {getAvailableRoles(index).map(role => (
                                                        <SelectItem key={role.id} value={String(role.id)} className="text-xs font-bold">{role.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="relative group/price">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within/price:text-emerald-500 transition-colors" />
                                                <Input 
                                                    type="number"
                                                    value={rolePrice.price}
                                                    onChange={(e) => handleRolePriceChange(index, "price", parseFloat(e.target.value) || 0)}
                                                    className="h-10 pl-9 bg-slate-100/30 border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-100 rounded-xl font-black text-sm transition-all"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            {formData.rolePrices.length > 1 && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeRolePrice(index)}
                                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {formData.rolePrices.length === 0 && (
                            <div className="p-8 text-center bg-slate-50/30 border-t border-slate-50">
                                <Sparkles className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No segments initialized</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* DISTRIBUTION PARAMETERS */}
                <Card className="border-none shadow-elegant bg-white rounded-3xl border border-slate-100/50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2.5 bg-slate-50/30">
                        <Settings2 className="h-4 w-4 text-cyan-500" />
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Protocol Engine Parameters</h3>
                    </div>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Distribution Mode</Label>
                            <Select value={formData.submitType} onValueChange={(val: any) => handleChange("submitType", val)}>
                                <SelectTrigger className="h-10 bg-slate-100/30 border-transparent rounded-xl px-4 text-xs font-bold text-slate-700 focus:ring-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="PerPage" className="text-xs font-bold">Paginated Stream (Per Page)</SelectItem>
                                    <SelectItem value="OneGo" className="text-xs font-bold">Holistic Execution (One Go)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Pagination Stratum</Label>
                            <div className="relative group">
                                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-cyan-500 transition-colors" />
                                <Input 
                                    type="number"
                                    value={formData.questionsPerPage}
                                    onChange={(e) => handleChange("questionsPerPage", parseInt(e.target.value) || 5)}
                                    className="h-10 pl-9 bg-slate-100/30 border-transparent focus:bg-white focus:ring-2 focus:ring-cyan-100 rounded-xl font-black text-sm"
                                    min={1}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 col-span-full">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Candidate Directive (Instructions)</Label>
                            <div className="relative group">
                                <ScrollText className="absolute left-4 top-4 h-4 w-4 text-slate-300 group-focus-within:text-cyan-500 transition-colors" />
                                <Textarea 
                                    value={formData.testInstructions}
                                    onChange={(e) => handleChange("testInstructions", e.target.value)}
                                    className="w-full min-h-[120px] pl-10 bg-slate-100/30 border-transparent rounded-2xl p-4 text-sm font-medium leading-relaxed resize-none transition-all focus:bg-white focus:ring-2 focus:ring-cyan-100"
                                    placeholder="Outline the operational guidelines for participants..."
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* GLOBAL SYNC STRIP */}
                <div className="p-4 rounded-3xl bg-cyan-600 text-white flex items-center justify-between shadow-xl shadow-cyan-600/20 group">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                            <Sparkles className="h-5 w-5 text-cyan-100" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black tracking-tight leading-none mb-1">Strategic Sync Matrix</h4>
                            <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Rule defined for global deployment</p>
                        </div>
                    </div>
                    <Button onClick={handleSubmit} className="bg-white text-cyan-600 font-black text-[10px] uppercase tracking-widest h-9 px-6 rounded-xl hover:bg-slate-50 transition-all shadow-lg active:scale-95">
                        Push Strategy
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};