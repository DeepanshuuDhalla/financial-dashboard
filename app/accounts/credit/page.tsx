"use client";
import React, { useState, useEffect } from "react";
import { useFinancialData } from "../../hooks/useFinancialData";
import { Account } from "../../../types";
import { Plus, Edit, Trash2, X, Save, CreditCard } from "lucide-react";

const currencies = ["USD", "EUR", "GBP", "INR", "JPY"];

const CreditCardsPage = () => {
  const { data, loading, error } = useFinancialData();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [form, setForm] = useState<Partial<Account>>({ type: "credit", currency: "USD", isActive: true });
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (data && data.accounts) {
      setAccounts(data.accounts.filter((a: Account) => a.type === "credit"));
    }
  }, [data]);

  const openAdd = () => {
    setEditAccount(null);
    setForm({ type: "credit", currency: "USD", isActive: true });
    setModalOpen(true);
  };
  const openEdit = (acc: Account) => {
    setEditAccount(acc);
    setForm(acc);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setForm({ type: "credit", currency: "USD", isActive: true });
    setEditAccount(null);
  };
  const handleChange = (field: keyof Account, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.currency || form.balance === undefined) return;
    if (editAccount) {
      setAccounts(prev => prev.map(a => a.id === editAccount.id ? { ...editAccount, ...form } as Account : a));
    } else {
      setAccounts(prev => [
        ...prev,
        { ...form, id: Math.random().toString(36).slice(2) } as Account
      ]);
    }
    closeModal();
  };
  const handleDelete = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };
  const filtered = accounts.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Credit Cards</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"><Plus size={18}/>Add Card</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cards..." className="mb-4 px-3 py-2 border rounded w-full" />
      <table className="w-full border rounded mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-right">Balance</th>
            <th className="p-2 text-left">Currency</th>
            <th className="p-2 text-left">Bank</th>
            <th className="p-2 text-left">Credit Limit</th>
            <th className="p-2 text-center">Active</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(acc => (
            <tr key={acc.id} className="border-t">
              <td className="p-2">{acc.name}</td>
              <td className="p-2 text-right">{acc.balance.toLocaleString(undefined, { style: 'currency', currency: acc.currency })}</td>
              <td className="p-2">{acc.currency}</td>
              <td className="p-2">{acc.bank}</td>
              <td className="p-2">{acc.creditLimit ? acc.creditLimit.toLocaleString(undefined, { style: 'currency', currency: acc.currency }) : '-'}</td>
              <td className="p-2 text-center">{acc.isActive ? 'Yes' : 'No'}</td>
              <td className="p-2 text-center">
                <button onClick={() => openEdit(acc)} className="text-blue-600 hover:underline mr-2"><Edit size={16}/></button>
                <button onClick={() => handleDelete(acc.id)} className="text-red-600 hover:underline"><Trash2 size={16}/></button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && <tr><td colSpan={7} className="p-4 text-center text-gray-500">No credit cards found.</td></tr>}
        </tbody>
      </table>
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"><X size={20}/></button>
            <h2 className="text-lg font-semibold mb-4">{editAccount ? 'Edit' : 'Add'} Credit Card</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input value={form.name || ''} onChange={e => handleChange('name', e.target.value)} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div>
                <label className="block mb-1">Balance</label>
                <input type="number" value={form.balance ?? ''} onChange={e => handleChange('balance', parseFloat(e.target.value))} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div>
                <label className="block mb-1">Currency</label>
                <select value={form.currency || 'USD'} onChange={e => handleChange('currency', e.target.value)} className="w-full border px-3 py-2 rounded">
                  {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1">Bank</label>
                <input value={form.bank || ''} onChange={e => handleChange('bank', e.target.value)} className="w-full border px-3 py-2 rounded" required />
              </div>
              <div>
                <label className="block mb-1">Credit Limit</label>
                <input type="number" value={form.creditLimit ?? ''} onChange={e => handleChange('creditLimit', parseFloat(e.target.value))} className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive ?? true} onChange={e => handleChange('isActive', e.target.checked)} id="isActive" />
                <label htmlFor="isActive">Active</label>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"><Save size={16}/>{editAccount ? 'Save' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditCardsPage; 