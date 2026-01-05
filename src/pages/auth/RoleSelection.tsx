// import { useNavigate } from "react-router-dom";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { GraduationCap, Users, School } from "lucide-react";

// const RoleSelection = () => {
//   const navigate = useNavigate();

//   const roles = [
//     {
//       id: "student",
//       title: "I'm a Student",
//       description: "Looking to learn and grow with guidance from counsellors",
//       icon: GraduationCap,
//       path: "/register/student",
//       gradient: "bg-gradient-primary",
//       color: "student"
//     },
//     {
//       id: "counsellor", 
//       title: "I'm a Counsellor",
//       description: "Ready to guide and support students in their journey",
//       icon: Users,
//       path: "/register/counsellor",
//       gradient: "bg-gradient-secondary",
//       color: "counsellor"
//     },
//     {
//       id: "school",
//       title: "I represent a School",
//       description: "Managing institutional programs and student relations",
//       icon: School,
//       path: "/register/school", 
//       gradient: "bg-gradient-accent",
//       color: "school"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-16">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-foreground mb-4">
//             Welcome to PathGrad
//           </h1>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           {roles.map((role) => {
//             const IconComponent = role.icon;
//             return (
//               <Card
//                 key={role.id}
//                 className="group cursor-pointer border-0 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2"
//                 onClick={() => navigate(role.path)}
//               >
//                 <CardContent className="p-8 text-center">
//                   <div className={`${role.gradient} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
//                     <IconComponent className="w-10 h-10 text-white" />
//                   </div>

//                   <h3 className="text-2xl font-semibold text-foreground mb-4">
//                     {role.title}
//                   </h3>

//                   <p className="text-muted-foreground mb-8 leading-relaxed">
//                     {role.description}
//                   </p>

//                   <Button 
//                     className={`w-full bg-${role.color} hover:bg-${role.color}/90 text-${role.color}-foreground font-medium py-3 transition-all duration-300`}
//                     size="lg"
//                   >
//                     Get Started
//                   </Button>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         <div className="text-center mt-16">
//           <p className="text-muted-foreground">
//             Already have an account?{" "}
//             <Button variant="link" className="p-0 text-primary hover:underline">
//               Sign in here
//             </Button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoleSelection;
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, GraduationCap, Users, Building } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export const RoleSelection = () => {
  const { testId,setTestId } = useAuthStore();
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
      description: "Individual learner seeking self-assessment and personal development",
      icon: GraduationCap,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      features: ["Personal assessment", "Career guidance", "Skill development"],
    },
    {
      id: "counsellor",
      title: "Counselor",
      description: "Educational professional guiding students and managing assessments",
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      features: ["Student management", "Assessment oversight", "Progress tracking"],
    },
    {
      id: "school",
      title: "School/Organization",
      description: "Educational institution or organization managing multiple users",
      icon: Building,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      features: ["Multi-user management", "Institutional analytics", "Bulk assessments"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to PathGrad
          </h1>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card key={role.id} className="group cursor-pointer border-0 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full ${role.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`h-8 w-8 ${role.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                  <CardDescription className="text-base">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full mt-6" size="lg">
                    <Link to={`/register/${role.id}`}>
                      Get Started as {role.title}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link to="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
export default RoleSelection;