import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Target,
  CreditCard,
  PieChart,
  Settings,
  HelpCircle,
  ChevronRight,
  Plus,
  Wallet,
  Receipt,
  Calendar,
  BarChart3,
  Filter,
  Download,
  Upload,
  Bell,
  Shield,
  User,
  Bookmark,
  Archive,
  Zap,
  Brain,
  Sparkles,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Smartphone,
  Headphones
} from 'lucide-react';
import { useFinancialData } from '../../hooks/useFinancialData';

interface MenuItemType {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string | null;
  path: string;
  submenu?: MenuItemType[];
  color?: string;
  bgColor?: string;
  gradient?: string;
}

interface QuickActionType {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
  gradient?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onRouteChange: (route: string) => void;
  currentRoute: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onRouteChange, currentRoute }) => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [aiInsights, setAiInsights] = useState<boolean>(true);
  const [balanceVisible, setBalanceVisible] = useState<boolean>(true);
  const { data, loading } = useFinancialData();

  const user = data?.user;
  const accounts = user?.accounts || [];
  const totalBalance = accounts.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0);
  const recentActivity = data?.recentActivity || [];
  const activeGoals = data?.goals?.active?.length || 0;
  const completedGoals = data?.goals?.completed?.length || 0;
  const archivedGoals = data?.goals?.archived?.length || 0;
  const transactionsCount = data?.transactions?.all?.length || 0;

  const toggleExpandedMenu = (menuKey: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const mainMenuItems: MenuItemType[] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      path: '/dashboard',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      key: 'transactions',
      label: 'Transactions',
      icon: Receipt,
      badge: transactionsCount ? String(transactionsCount) : null,
      path: '/transactions',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      submenu: [
        { key: 'all-transactions', label: 'All Transactions', icon: Receipt, path: '/transactions/all', color: 'text-gray-600', bgColor: 'bg-gray-50' },
        { key: 'income', label: 'Income', icon: TrendingUp, path: '/transactions/income', color: 'text-green-600', bgColor: 'bg-green-50' },
        { key: 'expenses', label: 'Expenses', icon: TrendingDown, path: '/transactions/expenses', color: 'text-red-600', bgColor: 'bg-red-50' },
        { key: 'recurring', label: 'Recurring', icon: Calendar, path: '/transactions/recurring', color: 'text-purple-600', bgColor: 'bg-purple-50' },
      ]
    },
    {
      key: 'goals',
      label: 'Savings Goals',
      icon: Target,
      badge: String(activeGoals),
      path: '/goals',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      submenu: [
        { key: 'active-goals', label: 'Active Goals', icon: Target, path: '/goals/active', color: 'text-green-600', bgColor: 'bg-green-50' },
        { key: 'completed-goals', label: 'Completed', icon: Bookmark, path: '/goals/completed', color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { key: 'archived-goals', label: 'Archived', icon: Archive, path: '/goals/archived', color: 'text-gray-600', bgColor: 'bg-gray-50' },
      ]
    },
    {
      key: 'accounts',
      label: 'Accounts',
      icon: Wallet,
      badge: null,
      path: '/accounts',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      submenu: [
        { key: 'bank-accounts', label: 'Bank Accounts', icon: Wallet, path: '/accounts/bank', color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { key: 'credit-cards', label: 'Credit Cards', icon: CreditCard, path: '/accounts/credit', color: 'text-red-600', bgColor: 'bg-red-50' },
        { key: 'investments', label: 'Investments', icon: TrendingUp, path: '/accounts/investments', color: 'text-green-600', bgColor: 'bg-green-50' },
      ]
    }
  ];

  const quickActions: QuickActionType[] = [
    { 
      key: 'add-income', 
      label: 'Add Income', 
      icon: Plus, 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      gradient: 'from-green-400 to-emerald-500'
    },
    { 
      key: 'add-expense', 
      label: 'Add Expense', 
      icon: TrendingDown, 
      color: 'text-red-600', 
      bg: 'bg-red-50',
      gradient: 'from-red-400 to-pink-500'
    },
    { 
      key: 'new-goal', 
      label: 'New Goal', 
      icon: Target, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      gradient: 'from-blue-400 to-cyan-500'
    },
    { 
      key: 'ai-insights', 
      label: 'AI Insights', 
      icon: Brain, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      gradient: 'from-purple-400 to-pink-500'
    },
  ];

  const bottomMenuItems: MenuItemType[] = [
    { key: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { key: 'security', label: 'Security', icon: Shield, path: '/security', color: 'text-green-600', bgColor: 'bg-green-50' },
    { key: 'profile', label: 'Profile', icon: User, path: '/profile', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { key: 'settings', label: 'Settings', icon: Settings, path: '/settings', color: 'text-gray-600', bgColor: 'bg-gray-50' },
    { key: 'help', label: 'Help & Support', icon: HelpCircle, path: '/help', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  ];

  const MenuItem: React.FC<{ item: MenuItemType; level?: number }> = ({ item, level = 0 }) => {
    const isActive = currentRoute === item.key;
    const isExpanded = expandedMenus[item.key];
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    
    return (
      <div className="mb-1">
        <button
          onClick={() => {
            onRouteChange(item.key);
            if (hasSubmenu) {
              toggleExpandedMenu(item.key);
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
            isActive 
              ? 'bg-gradient-to-r from-white to-gray-50 text-gray-900 shadow-lg border border-gray-200/50 scale-105' 
              : 'text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-md'
          } ${level > 0 ? 'ml-6 mr-2' : ''}`}
        >
          {/* Simplified background gradient - no blur during scroll */}
          <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient || 'from-gray-100 to-gray-50'} opacity-0 group-hover:opacity-20 transition-opacity duration-200 rounded-2xl`}></div>
          
          <div className="flex items-center space-x-3 relative z-10">
            <div className={`p-2 rounded-xl transition-all duration-200 ${
              isActive 
                ? `${item.bgColor} shadow-sm scale-110` 
                : `group-hover:${item.bgColor} group-hover:shadow-sm group-hover:scale-105`
            }`}>
              <item.icon className={`w-4 h-4 transition-all duration-200 ${
                isActive ? item.color : `text-gray-500 group-hover:${item.color}`
              }`} />
            </div>
            <span className={`font-medium text-sm transition-all duration-200 ${
              isActive ? 'text-gray-900 font-semibold' : 'text-gray-600'
            }`}>
              {item.label}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 relative z-10">
            {item.badge && (
              <span className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-sm' 
                  : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
              }`}>
                {item.badge}
              </span>
            )}
            {hasSubmenu && (
              <ChevronRight className={`w-4 h-4 transition-all duration-200 ${
                isExpanded ? 'rotate-90 scale-110' : ''
              } ${isActive ? 'text-gray-800' : 'text-gray-400'}`} />
            )}
          </div>
        </button>

        {hasSubmenu && isExpanded && (
          <div className="mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {item.submenu!.map((subItem) => (
              <MenuItem key={subItem.key} item={subItem} level={1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  }, [currentRoute, onClose]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <style jsx>{`
        /* Custom Scrollbar Styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
          margin: 8px 0;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #e5e7eb 0%, #d1d5db 50%, #9ca3af 100%);
          border-radius: 10px;
          transition: all 0.2s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #d1d5db 0%, #9ca3af 50%, #6b7280 100%);
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(180deg, #9ca3af 0%, #6b7280 50%, #4b5563 100%);
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }
        
        /* Smooth scrolling performance optimizations */
        .smooth-scroll {
          scroll-behavior: smooth;
          overflow-y: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Reduce paint complexity during scroll */
        .scroll-optimized {
          will-change: scroll-position;
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-white/98 border-r border-gray-200/50 transform transition-all duration-300 ease-in-out shadow-xl z-30 scroll-optimized ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        <div className="flex flex-col h-full smooth-scroll custom-scrollbar overflow-y-auto">
          {/* Main Navigation - Scrollable */}
          <div className="px-6">
            <div className="space-y-2 py-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 text-sm">Navigation</h3>
                  <Activity className="w-4 h-4 text-gray-400" />
                </div>
                {mainMenuItems.map((item) => (
                  <MenuItem key={item.key} item={item} />
                ))}
              </div>

              {/* Enhanced Recent Activity */}
              <div className="mt-8 p-5 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200/50 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800 text-sm">Recent Activity</h4>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Live</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {recentActivity.map((activity: any) => (
                    <div key={activity.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{activity.icon}</span>
                        <div>
                          <p className="text-xs font-medium text-gray-700">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-semibold ${activity.color}`}>{activity.amount}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => onRouteChange('all-transactions')}
                  className="w-full mt-3 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium"
                >
                  View all transactions →
                </button>
              </div>
                
              {/* Enhanced Header - Account Balance */}
              <div className="px-4 py-6 border-t border-gray-200/50">
                <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 border border-gray-700/50 shadow-2xl overflow-hidden">
                  {/* Simplified animated background elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white text-sm">Total Balance</h3>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                      <button
                        onClick={() => setBalanceVisible(!balanceVisible)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors duration-200"
                      >
                        {balanceVisible ? (
                          <span className="text-white/70 text-xs">👁️</span>
                        ) : (
                          <span className="text-white/70 text-xs">🙈</span>
                        )}
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-3xl font-bold text-white mb-1">
                          {balanceVisible ? totalBalance.toFixed(2) : '••••••••'}
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center text-green-400">
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                            <span className="text-sm font-medium">+2.5%</span>
                          </div>
                          <span className="text-white/60 text-sm">vs last month</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
                        <div>
                          <p className="text-white/60 text-xs">Income</p>
                          <p className="text-green-400 font-semibold text-sm">+$5,240</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-xs">Expenses</p>
                          <p className="text-red-400 font-semibold text-sm">-$3,180</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Navigation - Desktop */}
              <div className="mt-8 hidden lg:block">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 text-sm">Account</h3>
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-1">
                  {bottomMenuItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => onRouteChange(item.key)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm group ${
                        currentRoute === item.key
                          ? 'bg-white text-gray-900 shadow-lg border border-gray-200/50'
                          : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
                      }`}
                    >
                      <div className={`p-2 rounded-xl transition-all duration-200 ${
                        currentRoute === item.key 
                          ? `${item.bgColor} shadow-sm` 
                          : `group-hover:${item.bgColor}`
                      }`}>
                        <item.icon className={`w-4 h-4 ${
                          currentRoute === item.key ? item.color : `text-gray-500 group-hover:${item.color}`
                        }`} />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              

              {/* Mobile Bottom Navigation */}
              <div className="mt-8 lg:hidden pb-4">
                <h3 className="font-semibold text-gray-800 text-sm mb-4">Account</h3>
                <div className="space-y-1">
                  {bottomMenuItems.map((item) => (
                    <MenuItem key={item.key} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Area */}
          <div className="">
            {/* AI Insights Banner */}
            {aiInsights && (
              <div className="mx-6 mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200/50 relative overflow-hidden">
                <button
                  onClick={() => setAiInsights(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  ×
                </button>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">AI Insight</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      You're spending 23% more on dining this month. Consider setting a limit?
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Enhanced Quick Actions */}
            <div className="p-6 border-t border-gray-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 text-sm">Quick Actions</h3>
                <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.key}
                    onClick={() => {
                      switch (action.key) {
                        case 'add-income':
                          onRouteChange('income');
                          break;
                        case 'add-expense':
                          onRouteChange('expenses');
                          break;
                        case 'new-goal':
                          onRouteChange('active-goals');
                          break;
                        case 'ai-insights':
                          // Handle AI insights - could open a modal or navigate to analytics
                          console.log('AI Insights clicked');
                          break;
                        default:
                          break;
                      }
                    }}
                    className={`relative p-4 rounded-2xl ${action.bg} hover:scale-105 transition-all duration-200 group border border-gray-200/50 shadow-sm overflow-hidden`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-2xl`}></div>
                    <div className="relative z-10">
                      <action.icon className={`w-5 h-5 ${action.color} mb-2 group-hover:scale-110 transition-transform duration-200`} />
                      <p className="text-xs font-medium text-gray-700 leading-tight">{action.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>  
                      
            {/* Footer */}
            <div className="p-6 border-t border-gray-200/50">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>All systems operational</span>
                </div>
                <span>v2.1.0</span>
              </div>
            </div>
          </div>    
        </div>
      </aside>
    </>
  );
};

export default Sidebar;