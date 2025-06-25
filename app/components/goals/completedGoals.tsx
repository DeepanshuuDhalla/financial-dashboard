"use client"
import React, { useState, ReactNode } from 'react';
import { Plus, Search, Edit, Trash2, Target, TrendingUp, Calendar, Eye, EyeOff, X, Save, Zap, Award, Clock, CheckCircle2, RotateCcw, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { useFinancialData } from '../../hooks/useFinancialData';
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

interface CompletedGoal {
  id: string;
  name: string;
  targetAmount: number;
  finalAmount: number;
  completedDate: string;
  originalTargetDate: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  monthlyTarget: number;
  createdDate: string;
  completionTime: number;
  earlyCompletion: boolean;
  achievement: 'Early' | 'On Time' | 'Late';
  [key: string]: any;
}

const defaultForm: Omit<CompletedGoal, 'id' | 'completionTime'> = {
  name: '',
  targetAmount: 0,
  finalAmount: 0,
  completedDate: '',
  originalTargetDate: '',
  category: '',
  priority: 'Medium',
  description: '',
  monthlyTarget: 0,
  createdDate: '',
  earlyCompletion: false,
  achievement: 'On Time',
};

const CompletedGoalsPage = () => {
  const { data, loading, error } = useFinancialData();
  const [completedData, setCompletedData] = useState<CompletedGoal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [achievementFilter, setAchievementFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CompletedGoal | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const [showAmounts, setShowAmounts] = useState(true);
  const [showMockWarning, setShowMockWarning] = useState(false);

  // Load initial data from JSON
  React.useEffect(() => {
    if (data && data.goals && data.goals.completed) {
      if (data.goals.completed.length === 0) {
        setCompletedData(MOCK_GOALS.map(g => ({
          id: g.id,
          name: g.name,
          targetAmount: g.target_amount,
          finalAmount: g.final_amount,
          completedDate: g.completed_date || '',
          originalTargetDate: g.target_date,
          category: g.category,
          priority: g.priority as 'High' | 'Medium' | 'Low',
          description: g.description,
          monthlyTarget: g.monthly_target,
          createdDate: g.created_date,
          completionTime: g.completion_time || 0,
          earlyCompletion: g.early_completion || false,
          achievement: (g.achievement as 'Early' | 'On Time' | 'Late') || 'On Time',
        })));
        setShowMockWarning(true);
      } else {
        setCompletedData(data.goals.completed.map((g: any) => ({
          ...g,
          id: g.id || Math.random().toString(36).slice(2),
          completionTime: g.completionTime || 0,
        })));
        setShowMockWarning(false);
      }
    }
  }, [data]);

  // Calculate statistics
  const totalFinalAmount = completedData.reduce((sum, goal) => sum + goal.finalAmount, 0);
  const totalTargetAmount = completedData.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSavings = totalFinalAmount - totalTargetAmount;
  const earlyCompletions = completedData.filter(goal => goal.earlyCompletion).length;

  const categories = ['All', ...Array.from(new Set(completedData.map(goal => goal.category)))];
  const achievements = ['All', 'Early', 'On Time', 'Late'];

  const filteredData = completedData.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || goal.category === categoryFilter;
    const matchesAchievement = achievementFilter === 'All' || goal.achievement === achievementFilter;
    return matchesSearch && matchesCategory && matchesAchievement;
  });

  // CRUD Handlers
  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ ...defaultForm, createdDate: new Date().toISOString().slice(0, 10), completedDate: new Date().toISOString().slice(0, 10), originalTargetDate: new Date().toISOString().slice(0, 10) });
    setIsModalOpen(true);
  };

  const handleEdit = (goal: CompletedGoal) => {
    setEditingItem(goal);
    setFormData({ ...goal });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setCompletedData(prev => prev.filter(goal => goal.id !== id));
  };

  const handleReactivate = (goal: CompletedGoal) => {
    // Optionally implement reactivate to active
  };

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount || !formData.completedDate) return;
    // Calculate completionTime (days between createdDate and completedDate)
    const created = new Date(formData.createdDate);
    const completed = new Date(formData.completedDate);
    const completionTime = Math.ceil((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    if (editingItem) {
      setCompletedData(prev => prev.map(goal => goal.id === editingItem.id ? {
        ...goal,
        ...formData,
        completionTime,
      } : goal));
    } else {
      setCompletedData(prev => [
        {
          ...formData,
          id: Math.random().toString(36).slice(2),
          completionTime,
        } as CompletedGoal,
        ...prev
      ]);
    }
    setIsModalOpen(false);
  };

  const getAchievementColor = (achievement: string) => {
    switch (achievement) {
      case 'Early': return 'success';
      case 'On Time': return 'secondary';
      case 'Late': return 'warning';
      default: return 'default';
    }
  };

  const getDaysAgo = (completedDate: string) => {
    const today = new Date();
    const completed = new Date(completedDate);
    const diffTime = today.getTime() - completed.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Completed Goals</h1>
            <p className="text-slate-600 text-lg">Celebrate your financial achievements and milestones</p>
          </div>
          <div className="flex gap-3 relative z-10">
            <Button variant="outline" onClick={() => setShowAmounts(!showAmounts)} className="pointer-events-auto cursor-pointer">
              {showAmounts ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showAmounts ? 'Hide' : 'Show'} Amounts
            </Button>
            <Button onClick={handleAdd} className="shadow-lg pointer-events-auto cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Add Completed Goal
            </Button>
          </div>
        </div>

        {showMockWarning && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-center font-semibold">
            Test version: Showing mock data.
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Completed</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {showAmounts ? `$${totalFinalAmount.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{completedData.length} goals achieved</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Extra Savings</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {showAmounts ? `$${totalSavings.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Beyond target amounts</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Success Rate</p>
                  <p className="text-3xl font-bold text-slate-900">100%</p>
                  <p className="text-xs text-slate-500 mt-1">All goals completed</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Early Wins</p>
                  <p className="text-3xl font-bold text-slate-900">{earlyCompletions}</p>
                  <p className="text-xs text-slate-500 mt-1">Goals completed early</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Completed Goals Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div>
                <CardTitle>Completed Goals</CardTitle>
                <CardDescription>Review and manage your achieved financial objectives</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search completed goals..."
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
                  value={achievementFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAchievementFilter(e.target.value)}
                  className="sm:w-48"
                >
                  {achievements.map(achievement => (
                    <option key={achievement} value={achievement}>{achievement}</option>
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
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Achievement</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Amount</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900 hidden md:table-cell">Completed</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900 hidden lg:table-cell">Time</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((goal) => {
                    const daysAgo = getDaysAgo(goal.completedDate);
                    
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
                          <Badge variant={getAchievementColor(goal.achievement) as any}>
                            {goal.achievement}
                          </Badge>
                          <div className="text-xs text-slate-500 mt-1">
                            {goal.earlyCompletion ? 'Early completion' : goal.achievement === 'Late' ? 'Completed late' : 'On schedule'}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <div className="font-bold text-slate-900">
                              {showAmounts ? `$${goal.finalAmount.toLocaleString()}` : '••••••'}
                            </div>
                            <div className="text-slate-500">
                              Target: {showAmounts ? `$${goal.targetAmount.toLocaleString()}` : '••••••'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden md:table-cell">
                          <div className="text-sm">
                            <div className="text-slate-900">{new Date(goal.completedDate).toLocaleDateString()}</div>
                            <div className="text-xs text-slate-500">
                              {daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden lg:table-cell">
                          <div className="text-sm">
                            <div className="text-slate-900">{goal.completionTime} days</div>
                            <div className="text-xs text-slate-500">
                              {goal.completionTime < 365 ? 'Under 1 year' : 'Over 1 year'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2 relative z-10">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(goal)} className="pointer-events-auto cursor-pointer">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleReactivate(goal)} className="pointer-events-auto cursor-pointer">
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

        {/* Modal for Add/Edit */}
        <FullscreenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-900 tracking-wide drop-shadow-lg">{editingItem ? 'Edit' : 'Add'} Completed Goal</h2>
          <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-8 w-full max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Name</label>
                <Input value={formData.name} onChange={e => handleFormChange('name', e.target.value)} required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Target Amount</label>
                <Input type="number" value={formData.targetAmount} onChange={e => handleFormChange('targetAmount', e.target.value)} required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Final Amount</label>
                <Input type="number" value={formData.finalAmount} onChange={e => handleFormChange('finalAmount', e.target.value)} required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Completed Date</label>
                <Input type="date" value={formData.completedDate} onChange={e => handleFormChange('completedDate', e.target.value)} required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Original Target Date</label>
                <Input type="date" value={formData.originalTargetDate} onChange={e => handleFormChange('originalTargetDate', e.target.value)} required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Category</label>
                <Input value={formData.category} onChange={e => handleFormChange('category', e.target.value)} />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Priority</label>
                <Select value={formData.priority} onChange={e => handleFormChange('priority', e.target.value)}>
                  {['High', 'Medium', 'Low'].map(p => <option key={p} value={p}>{p}</option>)}
                </Select>
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
                <Input value={formData.description} onChange={e => handleFormChange('description', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Monthly Target</label>
                <Input type="number" value={formData.monthlyTarget} onChange={e => handleFormChange('monthlyTarget', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-2 text-sm font-semibold text-gray-700">Achievement</label>
                <Select value={formData.achievement} onChange={e => handleFormChange('achievement', e.target.value)}>
                  {achievements.filter(a => a !== 'All').map(a => <option key={a} value={a}>{a}</option>)}
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline" className="px-6 py-2 text-blue-700 border-blue-300 hover:bg-blue-50">Cancel</Button>
              <Button type="submit" variant="default" className="px-6 py-2 flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white shadow-lg"><Save size={18}/>{editingItem ? 'Save' : 'Add'}</Button>
            </div>
          </form>
        </FullscreenModal>
      </div>
    </div>
  );
};

export default CompletedGoalsPage; 