"use client";
import React, { useState, useEffect } from "react";
import { useFinancialData } from "../../hooks/useFinancialData";
import { Plus, Edit, Trash2, Save, Wallet, Banknote } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import FullscreenModal from "../common/FullscreenModal";
import { MOCK_ACCOUNTS } from '../../lib/mockData';

const accountTypes = [
  { value: "checking", label: "Checking", icon: Wallet },
  { value: "savings", label: "Savings", icon: Banknote },
];
const currencies = ["USD", "EUR", "GBP", "INR", "JPY"];

type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  accountNumber?: string;
  bank: string;
  isActive: boolean;
  user_id?: string;
};

const Card = ({ children, className = "", gradient = false }: { children: React.ReactNode; className?: string; gradient?: boolean }) => (
  <div className={`bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${gradient ? 'bg-gradient-to-br from-white to-gray-50/50' : ''} ${className}`}>{children}</div>
);
const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string; }) => (
  <div className={`p-4 sm:p-6 ${className}`}>{children}</div>
);
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost' | 'success' | 'warning' | 'danger';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
};
const Button: React.FC<ButtonProps> = ({ children, variant = "default", size = "default", className = "", ...props }) => {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:scale-105 active:scale-95";
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    outline: "border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm",
    ghost: "hover:bg-gray-50 text-gray-700",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm"
  };
  const sizes: Record<string, string> = {
    default: "h-9 py-2 px-3 text-sm sm:h-10 sm:px-4",
    sm: "h-7 px-2 text-xs sm:h-8 sm:px-3",
    lg: "h-10 px-4 text-sm sm:h-12 sm:px-6 sm:text-base",
    icon: "h-9 w-9 sm:h-10 sm:w-10"
  };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
};
type BadgeProps = {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
};
const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => {
  const variants: Record<string, string> = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200"
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${variants[variant]} ${className}`}>{children}</span>;
};

const BankAccounts: React.FC<{ userId: string }> = ({ userId }) => {
  const { data, addAccount, updateAccount, deleteAccount, reload } = useFinancialData(userId);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [form, setForm] = useState<Partial<Account>>({});
  const [search, setSearch] = useState("");
  const [opError, setOpError] = useState<string | null>(null);
  const [showMockWarning, setShowMockWarning] = useState(false);

  useEffect(() => {
    if (data && data.accounts) {
      if (data.accounts.length === 0) {
        setAccounts(MOCK_ACCOUNTS);
        setShowMockWarning(true);
      } else {
        setAccounts(data.accounts.filter((a: Account) => a.type === "checking" || a.type === "savings"));
        setShowMockWarning(false);
      }
    }
  }, [data]);

  // Summary
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  const activeCount = accounts.filter(a => a.isActive).length;
  const inactiveCount = accounts.length - activeCount;

  // Mock balance trend data
  const balanceTrend = [
    { month: "Jan", balance: totalBalance * 0.8 },
    { month: "Feb", balance: totalBalance * 0.85 },
    { month: "Mar", balance: totalBalance * 0.9 },
    { month: "Apr", balance: totalBalance * 0.95 },
    { month: "May", balance: totalBalance },
  ];

  const openAdd = () => {
    setEditAccount(null);
    setForm({ type: "checking", currency: "USD", isActive: true });
    setModalOpen(true);
    setOpError(null);
  };
  const openEdit = (acc: Account) => {
    setEditAccount(acc);
    setForm(acc);
    setModalOpen(true);
    setOpError(null);
  };
  const closeModal = () => {
    setModalOpen(false);
    setForm({});
    setEditAccount(null);
    setOpError(null);
  };
  const handleChange = <K extends keyof Account>(field: K, value: Account[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOpError(null);
    if (!form.name || !form.type || !form.currency || form.balance === undefined || !form.bank) {
      setOpError("Please fill all required fields.");
      return;
    }
    try {
      if (editAccount) {
        const res = await updateAccount(editAccount.id, form);
        if (!res.success) throw res.error;
      } else {
        const res = await addAccount({ ...form, id: Math.random().toString(36).slice(2), user_id: userId });
        if (!res.success) throw res.error;
      }
      await reload();
      closeModal();
    } catch (err) {
      if (err instanceof Error) setOpError(err.message);
      else setOpError("Operation failed");
    }
  };
  const handleDelete = async (id: string) => {
    setOpError(null);
    try {
      const res = await deleteAccount(id);
      if (!res.success) throw res.error;
      await reload();
    } catch (err) {
      if (err instanceof Error) setOpError(err.message);
      else setOpError("Delete failed");
    }
  };
  const filtered = accounts.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {showMockWarning && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-center font-semibold">
          Test version: Showing mock data.
        </div>
      )}
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card gradient>
          <CardContent>
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">Total Balance</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">${totalBalance.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-xs font-medium text-gray-700">Active Accounts</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full bg-gray-400"></span>
              <span className="text-xs font-medium text-gray-700">Inactive Accounts</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{inactiveCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Trend Chart */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Trend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={balanceTrend}>
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Bank Accounts</h2>
            <Button onClick={openAdd} size="default" variant="default" className="flex items-center gap-2"><Plus size={18}/>Add Account</Button>
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search accounts..." className="mb-4 px-3 py-2 border rounded w-full" />
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-right">Balance</th>
                  <th className="p-2 text-left">Currency</th>
                  <th className="p-2 text-left">Bank</th>
                  <th className="p-2 text-center">Active</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(acc => (
                  <tr key={acc.id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="p-2 font-medium text-gray-900">{acc.name}</td>
                    <td className="p-2 capitalize">{acc.type}</td>
                    <td className="p-2 text-right">{acc.balance.toLocaleString(undefined, { style: 'currency', currency: acc.currency })}</td>
                    <td className="p-2">{acc.currency}</td>
                    <td className="p-2">{acc.bank}</td>
                    <td className="p-2 text-center">{acc.isActive ? <Badge variant="success">Yes</Badge> : <Badge variant="default">No</Badge>}</td>
                    <td className="p-2 text-center">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(acc)}><Edit size={16}/></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(acc.id)}><Trash2 size={16}/></Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7} className="p-4 text-center text-gray-500">No accounts found.</td></tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal for Add/Edit */}
      <FullscreenModal isOpen={modalOpen} onClose={closeModal}>
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900 tracking-wide drop-shadow-lg">{editAccount ? 'Edit' : 'Add'} Bank Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-8 w-full max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Name</label>
              <input value={form.name || ''} onChange={e => handleChange('name', e.target.value)} className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90" required />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Type</label>
              <select value={form.type || 'checking'} onChange={e => handleChange('type', e.target.value)} className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90">
                {accountTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Balance</label>
              <input type="number" value={form.balance ?? ''} onChange={e => handleChange('balance', parseFloat(e.target.value))} className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90" required />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Currency</label>
              <select value={form.currency || 'USD'} onChange={e => handleChange('currency', e.target.value)} className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90">
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-semibold text-gray-700">Bank</label>
              <input value={form.bank || ''} onChange={e => handleChange('bank', e.target.value)} className="w-full border border-blue-200 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90" required />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input type="checkbox" checked={form.isActive ?? true} onChange={e => handleChange('isActive', e.target.checked)} id="isActive" className="accent-blue-600 scale-125" />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>
          {opError && <div className="text-red-600 text-sm text-center mb-2">{opError}</div>}
          <div className="flex justify-end gap-4 mt-8">
            <Button type="button" onClick={closeModal} variant="outline" className="px-6 py-2 text-blue-700 border-blue-300 hover:bg-blue-50">Cancel</Button>
            <Button type="submit" variant="default" className="px-6 py-2 flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white shadow-lg"><Save size={18}/>{editAccount ? 'Save' : 'Add'}</Button>
          </div>
        </form>
      </FullscreenModal>
    </div>
  );
};

export default BankAccounts; 