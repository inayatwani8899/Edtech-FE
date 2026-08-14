import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useStudentProfileStore } from "../../store/studentProfileStore";
import { useAuthStore } from "../../store/useAuthStore";
import { Calendar, Mail, Phone, User, School, Edit, Award, BookOpen, TrendingUp, Clock, X, Save, ShieldCheck, MapPin, Hash, Sparkles, Target } from "lucide-react";
import { Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  RadarChart
} from 'recharts';

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
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="flex flex-col items-center">
          <div className="bg-white p-5 rounded-[12px] border border-[#E5E7EB] shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-[#4F46E5]" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">Synchronizing Profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] p-6">
        <div className="max-w-md w-full">
          <Card className="bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm">
            <CardContent className="pt-6 pb-6">
              <div className="text-center">
                <div className="bg-red-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <User className="h-5 w-5 text-red-550 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">System Interruption</h3>
                <p className="mb-5 text-sm text-slate-500 font-medium px-4">{error}</p>
                <Button
                  onClick={() => user?.id && fetchStudentProfile(Number(user.id))}
                  className="rounded-[12px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[12px] font-semibold h-[38px] px-6"
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
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="max-w-md w-full px-4">
          <Card className="bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm">
            <CardContent className="pt-6 pb-6">
              <div className="text-center">
                <div className="bg-slate-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <User className="h-5 w-5 text-slate-450 text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">Identity Unavailable</h3>
                <p className="mb-5 text-sm text-slate-500 font-medium">Unable to load your profile information at this time.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Compact Standardized Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="h-px w-6 bg-[#4F46E5]/30"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4F46E5]">Student Identity</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#111827]">
              Portal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-blue-600">Dossier</span>
            </h1>
            <p className="text-[13px] font-medium text-[#6B7280]">Manage your academic profile and track your development across the educational ecosystem</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Side Panel (4 cols) - Identity & Status */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-white border border-[#E5E7EB] rounded-[12px] overflow-hidden shadow-sm group">
              {/* Profile Background Accent */}
              <div className="h-20 bg-gradient-to-br from-primary via-indigo-600 to-blue-600 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <div className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/30">
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">Active</span>
                  </div>
                </div>
              </div>

              <CardContent className="pt-0 relative px-6 pb-6">
                <div className="flex flex-col items-center -mt-10 mb-6">
                  <div className="relative">
                    <div className="relative bg-white border-[4px] border-white shadow-md rounded-full w-24 h-24 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                        <User className="h-12 w-12 text-slate-305 text-slate-400" />
                      </div>
                    </div>
                    <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-none mb-2">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="secondary" className="bg-[#4F46E5]/5 text-[#4F46E5] border-none text-[9.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        Level {profile.gradeLevel} Student
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Email</span>
                    <span className="font-bold text-slate-700">{profile.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Phone</span>
                    <span className="font-bold text-slate-700">{profile.phoneNumber || "---"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Pulse Mini-Card */}
            <Card className="bg-white border border-[#E5E7EB] rounded-[12px] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-[#4F46E5]" />
                  Performance Pulse
                </h3>
                <span className="text-[9px] font-bold text-[#4F46E5] bg-[#4F46E5]/5 px-2 py-0.5 rounded-full">LIVE</span>
              </div>

              <div className="h-[160px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={[
                    { subject: 'Logic', A: 120, fullMark: 150 },
                    { subject: 'Verbal', A: 98, fullMark: 150 },
                    { subject: 'Math', A: 86, fullMark: 150 },
                    { subject: 'Speed', A: 99, fullMark: 150 },
                    { subject: 'Focus', A: 85, fullMark: 150 },
                  ]}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 605 }} />
                    <Radar
                      name="Student"
                      dataKey="A"
                      stroke="#4F46E5"
                      fill="#4F46E5"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Main Panel (8 cols) - Information Dossier */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm">
              <div className="p-5 pb-0 flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">Academic Info</CardTitle>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Information Dossier</p>
                </div>
                {!isEditing && (
                  <Button
                    onClick={handleEdit}
                    className="h-[36px] px-4 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit Dossier
                  </Button>
                )}
              </div>

              <CardContent className="p-5">
                {isEditing ? (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            name="firstName"
                            value={editedProfile.firstName}
                            onChange={handleInputChange}
                            className="h-[40px] pl-9 bg-white border-[#E5E7EB] rounded-[12px] text-[13px] text-slate-700 focus-visible:ring-[#4F46E5]"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            name="lastName"
                            value={editedProfile.lastName}
                            onChange={handleInputChange}
                            className="h-[40px] pl-9 bg-white border-[#E5E7EB] rounded-[12px] text-[13px] text-slate-700 focus-visible:ring-[#4F46E5]"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Dossier</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            name="email"
                            value={editedProfile.email}
                            onChange={handleInputChange}
                            className="h-[40px] pl-9 bg-white border-[#E5E7EB] rounded-[12px] text-[13px] text-slate-700 focus-visible:ring-[#4F46E5]"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Line</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            name="phoneNumber"
                            value={editedProfile.phoneNumber}
                            onChange={handleInputChange}
                            className="h-[40px] pl-9 bg-white border-[#E5E7EB] rounded-[12px] text-[13px] text-slate-700 focus-visible:ring-[#4F46E5]"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic Rank</Label>
                        <div className="relative">
                          <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            name="gradeLevel"
                            value={editedProfile.gradeLevel}
                            onChange={handleInputChange}
                            className="h-[40px] pl-9 bg-white border-[#E5E7EB] rounded-[12px] text-[13px] text-slate-700 focus-visible:ring-[#4F46E5]"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Temporal Origin</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            name="dateOfBirth"
                            type="date"
                            value={editedProfile.dateOfBirth}
                            onChange={handleInputChange}
                            className="h-[40px] pl-9 bg-white border-[#E5E7EB] rounded-[12px] text-[13px] text-slate-700 focus-visible:ring-[#4F46E5]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-3">
                      <Button
                        onClick={handleSave}
                        className="flex-1 h-[38px] rounded-[12px] bg-[#4F46E5] text-white hover:bg-[#4338CA] text-[12px] font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Confirm Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="flex-1 h-[38px] rounded-[12px] border-[#E5E7EB] bg-white text-[12px] font-semibold text-[#111827]"
                      >
                        Discard
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    {/* Personal Bio Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5]">
                          <Award className="h-3.5 w-3.5" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scholarship Status</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { label: 'Academic Standing', val: 'Excellent', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                          { label: 'Current Grade', val: `Level ${profile.gradeLevel}`, icon: Hash, color: 'text-indigo-650 text-[#4F46E5]', bg: 'bg-indigo-50' },
                          { label: 'Registration Date', val: 'Sept 2024', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
                        ].map((stat, i) => (
                          <div key={i} className={`p-4 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`h-4.5 w-4.5 ${stat.color} mb-2`} />
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-[13px] font-bold text-slate-700 mt-0.5">{stat.val}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Detailed Profile Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-1.5 mb-1 pb-1 border-b border-slate-50">
                          <User className="h-4 w-4 text-[#4F46E5]" />
                          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Personal Identification</h4>
                        </div>
                        <div className="space-y-3.5">
                          <div className="flex flex-col text-xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Full Legal Name</span>
                            <span className="font-bold text-slate-750 text-slate-700">{profile.firstName} {profile.lastName}</span>
                          </div>
                          <div className="flex flex-col text-xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Birth Dossier</span>
                            <span className="font-bold text-slate-750 text-slate-700">
                              {new Date(profile.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex flex-col text-xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Student UID</span>
                            <span className="font-mono font-bold text-slate-500">#STU-{profile.id.toString().padStart(6, '0')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3.5">
                        <div className="flex items-center gap-1.5 mb-1 pb-1 border-b border-slate-50">
                          <MapPin className="h-4 w-4 text-indigo-500" />
                          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Academic Localization</h4>
                        </div>
                        <div className="space-y-3.5">
                          <div className="flex flex-col text-xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Primary Schooling</span>
                            <span className="font-bold text-slate-750 text-slate-700">CognifyIQ Global Academy</span>
                          </div>
                          <div className="flex flex-col text-xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Grade Alignment</span>
                            <span className="font-bold text-slate-750 text-slate-700">Level {profile.gradeLevel} Curriculum</span>
                          </div>
                          <div className="flex flex-col text-xs">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Current Focus</span>
                            <span className="font-bold text-slate-750 text-slate-700">Psychometric Analytics</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions / Integration Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white border border-[#E5E7EB] rounded-[12px] p-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-2.5 rounded-xl group-hover:bg-[#4F46E5] transition-all duration-300">
                    <Target className="h-5 w-5 text-[#4F46E5] group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-800 tracking-tight">Learning Goals</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Define your path</p>
                  </div>
                </div>
              </Card>
              <Card className="bg-white border border-[#E5E7EB] rounded-[12px] p-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 p-2.5 rounded-xl group-hover:bg-emerald-500 transition-all duration-300">
                    <Sparkles className="h-5 w-5 text-emerald-600 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-800 tracking-tight">Achievements</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">View your badges</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;