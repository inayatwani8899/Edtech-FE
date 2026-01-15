import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useStudentProfileStore } from "../../store/studentProfileStore";
import { useAuthStore } from "../../store/useAuthStore";
import { Calendar, Mail, Phone, User, School, Edit, Award, BookOpen, TrendingUp, Clock, CheckCircle, Target, X, Save } from "lucide-react";
import { Loader2 } from "lucide-react";

const StudentProfile: React.FC = () => {
  const { profile, loading, error, fetchStudentProfile, updateStudentProfile, clearProfile } = useStudentProfileStore();
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gradeLevel: "",
    dateOfBirth: ""
  });

  useEffect(() => {
    if (user?.id) {
      fetchStudentProfile(Number(user.id));
    }

    return () => {
      clearProfile();
    };
  }, [user, fetchStudentProfile, clearProfile]);

  useEffect(() => {
    if (profile) {
      setEditedProfile({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        gradeLevel: profile.gradeLevel || "",
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : ""
      });
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      setEditedProfile({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        gradeLevel: profile.gradeLevel || "",
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : ""
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      await updateStudentProfile(profile.id, editedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-slate-50/50">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
        </div>
        <div className="flex flex-col items-center relative z-10">
          <div className="bg-white/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-soft">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">Synchronizing Profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-slate-50/50">
        <div className="max-w-md w-full px-4 relative z-10">
          <Card className="glass-card border-none shadow-soft overflow-hidden rounded-2xl">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="bg-destructive/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <User className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">System Interruption</h3>
                <p className="mb-6 text-sm text-slate-500 font-medium px-4">{error}</p>
                <Button
                  onClick={() => user?.id && fetchStudentProfile(Number(user.id))}
                  className="rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-bold uppercase tracking-widest px-8"
                >
                  Retry Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-slate-50/50">
        <div className="max-w-md w-full px-4 relative z-10">
          <Card className="glass-card border-none shadow-soft rounded-2xl">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="bg-slate-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <User className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">Identity Unavailable</h3>
                <p className="mb-6 text-sm text-slate-500 font-medium">Unable to load your profile information at this time.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50/50">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-6 bg-primary/30"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Account Settings</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
            Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Profile</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm">Manage your personal information and academic identity.</p>
        </div>

        {/* Main Profile Card */}
        <Card className="glass-card border-none mb-6 overflow-hidden rounded-2xl shadow-soft">
          {/* Cover Section */}
          <div className="h-32 bg-gradient-to-r from-primary/10 via-blue-400/5 to-primary/10 relative">
            <div className="absolute top-4 right-4 z-20">
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    className="h-9 px-4 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-slate-200"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-3 w-3 mr-2" />
                    )}
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="h-9 px-4 rounded-lg bg-white/50 backdrop-blur-sm border-slate-200 text-slate-600 hover:bg-white text-[10px] font-bold uppercase tracking-widest"
                  >
                    <X className="h-3 w-3 mr-2" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleEdit}
                  className="h-9 px-4 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-slate-200 transition-all active:scale-95"
                >
                  <Edit className="h-3 w-3 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <CardContent className="p-6 md:p-8 pt-0 relative">
            <div className="flex flex-col md:flex-row gap-6 items-start -mt-12">
              {/* Profile Image & Basic Info */}
              <div className="flex flex-col items-center md:items-start z-10">
                <div className="relative group">
                  <div className="bg-slate-50 border-4 border-white shadow-elegant rounded-full w-24 h-24 flex items-center justify-center mb-4 transition-transform group-hover:scale-105 duration-300">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <div className="absolute bottom-6 right-0 bg-success text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
                    {isEditing ? `${editedProfile.firstName} ${editedProfile.lastName}` : `${profile.firstName} ${profile.lastName}`}
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
                      Verified Scholar
                    </Badge>
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                    <div className="flex items-center text-xs font-bold text-slate-400 gap-1.5">
                      <Mail className="h-3 w-3" />
                      {profile.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full pt-4 md:pt-12">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-4 w-1 bg-primary rounded-full"></div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Student Information</h3>
                </div>

                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 pt-4">
                      <Label htmlFor="firstName" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={editedProfile.firstName}
                        onChange={handleInputChange}
                        className="h-10 bg-slate-50/50 border-slate-100 rounded-lg text-xs font-semibold focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-1.5 pt-4">
                      <Label htmlFor="lastName" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={editedProfile.lastName}
                        onChange={handleInputChange}
                        className="h-10 bg-slate-50/50 border-slate-100 rounded-lg text-xs font-semibold focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-1.5 pt-4">
                      <Label htmlFor="email" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={editedProfile.email}
                        onChange={handleInputChange}
                        className="h-10 bg-slate-50/50 border-slate-100 rounded-lg text-xs font-semibold focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-1.5 pt-4">
                      <Label htmlFor="phoneNumber" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={editedProfile.phoneNumber}
                        onChange={handleInputChange}
                        className="h-10 bg-slate-50/50 border-slate-100 rounded-lg text-xs font-semibold focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-1.5 pt-4">
                      <Label htmlFor="gradeLevel" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Grade Level</Label>
                      <Input
                        id="gradeLevel"
                        name="gradeLevel"
                        value={editedProfile.gradeLevel}
                        onChange={handleInputChange}
                        className="h-10 bg-slate-50/50 border-slate-100 rounded-lg text-xs font-semibold focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-1.5 pt-4">
                      <Label htmlFor="dateOfBirth" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={editedProfile.dateOfBirth}
                        onChange={handleInputChange}
                        className="h-10 bg-slate-50/50 border-slate-100 rounded-lg text-xs font-semibold focus:ring-primary/20"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group bg-white/40 hover:bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-100/50 transition-all duration-300 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          <Mail className="h-4 w-4 text-primary group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email Address</p>
                          <p className="text-sm font-bold text-slate-700">{profile.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="group bg-white/40 hover:bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-100/50 transition-all duration-300 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-400/10 p-2 rounded-lg group-hover:bg-blue-400 group-hover:text-white transition-colors duration-300">
                          <Phone className="h-4 w-4 text-blue-400 group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Phone Number</p>
                          <p className="text-sm font-bold text-slate-700">{profile.phoneNumber || "Not provided"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="group bg-white/40 hover:bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-100/50 transition-all duration-300 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-400/10 p-2 rounded-lg group-hover:bg-indigo-400 group-hover:text-white transition-colors duration-300">
                          <School className="h-4 w-4 text-indigo-400 group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Academic Grade</p>
                          <p className="text-sm font-bold text-slate-700">Level {profile.gradeLevel}</p>
                        </div>
                      </div>
                    </div>

                    <div className="group bg-white/40 hover:bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-100/50 transition-all duration-300 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-400/10 p-2 rounded-lg group-hover:bg-emerald-400 group-hover:text-white transition-colors duration-300">
                          <Calendar className="h-4 w-4 text-emerald-400 group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Birth Date</p>
                          <p className="text-sm font-bold text-slate-700">
                            {new Date(profile.dateOfBirth).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>



      </div>
    </div>
  );
};

export default StudentProfile;