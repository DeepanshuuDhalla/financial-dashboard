import { useState, useEffect } from 'react';

export interface FinancialData {
  user: any;
  transactions: any;
  goals: any;
  analytics: any;
  notifications: any;
  recentActivity: any;
}

export function useFinancialData() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/app/data/financial-data.json');
      if (!res.ok) throw new Error('Failed to load financial data');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { data, loading, error, reload: load };
} 