'use client'
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import FinancialDashboard from './main';
import AllTransactionsPage from '../transactions/allTransaction';
import IncomePage from '../transactions/Income';
import ExpensesPage from '../transactions/Expenses';
import RecurringPage from '../transactions/Recurring';
import ActiveSavingsPage from '../goals/activeGoals';
import CompletedGoalsPage from '../goals/completedGoals';
import ArchivedGoalsPage from '../goals/archivedGoals';
import BankAccounts from '../accounts/BankAccounts';
import CreditCards from '../accounts/CreditCards';
import Investments from '../accounts/Investments';
import TestSupabaseCRUD from '../accounts/TestSupabaseCRUD';
import LoginForm from '../auth/LoginForm';
import { useAuth } from '../../hooks/useAuth';

// Mock data for demo
const mockTransactions = [
  { id: 1, type: 'expense', category: 'Groceries', amount: -67.50, date: '2025-06-21', description: 'Whole Foods Market', icon: '🛒' },
  { id: 2, type: 'income', category: 'Salary', amount: 3200, date: '2025-06-20', description: 'Monthly Salary', icon: '💰' },
  { id: 3, type: 'expense', category: 'Coffee', amount: -4.50, date: '2025-06-20', description: 'Starbucks', icon: '☕' },
  { id: 4, type: 'expense', category: 'Gas', amount: -45.00, date: '2025-06-19', description: 'Shell Station', icon: '⛽' },
  { id: 5, type: 'income', category: 'Freelance', amount: 450, date: '2025-06-18', description: 'Web Design Project', icon: '💻' },
  { id: 6, type: 'expense', category: 'Dining', amount: -32.50, date: '2025-06-18', description: 'Pizza Palace', icon: '🍕' },
  { id: 7, type: 'expense', category: 'Shopping', amount: -89.99, date: '2025-06-17', description: 'Amazon Purchase', icon: '📦' },
  { id: 8, type: 'expense', category: 'Utilities', amount: -120.00, date: '2025-06-15', description: 'Electric Bill', icon: '⚡' },
  { id: 9, type: 'income', category: 'Investment', amount: 75.50, date: '2025-06-14', description: 'Dividend Payment', icon: '📈' },
  { id: 10, type: 'expense', category: 'Entertainment', amount: -15.00, date: '2025-06-13', description: 'Movie Tickets', icon: '🎬' }
];

const mockGoals = [
  { id: 1, name: 'Emergency Fund', target: 10000, current: 7500, status: 'active', deadline: '2025-12-31', priority: 'high' },
  { id: 2, name: 'Vacation Fund', target: 3000, current: 1800, status: 'active', deadline: '2025-08-15', priority: 'medium' },
  { id: 3, name: 'New Car', target: 25000, current: 12000, status: 'active', deadline: '2026-06-30', priority: 'low' },
  { id: 4, name: 'Home Down Payment', target: 50000, current: 50000, status: 'completed', deadline: '2025-03-01', priority: 'high' }
];

const Page: React.FC<unknown> = () => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [currentRoute, setCurrentRoute] = useState<string>('dashboard')
  const { user, userId, loading: authLoading } = useAuth();

  // Redirect to default subpages for main sections
  useEffect(() => {
    if (currentRoute === 'transactions') setCurrentRoute('all-transactions');
    if (currentRoute === 'goals') setCurrentRoute('active-goals');
    if (currentRoute === 'accounts') setCurrentRoute('bank-accounts');
  }, [currentRoute]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    // Set initial state
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  const handleCloseSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  const handleRouteChange = (route: string) => {
    // Redirect to default subpages for main sections
    if (route === 'transactions') {
      setCurrentRoute('all-transactions');
    } else if (route === 'goals') {
      setCurrentRoute('active-goals');
    } else if (route === 'accounts') {
      setCurrentRoute('bank-accounts');
    } else {
      setCurrentRoute(route);
    }
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Futuristic Background Pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] [background-size:20px_20px]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Navbar onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} sidebarOpen={isSidebarOpen} />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={handleCloseSidebar}
        onRouteChange={handleRouteChange}
        currentRoute={currentRoute}
      />
      
      {/* Main Content Area */}
      <main className={`transition-all duration-300 ease-in-out pt-16 relative z-10 ${
        isSidebarOpen ? 'lg:ml-80' : 'lg:ml-0'
      }`}>
        <div className="p-6 lg:p-8">
          {currentRoute === 'dashboard' && <FinancialDashboard />}
          {currentRoute === 'all-transactions' && <AllTransactionsPage />}
          {currentRoute === 'income' && <IncomePage />}
          {currentRoute === 'expenses' && <ExpensesPage />}
          {currentRoute === 'recurring' && <RecurringPage />}
          {currentRoute === 'active-goals' && <ActiveSavingsPage />}
          {currentRoute === 'completed-goals' && <CompletedGoalsPage />}
          {currentRoute === 'archived-goals' && <ArchivedGoalsPage />}
          {currentRoute === 'bank-accounts' && <BankAccounts userId={userId!} />}
          {currentRoute === 'credit-cards' && <CreditCards userId={userId!} />}
          {currentRoute === 'investments' && <Investments userId={userId!} />}
          {currentRoute === 'test-crud' && <TestSupabaseCRUD userId={userId!} />}
          {/* Add more route conditions as needed */}
        </div>
      </main>
    </div>
  )
}

export default Page