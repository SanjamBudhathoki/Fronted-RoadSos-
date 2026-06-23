import React, { useState, useCallback } from "react";
import { ShieldAlert, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import NotificationBell from "./NotifyBell";

const NAV_ITEMS = [
  { id: 1, name: "Home", path: "/home" },
  { id: 2, name: "Services", path: "/services" },
  // { id: 3, name: "AI Technology", path: "/ai-tech" },
  { id: 4, name: "Support", path: "/support" },
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
  const initial = getUserInitial(user);
  const profileImage = localStorage.getItem("profileImage");

  return (
    <div className="flex items-center gap-4">
      {/* Profile */}
      <Link
        to="/user/profile"
        className="flex items-center gap-3 group"
      >
        <div
          className="w-11 h-11 rounded-full overflow-hidden bg-red-600 text-white flex items-center justify-center font-bold border-2 border-white shadow-md group-hover:scale-105 transition-transform"
          title={`${user?.firstName} (${user?.role})`}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            initial
          )}
        </div>

        <div className="hidden md:block">
          <p className="text-sm font-semibold text-gray-800">
            {user?.firstName}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {user?.role}
          </p>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-2 border-l pl-3">
        <NotificationBell />

        <button
          onClick={onLogout}
          className="
            flex items-center gap-2
            px-3 py-2
            rounded-lg
            bg-red-600 text-white
            hover:bg-red-700
            shadow-sm hover:shadow-md
            transition-all duration-200
          "
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
    <ShieldAlert className="h-8 w-8 text-red-600" aria-hidden="true" />
    <span className="text-2xl font-bold">
      Road<span className="text-red-600">SOS</span>
    </span>
  </Link>
);

const NavLink = ({ item, onClick }) => (
  <Link
    key={item.id}
    to={item.path}
    onClick={onClick}
    className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200"
  >
    {item.name}
  </Link>
);

const DesktopNav = ({ isAuthenticated, user, onLogout }) => (
  <div className="hidden md:flex items-center gap-8">
    <nav className="flex items-center gap-8">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.id} item={item} />
      ))}
    </nav>

    <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
      {isAuthenticated ? (
        <UserProfile user={user} onLogout={onLogout} />
      ) : (
        <>
          <Link to="/login" className="text-gray-700 font-medium hover:text-red-600 transition-colors">
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  </div>
);

const MobileNav = ({ isOpen, isAuthenticated, user, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t bg-white shadow-lg">
      <div className="px-4 py-4 flex flex-col gap-4">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.id} item={item} onClick={onClose} />
        ))}

        <hr className="my-2" />

        {isAuthenticated ? (
          <div className="space-y-4">
            <UserProfile user={user} onLogout={onLogout} />
          </div>
        ) : (
          <div className="space-y-3">
            <Link to="/login" className="block font-medium text-gray-700 hover:text-red-600">
              Login
            </Link>
            <Link
              to="/register"
              className="block px-4 py-2 rounded-lg bg-red-600 text-white text-center hover:bg-red-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const MobileMenuButton = ({ isOpen, onClick }) => (
  <Button
    onClick={onClick}
    className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
    aria-label={isOpen ? "Close menu" : "Open menu"}
    aria-expanded={isOpen}
    aria-controls="mobile-nav"
  >
    {isOpen ? <X size={28} /> : <Menu size={28} />}
  </Button>
);

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  console.log("HEADER USER:", user);
  console.log("AUTH:", isAuthenticated);


  
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex justify-between items-center">
          <Logo />
          <DesktopNav isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
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
      />
    </header>
  );
};

export default Header;