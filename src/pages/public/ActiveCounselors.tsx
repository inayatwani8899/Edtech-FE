import { Loader2 } from "lucide-react";
import { useCounselorStore } from "@/store/counsellorStore";
import { useEffect } from "react";

const dummyCounselors = [
    {
        id: "d1",
        firstName: "Dr. Arvind",
        lastName: "Sharma",
        areaOfSpecialization: "Career Psychometrics",
        highestQualification: "Ph.D in Psychology",
        yearsOfExperience: 12,
        currentOrganization: "Global Education Research",
        professionalBio: "Specializing in cognitive mapping and IRT-based career trajectory analysis for senior secondary students.",
        email: "arvind.sharma@research.org",
        image: "/counselor_1.png"
    },
    {
        id: "d2",
        firstName: "Sarah",
        lastName: "Jenkins",
        areaOfSpecialization: "Mental Wellness",
        highestQualification: "M.Sc Counselling",
        yearsOfExperience: 8,
        currentOrganization: "Student Success Clinic",
        professionalBio: "Focusing on academic stress management and holistic personality development using the Big Five framework.",
        email: "sarah.j@counsel.me",
        image: "/counselor_2.png"
    },
    {
        id: "d3",
        firstName: "Michael",
        lastName: "Chen",
        areaOfSpecialization: "College Admissions",
        highestQualification: "MBA, Ed.D",
        yearsOfExperience: 15,
        currentOrganization: "Ivy Admissions Group",
        professionalBio: "Expert in matching student profiles to international university requirements and scholarship opportunities.",
        email: "m.chen@ivyadmissions.com",
        image: "/counselor_3.png"
    },
    {
        id: "d4",
        firstName: "Dr. Priya",
        lastName: "Nair",
        areaOfSpecialization: "Life Skills & EQ",
        highestQualification: "Ph.D Special Education",
        yearsOfExperience: 18,
        currentOrganization: "National Child Institute",
        professionalBio: "Pioneer in emotional intelligence development and adaptive learning strategies for diverse student needs.",
        email: "p.nair@nci.edu",
        image: "/counselor_4.png"
    },
    {
        id: "d5",
        firstName: "James",
        lastName: "Wilson",
        areaOfSpecialization: "Tech Career Pathing",
        highestQualification: "M.S Computer Science",
        yearsOfExperience: 10,
        currentOrganization: "Silicon Valley Mentors",
        professionalBio: "Specializing in early-stage tech career paths, from coding bootcamps to senior engineering trajectories.",
        email: "james.w@svmentors.com",
        image: "/counselor_5.png"
    },
    {
        id: "d6",
        firstName: "Linda",
        lastName: "Thompson",
        areaOfSpecialization: "Policy & Advocacy",
        highestQualification: "LLM, Education Policy",
        yearsOfExperience: 22,
        currentOrganization: "Global Ed Council",
        professionalBio: "Senior advisor for educational policy and student rights advocacy, helping families navigate complex systems.",
        email: "l.thompson@edcouncil.int",
        image: "/counselor_6.png"
    }
];

const ActiveCounselors = () => {
    const { counselors, fetchCounselors, loading } = useCounselorStore();

    useEffect(() => {
        // Suppress API call for guests to avoid the global "Unauthorized" popup from axios interceptor
        const token = localStorage.getItem("auth_token");
        if (token) {
            fetchCounselors().catch(() => console.log("Fetch failed, using dummy fallback"));
        } else {
            console.log("Guest mode: Using dummy counselor data");
        }
    }, [fetchCounselors]);

    const handleStartChat = (counsellorId: string) => {
        const chatUrl = `/chat/${counsellorId}`;
        window.open(chatUrl, "_blank", "width=400,height=700,resizable=yes,scrollbars=yes");
    };

    // Combine real counselors with dummy ones to ensure a rich list
    const dispCounselors = counselors && counselors.length > 0 ? counselors : dummyCounselors;

    return (
        <div className="counselors-page" style={{ paddingTop: '1px', paddingBottom: '2px' }}>
            <section className="hero-section" style={{ paddingBottom: '30px' }}>
                <div className="hero-content">
                    <div className="section-eyebrow">Expert Guidance</div>
                    <h1 className="hero-h1">Professional <span>Counselors</span> <br />at your service.</h1>
                    <p className="hero-sub max-w-lg mx-auto">
                        Connect with certified experts who can help you navigate your results
                        and plan your professional future with confidence.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dispCounselors.map((c: any) => (
                        <div
                            key={c.id}
                            className="group bg-white border border-gray-100 rounded-[2.5rem] p-8 flex flex-col justify-between transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-indigo-500/20 duration-300"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    {c.image ? (
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-50 shadow-inner">
                                            <img src={c.image} alt={c.firstName} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-black text-xl">
                                            {c.firstName.charAt(0)}{c.lastName.charAt(0)}
                                        </div>
                                    )}
                                    {loading && <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />}
                                </div>
                                <h2 className="text-xl font-bold text-black mb-1">{c.firstName} {c.lastName}</h2>
                                <p className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-4">{c.areaOfSpecialization}</p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="font-bold text-gray-400 uppercase text-[9px] tracking-wider w-20">Qualification</span>
                                        <span className="text-gray-700 font-medium truncate">{c.highestQualification}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="font-bold text-gray-400 uppercase text-[9px] tracking-wider w-20">Experience</span>
                                        <span className="text-gray-700 font-medium">{c.yearsOfExperience} yrs</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="font-bold text-gray-400 uppercase text-[9px] tracking-wider w-20">Org</span>
                                        <span className="text-gray-700 font-medium truncate">{c.currentOrganization}</span>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 leading-relaxed italic mb-8 h-20 overflow-hidden line-clamp-3">
                                    {c.professionalBio}
                                </p>
                            </div>

                            <div className="mt-auto">
                                <button
                                    onClick={() => handleStartChat(c.id)}
                                    className="w-full bg-black text-white py-4 rounded-2xl font-bold text-sm hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300"
                                >
                                    Consult Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActiveCounselors;
