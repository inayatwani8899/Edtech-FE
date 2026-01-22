import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTestStore } from "@/store/testStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/store/userStore";
import { Plus, Trash2, Save, X, Settings2, Sliders, DollarSign, ScrollText, Loader2, PlayCircle, Hash } from "lucide-react";
import { useTestConfigurationStore } from "@/store/testConfigurationStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

type Message = { text: string; type: "success" | "error" | "info" } | null;

type RolePrice = {
  roleId: string;
  price: number;
};

const defaultFormData = {
  rolePrices: [{ roleId: "", price: 0 }] as RolePrice[], // Default one row
  testId: "",
  questionsPerPage: 5,
  submitType: "PerPage" as "PerPage" | "OneGo",
  allowMultiplePurchases: false,
  canResume: false,
  testInstructions: "",
};

export const TestConfigurationForm: React.FC<{ configId?: string }> = ({ configId }) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [message, setMessage] = useState<Message>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const actualConfigId = configId || paramId;

  const {
    tests,
    fetchTests,
  } = useTestStore();
  const {
    loading,
    currentConfiguration,
    fetchConfigurationById,
    createConfiguration,
    updateConfiguration,
    clearCurrentConfiguration,
  } = useTestConfigurationStore();
  const { roles, fetchRoles } = useUserStore();

  // Load configuration when editing
  useEffect(() => {
    if (actualConfigId) {
      fetchConfigurationById(actualConfigId);
      setIsEditMode(true);
    } else {
      clearCurrentConfiguration();
      setIsEditMode(false);
      setFormData(defaultFormData);
    }
  }, [actualConfigId]);

  // Fetch roles and tests on component mount
  useEffect(() => {
    fetchTests();
    fetchRoles();
  }, []);

  // When store updates currentConfiguration, sync to local form
  useEffect(() => {
    if (currentConfiguration && isEditMode) {
      setFormData({
        rolePrices: currentConfiguration.rolePrices?.length > 0
          ? currentConfiguration.rolePrices
          : [{ roleId: "", price: 0 }], // Ensure at least one row
        testId: currentConfiguration.testId,
        questionsPerPage: currentConfiguration.questionsPerPage,
        submitType: currentConfiguration.submitType,
        allowMultiplePurchases: currentConfiguration.allowMultiplePurchases,
        canResume: currentConfiguration.canResume,
        testInstructions: currentConfiguration.testInstructions,
      });
    }
  }, [currentConfiguration]);

  const showMessage = (text: string, type: "success" | "error" | "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value =
      target.type === "checkbox"
        ? target.checked
        : target.type === "number"
          ? parseFloat(target.value)
          : target.value;

    setFormData((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleRolePriceChange = (index: number, field: keyof RolePrice, value: string | number) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.rolePrices.length === 0) {
      showMessage("At least one role and price is required.", "error");
      return;
    }

    if (!formData.testId) {
      showMessage("Test is required.", "error");
      return;
    }

    if (formData.questionsPerPage <= 0) {
      showMessage("Questions per page must be valid values.", "error");
      return;
    }

    // Validate all role prices
    const invalidRolePrice = formData.rolePrices.find(rp =>
      !rp.roleId || rp.price < 0
    );

    if (invalidRolePrice) {
      showMessage("All roles must be selected and prices must be non-negative.", "error");
      return;
    }

    try {
      if (isEditMode && actualConfigId) {
        await updateConfiguration(actualConfigId, formData);
        showMessage(`Configuration updated successfully!`, "success");
      } else {
        await createConfiguration(formData);
        showMessage(`Configuration created successfully!`, "success");
      }

      setTimeout(() => navigate("/manage/test-configurations"), 1000);
    } catch (err) {
      showMessage(
        `Failed to ${isEditMode ? "update" : "create"} configuration. Please try again.`,
        "error"
      );
    }
  };

  if (loading && isEditMode && !currentConfiguration) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-cyan-500 animate-spin"></div>
          <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-cyan-500 animate-pulse" />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-400">Loading Configuration...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] py-8 px-4 sm:px-6">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-sky-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-white/50 backdrop-blur-md border-slate-200 text-slate-500 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5">
                Deployment
              </Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              {isEditMode ? "Edit Config" : "New Config"}
              <span className="text-slate-300">/</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-sky-600">Distribution Rule</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/manage/test-configurations")}
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
              Save Rule
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">

          {/* CARD 1: IDENTITY (Hero) - Spans 8 cols */}
          <Card className="md:col-span-8 border-none shadow-elegant bg-white/80 backdrop-blur-xl rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500"></div>
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                {/* Visual Icon Section */}
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                  <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-cyan-50 to-sky-50 flex items-center justify-center border-4 border-white shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <Settings2 className="h-10 w-10 text-cyan-300" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-cyan-100 text-cyan-600 border-none">Active Rule</Badge>
                  </div>
                </div>

                {/* Identity Inputs */}
                <div className="flex-grow space-y-4 w-full">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Assessment</Label>
                    <select
                      name="testId"
                      value={formData.testId}
                      onChange={handleChange}
                      className="w-full h-11 px-3 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-cyan-200 transition-all rounded-xl font-bold text-slate-700 outline-none"
                      disabled={loading}
                    >
                      <option value="">Select Assessment...</option>
                      {tests.map(test => (
                        <option key={test?.id} value={test?.id}>{test.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Page Pagination</Label>
                      <div className="relative">
                        <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          name="questionsPerPage"
                          type="number"
                          value={formData.questionsPerPage}
                          onChange={handleChange}
                          className="h-11 pl-10 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-cyan-200 transition-all rounded-xl font-bold text-slate-700"
                          min={1}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mode</Label>
                      <select
                        name="submitType"
                        value={formData.submitType}
                        onChange={handleChange}
                        className="w-full h-11 px-3 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-cyan-200 transition-all rounded-xl font-bold text-slate-700 outline-none"
                      >
                        <option value="PerPage">Paginated</option>
                        <option value="OneGo">Full Exam</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: BEHAVIOR TOGGLES - Spans 4 cols */}
          <Card className="md:col-span-4 border-none shadow-elegant bg-slate-900 text-white rounded-[2rem] overflow-hidden relative group">
            <CardHeader className="p-6 pb-2 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                  <Sliders className="h-5 w-5 text-cyan-300" />
                </div>
                <h3 className="text-lg font-bold">Policy</h3>
              </div>
            </CardHeader>
            <CardContent className="p-6 relative z-10 space-y-4">
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group/item">
                <span className="text-sm font-bold text-slate-300 group-hover/item:text-white transition-colors">Resume Capability</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="canResume"
                    checked={formData.canResume}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </div>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group/item">
                <span className="text-sm font-bold text-slate-300 group-hover/item:text-white transition-colors">Multiple Attempts</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="allowMultiplePurchases"
                    checked={formData.allowMultiplePurchases}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </div>
              </label>
            </CardContent>
          </Card>

          {/* CARD 3: PRICING MATRIX - Spans 12 cols */}
          <Card className="md:col-span-12 border-none shadow-elegant bg-white/60 backdrop-blur-xl rounded-[2rem] overflow-hidden">
            <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Access & Pricing Matrix</h3>
              </div>
              <Button
                type="button"
                onClick={addRolePrice}
                variant="outline"
                className="bg-white border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 text-xs font-bold h-8"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Segment
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 font-bold">Target Role</th>
                      <th scope="col" className="px-6 py-3 font-bold">Price (₹)</th>
                      <th scope="col" className="px-6 py-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.rolePrices.map((rolePrice, index) => (
                      <tr key={index} className="bg-white border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3">
                          <select
                            value={rolePrice.roleId}
                            onChange={(e) => handleRolePriceChange(index, 'roleId', e.target.value)}
                            className="w-full h-10 px-3 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-cyan-200 transition-all rounded-lg font-bold text-slate-700 outline-none"
                          >
                            <option value="">Select Role...</option>
                            {getAvailableRoles(index).map(role => (
                              <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-3">
                          <div className="relative max-w-[150px]">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                            <Input
                              type="number"
                              value={rolePrice.price}
                              onChange={(e) => handleRolePriceChange(index, 'price', e.target.value === "" ? "" : parseFloat(e.target.value))}
                              min={0}
                              className="h-10 pl-7 bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-emerald-200 rounded-lg font-bold text-slate-900"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right">
                          {formData.rolePrices.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeRolePrice(index)}
                              variant="ghost"
                              className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* CARD 4: Instructions - Spans 12 cols */}
          <Card className="md:col-span-12 border-none shadow-elegant bg-white/60 backdrop-blur-xl rounded-[2rem] overflow-hidden">
            <CardHeader className="p-6 pb-2">
              <div className="flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Candidate Instructions</h3>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Textarea
                name="testInstructions"
                value={formData.testInstructions}
                onChange={handleChange}
                placeholder="Detailed guidelines for the exam..."
                className="w-full min-h-[140px] bg-white/50 border-slate-200/50 hover:border-indigo-200 focus:bg-white rounded-xl resize-none text-slate-700 font-medium leading-relaxed p-4 outline-none transition-all"
              />
            </CardContent>
          </Card>

        </form>
      </div>
    </div>
  );
};