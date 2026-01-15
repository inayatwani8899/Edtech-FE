import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useStudentProfileStore } from "../../store/studentProfileStore";
import { useAuthStore } from "../../store/useAuthStore";
import { Calendar, Mail, Phone, User, School, Edit, Award, BookOpen, TrendingUp, Clock, CheckCircle, Target, X, Save, ShieldCheck, MapPin, Hash, Sparkles } from "lucide-react";
import { Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  RadarChart,
  PolarRadiusAxis
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
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header Section - Modern Centered */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4">
            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Student Identity</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Portal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-blue-600">Dossier</span>
          </h1>
          <p className="text-slate-500 font-medium text-base max-w-2xl mx-auto">
            Manage your academic profile and track your development across the educational ecosystem.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Side Panel (4 cols) - Identity & Status */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="glass-card border-white/20 overflow-hidden rounded-[2rem] shadow-elegant group">
              {/* Profile Background Accent */}
              <div className="h-24 bg-gradient-to-br from-primary via-indigo-600 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </div>

              <CardContent className="pt-0 relative px-8 pb-8">
                <div className="flex flex-col items-center -mt-12 mb-6">
                  <div className="relative group">
                    <div className="absolute inset-[-4px] bg-gradient-to-r from-primary to-blue-600 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                    <div className="relative bg-white border-[6px] border-white shadow-elegant rounded-full w-32 h-32 flex items-center justify-center transition-transform group-hover:scale-105 duration-500 overflow-hidden">
                      <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
                        <User className="h-16 w-16 text-slate-300" />
                      </div>
                      {/* Overlay shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-success text-white p-2 rounded-full border-4 border-white shadow-lg">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        Level {profile.gradeLevel} Student
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between group/item">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-50 group-hover/item:bg-primary/10 transition-colors">
                        <Mail className="h-4 w-4 text-slate-400 group-hover/item:text-primary" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</span>
                    </div>
                    <span className="text-sm font-bold text-slate-700">{profile.email}</span>
                  </div>
                  <div className="flex items-center justify-between group/item">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-50 group-hover/item:bg-blue-400/10 transition-colors">
                        <Phone className="h-4 w-4 text-slate-400 group-hover/item:text-blue-400" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone</span>
                    </div>
                    <span className="text-sm font-bold text-slate-700">{profile.phoneNumber || "---"}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-2xl border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all hover:border-primary/30"
                  >
                    Manage Privacy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance Pulse Mini-Card */}
            <Card className="glass-card border-white/20 rounded-[2rem] shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Performance Pulse
                </h3>
                <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">LIVE</span>
              </div>

              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                    { subject: 'Logic', A: 120, fullMark: 150 },
                    { subject: 'Verbal', A: 98, fullMark: 150 },
                    { subject: 'Math', A: 86, fullMark: 150 },
                    { subject: 'Speed', A: 99, fullMark: 150 },
                    { subject: 'Focus', A: 85, fullMark: 150 },
                  ]}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                    <Radar
                      name="Student"
                      dataKey="A"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Main Panel (8 cols) - Information Dossier */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="glass-card border-none shadow-elegant rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Academic <span className="text-primary text-3xl">.</span></CardTitle>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Information Dossier</p>
                </div>
                {!isEditing && (
                  <Button
                    onClick={handleEdit}
                    className="h-10 px-6 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-slate-200 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Edit className="h-3 w-3" />
                    Edit Dossier
                  </Button>
                )}
              </CardHeader>

              <CardContent className="p-8">
                {isEditing ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            name="firstName"
                            value={editedProfile.firstName}
                            onChange={handleInputChange}
                            className="h-12 pl-11 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name</Label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            name="lastName"
                            value={editedProfile.lastName}
                            onChange={handleInputChange}
                            className="h-12 pl-11 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Dossier</Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            name="email"
                            value={editedProfile.email}
                            onChange={handleInputChange}
                            className="h-12 pl-11 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Line</Label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            name="phoneNumber"
                            value={editedProfile.phoneNumber}
                            onChange={handleInputChange}
                            className="h-12 pl-11 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Academic Rank</Label>
                        <div className="relative">
                          <School className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            name="gradeLevel"
                            value={editedProfile.gradeLevel}
                            onChange={handleInputChange}
                            className="h-12 pl-11 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Temporal Origin</Label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            name="dateOfBirth"
                            type="date"
                            value={editedProfile.dateOfBirth}
                            onChange={handleInputChange}
                            className="h-12 pl-11 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold text-slate-700"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        onClick={handleSave}
                        className="flex-1 h-12 rounded-2xl bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Confirm Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="flex-1 h-12 rounded-2xl border-slate-200 text-slate-500 font-bold uppercase tracking-widest"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Discard
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2">
                    {/* Personal Bio Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Award className="h-4 w-4" />
                        </div>
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em]">Scholarship Status</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { label: 'Academic Standing', val: 'Excellent', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                          { label: 'Current Grade', val: `Level ${profile.gradeLevel}`, icon: Hash, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                          { label: 'Registration Date', val: 'Sept 2024', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
                        ].map((stat, i) => (
                          <div key={i} className={`p-5 rounded-3xl ${stat.bg} border border-transparent hover:border-white transition-all`}>
                            <stat.icon className={`h-5 w-5 ${stat.color} mb-3`} />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-sm font-black text-slate-700 mt-1">{stat.val}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Detailed Profile Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-50">
                          <User className="h-4 w-4 text-primary" />
                          <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">Personal Identification</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Legal Name</span>
                            <span className="text-sm font-bold text-slate-700">{profile.firstName} {profile.lastName}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Birth Dossier</span>
                            <span className="text-sm font-bold text-slate-700">
                              {new Date(profile.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Student UID</span>
                            <span className="text-sm font-mono font-bold text-slate-500">#STU-{profile.id.toString().padStart(6, '0')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-50">
                          <MapPin className="h-4 w-4 text-indigo-500" />
                          <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">Academic Localization</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Primary Schooling</span>
                            <span className="text-sm font-bold text-slate-700">EdTech Global Academy</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Grade Alignment</span>
                            <span className="text-sm font-bold text-slate-700">Level {profile.gradeLevel} Curriculum</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Focus</span>
                            <span className="text-sm font-bold text-slate-700">Psychometric Analytics</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions / Integration Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card border-none shadow-soft p-6 rounded-3xl hover:shadow-elegant transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-50 p-3 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                    <Target className="h-6 w-6 text-indigo-500 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 tracking-tight">Learning Goals</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Define your path</p>
                  </div>
                </div>
              </Card>
              <Card className="glass-card border-none shadow-soft p-6 rounded-3xl hover:shadow-elegant transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-50 p-3 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    <Sparkles className="h-6 w-6 text-emerald-500 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 tracking-tight">Achievements</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">View your badges</p>
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