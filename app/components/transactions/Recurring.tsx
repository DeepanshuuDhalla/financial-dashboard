"use client"
import React, { useState, useEffect, ReactNode } from 'react';
import { Plus, Search, Edit, Trash2, DollarSign, Calendar, Filter, Eye, EyeOff, X, Save, Clock, Repeat, AlertTriangle, Target, BarChart3, PieChart, Play, Pause, Settings, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import FullscreenModal from "../common/FullscreenModal";
import { MOCK_TRANSACTIONS } from '../../lib/mockData';
import { useFinancialData } from '../../hooks/useFinancialData';

// Enhanced shadcn-style components with proper TypeScript
const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`flex flex-col space-y-1.5 p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <h3 className={`text-lg sm:text-xl lg:text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`text-xs sm:text-sm text-slate-500 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`p-4 pt-0 sm:p-6 sm:pt-0 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = "default", size = "default", className = "", onClick, disabled, type = "button" }: {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'danger' | 'secondary' | 'success';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}) => {
  const variants = {
    default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-red-500 text-white hover:bg-red-600",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    success: "bg-green-500 text-white hover:bg-green-600"
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 sm:h-9 rounded-md px-2 sm:px-3 text-xs sm:text-sm",
    lg: "h-10 sm:h-11 rounded-md px-4 sm:px-8"
  };
  
  return (
    <button 
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }: { className?: string; [key: string]: any }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Select = ({ children, value, onChange, className = "" }: { 
  children: ReactNode; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; 
  className?: string; 
}) => (
  <select
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {children}
  </select>
);

const Badge = ({ children, variant = "default", className = "" }: { 
  children: ReactNode; 
  variant?: 'default' | 'secondary' | 'success' | 'destructive' | 'outline' | 'warning';
  className?: string;
}) => {
  const variants = {
    default: "bg-slate-900 text-slate-50 hover:bg-slate-900/80",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    success: "bg-green-100 text-green-800 hover:bg-green-100/80",
    destructive: "bg-red-100 text-red-800 hover:bg-red-100/80",
    outline: "border border-slate-200 text-slate-950",
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
  };
  
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

interface RecurringTransaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextDue: string;
  lastProcessed: string;
  status: 'active' | 'paused' | 'cancelled';
  autoRenew: boolean;
  merchant: string;
  paymentMethod: string;
  priority: 'low' | 'medium' | 'high';
  notes: string;
}

const RecurringPage = () => {
  const { data, usingMockData, showMockWarning, onRealDataAdded } = useFinancialData();
  const [recurringData, setRecurringData] = useState<RecurringTransaction[]>(data.transactions.filter(t => t.recurring));
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [frequencyFilter, setFrequencyFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecurringTransaction | null>(null);
  const [showAmounts, setShowAmounts] = useState(true);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: 'Food',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly',
    nextDue: '',
    status: 'active' as 'active' | 'paused' | 'cancelled',
    autoRenew: true,
    merchant: '',
    paymentMethod: 'Credit Card',
    priority: 'medium' as 'low' | 'medium' | 'high',
    notes: ''
  });

  // Chart data for recurring trends
  const chartData = [
    { month: 'Jan', income: 6000, expenses: 1500, net: 4500 },
    { month: 'Feb', income: 6000, expenses: 1500, net: 4500 },
    { month: 'Mar', income: 6000, expenses: 1500, net: 4500 },
    { month: 'Apr', income: 6000, expenses: 1500, net: 4500 },
    { month: 'May', income: 6000, expenses: 1500, net: 4500 },
    { month: 'Jun', income: 6000, expenses: 1500, net: 4500 }
  ];

  // Calculate category data from actual recurring data
  const calculateCategoryData = () => {
    const categoryTotals = recurringData.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {} as Record<string, number>);

    const colors: Record<string, string> = {
      'Salary': '#10b981',
      'Freelance': '#3b82f6',
      'Investment': '#f59e0b',
      'Housing': '#ef4444',
      'Utilities': '#8b5cf6',
      'Entertainment': '#ec4899',
      'Health': '#06b6d4',
      'Other': '#64748b'
    };

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      fill: colors[category] || '#64748b'
    }));
  };

  const categoryData = calculateCategoryData();

  // Advanced calculations
  const totalRecurringIncome = recurringData.filter(item => item.type === 'income' && item.status === 'active').reduce((sum, item) => sum + item.amount, 0);
  const totalRecurringExpenses = recurringData.filter(item => item.type === 'expense' && item.status === 'active').reduce((sum, item) => sum + item.amount, 0);
  const netRecurringFlow = totalRecurringIncome - totalRecurringExpenses;
  const activeRecurring = recurringData.filter(item => item.status === 'active').length;
  const pausedRecurring = recurringData.filter(item => item.status === 'paused').length;
  const upcomingDue = recurringData.filter(item => {
    const nextDue = new Date(item.nextDue);
    const today = new Date();
    const diffTime = nextDue.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }).length;

  const types = ['All', 'Income', 'Expense'];
  const statuses = ['All', 'Active', 'Paused', 'Cancelled'];
  const frequencies = ['All', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
  const categories = ['All', ...Array.from(new Set(recurringData.map(item => item.category)))];
  const paymentMethods = ['Credit Card', 'Debit Card', 'Bank Transfer', 'Direct Deposit', 'PayPal', 'Auto Pay', 'Cash'];

  const filteredData = recurringData.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || item.type === typeFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter.toLowerCase();
    const matchesFrequency = frequencyFilter === 'All' || item.frequency === frequencyFilter.toLowerCase();
    return matchesSearch && matchesType && matchesStatus && matchesFrequency;
  });

  const handleAdd = () => {
    console.log('Add Recurring button clicked');
    setEditingItem(null);
    setFormData({ 
      description: '', 
      amount: '', 
      type: 'expense', 
      category: 'Food', 
      frequency: 'monthly', 
      nextDue: '', 
      status: 'active', 
      autoRenew: true, 
      merchant: '', 
      paymentMethod: 'Credit Card', 
      priority: 'medium', 
      notes: '' 
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: RecurringTransaction) => {
    console.log('Edit Recurring button clicked for:', item.id);
    setEditingItem(item);
    setFormData({
      description: item.description,
      amount: item.amount.toString(),
      type: item.type,
      category: item.category,
      frequency: item.frequency,
      nextDue: item.nextDue,
      status: item.status,
      autoRenew: item.autoRenew,
      merchant: item.merchant,
      paymentMethod: item.paymentMethod,
      priority: item.priority,
      notes: item.notes
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log('Delete Recurring button clicked for:', id);
    setRecurringData(prev => prev.filter(item => item.id !== id));
  };

  const handleStatusToggle = (id: number, newStatus: 'active' | 'paused' | 'cancelled') => {
    setRecurringData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    if (!formData.description || !formData.amount || !formData.nextDue) return;
    
    if (editingItem) {
      setRecurringData(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, amount: parseFloat(formData.amount) }
          : item
      ));
    } else {
      const newItem: RecurringTransaction = {
        id: Date.now(),
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        frequency: formData.frequency,
        nextDue: formData.nextDue,
        lastProcessed: new Date().toISOString().split('T')[0],
        status: formData.status,
        autoRenew: formData.autoRenew,
        merchant: formData.merchant,
        paymentMethod: formData.paymentMethod,
        priority: formData.priority,
        notes: formData.notes
      };
      setRecurringData(prev => [newItem, ...prev]);
    }
    
    setIsModalOpen(false);
    onRealDataAdded();
  };

  const handleFormChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const closeModal = () => {
    console.log('Modal closed');
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'success' : 'destructive';
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'destructive';
      case 'weekly': return 'warning';
      case 'monthly': return 'success';
      case 'quarterly': return 'secondary';
      case 'yearly': return 'default';
      default: return 'default';
    }
  };

  const getDaysUntilDue = (nextDue: string) => {
    const nextDueDate = new Date(nextDue);
    const today = new Date();
    const diffTime = nextDueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {showMockWarning && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-center font-semibold">
            Test version: Showing mock data.
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">Recurring Transactions</h1>
            <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage your automated income and expenses</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto relative z-10">
            <Button variant="outline" size="sm" onClick={() => setShowAmounts(!showAmounts)} className="flex-1 sm:flex-none pointer-events-auto cursor-pointer">
              {showAmounts ? <EyeOff className="w-4 h-4 mr-1 sm:mr-2" /> : <Eye className="w-4 h-4 mr-1 sm:mr-2" />}
              <span className="hidden sm:inline">{showAmounts ? 'Hide' : 'Show'} Amounts</span>
              <span className="sm:hidden">{showAmounts ? 'Hide' : 'Show'}</span>
            </Button>
            <Button onClick={handleAdd} size="sm" className="flex-1 sm:flex-none pointer-events-auto cursor-pointer">
              <Plus className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Recurring</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <Card className="col-span-1">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Recurring Income</p>
                  <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-600 truncate">
                    {showAmounts ? `$${totalRecurringIncome.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Monthly guaranteed</p>
                </div>
                <div className="p-2 sm:p-3 bg-green-100 rounded-full flex-shrink-0 ml-2">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Recurring Expenses</p>
                  <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-red-600 truncate">
                    {showAmounts ? `$${totalRecurringExpenses.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Monthly fixed costs</p>
                </div>
                <div className="p-2 sm:p-3 bg-red-100 rounded-full flex-shrink-0 ml-2">
                  <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Net Flow</p>
                  <p className={`text-lg sm:text-2xl lg:text-3xl font-bold truncate ${netRecurringFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {showAmounts ? `${netRecurringFlow >= 0 ? '+' : ''}$${netRecurringFlow.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Monthly net</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0 ml-2">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Due Soon</p>
                  <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-orange-600 truncate">
                    {upcomingDue}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Next 7 days</p>
                </div>
                <div className="p-2 sm:p-3 bg-orange-100 rounded-full flex-shrink-0 ml-2">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recurring Cash Flow</CardTitle>
              <CardDescription>Monthly recurring income vs expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 sm:h-80 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis 
                      dataKey="month" 
                      stroke="#94a3b8" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="net" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recurring by Category</CardTitle>
              <CardDescription>Distribution of recurring transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 sm:h-80 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ category, percent }) => 
                        `${category} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recurring Transactions Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div>
                <CardTitle>Recurring Transactions</CardTitle>
                <CardDescription>Manage your automated financial transactions</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search recurring transactions..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={typeFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTypeFilter(e.target.value)}
                  className="sm:w-32"
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
                <Select
                  value={statusFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                  className="sm:w-32"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </Select>
                <Select
                  value={frequencyFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFrequencyFilter(e.target.value)}
                  className="sm:w-32"
                >
                  {frequencies.map(frequency => (
                    <option key={frequency} value={frequency}>{frequency}</option>
                  ))}
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm hidden sm:table-cell">Frequency</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm hidden md:table-cell">Next Due</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm hidden lg:table-cell">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => {
                    const daysUntilDue = getDaysUntilDue(item.nextDue);
                    return (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900 text-sm">{item.description}</div>
                          <div className="text-xs text-slate-500 sm:hidden">{item.frequency}</div>
                          <div className="text-xs text-slate-500">{item.merchant}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={getTypeColor(item.type)} className="text-xs">
                            {item.type}
                          </Badge>
                          <div className="text-xs text-slate-500 mt-1">{item.category}</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-sm">
                          <span className={item.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                            {showAmounts ? `$${item.amount.toLocaleString()}` : '••••••'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-sm hidden sm:table-cell">
                          <Badge variant={getFrequencyColor(item.frequency)} className="text-xs">
                            {item.frequency}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-sm hidden md:table-cell">
                          <div className="space-y-1">
                            <div>{new Date(item.nextDue).toLocaleDateString()}</div>
                            <Badge variant={daysUntilDue <= 3 ? 'destructive' : daysUntilDue <= 7 ? 'warning' : 'success'} className="text-xs">
                              {daysUntilDue === 0 ? 'Due today' : daysUntilDue === 1 ? 'Due tomorrow' : `${daysUntilDue} days`}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <Badge variant={getStatusColor(item.status)} className="text-xs">
                            {item.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1 relative z-10">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleStatusToggle(item.id, item.status === 'active' ? 'paused' : 'active')}
                              className="pointer-events-auto cursor-pointer"
                            >
                              {item.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="pointer-events-auto cursor-pointer">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="pointer-events-auto cursor-pointer">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal for Add/Edit */}
        <FullscreenModal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-900 tracking-wide drop-shadow-lg">{editingItem ? 'Edit' : 'Add'} Recurring Transaction</h2>
          <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-8 w-full max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
                <Input value={formData.description} onChange={e => handleFormChange('description', e.target.value)} required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Amount</label>
                <Input type="number" value={formData.amount} onChange={e => handleFormChange('amount', e.target.value)} required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Type</label>
                <Select value={formData.type} onChange={e => handleFormChange('type', e.target.value)}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </Select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Category</label>
                <Select value={formData.category} onChange={e => handleFormChange('category', e.target.value)}>
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Frequency</label>
                <Select value={formData.frequency} onChange={e => handleFormChange('frequency', e.target.value)}>
                  {frequencies.filter(f => f !== 'All').map(f => <option key={f} value={f.toLowerCase()}>{f}</option>)}
                </Select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Next Due</label>
                <Input type="date" value={formData.nextDue} onChange={e => handleFormChange('nextDue', e.target.value)} required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Merchant</label>
                <Input value={formData.merchant} onChange={e => handleFormChange('merchant', e.target.value)} />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Payment Method</label>
                <Select value={formData.paymentMethod} onChange={e => handleFormChange('paymentMethod', e.target.value)}>
                  {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                </Select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Priority</label>
                <Select value={formData.priority} onChange={e => handleFormChange('priority', e.target.value)}>
                  {priorities.filter(p => p !== 'All').map(p => <option key={p} value={p.toLowerCase()}>{p}</option>)}
                </Select>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <input type="checkbox" checked={formData.autoRenew} onChange={e => handleFormChange('autoRenew', e.target.checked)} id="autoRenew" className="accent-blue-600 scale-125" />
                <label htmlFor="autoRenew" className="text-sm font-medium text-gray-700">Auto Renew</label>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <Button type="button" onClick={closeModal} variant="outline" className="px-6 py-2 text-blue-700 border-blue-300 hover:bg-blue-50">Cancel</Button>
              <Button type="submit" variant="default" className="px-6 py-2 flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white shadow-lg"><Save size={18}/>{editingItem ? 'Save' : 'Add'}</Button>
            </div>
          </form>
        </FullscreenModal>
      </div>
    </div>
  );
};

export default RecurringPage; 