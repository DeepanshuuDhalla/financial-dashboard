import React, { useEffect } from "react";
import { useFinancialData } from "../../hooks/useFinancialData";

const TestSupabaseCRUD: React.FC<{ userId: string }> = ({ userId }) => {
  const { addAccount, updateAccount, deleteAccount, reload } = useFinancialData(userId);

  useEffect(() => {
    async function testCRUD() {
      // Add
      const addRes = await addAccount({ id: "test123", name: "Test Account", type: "checking", balance: 1000, currency: "USD", bank: "Test Bank", isActive: true, user_id: userId });
      console.log("Add result:", addRes);

      // Update
      const updateRes = await updateAccount("test123", { name: "Updated Account" });
      console.log("Update result:", updateRes);

      // Delete
      const deleteRes = await deleteAccount("test123");
      console.log("Delete result:", deleteRes);

      // Reload
      await reload();
    }
    testCRUD();
  }, [userId, addAccount, updateAccount, deleteAccount, reload]);

  return <div>Check console for Supabase CRUD test results.</div>;
};

export default TestSupabaseCRUD; 