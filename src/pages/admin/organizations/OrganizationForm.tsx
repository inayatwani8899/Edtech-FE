import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  Save,
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Lock,
  Upload,
  Database,
  Users,
  CheckCircle2,
  Fingerprint
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useOrganizationStore } from "@/store/organizationStore";

const OrganizationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    organization,
    loading,
    fetchOrganization,
    createOrganization,
    updateOrganization,
    clearOrganization
  } = useOrganizationStore();

  const [formData, setFormData] = useState({
    instituteName: "",
    TenantDb: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    website: "",
    organizationType: "",
    approxStudentCount: 0,
  });

  const [documentFile, setDocumentFile] = useState<File | null>(null);

  useEffect(() => {
    clearOrganization();
    if (id) {
      fetchOrganization(id);
    }
  }, [id, fetchOrganization, clearOrganization]);

  // Load organization details into form on edit
  useEffect(() => {
    if (organization && id) {
      setFormData({
        instituteName: organization.instituteName || "",
        TenantDb: organization.tenantDb || organization.tenantDatabase || "",
        address: organization.address || "",
        city: organization.city || "",
        state: organization.state || "",
        country: organization.country || "",
        postalCode: organization.postalCode || "",
        email: organization.email || "",
        password: "",
        confirmPassword: "",
        contactNumber: organization.contactNumber || "",
        website: organization.website || "",
        organizationType: organization.organizationType || "",
        approxStudentCount: organization.approxStudentCount || 0,
      });
    }
  }, [organization, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "approxStudentCount" ? Number(value) : value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, organizationType: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.instituteName.trim()) {
      toast.error("Institute Name is required.");
      return false;
    }
    if (!formData.organizationType) {
      toast.error("Organization Type must be selected.");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      toast.error("A valid email is required.");
      return false;
    }
    if (!formData.contactNumber.trim()) {
      toast.error("Contact Number is required.");
      return false;
    }

    if (!id) {
      // Validation for new organization registration
      if (!formData.TenantDb.trim()) {
        toast.error("Tenant Database name is required.");
        return false;
      }
      if (!formData.password) {
        toast.error("Password is required.");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match.");
        return false;
      }
      if (!documentFile) {
        toast.error("Verification Document is required.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (id) {
        // Prepare update payload (UpdateOrganizationCommand doesn't take passwords or file)
        const updatePayload = {
          instituteName: formData.instituteName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
          email: formData.email,
          contactNumber: formData.contactNumber,
          website: formData.website,
          organizationType: formData.organizationType,
          approxStudentCount: formData.approxStudentCount,
        };
        await updateOrganization(id, updatePayload);
        toast.success("Organization profile updated successfully.");
      } else {
        // Use FormData to send values as multipart/form-data for registration
        const formPayload = new FormData();
        formPayload.append("instituteName", formData.instituteName);
        formPayload.append("TenantDb", formData.TenantDb);
        formPayload.append("Address", formData.address);
        formPayload.append("City", formData.city);
        formPayload.append("State", formData.state);
        formPayload.append("Country", formData.country);
        formPayload.append("PostalCode", formData.postalCode);
        formPayload.append("email", formData.email);
        formPayload.append("Password", formData.password);
        formPayload.append("ContactNumber", formData.contactNumber);
        formPayload.append("Website", formData.website);
        formPayload.append("OrganizationType", formData.organizationType);
        formPayload.append("approxStudentCount", String(formData.approxStudentCount));
        
        if (documentFile) {
          formPayload.append("Document", documentFile);
        }

        await createOrganization(formPayload);
        toast.success("Organization successfully registered and deployed.");
      }
      navigate("/manage/organizations");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to process organization profile.");
    }
  };

  if (id && loading && !organization) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-indigo-100 border-t-transparent animate-pulse"></div>
        </div>
        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Retrieving Organization Dossier...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] px-4 py-6 overflow-x-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Condensed Header */}
        <div className="flex items-center justify-between gap-3 mb-4 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <div 
              className="p-1.5 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-slate-50 border border-slate-100" 
              onClick={() => navigate("/manage/organizations")}
            >
              <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                {id ? "Update Organization" : "Register Organization"}
              </h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Core Institutional Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate("/manage/organizations")}
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
              {id ? "Deploy Update" : "Deploy & Activate"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Summary Card */}
          <div className="lg:col-span-3">
            <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden border border-slate-100/50">
              <div className="h-16 bg-slate-900 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              </div>
              <CardContent className="px-4 pb-4 -mt-8 relative z-10 text-center">
                <div className="h-16 w-16 rounded-2xl bg-white p-1 shadow-lg border border-slate-50 mx-auto mb-3">
                  <div className="h-full w-full rounded-xl bg-slate-50 flex items-center justify-center">
                    <Fingerprint className="h-8 w-8 text-indigo-300" />
                  </div>
                </div>
                <h2 className="text-base font-black text-slate-900 truncate mb-1 px-2">
                  {formData.instituteName || "Institution"}
                </h2>
                <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-bold uppercase tracking-widest text-[8px] mb-4 border-none">
                  {formData.organizationType || "Organization"}
                </Badge>

                <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-50 text-left">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[8px] font-black text-slate-400 uppercase block tracking-widest mb-1 text-center">Audit Status</span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[10px] font-black uppercase text-slate-600">
                        {id ? (organization?.status || "Active") : "Draft Mode"}
                      </span>
                    </div>
                  </div>
                  {id && (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[8px] font-black text-slate-400 uppercase block tracking-widest mb-1 text-center">Tenant Database</span>
                      <div className="flex items-center justify-center gap-1.5">
                        <Database className="h-3 w-3 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-600 truncate max-w-full">
                          {formData.TenantDb || "Not set"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Fields Hub */}
          <div className="lg:col-span-9 space-y-6">
            {/* Form Container */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card 1: Identity & Parameters */}
              <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="h-4 w-4 text-indigo-600" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Institution Identity</h3>
                  </div>
                </div>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Institute Name</Label>
                    <Input
                      name="instituteName"
                      value={formData.instituteName}
                      onChange={handleInputChange}
                      className="h-10 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all"
                      placeholder="e.g. Stanford University"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Organization Type</Label>
                    <Select value={formData.organizationType} onValueChange={handleSelectChange}>
                      <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm text-slate-700">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200">
                        <SelectItem value="School" className="text-sm font-medium">School</SelectItem>
                        <SelectItem value="College" className="text-sm font-medium">College</SelectItem>
                        <SelectItem value="University" className="text-sm font-medium">University</SelectItem>
                        <SelectItem value="Coaching Centre" className="text-sm font-medium">Coaching Centre</SelectItem>
                        <SelectItem value="Other" className="text-sm font-medium">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Approx Student Count</Label>
                    <div className="relative group">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-450 text-slate-350" />
                      <Input
                        type="number"
                        name="approxStudentCount"
                        value={formData.approxStudentCount || ""}
                        onChange={handleInputChange}
                        className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all"
                        placeholder="e.g. 500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Contact Records */}
              <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-indigo-600" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Contact Records</h3>
                  </div>
                </div>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Institutional Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-350" />
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all"
                        placeholder="admin@institute.edu"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Contact Phone</Label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-350" />
                      <Input
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all"
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Website URL</Label>
                    <div className="relative group">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-350" />
                      <Input
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all"
                        placeholder="www.institute.edu"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Geographics */}
              <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Geographics</h3>
                  </div>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Street Address</Label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="h-10 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all"
                      placeholder="123 University Ave"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">City</Label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="h-10 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all"
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">State / Province</Label>
                      <Input
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="h-10 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all"
                        placeholder="State"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Country</Label>
                      <Input
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="h-10 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all"
                        placeholder="Country"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Postal Code</Label>
                      <Input
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="h-10 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all"
                        placeholder="Postal Code"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: System Deployment Config (Required on Create only) */}
              {!id && (
                <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden border border-indigo-100/50">
                  <div className="px-6 py-4 border-b border-indigo-50 flex items-center justify-between bg-indigo-50/20">
                    <div className="flex items-center gap-2.5">
                      <Database className="h-4 w-4 text-indigo-600" />
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Environment Setup</h3>
                    </div>
                    <Badge className="bg-indigo-150 text-indigo-700 font-bold uppercase tracking-wider text-[8px] border-none pointer-events-none">Deployment Config</Badge>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Tenant Database Name</Label>
                        <div className="relative group">
                          <Database className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-350" />
                          <Input
                            name="TenantDb"
                            value={formData.TenantDb}
                            onChange={handleInputChange}
                            className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all"
                            placeholder="e.g. school_db_01"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Onboarding Verification Document</Label>
                        <div className="relative group flex items-center h-10 border border-dashed border-slate-300 rounded-xl bg-slate-50/50 px-3 cursor-pointer hover:bg-white transition-all">
                          <Upload className="h-4 w-4 text-slate-400 mr-2" />
                          <span className="text-xs text-slate-500 font-medium truncate flex-1">
                            {documentFile ? documentFile.name : "Select audit file (.pdf, .jpg, .png)"}
                          </span>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Initial Password</Label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-350" />
                          <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Confirm Password</Label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-350" />
                          <Input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="h-10 pl-9 bg-slate-50/50 border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 rounded-xl font-bold text-sm transition-all"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationForm;
