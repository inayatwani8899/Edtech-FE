import { Loader2 } from "lucide-react";
import { useCounselorStore } from "@/store/counsellorStore";
import { useEffect } from "react";

const ActiveCounselors = () => {
    const { counselors, fetchCounselors, loading } = useCounselorStore();
    useEffect(() => {
        fetchCounselors();
    }, [fetchCounselors])
    if (!counselors || counselors.length === 0) {
        return <p className="text-center py-6 text-gray-500">No counselors available.</p>;
    }

    const handleStartChat = (counsellorId: string) => {
        const chatUrl = `/chat/${counsellorId}`;
        window.open(chatUrl, "_blank", "width=400,height=700,resizable=yes,scrollbars=yes");
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
            {counselors.map((c) => (
                <div
                    key={c.id}
                    className="bg-white/80 backdrop-blur-md shadow-lg rounded-3xl p-6 flex flex-col justify-between transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300"
                >
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl font-bold text-gray-800">{c.firstName} {c.lastName}</h2>
                            {loading && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
                        </div>
                        <p className="text-sm font-medium text-blue-600 mb-2">{c.areaOfSpecialization}</p>
                        <p className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold">Qualification:</span> {c.highestQualification}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold">Experience:</span> {c.yearsOfExperience} yrs
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold">Organization:</span> {c.currentOrganization}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                            <span className="font-semibold">License:</span> {c.licenseNumber}
                        </p>
                        <p className="text-sm text-gray-700">{c.professionalBio}</p>
                    </div>

                    <div className="mt-5 flex flex-col gap-3">
                        <p className="text-sm text-gray-500">{c.email}</p>
                        <button
                            onClick={() => handleStartChat(c.id)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                        >
                            Start Chatting
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActiveCounselors;
