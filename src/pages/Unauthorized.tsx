import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleGoBack = () => {
    let redirectPath = "/student/dashboard";
    const role = user?.role as string | undefined;
    if (role === "Admin" || role === "SuperAdmin") {
      redirectPath = "/dashboard";
    } else if (role === "School" || role === "Organization" || role === "OrganizationAdmin") {
      redirectPath = "/school/dashboard";
    } else if (role?.toLowerCase().includes("counselor") || role?.toLowerCase().includes("counsellor")) {
      redirectPath = "/counselor/dashboard";
    }
    navigate(redirectPath);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden px-4">
      {/* Backdrop elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-rose-50/80 to-transparent pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-rose-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xl shadow-elegant rounded-3xl p-8 text-center space-y-6">
          
          {/* Animated Warning Icon */}
          <div className="mx-auto h-20 w-20 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-rose-500/10 blur-xl rounded-full group-hover:scale-125 transition-transform duration-500" />
            <ShieldAlert className="h-10 w-10 text-rose-500 relative z-10 animate-bounce" />
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
              Access <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-600">Denied</span>
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              Your security profile lacks the clearance (canView) required to access this resource. Please contact your system administrator.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleGoBack}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider h-11 rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              Return to Dashboard
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full border-slate-200 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider h-11 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
