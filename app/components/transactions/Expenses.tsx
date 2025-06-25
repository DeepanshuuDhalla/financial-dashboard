"use client"
import React, { useState, useEffect, ReactNode } from 'react';
import { Plus, Search, Edit, Trash2, DollarSign, TrendingDown, Calendar, Filter, Eye, EyeOff, X, Save, AlertTriangle, Target, BarChart3, PieChart } from 'lucide-react';
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
  variant?: 'default' | 'outline' | 'ghost' | 'danger' | 'secondary';
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
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200"
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

interface ExpenseTransaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  subcategory: string;
  recurring: boolean;
  priority: 'low' | 'medium' | 'high';
  budget: number;
  merchant: string;
  paymentMethod: string;
}

const ExpensesPage = () => {
  const { data, usingMockData, showMockWarning, onRealDataAdded } = useFinancialData();
  const [expenseData, setExpenseData] = useState<ExpenseTransaction[]>([
    { id: 1, description: 'Rent Payment - Downtown Apt', amount: 1200, date: '2024-06-20', category: 'Housing', subcategory: 'Rent', recurring: true, priority: 'high', budget: 1200, merchant: 'Property Manager', paymentMethod: 'Bank Transfer' },
    { id: 2, description: 'Whole Foods Market', amount: 127.85, date: '2024-06-19', category: 'Food', subcategory: 'Groceries', recurring: false, priority: 'medium', budget: 500, merchant: 'Whole Foods', paymentMethod: 'Credit Card' },
    { id: 3, description: 'Electric Bill - June', amount: 89.42, date: '2024-06-18', category: 'Utilities', subcategory: 'Electricity', recurring: true, priority: 'high', budget: 100, merchant: 'Electric Company', paymentMethod: 'Auto Pay' },
    { id: 4, description: 'Coffee Shop & Restaurants', amount: 64.30, date: '2024-06-17', category: 'Food', subcategory: 'Dining Out', recurring: false, priority: 'low', budget: 200, merchant: 'Local Cafe', paymentMethod: 'Credit Card' },
    { id: 5, description: 'Gas Station - Shell', amount: 52.15, date: '2024-06-16', category: 'Transportation', subcategory: 'Fuel', recurring: false, priority: 'medium', budget: 150, merchant: 'Shell', paymentMethod: 'Credit Card' },
    { id: 6, description: 'Netflix Subscription', amount: 15.99, date: '2024-06-15', category: 'Entertainment', subcategory: 'Streaming', recurring: true, priority: 'low', budget: 50, merchant: 'Netflix', paymentMethod: 'Credit Card' },
    { id: 7, description: 'Gym Membership', amount: 49.99, date: '2024-06-14', category: 'Health', subcategory: 'Fitness', recurring: true, priority: 'medium', budget: 60, merchant: 'Local Gym', paymentMethod: 'Bank Transfer' },
    { id: 8, description: 'Amazon Purchase', amount: 156.78, date: '2024-06-13', category: 'Shopping', subcategory: 'Online', recurring: false, priority: 'low', budget: 300, merchant: 'Amazon', paymentMethod: 'Credit Card' },
    { id: 9, description: 'Uber Ride', amount: 23.50, date: '2024-06-12', category: 'Transportation', subcategory: 'Rideshare', recurring: false, priority: 'low', budget: 100, merchant: 'Uber', paymentMethod: 'Credit Card' },
    { id: 10, description: 'Pharmacy - CVS', amount: 34.21, date: '2024-06-11', category: 'Health', subcategory: 'Pharmacy', recurring: false, priority: 'medium', budget: 80, merchant: 'CVS', paymentMethod: 'Credit Card' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpenseTransaction | null>(null);
  const [showAmounts, setShowAmounts] = useState(true);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
    category: 'Food',
    subcategory: 'Groceries',
    recurring: false,
    priority: 'medium' as 'low' | 'medium' | 'high',
    budget: '',
    merchant: '',
    paymentMethod: 'Credit Card'
  });

  // Chart data for expense trends
  const chartData = [
    { month: 'Jan', expenses: 3100, budget: 3500, savings: 400 },
    { month: 'Feb', expenses: 2950, budget: 3500, savings: 550 },
    { month: 'Mar', expenses: 3200, budget: 3500, savings: 300 },
    { month: 'Apr', expenses: 3150, budget: 3500, savings: 350 },
    { month: 'May', expenses: 3300, budget: 3500, savings: 200 },
    { month: 'Jun', expenses: 3250, budget: 3500, savings: 250 }
  ];

  // Calculate category data from actual expense data
  const calculateCategoryData = () => {
    const categoryTotals = expenseData.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {} as Record<string, number>);

    const colors: Record<string, string> = {
      'Housing': '#ef4444',
      'Food': '#f59e0b',
      'Transportation': '#3b82f6',
      'Utilities': '#8b5cf6',
      'Entertainment': '#ec4899',
      'Health': '#06b6d4',
      'Shopping': '#84cc16',
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
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const recurringExpenses = expenseData.filter(item => item.recurring).reduce((sum, item) => sum + item.amount, 0);
  const thisMonthExpenses = expenseData.filter(item => item.date.startsWith('2024-06')).reduce((sum, item) => sum + item.amount, 0);
  const avgMonthlyExpenses = Math.round(totalExpenses / 6);
  const totalBudget = expenseData.reduce((sum, item) => sum + item.budget, 0);
  const budgetUtilization = ((totalExpenses / totalBudget) * 100).toFixed(1);
  const highPriorityExpenses = expenseData.filter(item => item.priority === 'high').reduce((sum, item) => sum + item.amount, 0);

  const categories = ['All', ...Array.from(new Set(expenseData.map(item => item.category)))];
  const priorities = ['All', 'High', 'Medium', 'Low'];
  const paymentMethods = ['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash', 'PayPal', 'Auto Pay'];

  const filteredData = expenseData.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const handleAdd = () => {
    console.log('Add Expense button clicked');
    setEditingItem(null);
    setFormData({ 
      description: '', 
      amount: '', 
      date: '', 
      category: 'Food', 
      subcategory: 'Groceries', 
      recurring: false, 
      priority: 'medium', 
      budget: '', 
      merchant: '', 
      paymentMethod: 'Credit Card' 
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: ExpenseTransaction) => {
    console.log('Edit Expense button clicked for:', item.id);
    setEditingItem(item);
    setFormData({
      description: item.description,
      amount: item.amount.toString(),
      date: item.date,
      category: item.category,
      subcategory: item.subcategory,
      recurring: item.recurring,
      priority: item.priority,
      budget: item.budget.toString(),
      merchant: item.merchant,
      paymentMethod: item.paymentMethod
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log('Delete Expense button clicked for:', id);
    setExpenseData(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    if (!formData.description || !formData.amount || !formData.date) return;
    
    if (editingItem) {
      setExpenseData(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, amount: parseFloat(formData.amount), budget: parseFloat(formData.budget) }
          : item
      ));
    } else {
      const newItem: ExpenseTransaction = {
        id: Date.now(),
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        subcategory: formData.subcategory,
        recurring: formData.recurring,
        priority: formData.priority,
        budget: parseFloat(formData.budget),
        merchant: formData.merchant,
        paymentMethod: formData.paymentMethod
      };
      setExpenseData(prev => [newItem, ...prev]);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getBudgetStatus = (amount: number, budget: number) => {
    const percentage = (amount / budget) * 100;
    if (percentage > 90) return 'destructive';
    if (percentage > 75) return 'warning';
    return 'success';
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
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">Expenses Dashboard</h1>
            <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">Track and manage your spending patterns</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto relative z-10">
            <Button variant="outline" size="sm" onClick={() => setShowAmounts(!showAmounts)} className="flex-1 sm:flex-none pointer-events-auto cursor-pointer">
              {showAmounts ? <EyeOff className="w-4 h-4 mr-1 sm:mr-2" /> : <Eye className="w-4 h-4 mr-1 sm:mr-2" />}
              <span className="hidden sm:inline">{showAmounts ? 'Hide' : 'Show'} Amounts</span>
              <span className="sm:hidden">{showAmounts ? 'Hide' : 'Show'}</span>
            </Button>
            <Button onClick={handleAdd} size="sm" className="flex-1 sm:flex-none pointer-events-auto cursor-pointer">
              <Plus className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Expense</span>
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
                  <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Total Expenses</p>
                  <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 truncate">
                    {showAmounts ? `$${totalExpenses.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{budgetUtilization}% of budget used</p>
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
                  <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Recurring Expenses</p>
                  <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 truncate">
                    {showAmounts ? `$${recurringExpenses.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Monthly fixed costs</p>
                </div>
                <div className="p-2 sm:p-3 bg-orange-100 rounded-full flex-shrink-0 ml-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">This Month</p>
                  <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 truncate">
                    {showAmounts ? `$${thisMonthExpenses.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">June 2024</p>
                </div>
                <div className="p-2 sm:p-3 bg-purple-100 rounded-full flex-shrink-0 ml-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">High Priority</p>
                  <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 truncate">
                    {showAmounts ? `$${highPriorityExpenses.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Essential expenses</p>
                </div>
                <div className="p-2 sm:p-3 bg-red-100 rounded-full flex-shrink-0 ml-2">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Trend</CardTitle>
              <CardDescription>Monthly expenses vs budget and savings</CardDescription>
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
                      dataKey="budget" 
                      stroke="#e2e8f0" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      dot={false}
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
                      dataKey="savings" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>Distribution of spending by category</CardDescription>
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
                      label={({ category, amount, percent }) => 
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

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div>
                <CardTitle>Expense Transactions</CardTitle>
                <CardDescription>Manage your expenses and track spending patterns</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={categoryFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryFilter(e.target.value)}
                  className="sm:w-32"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
                <Select
                  value={priorityFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriorityFilter(e.target.value)}
                  className="sm:w-32"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
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
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm hidden sm:table-cell">Budget</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm hidden md:table-cell">Priority</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm hidden lg:table-cell">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 text-sm">{item.description}</div>
                        <div className="text-xs text-slate-500 sm:hidden">{new Date(item.date).toLocaleDateString()}</div>
                        <div className="text-xs text-slate-500">{item.merchant}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                        <div className="text-xs text-slate-500 mt-1">{item.subcategory}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-red-600 text-sm">
                        {showAmounts ? `$${item.amount.toLocaleString()}` : '••••••'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-sm hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <span>${item.budget}</span>
                          <Badge variant={getBudgetStatus(item.amount, item.budget)} className="text-xs">
                            {((item.amount / item.budget) * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <Badge variant={getPriorityColor(item.priority)} className="text-xs">
                          {item.priority}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-sm hidden lg:table-cell">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 relative z-10">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="pointer-events-auto cursor-pointer">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="pointer-events-auto cursor-pointer">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modal for Add/Edit */}
        <FullscreenModal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-900 tracking-wide drop-shadow-lg">{editingItem ? 'Edit' : 'Add'} Expense</h2>
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
                <label className="block mb-2 text-sm font-semibold text-gray-700">Date</label>
                <Input type="date" value={formData.date} onChange={e => handleFormChange('date', e.target.value)} required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Category</label>
                <Select value={formData.category} onChange={e => handleFormChange('category', e.target.value)}>
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Subcategory</label>
                <Input value={formData.subcategory} onChange={e => handleFormChange('subcategory', e.target.value)} />
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
                <input type="checkbox" checked={formData.recurring} onChange={e => handleFormChange('recurring', e.target.checked)} id="recurring" className="accent-blue-600 scale-125" />
                <label htmlFor="recurring" className="text-sm font-medium text-gray-700">Recurring</label>
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

export default ExpensesPage; 