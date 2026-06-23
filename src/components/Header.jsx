import React, { useState, useCallback, useEffect } from "react";
import { 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X, 
  User, 
  ChevronDown,
  Settings,
  HelpCircle,
  Bell,
  Home,
  Activity,
  Wifi,
  WifiOff
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import NotificationBell from "./NotifyBell";

const NAV_ITEMS = [
  { id: 1, name: "Home", path: "/", icon: <Home size={16} /> },
  { id: 2, name: "Dashboard", path: "/user/dashbord", icon: <Activity size={16} /> },
  { id: 3, name: "Services", path: "/services", icon: <HelpCircle size={16} /> },
  { id: 4, name: "Support", path: "/support", icon: <HelpCircle size={16} /> },
];

const getUserInitial = (user) => {
  const firstName = user?.firstName || user?.name?.split(" ")[0] || "";
  const lastName = user?.lastName || user?.name?.split(" ")[1] || "";

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  if (firstName) {
    return firstName[0].toUpperCase();
  }

  return "U";
};

const UserProfile = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const initial = getUserInitial(user);
  const profileImage = localStorage.getItem("profileImage");
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 group p-1.5 rounded-xl hover:bg-gray-50 transition-all duration-200"
      >
        <div
          className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center font-bold border-2 border-white shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-200 ring-2 ring-red-100"
          title={`${user?.firstName} ${user?.lastName || ''} (${user?.role})`}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm">{initial}</span>
          )}
        </div>

        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-gray-800 leading-tight">
            {user?.firstName} {user?.lastName || ''}
          </p>
          <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            {user?.role || 'User'}
          </p>
        </div>

        <ChevronDown 
          size={16} 
          className={`hidden md:block text-gray-400 transition-transform duration-200 ${
            showDropdown ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-slideDown">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-semibold text-gray-900">
                {user?.firstName} {user?.lastName || ''}
              </p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold capitalize">
                {user?.role}
              </span>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={() => {
                  navigate('/user/profile');
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User size={16} className="text-gray-400" />
                View Profile
              </button>
              
              <button
                onClick={() => {
                  navigate('/settings');
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings size={16} className="text-gray-400" />
                Settings
              </button>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-100 pt-1 mt-1">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Logo = () => (
  <Link to="/" className="flex items-center gap-2.5 group">
    <div className="p-2 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors duration-200">
      <ShieldAlert className="h-6 w-6 text-red-600" aria-hidden="true" />
    </div>
    <div>
      <span className="text-xl font-bold text-gray-900">
        Road<span className="text-red-600">SOS</span>
      </span>
      <p className="text-[10px] text-gray-500 leading-tight -mt-0.5">Emergency Response</p>
    </div>
  </Link>
);

const NavLink = ({ item, onClick, isActive }) => (
  <Link
    to={item.path}
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
      isActive
        ? 'bg-red-50 text-red-600'
        : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
    }`}
  >
    {item.icon}
    {item.name}
  </Link>
);

const DesktopNav = ({ isAuthenticated, user, onLogout, currentPath }) => (
  <div className="hidden md:flex items-center gap-4">
    <nav className="flex items-center gap-1">
      {NAV_ITEMS.map((item) => (
        <NavLink 
          key={item.id} 
          item={item} 
          isActive={currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path))}
        />
      ))}
    </nav>

    <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
      {isAuthenticated ? (
        <>
          <NotificationBell />
          <UserProfile user={user} onLogout={onLogout} />
        </>
      ) : (
        <div className="flex items-center gap-3">
          <Link 
            to="/login" 
            className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>
      )}
    </div>
  </div>
);

const MobileNav = ({ isOpen, isAuthenticated, user, onClose, onLogout, currentPath }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      <div className="md:hidden fixed top-16 left-0 right-0 bg-white border-t shadow-2xl z-50 max-h-[calc(100vh-4rem)] overflow-y-auto animate-slideDown">
        <div className="px-4 py-4 flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavLink 
              key={item.id} 
              item={item} 
              onClick={onClose}
              isActive={currentPath === item.path}
            />
          ))}

          <hr className="my-2" />

          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center font-bold text-sm">
                  {getUserInitial(user)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {user?.firstName} {user?.lastName || ''}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              
              <Link
                to="/user/profile"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <User size={18} />
                View Profile
              </Link>
              
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg w-full"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={onClose}
                className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg text-center"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="block px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl text-center shadow-md"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const MobileMenuButton = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className="md:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95"
    aria-label={isOpen ? "Close menu" : "Open menu"}
    aria-expanded={isOpen}
    aria-controls="mobile-nav"
  >
    {isOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
  </button>
);

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [scrolled, setScrolled] = useState(false);

  // Online/Offline detection
  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // Scroll detection for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = useCallback(() => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/login");
  }, [logout, navigate]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b transition-all duration-300 ${
        scrolled 
          ? 'shadow-md border-gray-200' 
          : 'shadow-sm border-gray-100'
      }`}
    >
      {/* Offline Indicator */}
      {!online && (
        <div className="bg-amber-500 text-white text-xs text-center py-1.5 font-medium">
          <span className="flex items-center justify-center gap-2">
            <WifiOff size={14} />
            You're offline. Some features may be limited.
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex justify-between items-center">
          <Logo />
          <DesktopNav 
            isAuthenticated={isAuthenticated} 
            user={user} 
            onLogout={handleLogout}
            currentPath={location.pathname}
          />
          <MobileMenuButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
        </div>
      </div>

      <MobileNav
        id="mobile-nav"
        isOpen={isMobileMenuOpen}
        isAuthenticated={isAuthenticated}
        user={user}
        onClose={closeMobileMenu}
        onLogout={handleLogout}
        currentPath={location.pathname}
      />
    </header>
  );
};

export default Header;