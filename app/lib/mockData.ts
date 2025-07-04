export const MOCK_USER = {
  id: 'mock-user',
  name: 'Demo User',
  email: 'demo@financeflow.com',
  avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff',
};

export const MOCK_ACCOUNTS = [
  {
    id: 'acc-1',
    user_id: 'mock-user',
    name: 'Business Checking',
    type: 'checking',
    balance: 12000.50,
    currency: 'USD',
    accountNumber: '1234567890',
    bank: 'Demo Bank',
    isActive: true,
  },
  {
    id: 'acc-2',
    user_id: 'mock-user',
    name: 'Travel Rewards Credit Card',
    type: 'credit',
    balance: -1500.75,
    currency: 'USD',
    accountNumber: '9876543210',
    bank: 'Demo Bank',
    isActive: true,
    creditLimit: 5000,
  },
  {
    id: 'acc-3',
    user_id: 'mock-user',
    name: 'Roth IRA',
    type: 'investment',
    balance: 8000.00,
    currency: 'USD',
    accountNumber: '1122334455',
    bank: 'Demo Investments',
    isActive: true,
  },
];

export const MOCK_TRANSACTIONS = [
  {
    id: 'txn-1',
    account_id: 'acc-1',
    type: 'debit',
    category: 'Food',
    subcategory: 'Groceries',
    amount: 120.50,
    currency: 'USD',
    date: '2024-06-20',
    description: 'Whole Foods Market',
    merchant: 'Whole Foods',
    tags: ['groceries'],
    recurring: false,
    status: 'completed',
    created_at: '2024-06-20T10:00:00Z',
    updated_at: '2024-06-20T10:00:00Z',
  },
  {
    id: 'txn-2',
    account_id: 'acc-2',
    type: 'credit',
    category: 'Income',
    subcategory: 'Salary',
    amount: 3200.00,
    currency: 'USD',
    date: '2024-06-19',
    description: 'Monthly Salary',
    merchant: 'Tech Corp',
    tags: ['salary'],
    recurring: true,
    status: 'completed',
    created_at: '2024-06-19T09:00:00Z',
    updated_at: '2024-06-19T09:00:00Z',
  },
];

export const MOCK_GOALS = [
  {
    id: 'goal-1',
    account_id: 'acc-1',
    name: 'Emergency Fund',
    target_amount: 10000,
    current_amount: 7500,
    final_amount: 0,
    currency: 'USD',
    target_date: '2024-12-31',
    category: 'Savings',
    priority: 'High',
    description: 'Save for emergencies',
    monthly_target: 500,
    created_date: '2024-01-01',
    completed_date: null,
    archived_date: null,
    archive_reason: null,
    completion_time: null,
    early_completion: false,
    achievement: null,
    progress: 75,
    days_remaining: 120,
    days_overdue: 0,
    is_on_track: true,
    status: 'active',
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-06-20T10:00:00Z',
  },
];

export const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'goal', title: 'Welcome to FinanceFlow!', message: 'Start by adding your first account.', read: false, createdAt: new Date().toISOString() },
  { id: 2, type: 'transaction', title: 'Demo Transaction', message: 'Try adding a transaction to see insights.', read: false, createdAt: new Date().toISOString() },
]; 