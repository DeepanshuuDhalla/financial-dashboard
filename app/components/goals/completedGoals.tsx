"use client"
import React, { useState, ReactNode } from 'react';
import { Plus, Search, Edit, Trash2, Target, TrendingUp, Calendar, Eye, EyeOff, X, Save, Zap, Award, Clock, CheckCircle2, RotateCcw, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';

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

interface CompletedGoal {
  id: number;
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
}

const CompletedGoalsPage = () => {
  const [completedData, setCompletedData] = useState<CompletedGoal[]>([
    {
      id: 1,
      name: 'Emergency Fund',
      targetAmount: 10000,
      finalAmount: 10500,
      completedDate: '2024-05-15',
      originalTargetDate: '2024-06-30',
      category: 'Emergency',
      priority: 'High',
      description: 'Built a 6-month emergency fund for financial security',
      monthlyTarget: 1000,
      createdDate: '2024-01-15',
      completionTime: 120,
      earlyCompletion: true,
      achievement: 'Early'
    },
    {
      id: 2,
      name: 'Vacation to Europe',
      targetAmount: 8000,
      finalAmount: 8200,
      completedDate: '2024-04-20',
      originalTargetDate: '2024-05-01',
      category: 'Travel',
      priority: 'Medium',
      description: 'Two-week vacation exploring Europe',
      monthlyTarget: 800,
      createdDate: '2024-02-01',
      completionTime: 79,
      earlyCompletion: true,
      achievement: 'Early'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [achievementFilter, setAchievementFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CompletedGoal | null>(null);
  const [showAmounts, setShowAmounts] = useState(true);

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

  const handleAdd = () => {
    console.log('Add Completed Goal clicked');
    setIsModalOpen(true);
  };

  const handleEdit = (goal: CompletedGoal) => {
    console.log('Edit Completed Goal clicked for:', goal.id);
    setEditingItem(goal);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log('Delete Completed Goal clicked for:', id);
    setCompletedData(prev => prev.filter(goal => goal.id !== id));
  };

  const handleReactivate = (goal: CompletedGoal) => {
    console.log('Reactivate Goal clicked for:', goal.id);
    // Convert completed goal back to active goal
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

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingItem ? 'Edit Completed Goal' : 'Add Completed Goal'}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)} className="pointer-events-auto cursor-pointer">
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Goal Completion Form</h3>
              <p className="text-slate-600">Form implementation would go here</p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CompletedGoalsPage; 