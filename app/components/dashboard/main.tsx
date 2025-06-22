import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, 
  Eye, EyeOff, MoreHorizontal, Filter, Search, 
  Zap, Target, Brain, Activity, ChevronLeft, ChevronRight,
  DollarSign, PieChart, BarChart3, Calendar, Download,
  Settings, Bell, Plus, Minus, Star, AlertCircle
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, 
  Area, Cell, PieChart as RechartsPieChart, Pie,
  BarChart, Bar, Tooltip, Legend, ComposedChart
} from 'recharts';

// Enhanced Shadcn-style components with white theme
const Card = ({ children, className = "", gradient = false }: { children: React.ReactNode; className?: string; gradient?: boolean }) => (
  <div className={`bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${gradient ? 'bg-gradient-to-br from-white to-gray-50/50' : ''} ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string; }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Button = ({ children, variant = "default", size = "default", className = "", ...props }: {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'success' | 'warning' | 'danger';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:scale-105 active:scale-95";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    outline: "border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm",
    ghost: "hover:bg-gray-50 text-gray-700",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm"
  };
  const sizes = {
    default: "h-10 py-2 px-4 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "default", className = "" }: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Progress = ({ value, className = "", color = "blue" }: {
  value: number;
  className?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}) => {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500"
  };
  
  return (
    <div className={`w-full bg-gray-100 rounded-full h-2.5 ${className}`}>
      <div 
        className={`${colors[color]} h-2.5 rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
};

const FinancialDashboard = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('netWorth');
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [activeInsight, setActiveInsight] = useState(0);
  
  const itemsPerPage = 6;

  // Enhanced financial data with more realistic numbers
  const baseData = {
    totalBalance: 15420.75,
    monthlyIncome: 4800.00,
    monthlyExpenses: 3250.00,
    investments: 12800.00,
    debts: 3200.00,
    creditScore: 742,
    monthlyData: [
      { month: 'Jan', income: 4500, expenses: 3100, investments: 11200, savings: 1400, netWorth: 23100 },
      { month: 'Feb', income: 4650, expenses: 2950, investments: 11800, savings: 1700, netWorth: 24200 },
      { month: 'Mar', income: 4750, expenses: 3200, investments: 12100, savings: 1550, netWorth: 24850 },
      { month: 'Apr', income: 4900, expenses: 3150, investments: 12400, savings: 1750, netWorth: 25600 },
      { month: 'May', income: 4800, expenses: 3300, investments: 12600, savings: 1500, netWorth: 26100 },
      { month: 'Jun', income: 4800, expenses: 3250, investments: 12800, savings: 1550, netWorth: 26650 }
    ]
  };

  // Expense breakdown for pie chart
  const expenseBreakdown = [
    { name: 'Housing', value: 1200, color: '#3b82f6', percentage: 37 },
    { name: 'Food', value: 480, color: '#10b981', percentage: 15 },
    { name: 'Transportation', value: 390, color: '#f59e0b', percentage: 12 },
    { name: 'Utilities', value: 280, color: '#ef4444', percentage: 9 },
    { name: 'Entertainment', value: 325, color: '#8b5cf6', percentage: 10 },
    { name: 'Healthcare', value: 195, color: '#06b6d4', percentage: 6 },
    { name: 'Other', value: 380, color: '#84cc16', percentage: 11 }
  ];

  // Investment allocation
  const investmentAllocation = [
    { name: 'Stocks', value: 6400, percentage: 50, growth: '+12.5%' },
    { name: 'Bonds', value: 2560, percentage: 20, growth: '+4.2%' },
    { name: 'Real Estate', value: 2304, percentage: 18, growth: '+8.7%' },
    { name: 'Crypto', value: 896, percentage: 7, growth: '+24.1%' },
    { name: 'Cash', value: 640, percentage: 5, growth: '+2.1%' }
  ];

  // Advanced calculations
  const analytics = useMemo(() => {
    const savingsRate = ((baseData.monthlyIncome - baseData.monthlyExpenses) / baseData.monthlyIncome * 100);
    const netWorth = baseData.totalBalance + baseData.investments - baseData.debts;
    const debtToIncomeRatio = (baseData.debts / (baseData.monthlyIncome * 12) * 100);
    const monthlyNetCashFlow = baseData.monthlyIncome - baseData.monthlyExpenses;
    const emergencyFundRatio = baseData.totalBalance / baseData.monthlyExpenses;
    const investmentGrowthRate = 9.2;
    const financialFreedomScore = Math.min(100, (savingsRate + (100 - debtToIncomeRatio) + emergencyFundRatio * 8) / 3);
    
    return {
      savingsRate: savingsRate.toFixed(1),
      netWorth,
      debtToIncomeRatio: debtToIncomeRatio.toFixed(1),
      monthlyNetCashFlow,
      emergencyFundRatio: emergencyFundRatio.toFixed(1),
      financialFreedomScore: Math.round(financialFreedomScore),
      burnRate: (baseData.monthlyExpenses / 30).toFixed(0),
      wealthVelocity: ((monthlyNetCashFlow / netWorth * 100) * 12).toFixed(1),
      projectedNetWorth: netWorth * Math.pow(1 + investmentGrowthRate/100, 1),
      creditUtilization: 23,
      monthlyGrowth: 2.1
    };
  }, [baseData]);

  // Enhanced chart data
  const chartData = useMemo(() => {
    return baseData.monthlyData.map((month, index) => ({
      ...month,
      savingsRate: ((month.income - month.expenses) / month.income * 100),
      efficiency: ((month.income / month.expenses) * 100) - 100,
      growthRate: index > 0 ? ((month.netWorth - baseData.monthlyData[index-1].netWorth) / baseData.monthlyData[index-1].netWorth * 100) : 0
    }));
  }, [baseData.monthlyData]);

  // Enhanced transactions with better categorization
  const transactions = [
    { id: 1, description: 'Salary Deposit - Tech Corp', amount: 4800.00, category: 'Income', date: '2024-06-20', recurring: true, impact: 'positive', icon: DollarSign },
    { id: 2, description: 'Rent Payment - Downtown Apt', amount: -1200.00, category: 'Housing', date: '2024-06-19', recurring: true, impact: 'neutral', icon: null },
    { id: 3, description: 'S&P 500 ETF Purchase', amount: -800.00, category: 'Investment', date: '2024-06-18', recurring: false, impact: 'positive', icon: TrendingUp },
    { id: 4, description: 'Whole Foods Market', amount: -127.85, category: 'Food', date: '2024-06-17', recurring: false, impact: 'neutral', icon: null },
    { id: 5, description: 'Electric Bill - June', amount: -89.42, category: 'Utilities', date: '2024-06-16', recurring: true, impact: 'neutral', icon: null },
    { id: 6, description: 'Coffee Shop & Restaurants', amount: -64.30, category: 'Food', date: '2024-06-15', recurring: false, impact: 'warning', icon: null },
    { id: 7, description: 'Freelance Web Design', amount: 1200.00, category: 'Income', date: '2024-06-14', recurring: false, impact: 'positive', icon: DollarSign },
    { id: 8, description: 'Gas Station - Shell', amount: -52.15, category: 'Transportation', date: '2024-06-13', recurring: false, impact: 'neutral', icon: null },
    { id: 9, description: 'Netflix Subscription', amount: -15.99, category: 'Entertainment', date: '2024-06-12', recurring: true, impact: 'neutral', icon: null },
    { id: 10, description: 'Gym Membership', amount: -49.99, category: 'Health', date: '2024-06-11', recurring: true, impact: 'positive', icon: Activity }
  ];

  // Smart insights
  const insights = [
    {
      title: "Exceptional Savings Rate",
      description: `Your ${analytics.savingsRate}% savings rate is well above the recommended 20%. You're building wealth efficiently!`,
      action: "Consider increasing investment allocation",
      type: "success",
      icon: Target
    },
    {
      title: "Emergency Fund Status",
      description: `You have ${analytics.emergencyFundRatio} months of expenses saved. Aim for 6+ months for optimal security.`,
      action: "Build emergency fund",
      type: "warning",
      icon: AlertCircle
    },
    {
      title: "Investment Diversification",
      description: "Your portfolio shows good diversification across asset classes with strong recent performance.",
      action: "Rebalance quarterly",
      type: "info",
      icon: PieChart
    }
  ];

  // Filtered and paginated transactions
  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const metricOptions = [
    { key: 'netWorth', label: 'Net Worth', color: '#3b82f6' },
    { key: 'savingsRate', label: 'Savings Rate', color: '#10b981' },
    { key: 'investments', label: 'Investments', color: '#8b5cf6' },
    { key: 'income', label: 'Income', color: '#f59e0b' }
  ];

  const periodOptions = [
    { key: '3m', label: '3M' },
    { key: '6m', label: '6M' },
    { key: '1y', label: '1Y' },
    { key: '2y', label: '2Y' }
  ];

  const handleQuickAction = (action: string) => {
    console.log(`Executing action: ${action}`);
    // Here you would implement actual functionality
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Financial Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Intelligent insights for smarter financial decisions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="default" onClick={() => handleQuickAction('export')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="default" onClick={() => handleQuickAction('settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button size="default" onClick={() => handleQuickAction('add-transaction')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Net Worth Card */}
          <Card className="relative overflow-hidden" gradient>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Net Worth</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setBalanceVisible(!balanceVisible)}>
                  {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">
                  {balanceVisible ? `$${analytics.netWorth.toLocaleString()}` : '••••••••'}
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 font-medium text-sm">+{analytics.wealthVelocity}%</span>
                  <span className="text-gray-500 text-sm">annual growth</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Health Score */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Brain className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Health Score</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-gray-900">{analytics.financialFreedomScore}</span>
                  <Badge variant="success">Excellent</Badge>
                </div>
                <Progress value={analytics.financialFreedomScore} color="green" />
                <div className="text-xs text-gray-500">
                  Based on savings rate, debt ratio, and emergency fund
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Savings */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Target className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Monthly Savings</span>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">
                  ${analytics.monthlyNetCashFlow.toLocaleString()}
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="success">{analytics.savingsRate}% rate</Badge>
                  <span className="text-sm text-gray-500">{analytics.emergencyFundRatio}mo runway</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Score */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Credit Score</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-gray-900">{baseData.creditScore}</span>
                  <Badge variant="success">Very Good</Badge>
                </div>
                <Progress value={(baseData.creditScore - 300) / 5.5} color="blue" />
                <div className="text-xs text-gray-500">
                  {analytics.creditUtilization}% utilization
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Wealth Growth Trend */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Wealth Growth</h3>
                  <p className="text-sm text-gray-600">Track your financial progress over time</p>
                </div>
                <div className="flex items-center gap-2">
                  {periodOptions.map((period) => (
                    <Button
                      key={period.key}
                      variant={selectedPeriod === period.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPeriod(period.key)}
                    >
                      {period.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" name="Income" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    <Line type="monotone" dataKey="netWorth" stroke="#3b82f6" strokeWidth={3} name="Net Worth" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Expense Breakdown</h3>
                  <p className="text-sm text-gray-600">Monthly spending by category</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleQuickAction('analyze-expenses')}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analyze
                </Button>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }: { name: string, percentage: number }) => `${name} ${percentage}%`}
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`$${value}`, 'Amount']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Allocation */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Investment Portfolio</h3>
                <p className="text-sm text-gray-600">Asset allocation and performance</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleQuickAction('rebalance')}>
                <Target className="w-4 h-4 mr-2" />
                Rebalance
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {investmentAllocation.map((asset, index) => (
                <div key={`investment-${asset.name}-${index}`} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-center space-y-2">
                    <div className="text-lg font-semibold text-gray-900">{asset.name}</div>
                    <div className="text-2xl font-bold text-blue-600">${asset.value.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{asset.percentage}% allocation</div>
                    <Badge variant="success" className="text-xs">
                      {asset.growth}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Transactions Table */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Recent Transactions</h3>
                <p className="text-sm text-gray-600">Smart categorization and insights</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64 bg-white"
                  />
                </div>
                <Button variant="outline" size="default" onClick={() => handleQuickAction('filter')}>
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Enhanced Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Transaction</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Category</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Amount</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Impact</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {transaction.icon && (
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <transaction.icon className="w-4 h-4 text-gray-600" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{transaction.description}</div>
                            {transaction.recurring && (
                              <Badge variant="default" className="mt-1 text-xs">Recurring</Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="default">{transaction.category}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-bold text-lg ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={
                          transaction.impact === 'positive' ? 'success' : 
                          transaction.impact === 'warning' ? 'warning' : 'default'
                        }>
                          {transaction.impact}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{transaction.date}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleQuickAction(`edit-${transaction.id}`)}>
                            <Settings className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleQuickAction(`delete-${transaction.id}`)}>
                            <Minus className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Smart Insights */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Smart Insights</h3>
                <p className="text-sm text-gray-600">AI-powered financial recommendations</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveInsight(Math.max(0, activeInsight - 1))}
                  disabled={activeInsight === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  {activeInsight + 1} of {insights.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveInsight(Math.min(insights.length - 1, activeInsight + 1))}
                  disabled={activeInsight === insights.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.map((insight, index) => (
                <div
                  key={`insight-${insight.title}-${index}`}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    index === activeInsight 
                      ? 'border-blue-200 bg-blue-50 shadow-sm' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'success' ? 'bg-green-100' :
                      insight.type === 'warning' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      <insight.icon className={`w-5 h-5 ${
                        insight.type === 'success' ? 'text-green-600' :
                        insight.type === 'warning' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(insight.action)}
                      >
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: 'Set Budget', icon: Target, action: 'set-budget' },
                { label: 'Schedule Payment', icon: Calendar, action: 'schedule-payment' },
                { label: 'Investment Alert', icon: Bell, action: 'investment-alert' },
                { label: 'Debt Payoff', icon: Minus, action: 'debt-payoff' },
                { label: 'Savings Goal', icon: Plus, action: 'savings-goal' },
                { label: 'Financial Report', icon: BarChart3, action: 'financial-report' }
              ].map((action, index) => (
                <Button
                  key={`quick-action-${action.action}-${index}`}
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => handleQuickAction(action.action)}
                >
                  <action.icon className="w-6 h-6" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()} • Data synced from all accounts
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;