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
} from "lucide-react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import Card from "../components/Card";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();
  const [password, setPassword] = useState("");

  const [profileImage, setProfileImage] = useState(
  localStorage.getItem("profileImage") || null
);
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

    alert("Profile updated successfully");
    setEditMode(false);
    fetchProfile();
  } catch (err) {
    alert(err.response?.data?.message || "Update failed");
  }
};

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account?"
    );

    if (!confirmDelete) return;

    try {
      await authService.deleteProfile(profile._id);
      localStorage.clear();
      alert("Account deleted successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <Loader />;

  if (!profile)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <h2 className="text-gray-500 text-lg">Profile not found</h2>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="bg-linear-to-r from-red-600 to-red-500 rounded-3xl p-8 text-white shadow-xl mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
<div className="relative">
  <div className="h-24 w-24 rounded-full bg-white/20 overflow-hidden flex items-center justify-center border-2 border-white">
    {profileImage ? (
      <img
        src={profileImage}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    ) : (
      <User size={48} />
    )}
  </div>

  {editMode && (
    <label className="absolute -bottom-2 left-1/2 -translate-x-1/2 cursor-pointer bg-white text-red-600 px-2 py-1 rounded-lg text-xs font-medium shadow">
      Upload
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </label>
  )}
</div>            

            <div>
              <h1 className="text-3xl font-bold">
                {profile.firstName} {profile.lastName}
              </h1>

              <div className="flex items-center gap-2 mt-2">
                <Shield size={16} />
                <span className="bg-white/20 px-3 py-2 rounded-full text-sm">
                  <h6 className="font-bold">Role : {profile.role?.toUpperCase()}</h6> 
                </span>
              </div>

              <p className="text-red-100 mt-2">
                Manage your personal information and account settings.
              </p>
            </div>
          </div>
        </Card>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Profile Information
            </h2>

            {!editMode ? (
              <Button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl transition"
              >
                <Edit size={18} />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={handleUpdate}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl transition"
                >
                  <Save size={18} />
                  Save
                </Button>

                <Button
                  onClick={() => {
                  setProfile(originalProfile);
                  setEditMode(false);
                    }}
                  className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-xl transition"
                >
                  <X size={18} />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700">
                <User size={16} />
                First Name
              </label>
              <Input
                disabled={!editMode}
                value={profile.firstName || ""}
                onChange={(e) =>
                  setProfile({ ...profile, firstName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700">
                <User size={16} />
                Last Name
              </label>
              <Input
                disabled={!editMode}
                value={profile.lastName || ""}
                onChange={(e) =>
                  setProfile({ ...profile, lastName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700">
                <Mail size={16} />
                Email Address
              </label>
              <Input
                value={profile.email}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700">
                <Phone size={16} />
                Phone Number
              </label>
              <Input
                disabled={!editMode}
                value={profile.phone || ""}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700">
                <MapPin size={16} />
                Address
              </label>
              <Input
                disabled={!editMode}
                value={profile.address || ""}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
              />
            </div>
          
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg border border-red-200 overflow-hidden">
          <div className="bg-red-50 p-6 border-b border-red-100">
            <h3 className="text-xl font-bold text-red-700">
              Danger Zone
            </h3>
            <p className="text-red-500 text-sm mt-1">
              Once you delete your account, there is no going back.
            </p>
          </div>

          <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="font-semibold text-gray-800">
                Delete Account
              </h4>
              <p className="text-sm text-gray-500">
                Permanently remove your RoadSOS account and all associated data.
              </p>
            </div>

            <Button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition"
            >
              <Trash2 size={18} />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 