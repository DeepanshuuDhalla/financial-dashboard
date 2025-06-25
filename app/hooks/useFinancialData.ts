import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS, MOCK_GOALS } from '../lib/mockData';

export interface FinancialData {
  user: any;
  transactions: any;
  goals: any;
  analytics: any;
  notifications: any;
  recentActivity: any;
  accounts?: any[];
}

const MOCK_USER = {
  name: 'Demo User',
  email: 'demo@financeflow.com',
  avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff',
};

export function useFinancialData(userId?: string) {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [showMockWarning, setShowMockWarning] = useState(false);

  // Fetch user profile and accounts from Supabase
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!userId) throw new Error('No user ID provided');
      // Fetch user profile
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      // Fetch accounts
      const { data: accounts, error: accError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true });
      // Fetch transactions
      const { data: transactions, error: txnError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
      // Fetch goals
      const { data: goals, error: goalError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('target_date', { ascending: true });
      if (accError || txnError || goalError) throw accError || txnError || goalError;
      // Check if any real data exists
      const supabaseHasData = (accounts && accounts.length > 0) || (transactions && transactions.length > 0) || (goals && goals.length > 0);
      if (supabaseHasData) {
        setData(prev => ({
          ...(prev || {}),
          user: user || MOCK_USER,
          accounts,
          transactions,
          goals,
          analytics: {},
          notifications: [],
          recentActivity: [],
        }));
        setUsingMockData(false);
        setShowMockWarning(false);
      } else {
        setData(prev => ({
          ...(prev || {}),
          user: user || MOCK_USER,
          accounts: MOCK_ACCOUNTS,
          transactions: MOCK_TRANSACTIONS,
          goals: MOCK_GOALS,
          analytics: {},
          notifications: [],
          recentActivity: [],
        }));
        setUsingMockData(true);
        setShowMockWarning(true);
      }
    } catch (err: any) {
      setError(err);
      setData(prev => ({
        ...(prev || {}),
        user: MOCK_USER,
        accounts: MOCK_ACCOUNTS,
        transactions: MOCK_TRANSACTIONS,
        goals: MOCK_GOALS,
        analytics: {},
        notifications: [],
        recentActivity: [],
      }));
      setUsingMockData(true);
      setShowMockWarning(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // When any real data is added, call this to stop using mock data
  function onRealDataAdded() {
    setUsingMockData(false);
    setShowMockWarning(false);
    // Optionally, refetch real data
  }

  // --- Account CRUD ---
  const addAccount = useCallback(async (account: any) => {
    try {
      const { data: inserted, error: insertError } = await supabase
        .from('accounts')
        .insert([account])
        .select();
      if (insertError) throw insertError;
      setData(prev => prev ? { ...prev, accounts: [...((prev.accounts) || []), ...inserted] } : { user: MOCK_USER, transactions: [], goals: [], analytics: {}, notifications: [], recentActivity: [], accounts: inserted });
      return { success: true };
    } catch (err: any) {
      setError(err);
      return { success: false, error: err };
    }
  }, []);

  const updateAccount = useCallback(async (id: string, updates: any) => {
    try {
      const { data: updated, error: updateError } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', id)
        .select();
      if (updateError) throw updateError;
      setData(prev => prev ? {
        ...prev,
        accounts: (prev.accounts || []).map((acc: any) => acc.id === id ? { ...acc, ...updates } : acc)
      } : null);
      return { success: true };
    } catch (err: any) {
      setError(err);
      return { success: false, error: err };
    }
  }, []);

  const deleteAccount = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;
      setData(prev => prev ? {
        ...prev,
        accounts: (prev.accounts || []).filter((acc: any) => acc.id !== id)
      } : null);
      return { success: true };
    } catch (err: any) {
      setError(err);
      return { success: false, error: err };
    }
  }, []);

  return {
    data,
    loading,
    error,
    reload: load,
    addAccount,
    updateAccount,
    deleteAccount,
    usingMockData,
    showMockWarning,
    onRealDataAdded
  };
} 