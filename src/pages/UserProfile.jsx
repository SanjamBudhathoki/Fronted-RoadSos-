import React, { useEffect, useState } from "react";
import Input from "../components/Input";
import Loader from "../components/Loader";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Trash2,
  Edit,
  Save,
  X,
  Camera,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Lock,
  Award,
  Clock,
  Star,
  Heart,
  Settings,
  LogOut,
  Bell,
  Eye,
  EyeOff,
  AtSign,
  Calendar,
} from "lucide-react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import Card from "../components/Card";
import EmergencyContacts from "../components/EmergencyContacts";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || null
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("profileImage", reader.result);
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const fetchProfile = async () => {
    try {
      const data = await authService.getProfile();
      setProfile(data);
      setOriginalProfile(data);
    } catch (err) {
      console.log("Profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      const payload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        address: profile.address,
        gender: profile.gender,
      };

      if (password.trim()) {
        payload.password = password;
      }

      await authService.updateProfile(payload);
      
      setSuccessMessage("Profile updated successfully!");
      setEditMode(false);
      setPassword("");
      setShowPasswordField(false);
      fetchProfile();
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await authService.deleteProfile(profile._id);
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <Loader fullScreen />;

  if (!profile)
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="text-center">
          <div className="w-24 h-24 bg-lineat-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <User className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-500">We couldn't load your profile information</p>
          <Button 
            variant="primary" 
            className="rounded-xl mt-6"
            onClick={() => navigate("/login")}
          >
            Return to Login
          </Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-lineat-to-br from-gray-50 via-white to-red-50/30">
      
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-lineat-to-br from-red-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-lineat-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-lineat-to-br from-red-100/10 to-amber-100/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Success Toast */}
        {successMessage && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
            <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 p-4 flex items-center gap-3 min-w-[320px]">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-900">Success!</p>
                <p className="text-xs text-emerald-600">{successMessage}</p>
              </div>
              <button 
                onClick={() => setSuccessMessage("")} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Profile Header - Glassmorphism Card */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-linear-to-r from-red-600 via-red-500 to-pink-500 rounded-3xl blur-xl opacity-20"></div>
          <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden p-0 relative">
            
            {/* Decorative top linear */}
            <div className="h-2 bg-linear-to-r from-red-500 via-pink-500 to-purple-500"></div>
            
            <div className="p-8 sm:p-10">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                
                {/* Avatar with Status Ring */}
                <div className="relative">
                  <div className="relative group">
                    {/* Outer glow */}
                    <div className="absolute inset-0 bg-linear-to-r from-red-500 to-pink-500 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    
                    {/* Avatar Container */}
                    <div className="relative h-32 w-32 rounded-2xl bg-lineat-to-br from-red-500 to-pink-500 p-1 shadow-xl">
                      <div className="h-full w-full rounded-xl bg-white overflow-hidden">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-lineat-to-br from-red-50 to-pink-50 flex items-center justify-center">
                            <User className="h-16 w-16 text-red-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Online Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-xl border-4 border-white flex items-center justify-center shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>

                    {/* Upload Button */}
                    {editMode && (
                      <label className="absolute -top-2 -right-2 cursor-pointer bg-white rounded-xl p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border border-gray-100">
                        <Camera className="h-5 w-5 text-red-600" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center lg:text-left mt-2">
                  <div className="flex flex-col lg:flex-row items-center gap-4 mb-3">
                    <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {profile.firstName} {profile.lastName}
                    </h1>
                  </div>

                  {/* Quick Info Pills */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-5">
                    <span className="inline-flex items-center gap-1.5 bg-linear-to-r from-red-50 to-pink-50 border border-red-100 px-3 py-1.5 rounded-full text-sm font-semibold text-red-700">
                      <Shield className="h-3.5 w-6 gap-1.5" />
                      {profile.role?.toUpperCase()}
                    </span>
                    
                    <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-600">
                      <Mail className="h-3.5 w-3.5" />
                      {profile.email}
                    </span>
                    
                    <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-600">
                      <Phone className="h-3.5 w-3.5" />
                      {profile.phone || "Not set"}
                    </span>
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  {!editMode ? (
                    <>
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => setEditMode(true)}
                        className="rounded-2xl font-semibold shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300"
                        icon={<Edit className="w-5 h-5" />}
                      >
                        Edit Profile
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="success"
                        size="lg"
                        onClick={handleUpdate}
                        loading={saving}
                        disabled={saving}
                        className="rounded-2xl font-semibold shadow-lg shadow-emerald-200"
                        icon={<Save className="w-5 h-5" />}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => {
                          setProfile(originalProfile);
                          setEditMode(false);
                          setPassword("");
                          setShowPasswordField(false);
                        }}
                        className="rounded-2xl"
                        icon={<X className="w-4 h-4" />}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          

          {/* Main Content - Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Information Card */}
            <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg rounded-2xl overflow-hidden p-0 hover:shadow-xl transition-shadow duration-300">
              
              {/* Card Header */}
              <div className="bg-linear-to-r from-gray-50 to-white p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <User className="h-5 w-5 text-red-500" />
                      Personal Information
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Update your personal details and contact information</p>
                  </div>
                  {editMode && (
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-700">
                      <Edit className="h-3 w-3" />
                      Editing Mode
                    </span>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* First Name */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
                      <div className="w-6 h-6 bg-lineat-to-br from-red-100 to-pink-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <User className="h-3.5 w-3.5 text-red-600" />
                      </div>
                      First Name
                    </label>
                    {editMode ? (
                      <Input
                        value={profile.firstName || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, firstName: e.target.value })
                        }
                        placeholder="Enter first name"
                        className="rounded-xl border-gray-200 focus:border-red-300 focus:ring-red-200"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-gray-900 font-medium">{profile.firstName || "Not set"}</p>
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
                      <div className="w-6 h-6 bg-lineat-to-br from-red-100 to-pink-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <User className="h-3.5 w-3.5 text-red-600" />
                      </div>
                      Last Name
                    </label>
                    {editMode ? (
                      <Input
                        value={profile.lastName || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, lastName: e.target.value })
                        }
                        placeholder="Enter last name"
                        className="rounded-xl border-gray-200 focus:border-red-300 focus:ring-red-200"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-gray-900 font-medium">{profile.lastName || "Not set"}</p>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
                      <div className="w-6 h-6 bg-lineat-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                        <AtSign className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      Email Address
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2">
                      <p className="text-gray-900 font-medium flex-1">{profile.email}</p>
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Email is verified and cannot be changed
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
                      <div className="w-6 h-6 bg-lineat-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="h-3.5 w-3.5 text-green-600" />
                      </div>
                      Phone Number
                    </label>
                    {editMode ? (
                      <Input
                        value={profile.phone || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                        placeholder="Enter phone number"
                        className="rounded-xl border-gray-200 focus:border-red-300 focus:ring-red-200"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-gray-900 font-medium">{profile.phone || "Not set"}</p>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2 group">
                    <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
                      <div className="w-6 h-6 bg-lineat-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin className="h-3.5 w-3.5 text-purple-600" />
                      </div>
                      Address
                    </label>
                    {editMode ? (
                      <Input
                        value={profile.address || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, address: e.target.value })
                        }
                        placeholder="Enter your full address"
                        className="rounded-xl border-gray-200 focus:border-red-300 focus:ring-red-200"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-gray-900 font-medium">{profile.address || "Not set"}</p>
                      </div>
                    )}
                  </div>

                  {/* Password Section - Only in Edit Mode */}
                  {editMode && (
                    <div className="md:col-span-2">
                      {!showPasswordField ? (
                        <button
                          type="button"
                          onClick={() => setShowPasswordField(true)}
                          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all duration-200 group"
                        >
                          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 group-hover:text-red-600">
                            <Lock className="w-4 h-4" />
                            Change Password
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </button>
                      ) : (
                        <div className="p-5 bg-lineat-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-inner">
                          <div className="flex items-center justify-between mb-4">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                              <div className="w-6 h-6 bg-lineat-to-br from-amber-100 to-yellow-100 rounded-lg flex items-center justify-center">
                                <Lock className="h-3.5 w-3.5 text-amber-600" />
                              </div>
                              New Password
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setShowPasswordField(false);
                                setPassword("");
                              }}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter new password (min. 6 characters)"
                              className="rounded-xl border-gray-200 focus:border-red-300 focus:ring-red-200 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-linear-to-r from-red-500 to-emerald-500 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min((password.length / 8) * 100, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {password.length < 6 ? 'Weak' : password.length < 8 ? 'Medium' : 'Strong'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Leave blank to keep your current password
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
            {/* Emergency Contact Component */}
                  <EmergencyContacts/>

            {/* Danger Zone Card */}
            <Card className="bg-white/80 backdrop-blur-xl border border-red-200 shadow-lg rounded-2xl overflow-hidden p-0 hover:shadow-xl transition-shadow duration-300">
              
              {/* Danger Zone Header */}
              <div className="bg-linear-to-r from-red-50 to-orange-50 p-6 border-b border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-lineat-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-red-200">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-700">Danger Zone</h3>
                    <p className="text-red-500 text-sm">Irreversible and destructive actions</p>
                  </div>
                </div>
              </div>

              {/* Delete Account */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Trash2 className="h-5 w-5 text-red-500" />
                      Delete Account
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Once you delete your account, there is no going back. All your data, 
                      history, and achievements will be permanently removed.
                    </p>
                  </div>

                  <Button
                    variant="danger"
                    size="lg"
                    onClick={handleDelete}
                    className="rounded-2xl font-bold shadow-lg shadow-red-200 
                    hover:shadow-xl hover:shadow-red-300 shrink-0"
                    icon={<Trash2 className="w-5 h-5" />}
                  >
                    Delete My Account
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;