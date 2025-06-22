"use client"
import React, { useState, useEffect, ReactNode } from 'react';
import { Plus, Search, Edit, Trash2, DollarSign, TrendingUp, Calendar, Filter, Eye, EyeOff, X, Save } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';

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
  variant?: 'default' | 'secondary' | 'success' | 'destructive' | 'outline';
  className?: string;
}) => {
  const variants = {
    default: "bg-slate-900 text-slate-50 hover:bg-slate-900/80",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    success: "bg-green-100 text-green-800 hover:bg-green-100/80",
    destructive: "bg-red-100 text-red-800 hover:bg-red-100/80",
    outline: "border border-slate-200 text-slate-950"
  };
  
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: ReactNode }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto border border-gray-200/50">
        {children}
      </div>
    </div>
  );
};

interface IncomeTransaction {
  id: number;
  source: string;
  amount: number;
  date: string;
  category: string;
  recurring: boolean;
}

const IncomePage = () => {
  const [incomeData, setIncomeData] = useState<IncomeTransaction[]>([
    { id: 1, source: 'Software Engineer - TechCorp', amount: 4800, date: '2024-06-20', category: 'Salary', recurring: true },
    { id: 2, source: 'Web Development Project', amount: 1200, date: '2024-06-15', category: 'Freelance', recurring: false },
    { id: 3, source: 'Stock Dividends', amount: 180, date: '2024-06-10', category: 'Investment', recurring: true },
    { id: 4, source: 'E-commerce Store', amount: 650, date: '2024-06-08', category: 'Business', recurring: false },
    { id: 5, source: 'Apartment Rental', amount: 900, date: '2024-06-01', category: 'Real Estate', recurring: true },
    { id: 6, source: 'Consulting Work', amount: 800, date: '2024-05-28', category: 'Freelance', recurring: false },
    { id: 7, source: 'Bonus Payment', amount: 1500, date: '2024-05-25', category: 'Salary', recurring: false }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IncomeTransaction | null>(null);
  const [showAmounts, setShowAmounts] = useState(true);
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: '',
    category: 'Salary',
    recurring: false
  });

  const chartData = [
    { month: 'Jan', income: 4500, target: 5000 },
    { month: 'Feb', income: 5200, target: 5000 },
    { month: 'Mar', income: 4800, target: 5000 },
    { month: 'Apr', income: 5100, target: 5000 },
    { month: 'May', income: 4900, target: 5000 },
    { month: 'Jun', income: 6730, target: 5000 }
  ];

  // Calculate category data from actual income data
  const calculateCategoryData = () => {
    const categoryTotals = incomeData.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {} as Record<string, number>);

    const colors: Record<string, string> = {
      'Salary': '#3b82f6',
      'Freelance': '#10b981',
      'Investment': '#f59e0b',
      'Business': '#8b5cf6',
      'Real Estate': '#06b6d4',
      'Other': '#ef4444'
    };

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      fill: colors[category] || '#64748b'
    }));
  };

  const categoryData = calculateCategoryData();

  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const recurringIncome = incomeData.filter(item => item.recurring).reduce((sum, item) => sum + item.amount, 0);
  const thisMonthIncome = incomeData.filter(item => item.date.startsWith('2024-06')).reduce((sum, item) => sum + item.amount, 0);
  const avgMonthlyIncome = Math.round(totalIncome / 6);

  const categories = ['All', ...Array.from(new Set(incomeData.map(item => item.category)))];

  const filteredData = incomeData.filter(item => {
    const matchesSearch = item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = () => {
    console.log('Add Income button clicked');
    setEditingItem(null);
    setFormData({ source: '', amount: '', date: '', category: 'Salary', recurring: false });
    setIsModalOpen(true);
  };

  const handleEdit = (item: IncomeTransaction) => {
    console.log('Edit Income button clicked for:', item.id);
    setEditingItem(item);
    setFormData({
      source: item.source,
      amount: item.amount.toString(),
      date: item.date,
      category: item.category,
      recurring: item.recurring
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log('Delete Income button clicked for:', id);
    setIncomeData(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    if (!formData.source || !formData.amount || !formData.date) return;
    
    if (editingItem) {
      setIncomeData(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, amount: parseFloat(formData.amount) }
          : item
      ));
    } else {
      const newItem: IncomeTransaction = {
        id: Date.now(),
        source: formData.source,
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        recurring: formData.recurring
      };
      setIncomeData(prev => [newItem, ...prev]);
    }
    
    setIsModalOpen(false);
  };

  const handleFormChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const closeModal = () => {
    console.log('Modal closed');
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">Income Dashboard</h1>
            <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">Track and analyze your income streams</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto relative z-10">
            <Button variant="outline" size="sm" onClick={() => setShowAmounts(!showAmounts)} className="flex-1 sm:flex-none pointer-events-auto cursor-pointer">
              {showAmounts ? <EyeOff className="w-4 h-4 mr-1 sm:mr-2" /> : <Eye className="w-4 h-4 mr-1 sm:mr-2" />}
              <span className="hidden sm:inline">{showAmounts ? 'Hide' : 'Show'} Amounts</span>
              <span className="sm:hidden">{showAmounts ? 'Hide' : 'Show'}</span>
            </Button>
            <Button onClick={handleAdd} size="sm" className="flex-1 sm:flex-none pointer-events-auto cursor-pointer">
              <Plus className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Income</span>
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
                  <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Total Income</p>
                  <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 truncate">
                    {showAmounts ? `$${totalIncome.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">+12% from last month</p>
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
                  <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Recurring Income</p>
                  <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 truncate">
                    {showAmounts ? `$${recurringIncome.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Monthly guaranteed</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0 ml-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
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
                    {showAmounts ? `$${thisMonthIncome.toLocaleString()}` : '••••••'}
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
                  <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">Avg Monthly</p>
                  <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 truncate">
                    {showAmounts ? `$${avgMonthlyIncome.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">6-month average</p>
                </div>
                <div className="p-2 sm:p-3 bg-orange-100 rounded-full flex-shrink-0 ml-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Income Trend</CardTitle>
              <CardDescription>Monthly income over time vs target</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Line type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Income by Category</CardTitle>
              <CardDescription>Distribution of income sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div>
                <CardTitle>Income Transactions</CardTitle>
                <CardDescription>Manage your income sources and transactions</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search transactions..."
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
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">Source</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm hidden sm:table-cell">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm hidden md:table-cell">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 text-sm">{item.source}</div>
                        <div className="text-xs text-slate-500 sm:hidden">{new Date(item.date).toLocaleDateString()}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-bold text-green-600 text-sm">
                        {showAmounts ? `$${item.amount.toLocaleString()}` : '••••••'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-sm hidden sm:table-cell">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <Badge variant={item.recurring ? "success" : "outline"} className="text-xs">
                          {item.recurring ? 'Recurring' : 'One-time'}
                        </Badge>
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

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                {editingItem ? 'Edit Income' : 'Add New Income'}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeModal} className="h-8 w-8 p-0 pointer-events-auto cursor-pointer">
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Income Source *</label>
                <Input
                  value={formData.source}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('source', e.target.value)}
                  placeholder="e.g., Software Engineer - TechCorp"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount ($) *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('amount', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date *</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('date', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <Select
                  value={formData.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFormChange('category', e.target.value)}
                >
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Investment">Investment</option>
                  <option value="Business">Business</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Other">Other</option>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.recurring}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange('recurring', e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-950"
                />
                <label htmlFor="recurring" className="text-sm text-slate-700 cursor-pointer">
                  This is a recurring income source
                </label>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
                <Button variant="outline" onClick={closeModal} className="w-full sm:w-auto pointer-events-auto cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto pointer-events-auto cursor-pointer">
                  <Save className="w-4 h-4 mr-2" />
                  {editingItem ? 'Update Income' : 'Add Income'}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default IncomePage;