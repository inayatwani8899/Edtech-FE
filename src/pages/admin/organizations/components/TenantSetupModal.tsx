import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useOrganizationStore, Organization } from "@/store/organizationStore";
import api from "@/api/axios";
import {
  Loader2,
  Server,
  Database,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Mail,
  ExternalLink,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface TenantSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization | null;
}

export const TenantSetupModal: React.FC<TenantSetupModalProps> = ({
  open,
  onOpenChange,
  organization,
}) => {
  const { testDbConnection, setupDatabase, syncPrimaryData } = useOrganizationStore();
  
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Connection Form State
  const [serverHost, setServerHost] = useState("");
  const [serverPort, setServerPort] = useState(5432);
  const [databaseName, setDatabaseName] = useState("");
  const [dbUsername, setDbUsername] = useState("");
  const [dbPassword, setDbPassword] = useState("");
  const [directStudentAllow, setDirectStudentAllow] = useState<boolean>(true);
  
  // Connection Test Status
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "available" | "connected" | "failed" | "invalid">("idle");
  const [connectionError, setConnectionError] = useState("");

  // Setup DB Progress
  const [setupLogs, setSetupLogs] = useState<string[]>([]);
  const [setupStatus, setSetupStatus] = useState<"idle" | "running" | "success" | "failed">("idle");

  // Sync Progress
  const [syncStatus, setSyncStatus] = useState<"idle" | "running" | "success" | "failed">("idle");
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  // Dynamic API state
  interface GradeItem {
    id: number;
    name: string;
    description?: string;
  }

  interface RoleItem {
    id: number;
    name: string;
  }

  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loadingGrades, setLoadingGrades] = useState<boolean>(false);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(false);
  const [gradesSearch, setGradesSearch] = useState<string>("");
  const [rolesSearch, setRolesSearch] = useState<string>("");
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  useEffect(() => {
    if (organization) {
      // Pre-fill default server information
      setServerHost(localStorage.getItem("last_server_host") || "localhost");
      setServerPort(Number(localStorage.getItem("last_server_port")) || 5432);
      
      // Auto-compute DB name: sanitize institute name to alphanumeric
      const slug = organization.instituteName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/^_+|_+$/g, "");
      setDatabaseName(organization.tenantDb || organization.tenantDatabase || `edtech_${slug}`);
      
      setDbUsername(localStorage.getItem("last_db_user") || "postgres");
      setDbPassword("");
      
      // Reset onboarding wizard states
      setStep(1);
      setConnectionStatus("idle");
      setConnectionError("");
      setSetupLogs([]);
      setSetupStatus("idle");
      setSyncStatus("idle");
      setSyncLogs([]);
      setDirectStudentAllow(true);
      setGradesSearch("");
      setRolesSearch("");
      setSelectedGrades([]);
      setSelectedRoles([]);
    }
  }, [organization, open]);

  useEffect(() => {
    if (open) {
      const fetchGradesAndRoles = async () => {
        setLoadingGrades(true);
        setLoadingRoles(true);
        try {
          const orgBaseUrl = import.meta.env.VITE_ORG_API_BASE_URL || "https://nervous-dubinsky.180-179-213-167.plesk.page/api/";
          
          // Fetch Grades
          const gradesRes = await api.get(`${orgBaseUrl}Grade/all`);
          if (gradesRes.data?.success && Array.isArray(gradesRes.data.data)) {
            const gradesData = gradesRes.data.data;
            setGrades(gradesData);
            setSelectedGrades(gradesData.map((g: any) => g.id));
          }
          
          // Fetch Roles
          const rolesRes = await api.get(`${orgBaseUrl}Role`);
          if (rolesRes.data?.success && Array.isArray(rolesRes.data.data)) {
            const rolesData = rolesRes.data.data;
            setRoles(rolesData);
            setSelectedRoles(rolesData.map((r: any) => r.id));
          }
        } catch (error) {
          console.error("Error fetching grades or roles:", error);
          toast.error("Failed to load onboarding grades or roles.");
        } finally {
          setLoadingGrades(false);
          setLoadingRoles(false);
        }
      };
      
      fetchGradesAndRoles();
    }
  }, [open]);

  if (!organization) return null;

  const handleTestConnection = async () => {
    if (!serverHost || !databaseName || !dbUsername) {
      toast.error("Please fill in host, database name, and username");
      return;
    }
    
    setConnectionStatus("testing");
    setConnectionError("");
    
    try {
      const payload = {
        serverHost,
        serverPort,
        databaseName,
        dbUsername,
        dbPassword,
      };
      
      await testDbConnection(payload);
      setConnectionStatus("available");
      toast.success("Database configuration verified! Ready for provisioning.");
      
      // Cache server parameters for convenience
      localStorage.setItem("last_server_host", serverHost);
      localStorage.setItem("last_server_port", String(serverPort));
      localStorage.setItem("last_db_user", dbUsername);
      
    } catch (err: any) {
      setConnectionStatus("failed");
      setConnectionError(err.response?.data?.message || err.message || "Failed to establish a verification handshake.");
      toast.error("Handshake connection failed.");
    }
  };

  const handleSetupDatabase = async () => {
    setSetupStatus("running");
    setSetupLogs(["Initializing database orchestration...", "Connecting to primary server host...", "Creating SQL catalog schema..."]);
    
    try {
      const payload = {
        serverHost,
        serverPort,
        databaseName,
        dbUsername,
        dbPassword,
        directStudentAllow,
      };
      
      await setupDatabase(String(organization.id), payload);
      
      setSetupLogs(prev => [...prev, "Schema definition synchronized.", "Seed tables migrated successfully.", "Onboarding database complete!"]);
      setSetupStatus("success");
      toast.success("Tenant Database setup completed successfully!");
      
      // Auto move to step 3 after a small delay
      setTimeout(() => setStep(3), 1500);
    } catch (err: any) {
      setSetupStatus("failed");
      setSetupLogs(prev => [...prev, `CRITICAL ERROR: ${err.response?.data?.message || err.message || "Database deployment rejected"}`]);
      toast.error("Database initialization failed.");
    }
  };

  const handleSyncData = async () => {
    if (selectedGrades.length === 0) {
      toast.error("Please select at least one Grade.");
      return;
    }
    if (selectedRoles.length === 0) {
      toast.error("Please select at least one Role.");
      return;
    }

    setSyncStatus("running");
    setSyncLogs(["Starting primary sync...", "Analyzing Grade tables to clone...", "Replicating permission schemas..."]);
    
    try {
      const syncPayload = {
        gradeIds: selectedGrades,
        roleIds: selectedRoles
      };
      
      await syncPrimaryData(String(organization.id), syncPayload);
      
      setSyncLogs(prev => [...prev, "Grades metadata copied.", "Roles hierarchy and authorizations duplicated.", "Sync completed successfully!", "Automated onboarding email dispatched to administrator."]);
      setSyncStatus("success");
      toast.success("Primary data synced successfully.");
    } catch (err: any) {
      setSyncStatus("failed");
      setSyncLogs(prev => [...prev, `SYNC FAILURE: ${err.response?.data?.message || err.message || "Catalog replication aborted."}`]);
      toast.error("Data synchronization failed.");
    }
  };

  const getTenantSlug = () => {
    return organization.instituteName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  };

  const tenantSlug = getTenantSlug();
  const tenantUrl = `https://edtech.pathgrad.com/login/${tenantSlug}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border-none shadow-2xl rounded-[2rem] overflow-hidden p-0 gap-0">
        
        {/* Header Section */}
        <div className="bg-slate-900 text-white p-6 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-15"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
          
          <DialogHeader className="relative z-10 text-left">
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Onboarding Sync Protocol</span>
            <DialogTitle className="text-xl font-black uppercase tracking-tight text-white mt-1">
              Multi-Tenant Configurator
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs mt-1">
              Connect server node, deploy isolated tenant schema, and replicate primary parameters for {organization.instituteName}.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Stepper bar */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 px-6 py-3 justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
          <div className={`flex items-center gap-1.5 ${step === 1 ? "text-indigo-600" : "text-slate-500"}`}>
            <span className={`h-5 w-5 rounded-full flex items-center justify-center border text-[9px] ${step === 1 ? "bg-indigo-50 border-indigo-600 font-bold" : "bg-white"}`}>1</span>
            <span>Server Handshake</span>
          </div>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <div className={`flex items-center gap-1.5 ${step === 2 ? "text-indigo-600" : "text-slate-500"}`}>
            <span className={`h-5 w-5 rounded-full flex items-center justify-center border text-[9px] ${step === 2 ? "bg-indigo-50 border-indigo-600 font-bold" : "bg-white"}`}>2</span>
            <span>Database Setup</span>
          </div>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <div className={`flex items-center gap-1.5 ${step === 3 ? "text-indigo-600" : "text-slate-500"}`}>
            <span className={`h-5 w-5 rounded-full flex items-center justify-center border text-[9px] ${step === 3 ? "bg-indigo-50 border-indigo-600 font-bold" : "bg-white"}`}>3</span>
            <span>Synchronize Sync</span>
          </div>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto text-left">
          
          {/* STEP 1: Handshake */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Database Host</Label>
                  <Input 
                    value={serverHost}
                    onChange={(e) => {
                      setServerHost(e.target.value);
                      setConnectionStatus("idle");
                    }}
                    placeholder="e.g. localhost or database.cluster"
                    className="h-10 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Port</Label>
                  <Input 
                    type="number"
                    value={serverPort}
                    onChange={(e) => {
                      setServerPort(Number(e.target.value));
                      setConnectionStatus("idle");
                    }}
                    className="h-10 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tenant Database Name</Label>
                  <Input 
                    value={databaseName}
                    onChange={(e) => {
                      setDatabaseName(e.target.value);
                      setConnectionStatus("idle");
                    }}
                    placeholder="e.g. edtech_tenant"
                    className="h-10 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Database Username</Label>
                  <Input 
                    value={dbUsername}
                    onChange={(e) => {
                      setDbUsername(e.target.value);
                      setConnectionStatus("idle");
                    }}
                    placeholder="postgres"
                    className="h-10 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Password</Label>
                  <Input 
                    type="password"
                    value={dbPassword}
                    onChange={(e) => {
                      setDbPassword(e.target.value);
                      setConnectionStatus("idle");
                    }}
                    placeholder="••••••••"
                    className="h-10 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Status Alert Banner */}
              {connectionStatus !== "idle" && (
                <div className="mt-4">
                  {connectionStatus === "testing" && (
                    <Alert className="bg-blue-50 border-blue-100 text-blue-800 rounded-xl flex items-center py-2.5">
                      <Loader2 className="h-4 w-4 text-blue-600 animate-spin mr-3" />
                      <AlertDescription className="text-xs font-semibold">Testing credentials with database server...</AlertDescription>
                    </Alert>
                  )}

                  {connectionStatus === "failed" && (
                    <Alert className="bg-rose-50 border-rose-100 text-rose-800 rounded-xl py-2.5">
                      <div className="flex items-start">
                        <XCircle className="h-4 w-4 text-rose-600 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs font-black">Connection failed</p>
                          <p className="text-[10px] text-rose-600/80 font-medium mt-0.5">{connectionError}</p>
                        </div>
                      </div>
                    </Alert>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-slate-100 mt-6 gap-2">
                <Button 
                  onClick={handleTestConnection}
                  disabled={connectionStatus === "testing"}
                  className="h-9 px-5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider"
                >
                  {connectionStatus === "testing" ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Server className="h-3 w-3 mr-2" />}
                  Test Connection
                </Button>
                <Button 
                  onClick={() => setStep(2)}
                  disabled={connectionStatus !== "available"}
                  className="h-9 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider gap-1.5"
                >
                  Next Step <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Database Setup */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-slate-900/5 border border-slate-100 p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Provision Isolated Tenant Schema</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Database: {databaseName}</p>
                  </div>
                </div>

                <Button
                  onClick={handleSetupDatabase}
                  disabled={setupStatus === "running" || setupStatus === "success"}
                  className="h-9 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider"
                >
                  {setupStatus === "running" ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <Play className="h-3.5 w-3.5 mr-2 text-indigo-400" />}
                  Setup Database
                </Button>
              </div>

              {/* Direct Student Access Toggle Setting */}
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-tight">Enable Direct Student Registration</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">Allow students to directly register online under this tenant</span>
                </div>
                <Switch
                  checked={directStudentAllow}
                  onCheckedChange={setDirectStudentAllow}
                  disabled={setupStatus === "running" || setupStatus === "success"}
                  className="data-[state=checked]:bg-indigo-600"
                />
              </div>

              {/* Status Alert Banner */}
              {setupStatus === "failed" && (
                <Alert className="bg-rose-50 border-rose-100 text-rose-800 rounded-xl py-2.5">
                  <div className="flex items-start">
                    <XCircle className="h-4 w-4 text-rose-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs font-black">Database Setup Failed</p>
                      <p className="text-[10px] text-rose-600/80 font-medium mt-0.5">
                        {useOrganizationStore.getState().error || "An error occurred during database initialization."}
                      </p>
                    </div>
                  </div>
                </Alert>
              )}

              {/* Log View console */}
              {setupLogs.length > 0 && (
                <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-[10px] space-y-1.5 shadow-inner min-h-[140px] max-h-[200px] overflow-y-auto">
                  {setupLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-slate-600 select-none">[{idx + 1}]</span>
                      <span className={log.startsWith("CRITICAL") ? "text-rose-400" : "text-emerald-400"}>{log}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-slate-100 mt-6">
                <Button 
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="h-9 px-4 border-slate-200 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-wider gap-1.5"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Back
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={setupStatus !== "success"}
                  className="h-9 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider gap-1.5"
                >
                  Next Step <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Sync & Activate */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Grades checklist */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col h-[280px]">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Grades</Label>
                      <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 text-[9px] font-bold py-0 px-1.5 h-4 border border-indigo-100">
                        {selectedGrades.length} Selected
                      </Badge>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedGrades.length === grades.length) {
                          setSelectedGrades([]);
                        } else {
                          setSelectedGrades(grades.map(g => g.id));
                        }
                      }}
                      className="text-[9px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider transition-colors"
                    >
                      {selectedGrades.length === grades.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  
                  <div className="mb-2">
                    <Input
                      type="text"
                      placeholder="Search grades..."
                      value={gradesSearch}
                      onChange={(e) => setGradesSearch(e.target.value)}
                      className="h-8 bg-white border-slate-200 focus:bg-white rounded-lg text-[11px]"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-left">
                    {loadingGrades ? (
                      <div className="flex items-center justify-center h-full text-[11px] text-slate-400 font-medium">
                        <Loader2 className="h-4 w-4 animate-spin mr-2 text-indigo-500" /> Loading grades...
                      </div>
                    ) : grades.filter(g =>
                      g.name.toLowerCase().includes(gradesSearch.toLowerCase()) ||
                      (g.description || "").toLowerCase().includes(gradesSearch.toLowerCase())
                    ).length === 0 ? (
                      <div className="flex items-center justify-center h-full text-[11px] text-slate-400 font-medium">
                        No grades found
                      </div>
                    ) : (
                      grades.filter(g =>
                        g.name.toLowerCase().includes(gradesSearch.toLowerCase()) ||
                        (g.description || "").toLowerCase().includes(gradesSearch.toLowerCase())
                      ).map(g => {
                        const isChecked = selectedGrades.includes(g.id);
                        return (
                          <label
                            key={g.id}
                            className={`flex items-center gap-2.5 p-2 bg-white rounded-xl border cursor-pointer text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all ${
                              isChecked ? "border-indigo-200 bg-indigo-50/20" : "border-slate-200"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedGrades([...selectedGrades, g.id]);
                                } else {
                                  setSelectedGrades(selectedGrades.filter(id => id !== g.id));
                                }
                              }}
                              className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 accent-indigo-600 focus:ring-indigo-500/20"
                            />
                            <div className="flex flex-col text-left">
                              <span>{g.name}</span>
                              {g.description && (
                                <span className="text-[9px] font-medium text-slate-400 leading-tight">{g.description}</span>
                              )}
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Roles Checklist */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col h-[280px]">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Roles</Label>
                      <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 text-[9px] font-bold py-0 px-1.5 h-4 border border-indigo-100">
                        {selectedRoles.length} Selected
                      </Badge>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedRoles.length === roles.length) {
                          setSelectedRoles([]);
                        } else {
                          setSelectedRoles(roles.map(r => r.id));
                        }
                      }}
                      className="text-[9px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider transition-colors"
                    >
                      {selectedRoles.length === roles.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  
                  <div className="mb-2">
                    <Input
                      type="text"
                      placeholder="Search roles..."
                      value={rolesSearch}
                      onChange={(e) => setRolesSearch(e.target.value)}
                      className="h-8 bg-white border-slate-200 focus:bg-white rounded-lg text-[11px]"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-left">
                    {loadingRoles ? (
                      <div className="flex items-center justify-center h-full text-[11px] text-slate-400 font-medium">
                        <Loader2 className="h-4 w-4 animate-spin mr-2 text-indigo-500" /> Loading roles...
                      </div>
                    ) : roles.filter(r =>
                      r.name.toLowerCase().includes(rolesSearch.toLowerCase())
                    ).length === 0 ? (
                      <div className="flex items-center justify-center h-full text-[11px] text-slate-400 font-medium">
                        No roles found
                      </div>
                    ) : (
                      roles.filter(r =>
                        r.name.toLowerCase().includes(rolesSearch.toLowerCase())
                      ).map(r => {
                        const isChecked = selectedRoles.includes(r.id);
                        return (
                          <label
                            key={r.id}
                            className={`flex items-center gap-2.5 p-2 bg-white rounded-xl border cursor-pointer text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all ${
                              isChecked ? "border-indigo-200 bg-indigo-50/20" : "border-slate-200"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRoles([...selectedRoles, r.id]);
                                } else {
                                  setSelectedRoles(selectedRoles.filter(id => id !== r.id));
                                }
                              }}
                              className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 accent-indigo-600 focus:ring-indigo-500/20"
                            />
                            <div className="flex flex-col text-left">
                              <span>{r.name}</span>
                            </div>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Sync Action */}
              <div className="bg-slate-900/5 border border-slate-100 p-5 rounded-2xl flex items-center justify-between mt-4">
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Primary Parameters Replication</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Clones grades, configurations, & templates</p>
                </div>
                <Button
                  onClick={handleSyncData}
                  disabled={syncStatus === "running" || syncStatus === "success"}
                  className="h-9 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider"
                >
                  {syncStatus === "running" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                      Syncing Tenant Data...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 mr-2" />
                      Sync Master Data
                    </>
                  )}
                </Button>
              </div>

              {/* Status Alert Banner */}
              {syncStatus === "failed" && (
                <Alert className="bg-rose-50 border-rose-100 text-rose-800 rounded-xl py-2.5">
                  <div className="flex items-start">
                    <XCircle className="h-4 w-4 text-rose-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs font-black">Synchronization Failed</p>
                      <p className="text-[10px] text-rose-600/80 font-medium mt-0.5">
                        {useOrganizationStore.getState().error || "Failed to clone primary grades/roles metadata."}
                      </p>
                    </div>
                  </div>
                </Alert>
              )}

              {/* Logs */}
              {syncLogs.length > 0 && (
                <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-[10px] space-y-1.5 shadow-inner min-h-[120px] max-h-[180px] overflow-y-auto">
                  {syncLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-slate-600 select-none">[{idx + 1}]</span>
                      <span className={log.startsWith("SYNC FAILURE") ? "text-rose-400" : "text-emerald-400"}>{log}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tenant Access Panel */}
              {syncStatus === "success" && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl space-y-3.5 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <div>
                      <h4 className="text-xs font-black text-emerald-800 uppercase tracking-tight">Onboarding Fully Verified</h4>
                      <p className="text-[9px] font-bold text-emerald-700/80 uppercase">Registration, deployment & sync completed</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Isolated Login Address</span>
                      <a href={tenantUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-600 hover:underline flex items-center gap-1.5 mt-0.5">
                        {tenantUrl} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <Badge className="bg-emerald-500 text-white border-none font-bold uppercase text-[9px] tracking-wider">Active</Badge>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-slate-100 mt-6">
                <Button 
                  variant="outline"
                  onClick={() => setStep(2)}
                  disabled={syncStatus === "running"}
                  className="h-9 px-4 border-slate-200 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-wider gap-1.5"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Back
                </Button>
                {syncStatus === "success" ? (
                  <Button 
                    onClick={() => onOpenChange(false)}
                    className="h-9 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider"
                  >
                    Finish Onboarding
                  </Button>
                ) : syncStatus === "failed" ? (
                  <Button 
                    onClick={handleSyncData}
                    className="h-9 px-5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider gap-1.5 animate-pulse"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Retry Sync
                  </Button>
                ) : null}
              </div>
            </div>
          )}

        </div>

      </DialogContent>
    </Dialog>
  );
};
