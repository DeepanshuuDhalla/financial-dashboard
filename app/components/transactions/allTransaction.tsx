"use client"
import React, { useState, useMemo, ReactNode, useEffect } from 'react';
import { 
  Search, Filter, Calendar, Download, Plus, ArrowUpDown, 
  Eye, EyeOff, TrendingUp, TrendingDown, DollarSign, 
  ChevronLeft, ChevronRight, Settings, Trash2, Edit3,
  ArrowUp, ArrowDown, MoreHorizontal, Star, Clock, X, Copy, Save
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';

// Type definitions
interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  subcategory: string;
  date: string;
  time: string;
  status: string;
  recurring: boolean;
  account: string;
  merchant: string;
  type: string;
}

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

interface ButtonProps {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'danger';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  [key: string]: any;
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  className?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface TransactionFormData {
  description: string;
  amount: number;
  category: string;
  subcategory: string;
  date: string;
  time: string;
  account: string;
  merchant: string;
  type: string;
  recurring: boolean;
}

// Enhanced Components with proper TypeScript
const Card: React.FC<CardProps> = ({ children, className = "", hover = true }) => (
  <div className={`bg-white border border-gray-100 rounded-xl shadow-sm ${hover ? 'hover:shadow-md' : ''} transition-all duration-200 ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<CardContentProps> = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "", 
  disabled = false, 
  type = "button",
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    outline: "border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm",
    ghost: "hover:bg-gray-50 text-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm"
  };
  
  const sizes: Record<string, string> = {
    default: "h-10 py-2 px-4 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => {
  const variants: Record<string, string> = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
    outline: "bg-white text-gray-700 border border-gray-300"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

// Fix: Add type for sort fields
const sortableFields = ['date', 'amount', 'description', 'category'] as const;
type SortField = typeof sortableFields[number];

const AllTransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [sortBy, setSortBy] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedTransactions, setSelectedTransactions] = useState(new Set());
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, description: 'Salary Deposit - Tech Corp', amount: 4800.00, category: 'Income', subcategory: 'Salary', date: '2024-06-20', time: '09:15 AM', status: 'completed', recurring: true, account: 'Checking', merchant: 'Tech Corp', type: 'credit' },
    { id: 2, description: 'Rent Payment - Downtown Apt', amount: -1200.00, category: 'Housing', subcategory: 'Rent', date: '2024-06-19', time: '08:00 AM', status: 'completed', recurring: true, account: 'Checking', merchant: 'Property Manager', type: 'debit' },
    { id: 3, description: 'S&P 500 ETF Purchase', amount: -800.00, category: 'Investment', subcategory: 'Stocks', date: '2024-06-18', time: '02:30 PM', status: 'completed', recurring: false, account: 'Investment', merchant: 'Vanguard', type: 'debit' },
    { id: 4, description: 'Whole Foods Market', amount: -127.85, category: 'Food', subcategory: 'Groceries', date: '2024-06-17', time: '06:45 PM', status: 'completed', recurring: false, account: 'Credit Card', merchant: 'Whole Foods', type: 'debit' },
    { id: 5, description: 'Electric Bill - June', amount: -89.42, category: 'Utilities', subcategory: 'Electricity', date: '2024-06-16', time: '10:00 AM', status: 'completed', recurring: true, account: 'Checking', merchant: 'Electric Company', type: 'debit' },
    { id: 6, description: 'Coffee Shop & Restaurants', amount: -64.30, category: 'Food', subcategory: 'Dining Out', date: '2024-06-15', time: '12:30 PM', status: 'completed', recurring: false, account: 'Credit Card', merchant: 'Local Cafe', type: 'debit' },
    { id: 7, description: 'Freelance Web Design', amount: 1200.00, category: 'Income', subcategory: 'Freelance', date: '2024-06-14', time: '04:20 PM', status: 'completed', recurring: false, account: 'Checking', merchant: 'Client XYZ', type: 'credit' },
    { id: 8, description: 'Gas Station - Shell', amount: -52.15, category: 'Transportation', subcategory: 'Fuel', date: '2024-06-13', time: '07:15 AM', status: 'completed', recurring: false, account: 'Credit Card', merchant: 'Shell', type: 'debit' },
    { id: 9, description: 'Netflix Subscription', amount: -15.99, category: 'Entertainment', subcategory: 'Streaming', date: '2024-06-12', time: '11:00 PM', status: 'completed', recurring: true, account: 'Credit Card', merchant: 'Netflix', type: 'debit' },
    { id: 10, description: 'Gym Membership', amount: -49.99, category: 'Health', subcategory: 'Fitness', date: '2024-06-11', time: '06:00 AM', status: 'completed', recurring: true, account: 'Checking', merchant: 'Local Gym', type: 'debit' },
    { id: 11, description: 'Amazon Purchase', amount: -156.78, category: 'Shopping', subcategory: 'Online', date: '2024-06-10', time: '03:45 PM', status: 'completed', recurring: false, account: 'Credit Card', merchant: 'Amazon', type: 'debit' },
    { id: 12, description: 'Uber Ride', amount: -23.50, category: 'Transportation', subcategory: 'Rideshare', date: '2024-06-09', time: '09:30 PM', status: 'completed', recurring: false, account: 'Credit Card', merchant: 'Uber', type: 'debit' },
    { id: 13, description: 'Dividend Payment - AAPL', amount: 45.67, category: 'Investment', subcategory: 'Dividends', date: '2024-06-08', time: '12:00 PM', status: 'completed', recurring: true, account: 'Investment', merchant: 'Apple Inc', type: 'credit' },
    { id: 14, description: 'Pharmacy - CVS', amount: -34.21, category: 'Health', subcategory: 'Pharmacy', date: '2024-06-07', time: '02:15 PM', status: 'completed', recurring: false, account: 'Credit Card', merchant: 'CVS', type: 'debit' },
    { id: 15, description: 'Internet Bill', amount: -79.99, category: 'Utilities', subcategory: 'Internet', date: '2024-06-06', time: '08:30 AM', status: 'completed', recurring: true, account: 'Checking', merchant: 'ISP Provider', type: 'debit' }
  ]);

  const itemsPerPage = 15;

  const categories = ['all', 'Income', 'Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Investment'];
  const subcategories = {
    'Income': ['Salary', 'Freelance', 'Investment', 'Bonus'],
    'Housing': ['Rent', 'Mortgage', 'Utilities', 'Maintenance'],
    'Food': ['Groceries', 'Dining Out', 'Takeout', 'Coffee'],
    'Transportation': ['Fuel', 'Public Transit', 'Rideshare', 'Maintenance'],
    'Utilities': ['Electricity', 'Water', 'Internet', 'Phone'],
    'Entertainment': ['Streaming', 'Movies', 'Games', 'Events'],
    'Health': ['Pharmacy', 'Fitness', 'Medical', 'Insurance'],
    'Shopping': ['Online', 'Clothing', 'Electronics', 'Home'],
    'Investment': ['Stocks', 'Bonds', 'Crypto', 'Real Estate']
  };
  const accounts = ['Checking', 'Savings', 'Credit Card', 'Investment'];
  const periods = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' },
    { key: '1y', label: '1 Year' }
  ];

  // Analytics
  const analytics = useMemo(() => {
    const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const netFlow = totalIncome - totalExpenses;
    const avgTransaction = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / transactions.length;
    
    return {
      totalIncome,
      totalExpenses,
      netFlow,
      avgTransaction,
      totalTransactions: transactions.length
    };
  }, [transactions]);

  // Fix: Use type-safe mapping for sorting
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => 
        (selectedCategory === 'all' || t.category === selectedCategory) &&
        (searchTerm === '' || 
         t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
         t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
         t.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .sort((a, b) => {
        let aValue: string | number = '';
        let bValue: string | number = '';
        if (sortBy === 'amount') {
          aValue = Math.abs(a.amount);
          bValue = Math.abs(b.amount);
        } else if (sortBy === 'date') {
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
        } else if (sortBy === 'description') {
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
        } else if (sortBy === 'category') {
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
        }
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  }, [transactions, selectedCategory, searchTerm, sortBy, sortOrder]);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Chart data for spending trend - Fix to use current date format
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i)); // Start from 7 days ago and go forward
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayTransactions = transactions.filter(t => t.date === date);
      const income = dayTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
      const expenses = dayTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        income,
        expenses,
        net: income - expenses
      };
    });
  }, [transactions]);

  // Add some sample data for the current week to make chart visible
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Add sample transactions for current dates if they don't exist
    const hasCurrentData = transactions.some(t => 
      t.date === today || t.date === yesterday || t.date === twoDaysAgo
    );
    
    if (!hasCurrentData) {
      const sampleTransactions: Transaction[] = [
        {
          id: Math.max(...transactions.map(t => t.id)) + 1,
          description: 'Coffee Shop',
          amount: -5.50,
          category: 'Food',
          subcategory: 'Coffee',
          date: today,
          time: '08:30',
          status: 'completed',
          recurring: false,
          account: 'Credit Card',
          merchant: 'Starbucks',
          type: 'debit'
        },
        {
          id: Math.max(...transactions.map(t => t.id)) + 2,
          description: 'Lunch',
          amount: -15.75,
          category: 'Food',
          subcategory: 'Dining Out',
          date: yesterday,
          time: '12:15',
          status: 'completed',
          recurring: false,
          account: 'Credit Card',
          merchant: 'Local Restaurant',
          type: 'debit'
        },
        {
          id: Math.max(...transactions.map(t => t.id)) + 3,
          description: 'Freelance Payment',
          amount: 500.00,
          category: 'Income',
          subcategory: 'Freelance',
          date: twoDaysAgo,
          time: '14:00',
          status: 'completed',
          recurring: false,
          account: 'Checking',
          merchant: 'Client ABC',
          type: 'credit'
        }
      ];
      
      setTransactions(prev => [...sampleTransactions, ...prev]);
    }
  }, [transactions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen !== null) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Fix: Add type to handleSort
  const handleSort = (field: SortField) => {
    console.log('Sorting by:', field);
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Fix: Add type to toggleTransactionSelection
  const toggleTransactionSelection = (id: number) => {
    console.log('Toggling selection for transaction:', id);
    const newSelection = new Set(selectedTransactions);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedTransactions(newSelection);
  };

  const selectAllTransactions = () => {
    console.log('Select all transactions');
    if (selectedTransactions.size === paginatedTransactions.length) {
      setSelectedTransactions(new Set());
    } else {
      setSelectedTransactions(new Set(paginatedTransactions.map(t => t.id)));
    }
  };

  const handleDropdownToggle = (id: number) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setDropdownOpen(null);
  };

  const handleDuplicateTransaction = (transaction: Transaction) => {
    const newTransaction = {
      ...transaction,
      id: Math.max(...transactions.map(t => t.id)) + 1,
      description: `${transaction.description} (Copy)`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setDropdownOpen(null);
  };

  // Form state
  const [formData, setFormData] = useState<TransactionFormData>({
    description: '',
    amount: 0,
    category: 'Food',
    subcategory: 'Groceries',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    account: 'Checking',
    merchant: '',
    type: 'debit',
    recurring: false
  });

  // Modal Component (moved inside to access isEditMode)
  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200/50">
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 rounded-t-2xl">
            <div className="flex justify-between items-center p-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Transaction' : 'Add New Transaction'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {isEditMode ? 'Update transaction details' : 'Enter transaction information'}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          {children}
        </div>
      </div>
    );
  };

  // Modal handlers
  const openAddModal = () => {
    console.log('Add modal opened');
    setIsEditMode(false);
    setEditingTransaction(null);
    setFormData({
      description: '',
      amount: 0,
      category: 'Food',
      subcategory: 'Groceries',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      account: 'Checking',
      merchant: '',
      type: 'debit',
      recurring: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (transaction: Transaction) => {
    console.log('Edit modal opened for transaction:', transaction.id);
    setIsEditMode(true);
    setEditingTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: Math.abs(transaction.amount),
      category: transaction.category,
      subcategory: transaction.subcategory,
      date: transaction.date,
      time: transaction.time,
      account: transaction.account,
      merchant: transaction.merchant,
      type: transaction.type,
      recurring: transaction.recurring
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('Modal closed');
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingTransaction(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    const newTransaction: Transaction = {
      id: isEditMode && editingTransaction ? editingTransaction.id : Math.max(...transactions.map(t => t.id)) + 1,
      description: formData.description,
      amount: formData.type === 'debit' ? -Math.abs(formData.amount) : Math.abs(formData.amount),
      category: formData.category,
      subcategory: formData.subcategory,
      date: formData.date,
      time: formData.time,
      status: 'completed',
      recurring: formData.recurring,
      account: formData.account,
      merchant: formData.merchant,
      type: formData.type
    };

    if (isEditMode && editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? newTransaction : t));
    } else {
      setTransactions(prev => [newTransaction, ...prev]);
    }

    closeModal();
  };

  const handleFormChange = (field: keyof TransactionFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Header */}
        <Card>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  All Transactions
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Manage your financial transactions
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="flex-1 sm:flex-none">
                  <Filter className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => {}} className="flex-1 sm:flex-none">
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                <Button size="sm" onClick={openAddModal} className="flex-1 sm:flex-none">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Income</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setBalanceVisible(!balanceVisible)} className="h-8 w-8">
                  {balanceVisible ? <Eye className="w-3 h-3 sm:w-4 sm:h-4" /> : <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />}
                </Button>
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                {balanceVisible ? `+$${analytics.totalIncome.toLocaleString()}` : '••••••••'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Expenses</span>
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">
                {balanceVisible ? `-$${analytics.totalExpenses.toLocaleString()}` : '••••••••'}
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Net Flow</span>
              </div>
              <div className={`text-lg sm:text-xl md:text-2xl font-bold ${analytics.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {balanceVisible ? `${analytics.netFlow >= 0 ? '+' : ''}$${analytics.netFlow.toLocaleString()}` : '••••••••'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spending Trend Chart */}
        <Card>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Spending Trend</h3>
                  <p className="text-sm text-gray-600">Last 7 days transaction overview</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Net: +${chartData.reduce((sum, day) => sum + day.net, 0).toFixed(2)}
                  </Badge>
                </div>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value: number, name: string) => [
                        `$${Math.abs(value).toFixed(2)}`, 
                        name === 'income' ? 'Income' : name === 'expenses' ? 'Expenses' : 'Net'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fill="url(#incomeGradient)"
                      name="income"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      fill="url(#expenseGradient)"
                      name="expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortField)}
                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    {sortableFields.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchTerm('');
                      setSortBy('date');
                      setSortOrder('desc');
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Actions */}
        <Card>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full bg-white shadow-sm"
                />
              </div>
              
              {selectedTransactions.size > 0 && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs sm:text-sm text-gray-600">
                    {selectedTransactions.size} selected
                  </span>
                  <Button variant="danger" size="sm" onClick={() => {}} className="flex-1 sm:flex-none">
                    <Trash2 className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="border-b border-gray-200 bg-gray-50/50">
                  <tr>
                    <th className="text-left p-4">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.size === paginatedTransactions.length && paginatedTransactions.length > 0}
                        onChange={selectAllTransactions}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('description')}>
                      <div className="flex items-center gap-2 pointer-events-none">
                        Transaction
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('category')}>
                      <div className="flex items-center gap-2 pointer-events-none">
                        Category
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('amount')}>
                      <div className="flex items-center gap-2 pointer-events-none">
                        Amount
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('date')}>
                      <div className="flex items-center gap-2 pointer-events-none">
                        Date & Time
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">Account</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedTransactions.has(transaction.id)}
                          onChange={() => toggleTransactionSelection(transaction.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900 truncate max-w-xs">{transaction.description}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{transaction.merchant}</div>
                          {transaction.recurring && (
                            <Badge variant="info" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              Recurring
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <Badge variant="default">{transaction.category}</Badge>
                          <div className="text-xs text-gray-500">{transaction.subcategory}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`font-bold text-lg ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">{transaction.type}</div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{transaction.date}</div>
                          <div className="text-sm text-gray-500">{transaction.time}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{transaction.account}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="success">
                          {transaction.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 relative z-10">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEditModal(transaction)}
                            className="pointer-events-auto"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <div className="relative">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDropdownToggle(transaction.id)}
                              className="pointer-events-auto"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                            
                            {dropdownOpen === transaction.id && (
                              <div 
                                className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      openEditModal(transaction);
                                      setDropdownOpen(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDuplicateTransaction(transaction)}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <Copy className="w-4 h-4" />
                                    Duplicate
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTransaction(transaction.id)}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3 p-4">
              {paginatedTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <DollarSign className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                  <Button onClick={openAddModal}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Transaction
                  </Button>
                </div>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedTransactions.has(transaction.id)}
                          onChange={() => toggleTransactionSelection(transaction.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{transaction.description}</div>
                          <div className="text-sm text-gray-500 truncate">{transaction.merchant}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <div className="relative">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDropdownToggle(transaction.id)}
                            className="pointer-events-auto h-8 w-8"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                          
                          {dropdownOpen === transaction.id && (
                            <div 
                              className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    openEditModal(transaction);
                                    setDropdownOpen(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Edit3 className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDuplicateTransaction(transaction)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Copy className="w-4 h-4" />
                                  Duplicate
                                </button>
                                <button
                                  onClick={() => handleDeleteTransaction(transaction.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 text-xs">Amount:</span>
                        <div className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Category:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="default" className="text-xs">{transaction.category}</Badge>
                          {transaction.recurring && (
                            <Badge variant="info" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              Recurring
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Date:</span>
                        <div className="font-medium text-sm">{transaction.date}</div>
                        <div className="text-xs text-gray-500">{transaction.time}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Account:</span>
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">{transaction.account}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Empty State for Desktop */}
            {paginatedTransactions.length === 0 && (
              <div className="hidden lg:block text-center py-12">
                <div className="text-gray-400 mb-4">
                  <DollarSign className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                <Button onClick={openAddModal}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Transaction
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 border-t border-gray-200 gap-4">
                <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="h-8 px-3"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = currentPage <= 3 ? i + 1 : 
                                     currentPage >= totalPages - 2 ? totalPages - 4 + i :
                                     currentPage - 2 + i;
                      
                      if (pageNum < 1 || pageNum > totalPages) return null;
                      
                      return (
                        <Button
                          key={`page-${pageNum}-${i}`}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="min-w-[32px] h-8 px-2"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="h-8 px-3"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Transaction Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        >
          <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter transaction description"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleFormChange('amount', parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleFormChange('type', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="debit">Expense (Debit)</option>
                    <option value="credit">Income (Credit)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      handleFormChange('category', e.target.value);
                      handleFormChange('subcategory', subcategories[e.target.value as keyof typeof subcategories]?.[0] || '');
                    }}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.filter(c => c !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => handleFormChange('subcategory', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {subcategories[formData.category as keyof typeof subcategories]?.map(subcategory => (
                      <option key={subcategory} value={subcategory}>{subcategory}</option>
                    )) || []}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleFormChange('date', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleFormChange('time', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account *</label>
                  <select
                    value={formData.account}
                    onChange={(e) => handleFormChange('account', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {accounts.map(account => (
                      <option key={account} value={account}>{account}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Merchant</label>
                  <input
                    type="text"
                    value={formData.merchant}
                    onChange={(e) => handleFormChange('merchant', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter merchant name"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.recurring}
                  onChange={(e) => handleFormChange('recurring', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="recurring" className="text-sm text-gray-700 cursor-pointer">
                  This is a recurring transaction
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <Button type="submit" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {isEditMode ? 'Update' : 'Add'} Transaction
              </Button>
              <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* Quick Stats Footer */}
        <Card>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{analytics.totalTransactions}</div>
                <div className="text-sm text-gray-600">Total Transactions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {transactions.filter(t => t.amount > 0).length}
                </div>
                <div className="text-sm text-gray-600">Income Transactions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {transactions.filter(t => t.amount < 0).length}
                </div>
                <div className="text-sm text-gray-600">Expense Transactions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {transactions.filter(t => t.recurring).length}
                </div>
                <div className="text-sm text-gray-600">Recurring</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllTransactionsPage;