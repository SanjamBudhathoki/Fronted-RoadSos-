import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { authService } from '../services/authService';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Lock, 
  Trash2, 
  Save,
  Smartphone,
  MapPin,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Eye,
  EyeOff,
  HelpCircle,
  FileText,
  Mail,
  X
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Settings State
  const [settings, setSettings] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pushNotifications: true,
    smsAlerts: true,
    emailAlerts: false,
    soundAlerts: true,
    vibrationAlerts: true,
    shareLocation: true,
    locationPrecision: 'high',
    autoShareWithContacts: false,
    emergencyContacts: [],
    darkMode: false,
    language: 'en',
    offlineMode: true,
    voiceActivation: true,
    twoFactorAuth: false,
    biometricLogin: false,
    sessionTimeout: '30',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      const profile = response?.data?.data || response?.data || response;
      const savedSettings = JSON.parse(localStorage.getItem('roadSOS_settings') || '{}');
      
      setSettings(prev => ({
        ...prev,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        ...savedSettings,
      }));
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await authService.updateProfile({
        firstName: settings.firstName,
        lastName: settings.lastName,
        phone: settings.phone,
      });

      const appSettings = {
        darkMode: settings.darkMode,
        language: settings.language,
        offlineMode: settings.offlineMode,
        voiceActivation: settings.voiceActivation,
        pushNotifications: settings.pushNotifications,
        smsAlerts: settings.smsAlerts,
        emailAlerts: settings.emailAlerts,
        soundAlerts: settings.soundAlerts,
        vibrationAlerts: settings.vibrationAlerts,
        shareLocation: settings.shareLocation,
        locationPrecision: settings.locationPrecision,
        autoShareWithContacts: settings.autoShareWithContacts,
        twoFactorAuth: settings.twoFactorAuth,
        biometricLogin: settings.biometricLogin,
        sessionTimeout: settings.sessionTimeout,
      };
      
      localStorage.setItem('roadSOS_settings', JSON.stringify(appSettings));
      setSuccess('✅ Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setError('');
      setSuccess('');

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      await authService.updateProfile({
        currentPassword: passwordData.currentPassword,
        password: passwordData.newPassword,
      });

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('🔒 Password changed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to change password:', err);
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      setError('Please fill in contact name and phone number');
      return;
    }

    setSettings(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { ...newContact, id: Date.now() }]
    }));
    setNewContact({ name: '', phone: '', relation: '' });
    setSuccess('📞 Emergency contact added!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleRemoveContact = (id) => {
    setSettings(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(c => c.id !== id)
    }));
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '⚠️ Are you absolutely sure?\n\nThis will permanently delete your account, all SOS history, and personal data. This action CANNOT be undone.'
    );
    
    if (!confirmed) return;

    const userInput = window.prompt('Type DELETE to confirm:');
    
    if (userInput !== 'DELETE') {
      setError('Account deletion cancelled. You must type DELETE exactly.');
      return;
    }

    try {
      await authService.deleteProfile();
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      console.error('Failed to delete account:', err);
      setError('Failed to delete account');
    }
  };

  // Custom Toggle Component
  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? 'bg-red-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-500 mt-1">Manage your account, notifications, and preferences</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm flex-1">{error}</p>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
              <X size={16} />
            </button>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl flex items-start gap-3">
            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm flex-1">{success}</p>
            <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-600">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="space-y-6">
          
          {/* Profile Settings */}
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-red-500" />
              Profile Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <Input
                  value={settings.firstName}
                  onChange={(e) => setSettings({ ...settings, firstName: e.target.value })}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <Input
                  value={settings.lastName}
                  onChange={(e) => setSettings({ ...settings, lastName: e.target.value })}
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  value={settings.email}
                  disabled
                  className="bg-gray-50 cursor-not-allowed text-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Bell className="h-5 w-5 text-red-500" />
              Notifications
            </h2>
            
            <div className="space-y-1">
              {[
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive alerts on your device' },
                { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Get text messages for emergencies' },
                { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive email notifications' },
                { key: 'soundAlerts', label: 'Sound Alerts', desc: 'Play sound for emergency alerts' },
                { key: 'vibrationAlerts', label: 'Vibration', desc: 'Vibrate on emergency alerts' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <Toggle 
                    enabled={settings[key]} 
                    onChange={(val) => setSettings({ ...settings, [key]: val })} 
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Privacy & Location */}
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-red-500" />
              Privacy & Location
            </h2>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Share Location</p>
                  <p className="text-xs text-gray-500">Share location during emergencies</p>
                </div>
                <Toggle 
                  enabled={settings.shareLocation} 
                  onChange={(val) => setSettings({ ...settings, shareLocation: val })} 
                />
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Location Precision</p>
                  <p className="text-xs text-gray-500">GPS accuracy level</p>
                </div>
                <select
                  value={settings.locationPrecision}
                  onChange={(e) => setSettings({ ...settings, locationPrecision: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white"
                >
                  <option value="high">High (GPS)</option>
                  <option value="medium">Medium (WiFi + Cell)</option>
                  <option value="low">Low (Cell only)</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Auto-Share with Contacts</p>
                  <p className="text-xs text-gray-500">Automatically notify emergency contacts</p>
                </div>
                <Toggle 
                  enabled={settings.autoShareWithContacts} 
                  onChange={(val) => setSettings({ ...settings, autoShareWithContacts: val })} 
                />
              </div>
            </div>
          </Card>

          {/* Emergency Contacts */}
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Smartphone className="h-5 w-5 text-red-500" />
              Emergency Contacts
            </h2>
            
            {settings.emergencyContacts.length > 0 && (
              <div className="space-y-2 mb-4">
                {settings.emergencyContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.phone}</p>
                      {contact.relation && (
                        <span className="inline-block mt-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          {contact.relation}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveContact(contact.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Add Emergency Contact</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="Contact name"
                  />
                  <Input
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
                <div className="flex gap-3">
                  <Input
                    value={newContact.relation}
                    onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                    placeholder="Relation (optional)"
                    className="flex-1"
                  />
                  <Button onClick={handleAddContact} size="md">
                    Add Contact
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* App Preferences */}
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Globe className="h-5 w-5 text-red-500" />
              App Preferences
            </h2>
            
            <div className="space-y-1">
              {[
                { key: 'darkMode', label: 'Dark Mode', desc: 'Switch to dark theme' },
                { key: 'voiceActivation', label: 'Voice Activation', desc: '"Hey RoadSOS" voice commands' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <Toggle 
                    enabled={settings[key]} 
                    onChange={(val) => setSettings({ ...settings, [key]: val })} 
                  />
                </div>
              ))}
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Language</p>
                  <p className="text-xs text-gray-500">Select your preferred language</p>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="hi">हिंदी</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-red-500" />
              Security
            </h2>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Add extra security layer</p>
                </div>
                <Toggle 
                  enabled={settings.twoFactorAuth} 
                  onChange={(val) => setSettings({ ...settings, twoFactorAuth: val })} 
                />
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Session Timeout</p>
                  <p className="text-xs text-gray-500">Auto logout after inactivity</p>
                </div>
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Change Password */}
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Lock className="h-5 w-5 text-red-500" />
              Change Password
            </h2>
            
            <div className="space-y-4">
              {['current', 'new', 'confirm'].map((field, idx) => (
                <div key={field} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field === 'current' ? 'Current Password' : 
                     field === 'new' ? 'New Password' : 'Confirm New Password'}
                  </label>
                  <Input
                    type={showPasswords[field] ? "text" : "password"}
                    value={passwordData[`${field}Password`]}
                    onChange={(e) => setPasswordData({ ...passwordData, [`${field}Password`]: e.target.value })}
                    placeholder={`Enter ${field === 'current' ? 'current' : field === 'new' ? 'new' : 'confirm new'} password`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] })}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords[field] ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              ))}
              
              <Button onClick={handleChangePassword} variant="primary" className="w-full">
                Update Password
              </Button>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              disabled={saving}
              loading={saving}
              variant="primary"
              size="lg"
              icon={<Save size={20} />}
            >
              {saving ? 'Saving...' : 'Save All Settings'}
            </Button>
          </div>

          {/* Danger Zone */}
          <Card className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-red-700 flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </h2>
            <p className="text-red-600 text-sm mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              icon={<Trash2 size={18} />}
              className="w-full"
            >
              Delete Account Permanently
            </Button>
          </Card>

          {/* Help Links */}
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-red-500" />
              Help & Support
            </h2>
            <div className="space-y-1">
              {[
                { icon: FileText, label: 'Privacy Policy' },
                { icon: FileText, label: 'Terms of Service' },
                { icon: Mail, label: 'Contact Support' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition text-sm text-gray-700"
                >
                  <span className="flex items-center gap-2">
                    <Icon size={18} className="text-gray-400" />
                    {label}
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              ))}
            </div>
          </Card>

          <p className="text-center text-xs text-gray-400 pb-8">
            RoadSOS v1.0.0 • Made with ❤️ for safer roads
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;