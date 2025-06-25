import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  Zap
} from 'lucide-react';
import { useFinancialData } from '../../hooks/useFinancialData';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const MOCK_USER = {
  name: 'Demo User',
  email: 'demo@financeflow.com',
  avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff',
};
const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'goal', title: 'Welcome to FinanceFlow!', message: 'Start by adding your first account.', read: false, createdAt: new Date().toISOString() },
  { id: 2, type: 'transaction', title: 'Demo Transaction', message: 'Try adding a transaction to see insights.', read: false, createdAt: new Date().toISOString() },
];

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, sidebarOpen }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const { data } = useFinancialData();
  const { signOut } = useAuth();
  const router = useRouter();

  const user = data?.user || MOCK_USER;
  const notifications = data?.notifications?.length ? data.notifications : MOCK_NOTIFICATIONS;
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setProfileDropdownOpen(false);
      setNotificationDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await signOut();
    router.push('/');
  };

  // Always render the full navbar, never a loading skeleton
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Menu Toggle with Animation */}
          <button
            onClick={onToggleSidebar}
            className="group p-2.5 rounded-2xl hover:bg-gray-100/80 transition-all duration-300 hover:scale-105 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative">
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-700 transform transition-transform duration-300 group-hover:rotate-90" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700 transform transition-transform duration-300 group-hover:rotate-180" />
              )}
            </div>
          </button>

          {/* Enhanced Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-gray-200/50">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Zap className="w-2 h-2 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                FinanceFlow
              </h1>
              <div className="flex items-center space-x-2 -mt-1">
                <p className="text-xs text-gray-500">AI-Powered Dashboard</p>
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Section - Enhanced Search */}
        {/* (You can add a search bar here if needed) */}

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Mobile Search */}
          <button className="md:hidden p-2.5 rounded-2xl hover:bg-gray-100/80 transition-all duration-200 hover:scale-105">
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-2xl hover:bg-gray-100/80 transition-all duration-200 hover:scale-105 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"></div>
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-600 relative z-10" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 relative z-10" />
            )}
          </button>

          {/* Enhanced Notifications */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNotificationDropdownOpen(!notificationDropdownOpen);
              }}
              className="relative p-2.5 rounded-2xl hover:bg-gray-100/80 transition-all duration-200 hover:scale-105 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"></div>
              <Bell className="w-5 h-5 text-gray-600 relative z-10" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Enhanced Notifications Dropdown */}
            {notificationDropdownOpen && notifications.length > 0 && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100 font-semibold text-gray-800">Notifications</div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif: any) => (
                    <div key={notif.id} className={`flex items-start space-x-3 px-4 py-3 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors duration-200`}>
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-lg">
                        {notif.type === 'goal' ? '🎯' : notif.type === 'transaction' ? '💸' : '🔔'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{notif.title}</div>
                        <div className="text-xs text-gray-500">{notif.message}</div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Profile Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              className="flex items-center space-x-2 p-2.5 rounded-2xl hover:bg-gray-100/80 transition-all duration-200 hover:scale-105 group"
            >
              <img src={user?.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
              <span className="hidden md:block font-medium text-gray-800 text-sm">{user?.name}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Enhanced Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <img src={user?.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                    <div>
                      <div className="font-semibold text-gray-900">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                  </div>
                </div>
                <button className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <User className="w-4 h-4 mr-2" /> Profile
                </button>
                <button className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </button>
                <button
                  className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 border-t border-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;