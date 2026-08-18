import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Trash2,
  Moon,
  Sun,
  Monitor
} from "lucide-react";

export const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    testReminders: true,
    resultNotifications: true,
    
    // Privacy
    profileVisibility: "private",
    dataSharing: false,
    analyticsTracking: true,
    
    // Appearance
    theme: "system",
    language: "en",
    timezone: "America/New_York",
    
    // Test Settings
    autoSave: true,
    testTimeout: "60",
    showProgress: true
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Export Requested",
      description: "Your data export will be emailed to you within 24 hours.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Compact Standardized Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="h-px w-6 bg-[#4F46E5]/30"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4F46E5]">System Configuration</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#111827]">
              App <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-blue-600">Settings</span>
            </h1>
            <p className="text-[13px] font-medium text-[#6B7280]">Configure your preferences and account settings</p>
          </div>
          <Button 
            onClick={handleSave}
            className="h-[38px] px-6 rounded-[12px] bg-[#4F46E5] hover:bg-[#4338CA] text-white text-[12px] font-semibold transition-all shrink-0 mb-1.5"
          >
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notifications */}
          <Card className="bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="flex items-center text-[15px] font-bold text-slate-800">
                <Bell className="h-4.5 w-4.5 mr-2 text-indigo-500" />
                Notifications
              </CardTitle>
              <CardDescription className="text-xs">
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-xs font-bold text-slate-700">Email Notifications</Label>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications" className="text-xs font-bold text-slate-700">Push Notifications</Label>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Receive browser notifications
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, pushNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="test-reminders" className="text-xs font-bold text-slate-700">Test Reminders</Label>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Get reminded about upcoming tests
                  </p>
                </div>
                <Switch
                  id="test-reminders"
                  checked={settings.testReminders}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, testReminders: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="result-notifications" className="text-xs font-bold text-slate-700">Result Notifications</Label>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Notify when test results are ready
                  </p>
                </div>
                <Switch
                  id="result-notifications"
                  checked={settings.resultNotifications}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, resultNotifications: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="flex items-center text-[15px] font-bold text-slate-800">
                <Shield className="h-4.5 w-4.5 mr-2 text-indigo-500" />
                Privacy & Security
              </CardTitle>
              <CardDescription className="text-xs">
                Control your privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="profile-visibility" className="text-xs font-bold text-slate-700">Profile Visibility</Label>
                <Select
                  value={settings.profileVisibility}
                  onValueChange={(value) => 
                    setSettings({ ...settings, profileVisibility: value })
                  }
                >
                  <SelectTrigger className="h-[38px] bg-white border-[#E5E7EB] rounded-[12px] text-[13px] text-slate-700 focus-visible:ring-[#4F46E5]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-[12px] border-[#E5E7EB]">
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="limited">Limited</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-sharing" className="text-xs font-bold text-slate-700">Data Sharing</Label>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Allow anonymized data for research
                  </p>
                </div>
                <Switch
                  id="data-sharing"
                  checked={settings.dataSharing}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, dataSharing: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytics-tracking" className="text-xs font-bold text-slate-700">Analytics Tracking</Label>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Help improve our platform
                  </p>
                </div>
                <Switch
                  id="analytics-tracking"
                  checked={settings.analyticsTracking}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, analyticsTracking: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="flex items-center text-[15px] font-bold text-slate-800">
                <Palette className="h-4.5 w-4.5 mr-2 text-indigo-500" />
                Appearance
              </CardTitle>
              <CardDescription className="text-xs">
                Customize your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="theme" className="text-xs font-bold text-slate-700">Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => 
                    setSettings({ ...settings, theme: value })
                  }
                >
                  <SelectTrigger className="h-[38px] bg-white border-[#E5E7EB] rounded-[12px] text-[13px] text-slate-700 focus-visible:ring-[#4F46E5]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-[12px] border-[#E5E7EB]">
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center">
                        <Monitor className="h-4 w-4 mr-2" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="language" className="text-xs font-bold text-slate-700">Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => 
                    setSettings({ ...settings, language: value })
                  }
                >
                  <SelectTrigger className="h-[38px] bg-white border-[#E5E7EB] rounded-[12px] text-[13px] text-slate-700 focus-visible:ring-[#4F46E5]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-[12px] border-[#E5E7EB]">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="timezone" className="text-xs font-bold text-slate-700">Timezone</Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(value) => 
                    setSettings({ ...settings, timezone: value })
                  }
                >
                  <SelectTrigger className="h-[38px] bg-white border-[#E5E7EB] rounded-[12px] text-[13px] text-slate-700 focus-visible:ring-[#4F46E5]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-[12px] border-[#E5E7EB]">
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Test Settings */}
          <Card className="bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="flex items-center text-[15px] font-bold text-slate-800">
                <Globe className="h-4.5 w-4.5 mr-2 text-indigo-500" />
                Test Settings
              </CardTitle>
              <CardDescription className="text-xs">
                Configure your testing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save" className="text-xs font-bold text-slate-700">Auto-save Progress</Label>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Automatically save test progress
                  </p>
                </div>
                <Switch
                  id="auto-save"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, autoSave: checked })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="test-timeout" className="text-xs font-bold text-slate-700">Test Timeout (minutes)</Label>
                <Input
                  id="test-timeout"
                  type="number"
                  value={settings.testTimeout}
                  onChange={(e) => 
                    setSettings({ ...settings, testTimeout: e.target.value })
                  }
                  className="h-[38px] bg-white border-[#E5E7EB] rounded-[12px] text-[13px] text-slate-700 focus-visible:ring-[#4F46E5]"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-progress" className="text-xs font-bold text-slate-700">Show Progress Bar</Label>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Display progress during tests
                  </p>
                </div>
                <Switch
                  id="show-progress"
                  checked={settings.showProgress}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, showProgress: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Management */}
        <Card className="bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-[15px] font-bold text-slate-800">Data Management</CardTitle>
            <CardDescription className="text-xs">
              Export or delete your account data
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={handleExportData}
                className="h-[38px] rounded-[12px] border-[#E5E7EB] bg-white text-[12px] font-semibold text-[#111827] flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-all border"
              >
                <Download className="h-4 w-4" />
                Export My Data
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                className="h-[38px] rounded-[12px] bg-red-600 hover:bg-red-700 text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};