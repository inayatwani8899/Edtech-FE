import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-lg text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="max-w-md w-full shadow-xl border-0">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-red-500" />
              </div>
              <div className="text-lg font-semibold mb-2 text-gray-900">Error Loading Profile</div>
              <p className="mb-4 text-gray-600">{error}</p>
              <Button 
                onClick={() => user?.id && fetchStudentProfile(Number(user.id))}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="max-w-md w-full shadow-xl border-0">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <div className="text-lg font-semibold mb-2 text-gray-900">Profile Not Found</div>
              <p className="mb-4 text-gray-600">Unable to load your profile information.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Profile</h1>
          <p className="text-gray-600">Manage your personal information and track your progress</p>
        </div>

        {/* Main Profile Card */}
        <Card className="shadow-xl border-0 mb-6 overflow-hidden">
          {/* Cover Image */}
          <div className="h-20 bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 relative">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute top-4 right-4">
              {isEditing ? (
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSave}
                    className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                  <Button 
                    onClick={handleCancel}
                    className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleEdit}
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
          
          <CardContent className="p-8 ">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Profile Image */}
              <div className="flex flex-col items-center md:items-start ">
                <div className="bg-gradient-to-br from-blue-500 to-green-500 border-4 border-white shadow-xl rounded-full w-32 h-32 flex items-center justify-center mb-4">
                  <User className="h-16 w-16 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {isEditing ? `${editedProfile.firstName} ${editedProfile.lastName}` : `${profile.firstName} ${profile.lastName}`}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <School className="h-3 w-3 mr-1" />
                      Student
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(profile.dateOfBirth).getFullYear()}
                  </p>
                </div>
              </div>
              
              {/* Contact Information Grid */}
              <div className="flex-1 w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <Label htmlFor="firstName" className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={editedProfile.firstName}
                        onChange={handleInputChange}
                        className="bg-white border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                      <Label htmlFor="lastName" className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={editedProfile.lastName}
                        onChange={handleInputChange}
                        className="bg-white border-green-200 focus:border-green-400"
                      />
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <Label htmlFor="email" className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={editedProfile.email}
                        onChange={handleInputChange}
                        className="bg-white border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                      <Label htmlFor="phoneNumber" className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">
                        Phone Number
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={editedProfile.phoneNumber}
                        onChange={handleInputChange}
                        className="bg-white border-green-200 focus:border-green-400"
                      />
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <Label htmlFor="gradeLevel" className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">
                        Grade Level
                      </Label>
                      <Input
                        id="gradeLevel"
                        name="gradeLevel"
                        value={editedProfile.gradeLevel}
                        onChange={handleInputChange}
                        className="bg-white border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                      <Label htmlFor="dateOfBirth" className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">
                        Date of Birth
                      </Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={editedProfile.dateOfBirth}
                        onChange={handleInputChange}
                        className="bg-white border-green-200 focus:border-green-400"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                          <Mail className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Email Address</p>
                          <p className="font-medium text-gray-900 truncate">{profile.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-600 p-2 rounded-lg">
                          <Phone className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Phone Number</p>
                          <p className="font-medium text-gray-900">{profile.phoneNumber || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                          <School className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Grade Level</p>
                          <p className="font-medium text-gray-900">{profile.gradeLevel}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-600 p-2 rounded-lg">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Date of Birth</p>
                          <p className="font-medium text-gray-900">
                            {new Date(profile.dateOfBirth).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
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