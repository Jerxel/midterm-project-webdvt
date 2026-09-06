import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "budget-tracker-transactions";

function readFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    // Corrupt or unavailable storage shouldn't crash the app
    return [];
  }
}

/**
 * Custom hook that owns all reading/writing of transactions to
 * persistent storage (localStorage). Any page that needs transaction
 * data — Dashboard, Add Transaction, Transaction Detail, Summary —
 * imports this single hook instead of re-implementing storage logic.
 *
 * Also keeps multiple components in sync: if one tab/component
 * changes transactions, other mounted components using this hook
 * pick up the change via the "storage" event.
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState(readFromStorage);

  // Persist to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Stay in sync if storage changes in another tab
  useEffect(() => {
    function handleStorage(e) {
      if (e.key === STORAGE_KEY) {
        setTransactions(readFromStorage());
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split("T")[0],
      ...transaction,
      amount: parseFloat(transaction.amount),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    return newTransaction;
  }, []);

  const updateTransaction = useCallback((id, updates) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...updates,
              amount:
                updates.amount !== undefined
                  ? parseFloat(updates.amount)
                  : t.amount,
            }
          : t
      )
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getTransaction = useCallback(
    (id) => transactions.find((t) => t.id === id),
    [transactions]
  );

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
  };
}
