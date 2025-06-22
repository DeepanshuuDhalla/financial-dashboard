"use client"
import React, { useState, ReactNode } from 'react';
import { Plus, Search, Edit, Trash2, Target, TrendingUp, Calendar, Eye, EyeOff, X, Save, Zap, Award, Clock, CheckCircle2, Archive, RotateCcw, Star, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { useFinancialData } from '../../hooks/useFinancialData';

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
    onChange={onChange}
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

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: ReactNode }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto max-h-[85vh] overflow-y-auto border border-slate-200 relative">
        {children}
      </div>
    </div>
  );
};

interface ArchivedGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  monthlyTarget: number;
  createdDate: string;
  archivedDate: string;
  archiveReason: 'Cancelled' | 'Postponed' | 'Changed' | 'Achieved' | 'Other';
  progress: number;
  daysOverdue: number;
  [key: string]: any;
}

const defaultForm: Omit<ArchivedGoal, 'id' | 'progress' | 'daysOverdue'> = {
  name: '',
  targetAmount: 0,
  currentAmount: 0,
  targetDate: '',
  category: '',
  priority: 'Medium',
  description: '',
  monthlyTarget: 0,
  createdDate: '',
  archivedDate: '',
  archiveReason: 'Other',
};

const ArchivedGoalsPage = () => {
  const { data, loading, error } = useFinancialData();
  const [archivedData, setArchivedData] = useState<ArchivedGoal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [reasonFilter, setReasonFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ArchivedGoal | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const [showAmounts, setShowAmounts] = useState(true);

  // Load initial data from JSON
  React.useEffect(() => {
    if (data && data.goals && data.goals.archived) {
      setArchivedData(data.goals.archived.map((g: any) => ({
        ...g,
        id: g.id || Math.random().toString(36).slice(2),
        progress: g.progress || Math.round((g.currentAmount / g.targetAmount) * 100),
        daysOverdue: g.daysOverdue || 0,
      })));
    }
  }, [data]);

  // Calculate statistics
  const totalTargetAmount = archivedData.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = archivedData.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalLostSavings = totalTargetAmount - totalCurrentAmount;
  const averageProgress = Math.round(archivedData.reduce((sum, goal) => sum + goal.progress, 0) / archivedData.length);
  const cancelledGoals = archivedData.filter(goal => goal.archiveReason === 'Cancelled').length;
  const postponedGoals = archivedData.filter(goal => goal.archiveReason === 'Postponed').length;
  const achievedGoals = archivedData.filter(goal => goal.archiveReason === 'Achieved').length;

  // Archive reasons distribution
  const reasonData = archivedData.reduce((acc, goal) => {
    acc[goal.archiveReason] = (acc[goal.archiveReason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(reasonData).map(([reason, count]) => ({
    name: reason,
    value: count,
    percentage: Math.round((count / archivedData.length) * 100)
  }));

  const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  const categories = ['All', ...Array.from(new Set(archivedData.map(goal => goal.category)))];
  const reasons = ['All', 'Cancelled', 'Postponed', 'Changed', 'Achieved', 'Other'];

  const filteredData = archivedData.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || goal.category === categoryFilter;
    const matchesReason = reasonFilter === 'All' || goal.archiveReason === reasonFilter;
    return matchesSearch && matchesCategory && matchesReason;
  });

  // CRUD Handlers
  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ ...defaultForm, createdDate: new Date().toISOString().slice(0, 10), archivedDate: new Date().toISOString().slice(0, 10) });
    setIsModalOpen(true);
  };

  const handleEdit = (goal: ArchivedGoal) => {
    setEditingItem(goal);
    setFormData({ ...goal });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setArchivedData(prev => prev.filter(goal => goal.id !== id));
  };

  const handleRestore = (goal: ArchivedGoal) => {
    // Optionally implement restore to active
  };

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount || !formData.targetDate) return;
    if (editingItem) {
      setArchivedData(prev => prev.map(goal => goal.id === editingItem.id ? {
        ...goal,
        ...formData,
        progress: Math.round((formData.currentAmount / formData.targetAmount) * 100),
        daysOverdue: goal.daysOverdue || 0,
      } : goal));
    } else {
      setArchivedData(prev => [
        {
          ...formData,
          id: Math.random().toString(36).slice(2),
          progress: Math.round((formData.currentAmount / formData.targetAmount) * 100),
          daysOverdue: 0,
        } as ArchivedGoal,
        ...prev
      ]);
    }
    setIsModalOpen(false);
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'Cancelled': return 'destructive';
      case 'Postponed': return 'warning';
      case 'Achieved': return 'success';
      case 'Changed': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'warning';
      case 'Low': return 'secondary';
      default: return 'default';
    }
  };

  const getDaysAgo = (archivedDate: string) => {
    const today = new Date();
    const archived = new Date(archivedDate);
    const diffTime = today.getTime() - archived.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Archived Goals</h1>
            <p className="text-slate-600 text-lg">Review and manage your archived financial objectives</p>
          </div>
          <div className="flex gap-3 relative z-10">
            <Button variant="outline" onClick={() => setShowAmounts(!showAmounts)} className="pointer-events-auto cursor-pointer">
              {showAmounts ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showAmounts ? 'Hide' : 'Show'} Amounts
            </Button>
            <Button onClick={handleAdd} className="shadow-lg pointer-events-auto cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Add Archived Goal
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-slate-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Archived</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {showAmounts ? `$${totalTargetAmount.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{archivedData.length} goals archived</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-full">
                  <Archive className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Lost Savings</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {showAmounts ? `$${totalLostSavings.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Unrealized potential</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg. Progress</p>
                  <p className="text-3xl font-bold text-slate-900">{averageProgress}%</p>
                  <p className="text-xs text-slate-500 mt-1">Before archiving</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Postponed</p>
                  <p className="text-3xl font-bold text-slate-900">{postponedGoals}</p>
                  <p className="text-xs text-slate-500 mt-1">Goals to reconsider</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Archive Reasons</CardTitle>
              <CardDescription>Distribution of why goals were archived</CardDescription>
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
                    <Tooltip formatter={(value: number) => [`${value} goals`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress Before Archive</CardTitle>
              <CardDescription>How much progress was made before archiving</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={archivedData.map(goal => ({
                    name: goal.name.substring(0, 8) + (goal.name.length > 8 ? '...' : ''),
                    progress: goal.progress,
                    reason: goal.archiveReason
                  }))}>
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
                    <Bar dataKey="progress" radius={[8, 8, 0, 0]} fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Archived Goals Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div>
                <CardTitle>Archived Goals</CardTitle>
                <CardDescription>Review and manage your archived financial objectives</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search archived goals..."
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
                  value={reasonFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReasonFilter(e.target.value)}
                  className="sm:w-48"
                >
                  {reasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
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
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Reason</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Progress</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900 hidden md:table-cell">Archived</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900 hidden lg:table-cell">Amount</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((goal) => {
                    const daysAgo = getDaysAgo(goal.archivedDate);
                    
                    return (
                      <tr key={goal.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-semibold text-slate-900">{goal.name}</div>
                            <div className="text-sm text-slate-500">{goal.category}</div>
                            <div className="text-xs text-slate-400 mt-1 md:hidden">
                              {daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant={getReasonColor(goal.archiveReason) as any}>
                            {goal.archiveReason}
                          </Badge>
                          <div className="text-xs text-slate-500 mt-1">
                            {goal.daysOverdue > 0 ? `${goal.daysOverdue} days overdue` : 'On time'}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-slate-700">{goal.progress}%</span>
                              <span className="text-xs text-slate-500">
                                {showAmounts ? `$${goal.currentAmount.toLocaleString()}` : '••••••'}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-yellow-500 h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${goal.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden md:table-cell">
                          <div className="text-sm">
                            <div className="text-slate-900">{new Date(goal.archivedDate).toLocaleDateString()}</div>
                            <div className="text-xs text-slate-500">
                              {daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden lg:table-cell">
                          <div className="text-sm">
                            <div className="font-bold text-slate-900">
                              {showAmounts ? `$${goal.targetAmount.toLocaleString()}` : '••••••'}
                            </div>
                            <div className="text-slate-500">
                              Target amount
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2 relative z-10">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(goal)} className="pointer-events-auto cursor-pointer">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleRestore(goal)} className="pointer-events-auto cursor-pointer">
                              <RotateCcw className="w-4 h-4 text-blue-500" />
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

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingItem ? 'Edit Archived Goal' : 'Add Archived Goal'}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)} className="pointer-events-auto cursor-pointer">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
                <Input value={formData.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('name', e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Target Amount *</label>
                  <Input type="number" value={formData.targetAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('targetAmount', Number(e.target.value))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Amount *</label>
                  <Input type="number" value={formData.currentAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('currentAmount', Number(e.target.value))} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Target Date *</label>
                  <Input type="date" value={formData.targetDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('targetDate', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Archived Date *</label>
                  <Input type="date" value={formData.archivedDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('archivedDate', e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                  <Input value={formData.category} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('category', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Priority *</label>
                  <Select value={formData.priority} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFormChange('priority', e.target.value)}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Target</label>
                  <Input type="number" value={formData.monthlyTarget} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('monthlyTarget', Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Archive Reason *</label>
                  <Select value={formData.archiveReason} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFormChange('archiveReason', e.target.value)}>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Postponed">Postponed</option>
                    <option value="Changed">Changed</option>
                    <option value="Achieved">Achieved</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <Input value={formData.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('description', e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
                <Button variant="success" type="submit">{editingItem ? 'Save Changes' : 'Add Goal'}</Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ArchivedGoalsPage; 