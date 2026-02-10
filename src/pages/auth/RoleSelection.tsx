import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Building, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export const RoleSelection = () => {
  const { setTestId } = useAuthStore();
  const [searchParams] = useSearchParams();

  // Get testId from URL search params
  const urlTestId = searchParams.get('testId');

  useEffect(() => {
    // Set testId in store when component mounts or URL changes
    if (urlTestId) {
      setTestId(urlTestId);
    }
  }, [urlTestId, setTestId]);

  const roles = [
    {
      id: "student",
      title: "Student",
      description: "For learners seeking self-assessment.",
      icon: GraduationCap,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
      accentColor: "text-blue-600",
      features: ["Personal assessment", "Career guidance", "Skill dev"],
    },
    {
      id: "counsellor",
      title: "Counselor",
      description: "For pros managing student assessments.",
      icon: Users,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
      accentColor: "text-emerald-600",
      features: ["Student mgmt", "Assessment oversight", "Tracking"],
    },
    {
      id: "school",
      title: "Organization",
      description: "For institutions managing multiple users.",
      icon: Building,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
      accentColor: "text-purple-600",
      features: ["Multi-user mgmt", "Analytics", "Bulk actions"],
    },
  ];

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden flex flex-col items-center justify-center">

      {/* Subtle Decorative elements - toned down for cleanliness */}
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-300 to-cyan-300 opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-300 to-pink-300 opacity-10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10 flex flex-col h-full justify-center">

        {/* Header - Compact */}
        <div className="text-center mb-6 lg:mb-10 pt-4">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome to PathGrad
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Select your role to begin your journey.
          </p>
        </div>

        {/* Role Cards - Grid optimized for screen width */}
        <div className="grid md:grid-cols-3 gap-4 lg:gap-6 w-full max-w-5xl mx-auto mb-6 lg:mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                className="group relative cursor-pointer border border-white/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden flex flex-col"
              >
                {/* Hover Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <CardHeader className="text-center pb-2 pt-6 relative z-10 space-y-2">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className={`text-lg font-bold ${role.accentColor}`}>{role.title}</CardTitle>
                    <CardDescription className="text-xs md:text-sm text-slate-500 line-clamp-2 mt-1">
                      {role.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 relative z-10 px-4 pb-6 flex-1 flex flex-col justify-end">
                  <ul className="space-y-2 hidden lg:block">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-xs text-slate-600 dark:text-slate-300 font-medium justify-center">
                        <div className={`w-1.5 h-1.5 bg-gradient-to-r ${role.gradient} rounded-full mr-2`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full h-9 text-sm rounded-lg font-medium shadow-md transition-all duration-300 bg-gradient-to-r ${role.gradient} text-white hover:opacity-90`}
                  >
                    <Link to={`/register/${role.id}`}>
                      Select {role.title}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Link - Minimal */}
        <div className="text-center pb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/10 transition-colors duration-300"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;






// import { Link, useSearchParams } from "react-router-dom";
// import { GraduationCap, Users, Building, ArrowLeft, ChevronRight } from "lucide-react";
// import { useAuthStore } from "@/store/useAuthStore";
// import { useEffect } from "react";
// import { Button } from "@/components/ui/button";

// export const RoleSelection = () => {
//   const { setTestId } = useAuthStore();
//   const [searchParams] = useSearchParams();
//   const urlTestId = searchParams.get("testId");

//   useEffect(() => {
//     if (urlTestId) setTestId(urlTestId);
//   }, [urlTestId, setTestId]);

//   const roles = [
//     {
//       id: "student",
//       title: "Student",
//       subtitle: "Personal Growth",
//       description: "Self-assessment & career guidance.",
//       icon: GraduationCap,
//       color: "bg-blue-500",
//       text: "text-blue-600",
//       border: "group-hover:border-blue-500/50",
//       glow: "group-hover:shadow-blue-500/20",
//       lightBg: "bg-blue-50",
//       tags: ["Assessment", "Career", "Skills"],
//     },
//     {
//       id: "counsellor",
//       title: "Counselor",
//       subtitle: "Management Pro",
//       description: "Manage students & track progress.",
//       icon: Users,
//       color: "bg-emerald-500",
//       text: "text-emerald-600",
//       border: "group-hover:border-emerald-500/50",
//       glow: "group-hover:shadow-emerald-500/20",
//       lightBg: "bg-emerald-50",
//       tags: ["Oversight", "Tracking", "Review"],
//     },
//     {
//       id: "school",
//       title: "Organization",
//       subtitle: "Enterprise",
//       description: "Institutional analytics & bulk actions.",
//       icon: Building,
//       color: "bg-purple-500",
//       text: "text-purple-600",
//       border: "group-hover:border-purple-500/50",
//       glow: "group-hover:shadow-purple-500/20",
//       lightBg: "bg-purple-50",
//       tags: ["Analytics", "Admin", "Bulk"],
//     },
//   ];

//   return (
//     <div className="h-screen w-full bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 overflow-hidden flex flex-col items-center justify-center relative font-sans selection:bg-zinc-200">

//       {/* 1. Background Grid Pattern (CSS-in-JS simulation) */}
//       <div className="absolute inset-0 z-0 opacity-[0.4]"
//         style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
//       </div>

//       {/* 2. Ambient Glows */}
//       <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
//       <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-[100px] pointer-events-none" />

//       {/* 3. Main Bento Container */}
//       <main className="relative z-10 w-full max-w-6xl px-6 h-full max-h-[90vh] flex flex-col">

//         {/* Header Section */}
//         <header className="flex-none mb-8 text-center space-y-2">
//           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-2">
//             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//             <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Select Profile</span>
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
//             PathGrad<span className="text-zinc-400">.</span>
//           </h1>
//           <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
//             Choose how you want to interact with the platform.
//           </p>
//         </header>

//         {/* The Grid */}
//         <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 min-h-0">
//           {roles.map((role) => {
//             const Icon = role.icon;
//             return (
//               <Link
//                 key={role.id}
//                 to={`/register/${role.id}`}
//                 className={`group relative flex flex-col justify-between p-6 h-full
//                   bg-white dark:bg-zinc-900 
//                   rounded-[2rem] 
//                   border border-zinc-200 dark:border-zinc-800 
//                   transition-all duration-300 ease-out
//                   hover:-translate-y-1 hover:shadow-xl ${role.border} ${role.glow}
//                 `}
//               >
//                 {/* Large Faded Icon (Artistic Background) */}
//                 <Icon className={`absolute -right-4 -bottom-4 w-40 h-40 opacity-5 dark:opacity-[0.02] -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-0 ${role.text}`} />

//                 {/* Top: Icon & Title */}
//                 <div className="relative z-10">
//                   <div className={`w-12 h-12 rounded-2xl ${role.lightBg} dark:bg-zinc-800 flex items-center justify-center mb-4 transition-colors duration-300 group-hover:scale-110`}>
//                     <Icon className={`w-6 h-6 ${role.text}`} />
//                   </div>

//                   <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-1">
//                     {role.title}
//                   </h3>
//                   <p className={`text-xs font-medium ${role.text} uppercase tracking-wider mb-2 opacity-80`}>
//                     {role.subtitle}
//                   </p>
//                   <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
//                     {role.description}
//                   </p>
//                 </div>

//                 {/* Bottom: Tags & Action */}
//                 <div className="relative z-10 pt-6 mt-auto">
//                   {/* Tags as Pills */}
//                   <div className="flex flex-wrap gap-2 mb-6">
//                     {role.tags.map((tag, i) => (
//                       <span key={i} className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-md">
//                         {tag}
//                       </span>
//                     ))}
//                   </div>

//                   {/* Pseudo Button */}
//                   <div className="w-full py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 group-hover:bg-zinc-900 dark:group-hover:bg-zinc-100 group-hover:text-white dark:group-hover:text-black transition-colors duration-300 flex items-center justify-center gap-2 font-semibold text-sm">
//                     Get Started <ChevronRight className="w-4 h-4" />
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>

//         {/* Footer */}
//         <footer className="flex-none mt-6 text-center pb-4">
//           <Link
//             to="/"
//             className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm font-medium inline-flex items-center gap-2"
//           >
//             <ArrowLeft className="w-4 h-4" /> Back to Home
//           </Link>
//         </footer>

//       </main>
//     </div>
//   );
// };

// export default RoleSelection;