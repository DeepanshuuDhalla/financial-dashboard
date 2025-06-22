"use client";
import AccountManager from "../../components/accounts/AccountManager";

export default function BankAccountsPage() {
  // This page shows both checking and savings accounts
  // We'll render two AccountManager components, one for each type
  return (
    <div className="space-y-12">
      <AccountManager accountType="checking" title="Checking Accounts" description="Manage your checking accounts." />
      <AccountManager accountType="savings" title="Savings Accounts" description="Manage your savings accounts." />
    </div>
  );
} 