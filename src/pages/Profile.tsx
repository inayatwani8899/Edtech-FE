import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from '../store/useAuthStore'
import { User, Calendar, Phone, Edit2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Profile = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone
  });

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: `${user?.firstName}` || "",
      lastName: `${user?.lastName}` || "",
      email: user?.email || "",
      phone: user?.phone
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                My Profile
              </span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Manage your personal information and account settings
            </p>
          </div>

          <div className="flex gap-3">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl px-6"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 rounded-xl px-6"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="rounded-xl px-6 border-slate-200 hover:bg-slate-50 text-slate-600"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-xl border-white/50 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden sticky top-8">
              <div className="h-32 bg-gradient-to-br from-primary/10 to-blue-500/10 relative">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
              </div>
              <CardContent className="pt-0 relative px-6 pb-8">
                <div className="flex justify-center -mt-16 mb-6">
                  <div className="p-1.5 bg-white rounded-full shadow-lg">
                    <Avatar className="h-32 w-32 border-4 border-white">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="text-4xl bg-primary text-primary-foreground font-bold">
                        {user?.firstName?.charAt(0)?.toUpperCase()}{user?.lastName?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">{`${formData.firstName} ${formData.lastName}`}</h2>
                  <p className="text-slate-500 font-medium">{formData.email}</p>
                  <div className="mt-3">
                    <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 border-0">
                      {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  {/* <div className="flex items-center text-slate-600 p-3 rounded-xl bg-slate-50">
                    <MapPin className="h-5 w-5 mr-3 text-primary/70" />
                    <span className="font-medium">{formData.location || "Location not set"}</span>
                  </div> */}
                  <div className="flex items-center text-slate-600 p-3 rounded-xl bg-slate-50">
                    <Phone className="h-5 w-5 mr-3 text-primary/70" />
                    <span className="font-medium">{formData.phone || "No phone number"}</span>
                  </div>
                  <div className="flex items-center text-slate-600 p-3 rounded-xl bg-slate-50">
                    <Calendar className="h-5 w-5 mr-3 text-primary/70" />
                    <span className="font-medium">Member since 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details Form */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white/80 backdrop-blur-xl border-white/50 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-white/50 px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800">Personal Information</CardTitle>
                    <CardDescription className="text-slate-500 font-medium mt-1">Update your personal details and contact confirmation</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-600 font-semibold">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="bg-white/50 border-slate-200 focus:ring-primary focus:border-primary rounded-xl h-11"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-xl text-slate-700 font-medium border border-slate-100 h-11 flex items-center">
                        {formData.firstName}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-600 font-semibold">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="bg-white/50 border-slate-200 focus:ring-primary focus:border-primary rounded-xl h-11"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-xl text-slate-700 font-medium border border-slate-100 h-11 flex items-center">
                        {formData.lastName}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-600 font-semibold">Email Address</Label>
                    {!isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        readOnly
                        className="bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed rounded-xl h-11"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-xl text-slate-500 font-medium border border-slate-100 h-11 flex items-center">
                        {formData.email}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-600 font-semibold">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-white/50 border-slate-200 focus:ring-primary focus:border-primary rounded-xl h-11"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-xl text-slate-700 font-medium border border-slate-100 h-11 flex items-center">
                        {formData.phone}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Placeholder for future sections like Bio or Professional Info */}
            {/* <Card className="bg-white/80 backdrop-blur-xl border-white/50 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden opacity-60">
              <CardHeader className="border-b border-slate-100 bg-white/50 px-8 py-6">
                 ...
              </CardHeader>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};