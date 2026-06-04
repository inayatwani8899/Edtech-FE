import React, { useEffect, useState, useRef } from "react";
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
  Fingerprint,
  ArrowRight,
  Check,
  X,
  ShieldAlert,
  AlertCircle,
  FileText,
  Sparkles,
  HelpCircle,
  Trash2,
  Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useOrganizationStore } from "@/store/organizationStore";

interface ErrorState {
  instituteName?: string;
  organizationType?: string;
  email?: string;
  contactNumber?: string;
  TenantDb?: string;
  password?: string;
  confirmPassword?: string;
  documentFile?: string;
  [key: string]: string | undefined;
}

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

  // Wizard step state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxVisitedStep, setMaxVisitedStep] = useState<number>(1);

  // Form State
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
    contactPerson: "", // Visual-only field for executive feel
    siteMessage: ""
  });

  // Verification & mockup files
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [supportFile, setSupportFile] = useState<File | null>(null);

  // Drag & drop highlight states
  const [isDragActiveLogo, setIsDragActiveLogo] = useState(false);
  const [isDragActiveCert, setIsDragActiveCert] = useState(false);
  const [isDragActiveSupport, setIsDragActiveSupport] = useState(false);

  // Form interactivity states
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<ErrorState>({});
  const [draftExists, setDraftExists] = useState(false);
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);

  // Refs for custom file upload zones
  const logoInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const supportInputRef = useRef<HTMLInputElement>(null);

  // Fetch organization data on edit mode initialization
  useEffect(() => {
    clearOrganization();
    if (id) {
      fetchOrganization(id);
    }
  }, [id, fetchOrganization, clearOrganization]);

  // Check if draft exists in localStorage on mount (creation mode only)
  useEffect(() => {
    if (!id) {
      const draft = localStorage.getItem("org_onboarding_draft");
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          if (parsed.instituteName || parsed.email || parsed.contactNumber) {
            setDraftExists(true);
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }, [id]);

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
        contactPerson: "System Administrator", // Default contact person placeholder
        siteMessage: organization.siteMessage || ""
      });

      if (organization.logoPath) {
        const fullUrl = organization.logoPath.startsWith("http")
          ? organization.logoPath
          : `https://nervous-dubinsky.180-179-213-167.plesk.page${organization.logoPath}`;
        setLogoPreview(fullUrl);
      }
    }
  }, [organization, id]);

  // Auto-save form progress to localStorage (creation mode only)
  useEffect(() => {
    if (!id && (formData.instituteName || formData.email || formData.contactNumber)) {
      const draftData = {
        ...formData,
        password: "", // do not save sensitive credentials
        confirmPassword: ""
      };
      localStorage.setItem("org_onboarding_draft", JSON.stringify(draftData));
    }
  }, [formData, id]);

  // Real-time Validation Engine
  const validateField = (name: string, value: any): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let err = "";

    switch (name) {
      case "instituteName":
        if (!value || !value.trim()) {
          err = "Institution name is required";
        } else if (value.trim().length < 3) {
          err = "Name must be at least 3 characters";
        }
        break;
      case "organizationType":
        if (!value) {
          err = "Please select an institution type";
        }
        break;
      case "email":
        if (!value) {
          err = "Administrative email is required";
        } else if (!emailRegex.test(value)) {
          err = "Please enter a valid email address";
        }
        break;
      case "contactNumber":
        if (!value || !value.trim()) {
          err = "Contact number is required";
        }
        break;
      case "TenantDb":
        if (!id) {
          if (!value || !value.trim()) {
            err = "Tenant database identifier is required";
          } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            err = "Identifier must only contain alphanumeric characters or underscores";
          }
        }
        break;
      case "password":
        if (!id) {
          if (!value) {
            err = "Password is required";
          } else if (value.length < 6) {
            err = "Password must be at least 6 characters";
          }
        }
        break;
      case "confirmPassword":
        if (!id) {
          if (!value) {
            err = "Password confirmation is required";
          } else if (value !== formData.password) {
            err = "Passwords do not match";
          }
        }
        break;
      default:
        break;
    }
    return err;
  };

  // Run validation on form state changes
  useEffect(() => {
    const newErrors: ErrorState = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key as keyof typeof formData]);
      if (err) newErrors[key] = err;
    });

    if (!id && formData.confirmPassword && formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!id && !documentFile) {
      newErrors.documentFile = "Verification document is required";
    }

    setErrors(newErrors);
  }, [formData, documentFile, id]);

  // Unsaved changes warning hook
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormDirty() && !loading) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData, documentFile, loading]);

  const isFormDirty = () => {
    if (id) {
      if (!organization) return false;
      return (
        formData.instituteName !== (organization.instituteName || "") ||
        formData.address !== (organization.address || "") ||
        formData.city !== (organization.city || "") ||
        formData.state !== (organization.state || "") ||
        formData.country !== (organization.country || "") ||
        formData.postalCode !== (organization.postalCode || "") ||
        formData.email !== (organization.email || "") ||
        formData.contactNumber !== (organization.contactNumber || "") ||
        formData.website !== (organization.website || "") ||
        formData.organizationType !== (organization.organizationType || "") ||
        formData.approxStudentCount !== (organization.approxStudentCount || 0) ||
        formData.siteMessage !== (organization.siteMessage || "")
      );
    } else {
      return (
        Object.keys(formData).some((k) => k !== "approxStudentCount" && formData[k as keyof typeof formData] !== "") ||
        formData.approxStudentCount !== 0 ||
        documentFile !== null
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "approxStudentCount" ? Number(value) : value
    }));
    // Touch on change to trigger real-time validation visual indicators
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, organizationType: value }));
    setTouchedFields((prev) => ({ ...prev, organizationType: true }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocumentFile(e.target.files[0]);
      setTouchedFields((prev) => ({ ...prev, documentFile: true }));
    }
  };

  const handleRestoreDraft = () => {
    const draft = localStorage.getItem("org_onboarding_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          password: "",
          confirmPassword: ""
        }));
        toast.success("Onboarding draft restored successfully.");
      } catch (e) {
        toast.error("Failed to restore draft data.");
      }
    }
    setDraftExists(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem("org_onboarding_draft");
    setDraftExists(false);
    toast.info("Draft data cleared.");
  };

  const getStepErrors = (stepNum: number): string[] => {
    const stepErrors: string[] = [];
    if (stepNum === 1) {
      if (errors.instituteName) stepErrors.push(errors.instituteName);
      if (errors.organizationType) stepErrors.push(errors.organizationType);
      if (!id && errors.TenantDb) stepErrors.push(errors.TenantDb);
    } else if (stepNum === 2) {
      if (errors.email) stepErrors.push(errors.email);
      if (errors.contactNumber) stepErrors.push(errors.contactNumber);
      if (!id && errors.password) stepErrors.push(errors.password);
      if (!id && errors.confirmPassword) stepErrors.push(errors.confirmPassword);
    } else if (stepNum === 4) {
      if (!id && errors.documentFile) stepErrors.push(errors.documentFile);
    }
    return stepErrors;
  };

  const handleNextStep = () => {
    // Force touch all fields in current step
    const fieldsToTouch: string[] = [];
    if (currentStep === 1) {
      fieldsToTouch.push("instituteName", "organizationType");
      if (!id) fieldsToTouch.push("TenantDb");
    } else if (currentStep === 2) {
      fieldsToTouch.push("email", "contactNumber");
      if (!id) fieldsToTouch.push("password", "confirmPassword");
    } else if (currentStep === 4) {
      if (!id) fieldsToTouch.push("documentFile");
    }

    const updatedTouched = { ...touchedFields };
    fieldsToTouch.forEach((f) => { updatedTouched[f] = true; });
    setTouchedFields(updatedTouched);

    const stepErrors = getStepErrors(currentStep);
    if (stepErrors.length > 0) {
      toast.error(`Please correct the validation errors in Step ${currentStep} first.`);
      return;
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setMaxVisitedStep((prev) => Math.max(prev, nextStep));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleStepClick = (stepNum: number) => {
    if (stepNum === currentStep) return;

    if (stepNum < currentStep) {
      setCurrentStep(stepNum);
      return;
    }

    // Navigating forward: validate all intermediate steps
    for (let s = currentStep; s < stepNum; s++) {
      const fieldsToTouch: string[] = [];
      if (s === 1) {
        fieldsToTouch.push("instituteName", "organizationType");
        if (!id) fieldsToTouch.push("TenantDb");
      } else if (s === 2) {
        fieldsToTouch.push("email", "contactNumber");
        if (!id) fieldsToTouch.push("password", "confirmPassword");
      } else if (s === 4) {
        if (!id) fieldsToTouch.push("documentFile");
      }

      const updatedTouched = { ...touchedFields };
      fieldsToTouch.forEach((f) => { updatedTouched[f] = true; });
      setTouchedFields(updatedTouched);

      const stepErrors = getStepErrors(s);
      if (stepErrors.length > 0) {
        toast.error(`Step ${s} is incomplete. Resolve errors to unlock Step ${stepNum}.`);
        setCurrentStep(s);
        return;
      }
    }

    setCurrentStep(stepNum);
    setMaxVisitedStep((prev) => Math.max(prev, stepNum));
  };

  const handleAbort = () => {
    if (isFormDirty()) {
      setShowAbortConfirm(true);
    } else {
      localStorage.removeItem("org_onboarding_draft");
      navigate("/manage/organizations");
    }
  };

  const confirmAbortAction = () => {
    localStorage.removeItem("org_onboarding_draft");
    navigate("/manage/organizations");
  };

  const validateForm = () => {
    // Touch all fields
    const allFields = ["instituteName", "organizationType", "email", "contactNumber"];
    if (!id) {
      allFields.push("TenantDb", "password", "confirmPassword", "documentFile");
    }
    const updatedTouched = { ...touchedFields };
    allFields.forEach((f) => { updatedTouched[f] = true; });
    setTouchedFields(updatedTouched);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.instituteName.trim()) {
      toast.error("Institute Name is required.");
      setCurrentStep(1);
      return false;
    }
    if (!formData.organizationType) {
      toast.error("Organization Type must be selected.");
      setCurrentStep(1);
      return false;
    }
    if (!id && !formData.TenantDb.trim()) {
      toast.error("Tenant Database name is required.");
      setCurrentStep(1);
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      toast.error("A valid email is required.");
      setCurrentStep(2);
      return false;
    }
    if (!formData.contactNumber.trim()) {
      toast.error("Contact Number is required.");
      setCurrentStep(2);
      return false;
    }

    if (!id) {
      if (!formData.password) {
        toast.error("Password is required.");
        setCurrentStep(2);
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match.");
        setCurrentStep(2);
        return false;
      }
      if (!documentFile) {
        toast.error("Verification Document is required.");
        setCurrentStep(4);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    try {
      if (id) {
        const updatePayload = new FormData();
        updatePayload.append("Id", String(id));
        updatePayload.append("id", String(id));
        updatePayload.append("instituteName", formData.instituteName);
        if (formData.password) {
          updatePayload.append("Password", formData.password);
        }
        updatePayload.append("Address", formData.address);
        updatePayload.append("City", formData.city);
        updatePayload.append("State", formData.state);
        updatePayload.append("Country", formData.country);
        updatePayload.append("PostalCode", formData.postalCode);
        updatePayload.append("email", formData.email);
        updatePayload.append("ContactNumber", formData.contactNumber);
        updatePayload.append("Website", formData.website || "");
        updatePayload.append("OrganizationType", formData.organizationType);
        updatePayload.append("approxStudentCount", String(formData.approxStudentCount || 0));
        
        updatePayload.append("siteMessage", formData.siteMessage || "");
        updatePayload.append("SiteMessage", formData.siteMessage || "");

        if (logoFile) {
          updatePayload.append("logo", logoFile);
          updatePayload.append("Logo", logoFile);
          updatePayload.append("LogoFile", logoFile);
          updatePayload.append("LogoPath", logoFile);
          updatePayload.append("logoFile", logoFile);
          updatePayload.append("logoPath", logoFile);
        }

        if (documentFile) {
          updatePayload.append("Document", documentFile);
          updatePayload.append("DocumentFile", documentFile);
          updatePayload.append("document", documentFile);
          updatePayload.append("documentFile", documentFile);
        }

        await updateOrganization(id, updatePayload);
        toast.success("Organization profile updated successfully.");
      } else {
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
        formPayload.append("Website", formData.website || "");
        formPayload.append("OrganizationType", formData.organizationType);
        formPayload.append("approxStudentCount", String(formData.approxStudentCount || 0));
        
        // Metadata/Config fields to match SchoolRegister.tsx API integration
        formPayload.append("DocumentUrl", "");
        formPayload.append("SiteMessage", formData.siteMessage || "");
        formPayload.append("siteMessage", formData.siteMessage || "");
        formPayload.append("Status", "Pending");
        formPayload.append("OnboardingStage", "Submitted");
        formPayload.append("IsVerified", "false");
        formPayload.append("IsActive", "true");

        if (documentFile) {
          formPayload.append("Document", documentFile);
          formPayload.append("DocumentFile", documentFile);
          formPayload.append("document", documentFile);
          formPayload.append("documentFile", documentFile);
        }

        if (logoFile) {
          formPayload.append("LogoPath", logoFile);
          formPayload.append("Logo", logoFile);
          formPayload.append("LogoFile", logoFile);
          formPayload.append("logo", logoFile);
          formPayload.append("logoFile", logoFile);
          formPayload.append("logoPath", logoFile);
        }

        await createOrganization(formPayload);
        localStorage.removeItem("org_onboarding_draft");
        toast.success("Organization successfully registered and deployed.");
      }
      navigate("/manage/organizations");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to process organization profile.");
    }
  };

  // Input styling dynamic feedback
  const getInputClass = (fieldName: string) => {
    const base = "h-10 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl font-bold text-sm transition-all focus-visible:ring-2 focus-visible:ring-indigo-100 focus-visible:border-indigo-500 w-full";
    if (!touchedFields[fieldName]) return base;
    if (errors[fieldName]) {
      return `${base} border-rose-300 bg-rose-50/10 focus-visible:ring-rose-100 focus-visible:border-rose-500 text-slate-800`;
    }
    return `${base} border-emerald-300 bg-emerald-50/10 focus-visible:ring-emerald-100 focus-visible:border-emerald-500`;
  };

  // Password strength visual calculation
  const getPasswordStrength = () => {
    if (!formData.password) return { label: "", color: "bg-slate-200", width: "w-0" };
    if (formData.password.length < 6) return { label: "Too Short", color: "bg-rose-500", width: "w-1/4" };
    
    // Check complexity
    const hasLetters = /[a-zA-Z]/.test(formData.password);
    const hasNumbers = /[0-9]/.test(formData.password);
    const hasSymbols = /[^a-zA-Z0-9]/.test(formData.password);

    if (hasLetters && hasNumbers && hasSymbols && formData.password.length >= 8) {
      return { label: "Strong & Secure", color: "bg-emerald-500", width: "w-full" };
    }
    if (hasLetters && hasNumbers) {
      return { label: "Medium Complexity", color: "bg-amber-500", width: "w-2/3" };
    }
    return { label: "Weak Passphrase", color: "bg-orange-500", width: "w-1/3" };
  };

  const steps = [
    { id: 1, name: "Organization Info", desc: "Identity & parameters", icon: Building2 },
    { id: 2, name: id ? "Contact Details" : "Contact & Security", desc: id ? "Email & phone records" : "Identity & system credentials", icon: Mail },
    { id: 3, name: "Location Details", desc: "Geographic registry", icon: MapPin },
    { id: 4, name: id ? "Branding & Media" : "Branding & Verification", desc: id ? "Asset configuration" : "Onboarding documentation", icon: Upload },
    { id: 5, name: "Review & Deploy", desc: "Compliance & submission", icon: CheckCircle2 }
  ];

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

  const isStepComplete = (stepNum: number) => {
    return stepNum < currentStep && getStepErrors(stepNum).length === 0;
  };

  const passwordStrength = getPasswordStrength();

  // Progress Bar percentage calculation
  const progressPercentage = currentStep === 5 ? 100 : (currentStep - 1) * 20 + 10;

  // Live Summary definitions
  const renderedAddress = [formData.address, formData.city, formData.state, formData.country, formData.postalCode]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] relative overflow-hidden font-sans pb-16">
      {/* Background grids and blurs */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-50/60 to-transparent pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-[30%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Header Block */}
        <div className="flex items-center justify-between gap-3 mb-6 border-b border-slate-200/60 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="p-2 bg-white rounded-xl shadow-sm cursor-pointer hover:bg-slate-50 border border-slate-200/50 hover:scale-105 active:scale-95 transition-all"
              onClick={handleAbort}
            >
              <ArrowLeft className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                {id ? "Modify Organization" : "Register Onboarding Wizard"}
                <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 font-bold uppercase tracking-wider text-[8px] border-indigo-200/50">
                  {id ? "Update Mode" : "Super Admin Console"}
                </Badge>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {id ? "Edit existing organization properties" : "Enterprise setup & tenant instance deployment"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleAbort}
              className="text-slate-500 hover:bg-slate-100 font-bold text-xs h-9 px-4 rounded-xl transition-all"
            >
              Abort Setup
            </Button>
            <Button
              onClick={() => {
                if (currentStep === 5) {
                  handleSubmit();
                } else {
                  handleNextStep();
                }
              }}
              disabled={loading}
              className="bg-slate-900 text-white font-bold text-xs h-9 px-5 rounded-xl shadow-md hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : currentStep === 5 ? (
                <Save className="h-3.5 w-3.5" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5" />
              )}
              {currentStep === 5 ? (id ? "Deploy Update" : "Deploy & Activate") : "Continue"}
            </Button>
          </div>
        </div>

        {/* Draft Restore Alert */}
        {draftExists && !id && (
          <div className="mb-6 p-4 bg-white border border-indigo-100 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Unfinished registration draft identified</p>
                <p className="text-xs text-slate-500 font-medium">We saved your progress from your last visit. Would you like to restore it?</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" className="rounded-xl font-bold h-8 text-xs border-slate-200" onClick={handleDiscardDraft}>
                Discard
              </Button>
              <Button size="sm" className="bg-primary text-white rounded-xl font-bold h-8 text-xs shadow-md" onClick={handleRestoreDraft}>
                Restore Progress
              </Button>
            </div>
          </div>
        )}

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Sidebar: Steps & Dynamic Summary (Laptops / Small Desktops) */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            
            {/* Steps Timeline Navigation */}
            <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden border border-slate-100/50">
              <CardContent className="p-4 space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-4 ml-1">Onboarding Progress</p>
                <div className="relative pl-3 space-y-6">
                  {/* Visual timeline bar */}
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100 pointer-events-none -z-10" />

                  {steps.map((s, index) => {
                    const isActive = s.id === currentStep;
                    const isCompleted = isStepComplete(s.id);
                    const isSelectable = s.id <= maxVisitedStep;
                    const StepIcon = s.icon;

                    return (
                      <div
                        key={s.id}
                        onClick={() => isSelectable && handleStepClick(s.id)}
                        className={`flex items-start gap-4 relative transition-all duration-300 ${
                          isSelectable ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                        }`}
                      >
                        <div
                          className={`h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm border ${
                            isActive
                              ? "bg-slate-900 border-slate-900 text-white scale-110 shadow-slate-900/10"
                              : isCompleted
                              ? "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/10"
                              : "bg-white border-slate-200 text-slate-400"
                          }`}
                        >
                          {isCompleted ? <Check className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold leading-tight ${isActive ? "text-slate-900 font-extrabold" : "text-slate-500"}`}>
                            {s.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Sticky Live Summary (displays below progress in 2-column layout on lg viewports) */}
            <div className="hidden lg:block xl:hidden">
              <SummaryPanel
                formData={formData}
                logoPreview={logoPreview}
                documentFile={documentFile}
                logoFile={logoFile}
                supportFile={supportFile}
                renderedAddress={renderedAddress}
                isEdit={!!id}
                orgStatus={organization?.status}
              />
            </div>
          </div>

          {/* Right Area: Form Workspace (spans 8 on lg, 6 on xl) */}
          <div className="lg:col-span-8 xl:col-span-6 space-y-6">
            
            {/* Progress Percentage Visual Indicator */}
            <Card className="border-none shadow-elegant bg-white rounded-3xl p-5 border border-slate-100/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Onboarding Completeness</span>
                <span className="text-xs font-black text-slate-900">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-slate-900 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </Card>

            {/* Current Step Workspace */}
            <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden min-h-[420px] flex flex-col justify-between border border-slate-100/50">
              <div className="p-6 md:p-8 flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* Step Headers */}
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                  <div className="p-2.5 bg-slate-50 text-slate-900 rounded-2xl border border-slate-100 shadow-sm">
                    {(() => {
                      const ActiveIcon = steps[currentStep - 1].icon;
                      return <ActiveIcon className="h-5 w-5" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                      {steps[currentStep - 1].name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                      {currentStep === 1 && "Specify your institution's registration parameters and identifier databases."}
                      {currentStep === 2 && "Configure contact directory records and system login administrator passwords."}
                      {currentStep === 3 && "Specify the geographic boundaries for compliance auditing and mailing records."}
                      {currentStep === 4 && "Configure custom corporate branding assets and onboarding verification files."}
                      {currentStep === 5 && "Review onboarding summaries and complete system compilation validation."}
                    </p>
                  </div>
                </div>

                {/* Forms content switch */}
                <div className="space-y-5">
                  {currentStep === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      <div className="space-y-1.5 md:col-span-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1">Institute Name *</Label>
                          {touchedFields.instituteName && (
                            errors.instituteName ? (
                              <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.instituteName}</span>
                            ) : (
                              <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Ready</span>
                            )
                          )}
                        </div>
                        <Input
                          name="instituteName"
                          value={formData.instituteName}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className={getInputClass("instituteName")}
                          placeholder="e.g. Stanford University"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1">Organization Type *</Label>
                          {touchedFields.organizationType && (
                            errors.organizationType ? (
                              <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Required</span>
                            ) : (
                              <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Ready</span>
                            )
                          )}
                        </div>
                        <Select value={formData.organizationType} onValueChange={handleSelectChange}>
                          <SelectTrigger className={`h-10 bg-slate-50/50 border-slate-200/50 focus:bg-white rounded-xl font-bold text-sm text-slate-700 w-full ${touchedFields.organizationType && errors.organizationType ? 'border-rose-300' : ''}`}>
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
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1">Approx Student Capacity</Label>
                        <div className="relative group">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450 text-slate-400" />
                          <Input
                            type="number"
                            name="approxStudentCount"
                            value={formData.approxStudentCount || ""}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            className="h-10 pl-9 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl font-bold text-sm transition-all focus-visible:ring-2 focus-visible:ring-indigo-100 focus-visible:border-indigo-500 w-full"
                            placeholder="e.g. 500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1 font-bold">Institution Website URL</Label>
                        <div className="relative group">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            className="h-10 pl-9 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl font-bold text-sm transition-all focus-visible:ring-2 focus-visible:ring-indigo-100 focus-visible:border-indigo-500 w-full"
                            placeholder="www.institute.edu"
                          />
                        </div>
                      </div>

                      {!id && (
                        <div className="space-y-1.5 md:col-span-2 pt-4 border-t border-slate-100">
                          <div className="flex justify-between items-center">
                            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1 font-extrabold text-indigo-700 flex items-center gap-1">
                              <Database className="h-3.5 w-3.5" /> Tenant Database Identifier *
                            </Label>
                            {touchedFields.TenantDb && (
                              errors.TenantDb ? (
                                <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.TenantDb}</span>
                              ) : (
                                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Valid</span>
                              )
                            )}
                          </div>
                          <Input
                            name="TenantDb"
                            value={formData.TenantDb}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            className={getInputClass("TenantDb")}
                            placeholder="e.g. stanford_db"
                          />
                          <p className="text-[10px] text-slate-450 text-slate-400 font-medium leading-normal ml-1">
                            Important: This database identifier configures the private backend instance. Must not contain spaces or special characters.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1">Administrative Contact Person</Label>
                        <Input
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          className="h-10 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl font-bold text-sm w-full"
                          placeholder="e.g. Dean Johnson"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1">Institutional Email Address *</Label>
                          {touchedFields.email && (
                            errors.email ? (
                              <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.email}</span>
                            ) : (
                              <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Valid</span>
                            )
                          )}
                        </div>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450 text-slate-400" />
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            className={`pl-9 ${getInputClass("email")}`}
                            placeholder="admin@institute.edu"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1">Administrative Phone Number *</Label>
                          {touchedFields.contactNumber && (
                            errors.contactNumber ? (
                              <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Required</span>
                            ) : (
                              <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Ready</span>
                            )
                          )}
                        </div>
                        <div className="relative group">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-450 text-slate-400" />
                          <Input
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            className={`pl-9 ${getInputClass("contactNumber")}`}
                            placeholder="e.g. +1 650 723 2300"
                          />
                        </div>
                      </div>

                      {!id && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:col-span-2 pt-4 border-t border-slate-100">
                          
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1 font-extrabold text-indigo-700">Administrator Password *</Label>
                              {touchedFields.password && (
                                errors.password ? (
                                  <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.password}</span>
                                ) : (
                                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Secure</span>
                                )
                              )}
                            </div>
                            <div className="relative group">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                className={`pl-9 ${getInputClass("password")}`}
                                placeholder="••••••••"
                              />
                            </div>
                            {/* Strength indicator */}
                            {formData.password && (
                              <div className="space-y-1 mt-1 ml-1">
                                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                  <span>Strength</span>
                                  <span className="text-slate-650">{passwordStrength.label}</span>
                                </div>
                                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`} />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1">Confirm Administrator Password *</Label>
                              {touchedFields.confirmPassword && (
                                errors.confirmPassword ? (
                                  <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.confirmPassword}</span>
                                ) : (
                                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Matched</span>
                                )
                              )}
                            </div>
                            <div className="relative group">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                className={`pl-9 ${getInputClass("confirmPassword")}`}
                                placeholder="••••••••"
                              />
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1">Street Address</Label>
                        <div className="relative group">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="pl-9 h-10 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl font-bold text-sm w-full focus-visible:ring-2 focus-visible:ring-indigo-150 focus-visible:border-indigo-500"
                            placeholder="e.g. 450 Serra Mall"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1">City</Label>
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="h-10 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl font-bold text-sm w-full focus-visible:ring-2 focus-visible:ring-indigo-150 focus-visible:border-indigo-500"
                          placeholder="Stanford"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1">State / Province</Label>
                        <Input
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="h-10 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl font-bold text-sm w-full focus-visible:ring-2 focus-visible:ring-indigo-150 focus-visible:border-indigo-500"
                          placeholder="California"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1">Country</Label>
                        <Input
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="h-10 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl font-bold text-sm w-full focus-visible:ring-2 focus-visible:ring-indigo-150 focus-visible:border-indigo-500"
                          placeholder="United States"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1">Postal / Zip Code</Label>
                        <Input
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="h-10 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl font-bold text-sm w-full focus-visible:ring-2 focus-visible:ring-indigo-150 focus-visible:border-indigo-500"
                          placeholder="94305"
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Logo Drag and Drop */}
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1">Institutional Logo Image</Label>
                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDragActiveLogo(true); }}
                          onDragLeave={() => setIsDragActiveLogo(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragActiveLogo(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              const file = e.dataTransfer.files[0];
                              setLogoFile(file);
                              setLogoPreview(URL.createObjectURL(file));
                            }
                          }}
                          onClick={() => !logoPreview && logoInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[160px] relative ${
                            isDragActiveLogo 
                              ? 'border-indigo-500 bg-indigo-500/5 scale-[0.99]' 
                              : 'border-slate-200 hover:border-slate-350 bg-slate-50/20 hover:bg-slate-50/60'
                          }`}
                        >
                          <input
                            type="file"
                            ref={logoInputRef}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                setLogoFile(file);
                                setLogoPreview(URL.createObjectURL(file));
                              }
                            }}
                            accept="image/*"
                            className="hidden"
                          />

                          {logoPreview ? (
                            <div className="flex flex-col items-center space-y-3 w-full" onClick={(e) => e.stopPropagation()}>
                              <img 
                                src={logoPreview} 
                                alt="Logo Preview" 
                                className="h-16 w-16 object-contain rounded-xl border border-slate-100 bg-white p-1 shadow-sm"
                              />
                              <div className="text-center">
                                <span className="text-xs font-bold text-slate-800 block truncate max-w-[200px]">
                                  {logoFile ? logoFile.name : (organization?.logoPath ? "Current Logo" : "Uploaded Logo")}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => logoInputRef.current?.click()}
                                  className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                                >
                                  Change Logo
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setLogoFile(null);
                                    setLogoPreview("");
                                  }}
                                  className="h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-50"
                                >
                                  Remove Logo
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <Upload className={`h-8 w-8 mb-2 transition-transform duration-300 ${isDragActiveLogo ? 'scale-110 text-indigo-500' : 'text-slate-400'}`} />
                              <span className="text-xs font-bold text-slate-700 block mb-1">Upload Organization Logo</span>
                              <span className="text-[10px] text-slate-400 font-medium block">PNG, JPG, SVG up to 2MB</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Welcome message field */}
                      <div className="space-y-1.5 md:col-span-2">
                        <div className="flex justify-between items-center px-1">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Site Welcome Message (Optional)</Label>
                          <span className="text-[9px] text-slate-450 text-slate-400 font-mono font-bold">{(formData.siteMessage || "").length} / 500</span>
                        </div>
                        <textarea
                          name="siteMessage"
                          value={formData.siteMessage || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length <= 500) {
                              setFormData((prev) => ({ ...prev, siteMessage: val }));
                            }
                          }}
                          placeholder="E.g., Welcome to the Delhi Public School Portal"
                          rows={3}
                          className="w-full p-3 bg-slate-50/50 border border-slate-200 focus:bg-white rounded-xl font-bold text-sm transition-all focus-visible:ring-2 focus-visible:ring-indigo-100 focus-visible:border-indigo-500 resize-none text-slate-800 placeholder:text-slate-300"
                        />
                      </div>

                      {/* Onboarding Document Upload (Required on creation) */}
                      <div className="space-y-2 md:col-span-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1">
                            Onboarding Verification Document *
                          </Label>
                          {touchedFields.documentFile && (
                            errors.documentFile ? (
                              <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Required</span>
                            ) : (
                              <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Uploaded</span>
                            )
                          )}
                        </div>

                        {id ? (
                          // Edit mode: display existing document details from store
                          organization?.documentUrl ? (
                            <div className="flex items-center gap-3 p-4 bg-indigo-50/40 border border-indigo-150 rounded-2xl">
                              <FileText className="h-6 w-6 text-indigo-500 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">Verification Document</p>
                                <a
                                  href={organization.documentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-indigo-600 hover:underline font-bold uppercase tracking-wider block mt-1"
                                >
                                  View Current Certificate File <Eye className="h-2.5 w-2.5 inline-block ml-0.5" />
                                </a>
                              </div>
                              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-bold py-0.5 px-2 pointer-events-none">Verified</Badge>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic">No verification documents uploaded for this organization profile.</p>
                          )
                        ) : (
                          // Creation mode: active dropzone
                          <>
                            <div
                              onDragOver={(e) => { e.preventDefault(); setIsDragActiveCert(true); }}
                              onDragLeave={() => setIsDragActiveCert(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDragActiveCert(false);
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                  setDocumentFile(e.dataTransfer.files[0]);
                                  setTouchedFields((prev) => ({ ...prev, documentFile: true }));
                                }
                              }}
                              onClick={() => certInputRef.current?.click()}
                              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] ${
                                isDragActiveCert ? 'border-indigo-500 bg-indigo-500/5 scale-[0.99]' : 'border-slate-200 hover:border-slate-350 bg-slate-50/20 hover:bg-slate-50/60'
                              }`}
                            >
                              <Upload className={`h-8 w-8 mb-2 transition-transform duration-300 ${isDragActiveCert ? 'scale-110 text-indigo-500' : 'text-slate-400'}`} />
                              <span className="text-xs font-bold text-slate-700 block mb-1">Drag & drop verification certificate, or browse</span>
                              <span className="text-[10px] text-slate-400 font-medium block">PDF, JPG, PNG up to 10MB</span>
                              <input
                                type="file"
                                ref={certInputRef}
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                              />
                            </div>

                            {documentFile && (
                              <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                <FileText className="h-6 w-6 text-indigo-500 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate leading-none mb-1">{documentFile.name}</p>
                                  <p className="text-[10px] text-slate-400 font-semibold">Regulatory Cert • {(documentFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDocumentFile(null);
                                  }}
                                  className="h-8 w-8 text-rose-500 hover:bg-rose-50 rounded-xl"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Supporting Documents (Optional mockup upload) */}
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wide ml-1">Supporting Documentation (Optional)</Label>
                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDragActiveSupport(true); }}
                          onDragLeave={() => setIsDragActiveSupport(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragActiveSupport(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              setSupportFile(e.dataTransfer.files[0]);
                            }
                          }}
                          onClick={() => supportInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] ${
                            isDragActiveSupport ? 'border-indigo-500 bg-indigo-500/5 scale-[0.99]' : 'border-slate-200 hover:border-slate-350 bg-slate-50/20 hover:bg-slate-50/60'
                          }`}
                        >
                          <Upload className={`h-8 w-8 mb-2 transition-transform duration-300 ${isDragActiveSupport ? 'scale-110 text-indigo-500' : 'text-slate-400'}`} />
                          <span className="text-xs font-bold text-slate-700 block mb-1">Drag & drop supplementary files, or browse</span>
                          <span className="text-[10px] text-slate-400 font-medium block">PDF, DOCX, ZIP up to 20MB</span>
                          <input
                            type="file"
                            ref={supportInputRef}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setSupportFile(e.target.files[0]);
                              }
                            }}
                            accept=".pdf,.docx,.doc,.zip,.rar"
                            className="hidden"
                          />
                        </div>

                        {supportFile && (
                          <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                            <FileText className="h-6 w-6 text-slate-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate leading-none mb-1">{supportFile.name}</p>
                              <p className="text-[10px] text-slate-400 font-semibold">Supplementary Pack • {(supportFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSupportFile(null);
                              }}
                              className="h-8 w-8 text-rose-500 hover:bg-rose-50 rounded-xl"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {currentStep === 5 && (
                    <div className="space-y-6">
                      
                      {/* Form summary layout */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Institution Identity</span>
                          <div className="space-y-1.5 text-xs text-slate-700">
                            <div className="flex justify-between"><span className="font-medium text-slate-400">Name:</span> <span className="font-bold text-slate-800">{formData.instituteName}</span></div>
                            <div className="flex justify-between"><span className="font-medium text-slate-400">Type:</span> <span className="font-bold text-slate-800">{formData.organizationType}</span></div>
                            <div className="flex justify-between"><span className="font-medium text-slate-400">Capacity:</span> <span className="font-bold text-slate-800">{formData.approxStudentCount || "Not set"}</span></div>
                            <div className="flex justify-between"><span className="font-medium text-slate-400">Website:</span> <span className="font-bold text-slate-800 truncate max-w-[150px]">{formData.website || "Not set"}</span></div>
                            {!id && <div className="flex justify-between"><span className="font-medium text-slate-455 text-slate-400">Database ID:</span> <span className="font-bold text-indigo-700">{formData.TenantDb}</span></div>}
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Contact Directory</span>
                          <div className="space-y-1.5 text-xs text-slate-700">
                            <div className="flex justify-between"><span className="font-medium text-slate-400">Person:</span> <span className="font-bold text-slate-800">{formData.contactPerson || "Not provided"}</span></div>
                            <div className="flex justify-between"><span className="font-medium text-slate-400">Email:</span> <span className="font-bold text-slate-800">{formData.email}</span></div>
                            <div className="flex justify-between"><span className="font-medium text-slate-400">Phone:</span> <span className="font-bold text-slate-800">{formData.contactNumber}</span></div>
                            <div className="flex justify-between">
                              <span className="font-medium text-slate-400">Credentials:</span> 
                              <span className="font-bold text-slate-800">{id ? "Existing Credentials" : "Admin Account Configured"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl md:col-span-2">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Location & Geographics</span>
                          <div className="text-xs text-slate-700">
                            <p className="font-bold text-slate-800">{renderedAddress || "Geographical information not configured."}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl md:col-span-2">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Portal Customization & Media</span>
                          <div className="space-y-1.5 text-xs text-slate-700 text-left">
                            <div className="flex justify-between"><span className="font-medium text-slate-400">Branding Logo:</span> <span className="font-bold text-slate-800">{logoFile ? logoFile.name : (organization?.logoPath ? "Preserve Existing Logo" : "Default Layout")}</span></div>
                            <div className="flex justify-between">
                              <span className="font-medium text-slate-400">Verification Cert:</span> 
                              <span className="font-bold text-slate-800">
                                {id ? (organization?.documentUrl ? "Verification file verified" : "Not uploaded") : (documentFile ? documentFile.name : "Missing")}
                              </span>
                            </div>
                            <div className="flex flex-col mt-1.5">
                              <span className="font-medium text-slate-400 mb-0.5">Welcome Message:</span>
                              <p className="font-bold text-slate-800 bg-white/50 p-2 rounded-lg border border-slate-100">{formData.siteMessage || "Not configured"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Validation checklist */}
                      <div className="p-4 border border-slate-200/60 rounded-2xl bg-white space-y-3">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">System Compilation Checklist</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          
                          <div
                            onClick={() => handleStepClick(1)}
                            className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <span className="font-semibold text-slate-650 text-slate-500">Institution Identity details</span>
                            {formData.instituteName && formData.organizationType ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-rose-500 animate-pulse" />
                            )}
                          </div>

                          <div
                            onClick={() => handleStepClick(1)}
                            className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <span className="font-semibold text-slate-500">Environment Database Config</span>
                            {id || (formData.TenantDb && !errors.TenantDb) ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-rose-500 animate-pulse" />
                            )}
                          </div>

                          <div
                            onClick={() => handleStepClick(2)}
                            className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <span className="font-semibold text-slate-500">Admin Account Credentials</span>
                            {formData.email && formData.contactNumber && (id || formData.password) ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-rose-500 animate-pulse" />
                            )}
                          </div>

                          <div
                            onClick={() => handleStepClick(4)}
                            className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <span className="font-semibold text-slate-500">Verification Certificate</span>
                            {id || documentFile ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-rose-500 animate-pulse" />
                            )}
                          </div>

                        </div>
                      </div>

                      {/* Success / Warning notifications */}
                      {getStepErrors(1).length === 0 && getStepErrors(2).length === 0 && (id || documentFile) ? (
                        <div className="flex gap-3 p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                          <p className="text-xs text-emerald-800 font-semibold leading-relaxed">
                            System compiled successfully. All compliance documents and credential parameters are verified. You are authorized to deploy this tenant instance.
                          </p>
                        </div>
                      ) : (
                        <div className="flex gap-3 p-4 bg-rose-50/50 border border-rose-200 rounded-2xl">
                          <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0" />
                          <p className="text-xs text-rose-800 font-semibold leading-relaxed">
                            Form contains incomplete validation fields. Please resolve outstanding checklist items prior to deployment submission.
                          </p>
                        </div>
                      )}

                    </div>
                  )}
                </div>

              </div>

              {/* Step Navigation Controls */}
              <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1 || loading}
                  className="rounded-xl font-bold h-9 text-xs border-slate-200 hover:bg-slate-50 transition-all gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </Button>

                {currentStep === 5 ? (
                  <Button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={loading}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-9 text-xs px-5 rounded-xl shadow-md transition-all gap-1.5 flex items-center"
                  >
                    {loading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5 animate-pulse" />
                    )}
                    {id ? "Deploy Update" : "Deploy & Activate"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-9 text-xs px-5 rounded-xl shadow-md transition-all gap-1.5 flex items-center"
                  >
                    Continue <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Right Sidebar: Dynamic summary panel (spans 3 on xl viewports) */}
          <div className="hidden xl:block xl:col-span-3">
            <SummaryPanel
              formData={formData}
              logoPreview={logoPreview}
              documentFile={documentFile}
              logoFile={logoFile}
              supportFile={supportFile}
              renderedAddress={renderedAddress}
              isEdit={!!id}
              orgStatus={organization?.status}
            />
          </div>

        </div>
      </div>

      {/* Confirmation Modal: Aborting Onboarding */}
      {showAbortConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 max-w-md w-full text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="p-3 bg-rose-50 text-rose-500 rounded-full w-fit mx-auto">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-850 text-slate-800 uppercase tracking-wider">Unsaved Changes</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">
                You have active changes in this onboarding process. Aborting now will discard all information and clear the current session.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl font-bold h-10 text-xs border-slate-200"
                onClick={() => setShowAbortConfirm(false)}
              >
                Go Back
              </Button>
              <Button
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold h-10 text-xs shadow-md shadow-rose-500/10"
                onClick={confirmAbortAction}
              >
                Abort & Discard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Summary Panel Component
interface SummaryPanelProps {
  formData: any;
  logoPreview: string;
  documentFile: File | null;
  logoFile: File | null;
  supportFile: File | null;
  renderedAddress: string;
  isEdit: boolean;
  orgStatus?: string;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({
  formData,
  logoPreview,
  documentFile,
  logoFile,
  supportFile,
  renderedAddress,
  isEdit,
  orgStatus
}) => {
  return (
    <Card className="border-none shadow-elegant bg-white rounded-3xl overflow-hidden border border-slate-100/50">
      <div className="h-20 bg-slate-900 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-transparent to-transparent"></div>
      </div>
      <CardContent className="px-5 pb-5 -mt-10 relative z-10 text-center">
        
        {/* Thumbnail logo display */}
        <div className="h-20 w-20 rounded-2xl bg-white p-1 shadow-lg border border-slate-100 mx-auto mb-3 flex items-center justify-center">
          <div className="h-full w-full rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden">
            {logoPreview ? (
              <img src={logoPreview} alt="Preview logo" className="h-full w-full object-contain" />
            ) : (
              <Fingerprint className="h-10 w-10 text-indigo-300 animate-pulse" />
            )}
          </div>
        </div>

        <h2 className="text-sm font-black text-slate-900 truncate mb-1 px-1">
          {formData.instituteName || "New Institution"}
        </h2>
        <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-bold uppercase tracking-widest text-[8px] mb-4 border-none py-0.5">
          {formData.organizationType || "Draft Profile"}
        </Badge>

        {/* Dynamic Details */}
        <div className="space-y-2 text-left border-t border-slate-100 pt-4 text-xs font-semibold">
          
          <div className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl space-y-2">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block leading-none">Onboarding Summary</span>
            
            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 block font-medium">Administrator Email</span>
              <span className="text-[10px] text-slate-700 block truncate">{formData.email || "Not set"}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 block font-medium">Contact Phone</span>
              <span className="text-[10px] text-slate-700 block">{formData.contactNumber || "Not set"}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-slate-400 block font-medium">Registered Address</span>
              <span className="text-[10px] text-slate-700 block leading-tight line-clamp-2">{renderedAddress || "Not set"}</span>
            </div>

            {!isEdit && (
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 block font-medium">Tenant Database</span>
                <span className="text-[10px] text-indigo-700 block truncate font-bold">{formData.TenantDb || "Not set"}</span>
              </div>
            )}
          </div>

          <div className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2 leading-none">Verification Documents</span>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-medium">Certificate:</span>
                <span className="font-bold text-slate-800 max-w-[120px] truncate">
                  {isEdit ? "Lock & Verified" : (documentFile ? documentFile.name : "Pending")}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-medium">Logo Pack:</span>
                <span className="font-bold text-slate-800 max-w-[120px] truncate">
                  {logoFile ? logoFile.name : "Default Theme"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-medium">Supplementary:</span>
                <span className="font-bold text-slate-800 max-w-[120px] truncate">
                  {supportFile ? supportFile.name : "None"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center justify-between">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block leading-none">Audit Status</span>
            <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-none font-bold uppercase tracking-wider text-[8px] py-0.5">
              {isEdit ? (orgStatus || "Active") : "Draft Mode"}
            </Badge>
          </div>

        </div>

      </CardContent>
    </Card>
  );
};

export default OrganizationForm;
