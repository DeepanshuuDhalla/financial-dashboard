"use client"
import React, { useState, ReactNode } from 'react';
import { Plus, Search, Edit, Trash2, Target, TrendingUp, Calendar, Eye, EyeOff, X, Save, Zap, Award, Clock, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import FullscreenModal from "../common/FullscreenModal";
import { MOCK_GOALS } from '../../lib/mockData';

// Enhanced shadcn-style components
const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white border border-slate-200/60 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-slate-300/60 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <h3 className={`text-xl font-bold leading-none tracking-tight text-slate-900 ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`text-sm text-slate-600 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>
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
    default: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
    outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 shadow-sm",
    ghost: "hover:bg-slate-100 text-slate-700",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-sm",
    success: "bg-green-500 text-white hover:bg-green-600 shadow-sm"
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8"
  };
  
  return (
    <button 
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 active:scale-95 ${variants[variant]} ${sizes[size]} ${className}`}
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
    className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${className}`}
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
    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e)}
    className={`flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${className}`}
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
    default: "bg-slate-100 text-slate-800 border-slate-200",
    secondary: "bg-blue-50 text-blue-700 border-blue-200",
    success: "bg-green-50 text-green-700 border-green-200",
    destructive: "bg-red-50 text-red-700 border-red-200",
    outline: "border border-slate-200 text-slate-700",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200"
  };
  
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const ProgressBar = ({ progress, className = "" }: { progress: number; className?: string }) => (
  <div className={`w-full bg-slate-100 rounded-full h-2 overflow-hidden ${className}`}>
    <div 
      className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
      style={{ width: `${Math.min(progress, 100)}%` }}
    >
      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
    </div>
  </div>
);

interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  monthlyTarget: number;
  createdDate: string;
}

const ActiveSavingsPage = () => {
  const [savingsData, setSavingsData] = useState<SavingsGoal[]>([]);
  const [showMockWarning, setShowMockWarning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SavingsGoal | null>(null);
  const [showAmounts, setShowAmounts] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'Emergency',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    description: '',
    monthlyTarget: ''
  });

  React.useEffect(() => {
    // Simulate fetching from Supabase, fallback to mock if empty
    // Replace with real Supabase fetch if needed
    if (Array.isArray(MOCK_GOALS) && MOCK_GOALS.length > 0) {
      setSavingsData(MOCK_GOALS.map((g, i) => ({
        id: typeof g.id === 'number' ? g.id : i + 1,
        name: g.name ?? '',
        targetAmount: g.target_amount ?? 0,
        currentAmount: g.current_amount ?? 0,
        targetDate: g.target_date ?? '',
        category: g.category ?? '',
        priority: (g.priority as 'High' | 'Medium' | 'Low') ?? 'Medium',
        description: g.description ?? '',
        monthlyTarget: g.monthly_target ?? 0,
        createdDate: g.created_date ?? '',
      })));
      setShowMockWarning(true);
    }
  }, []);

  // Calculate statistics
  const totalTargetAmount = savingsData.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = savingsData.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalMonthlyTarget = savingsData.reduce((sum, goal) => sum + goal.monthlyTarget, 0);
  const overallProgress = (totalCurrentAmount / totalTargetAmount) * 100;
  const goalsOnTrack = savingsData.filter(goal => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const timeProgress = ((new Date().getTime() - new Date(goal.createdDate).getTime()) / 
                         (new Date(goal.targetDate).getTime() - new Date(goal.createdDate).getTime())) * 100;
    return progress >= timeProgress * 0.8;
  }).length;

  // Progress chart data
  const progressData = savingsData.map(goal => ({
    name: goal.name.substring(0, 10) + (goal.name.length > 10 ? '...' : ''),
    progress: Math.round((goal.currentAmount / goal.targetAmount) * 100),
    current: goal.currentAmount,
    target: goal.targetAmount
  }));

  // Category distribution
  const categoryData = savingsData.reduce((acc, goal) => {
    acc[goal.category] = (acc[goal.category] || 0) + goal.currentAmount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount,
    percentage: Math.round((amount / totalCurrentAmount) * 100)
  }));

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  const categories = ['All', ...Array.from(new Set(savingsData.map(goal => goal.category)))];
  const priorities = ['All', 'High', 'Medium', 'Low'];

  const filteredData = savingsData.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || goal.category === categoryFilter;
    const matchesPriority = priorityFilter === 'All' || goal.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      category: 'Emergency',
      priority: 'Medium',
      description: '',
      monthlyTarget: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (goal: SavingsGoal) => {
    setEditingItem(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      targetDate: goal.targetDate,
      category: goal.category,
      priority: goal.priority,
      description: goal.description,
      monthlyTarget: goal.monthlyTarget.toString()
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setSavingsData(prev => prev.filter(goal => goal.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount || !formData.targetDate) return;
    
    if (editingItem) {
      setSavingsData(prev => prev.map(goal => 
        goal.id === editingItem.id 
          ? {
              ...goal,
              name: formData.name,
              targetAmount: parseFloat(formData.targetAmount),
              currentAmount: parseFloat(formData.currentAmount) || 0,
              targetDate: formData.targetDate,
              category: formData.category,
              priority: formData.priority,
              description: formData.description,
              monthlyTarget: parseFloat(formData.monthlyTarget) || 0
            }
          : goal
      ));
    } else {
      const newGoal: SavingsGoal = {
        id: Date.now(),
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        targetDate: formData.targetDate,
        category: formData.category,
        priority: formData.priority,
        description: formData.description,
        monthlyTarget: parseFloat(formData.monthlyTarget) || 0,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setSavingsData(prev => [newGoal, ...prev]);
    }
    
    setIsModalOpen(false);
  };

  const handleFormChange = (field: keyof typeof formData, value: string | 'High' | 'Medium' | 'Low') => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'warning';
      case 'Low': return 'secondary';
      default: return 'default';
    }
  };

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Active Savings Goals</h1>
            <p className="text-slate-600 text-lg">Track your progress towards financial milestones</p>
          </div>
          <div className="flex gap-3 relative z-10">
            <Button variant="outline" onClick={() => setShowAmounts(!showAmounts)} className="pointer-events-auto cursor-pointer">
              {showAmounts ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showAmounts ? 'Hide' : 'Show'} Amounts
            </Button>
            <Button onClick={handleAdd} className="shadow-lg pointer-events-auto cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Add New Goal
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Target</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {showAmounts ? `$${totalTargetAmount.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{savingsData.length} active goals</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Saved</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {showAmounts ? `$${totalCurrentAmount.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{Math.round(overallProgress)}% of total target</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Monthly Target</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {showAmounts ? `$${totalMonthlyTarget.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Combined monthly goals</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">On Track</p>
                  <p className="text-3xl font-bold text-slate-900">{goalsOnTrack}</p>
                  <p className="text-xs text-slate-500 mt-1">Goals meeting timeline</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
              <CardDescription>Individual goal progress percentages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={(value: number) => [`${value}%`, 'Progress']}
                    />
                    <Bar dataKey="progress" radius={[8, 8, 0, 0]} fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Savings by Category</CardTitle>
              <CardDescription>Distribution of saved amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div>
                <CardTitle>Active Savings Goals</CardTitle>
                <CardDescription>Manage and track your financial objectives</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search goals..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={categoryFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryFilter(e.target.value)}
                  className="sm:w-48"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
                <Select
                  value={priorityFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriorityFilter(e.target.value)}
                  className="sm:w-48"
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
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Goal</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Progress</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Amount</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900 hidden md:table-cell">Target Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900 hidden lg:table-cell">Priority</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((goal) => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    const daysRemaining = getDaysRemaining(goal.targetDate);
                    
                    return (
                      <tr key={goal.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-semibold text-slate-900">{goal.name}</div>
                            <div className="text-sm text-slate-500">{goal.category}</div>
                            <div className="text-xs text-slate-400 mt-1 md:hidden">
                              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-slate-700">{Math.round(progress)}%</span>
                              <span className="text-xs text-slate-500">
                                {showAmounts ? `$${goal.currentAmount.toLocaleString()}` : '••••••'}
                              </span>
                            </div>
                            <ProgressBar progress={progress} />
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <div className="font-bold text-slate-900">
                              {showAmounts ? `$${goal.targetAmount.toLocaleString()}` : '••••••'}
                            </div>
                            <div className="text-slate-500">
                              Monthly: {showAmounts ? `$${goal.monthlyTarget.toLocaleString()}` : '••••••'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden md:table-cell">
                          <div className="text-sm">
                            <div className="text-slate-900">{new Date(goal.targetDate).toLocaleDateString()}</div>
                            <div className={`text-xs ${daysRemaining > 30 ? 'text-green-600' : daysRemaining > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden lg:table-cell">
                          <Badge variant={getPriorityColor(goal.priority) as any}>
                            {goal.priority}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2 relative z-10">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(goal)} className="pointer-events-auto cursor-pointer">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(goal.id)} className="pointer-events-auto cursor-pointer">
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
        <FullscreenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-900 tracking-wide drop-shadow-lg">{editingItem ? 'Edit' : 'Add'} Savings Goal</h2>
          <form onSubmit={(e: React.FormEvent) => handleSubmit(e)} className="space-y-6 p-4 sm:p-8 w-full max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Goal Name</label>
                <Input value={formData.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('name', e.target.value)} placeholder="e.g., Emergency Fund" required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Target Amount</label>
                <Input type="number" value={formData.targetAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('targetAmount', e.target.value)} required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Current Amount</label>
                <Input type="number" value={formData.currentAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('currentAmount', e.target.value)} required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Target Date</label>
                <Input type="date" value={formData.targetDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('targetDate', e.target.value)} required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Category</label>
                <Select value={formData.category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFormChange('category', e.target.value)}>
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Priority</label>
                <Select value={formData.priority} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFormChange('priority', e.target.value)}>
                  {priorities.filter(p => p !== 'All').map(p => <option key={p} value={p}>{p}</option>)}
                </Select>
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
                <Input value={formData.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('description', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Monthly Target</label>
                <Input type="number" value={formData.monthlyTarget} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('monthlyTarget', e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline" className="px-6 py-2 text-blue-700 border-blue-300 hover:bg-blue-50">Cancel</Button>
              <Button type="submit" variant="default" className="px-6 py-2 flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white shadow-lg"><Save size={18}/>{editingItem ? 'Save' : 'Add'}</Button>
            </div>
          </form>
        </FullscreenModal>

        {showMockWarning && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-center font-semibold">
            Test version: Showing mock data.
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveSavingsPage;