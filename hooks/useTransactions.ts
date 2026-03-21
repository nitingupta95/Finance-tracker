import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Transaction } from '@/types/transaction';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/transaction');
      setTransactions(res.data);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/transaction', transaction);
      if (res.status === 201) {
        setTransactions((prev) => [res.data, ...prev]);
        return { success: true, data: res.data };
      }
      return { success: false, error: 'Failed to add transaction' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to add transaction';
      setError(errorMessage);
      console.error('Error adding transaction:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTransaction = useCallback(async (id: string, transaction: Partial<Transaction>) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.put(`/api/transaction/${id}`, transaction);
      if (res.status === 200) {
        setTransactions((prev) =>
          prev.map((t) => (t._id === id ? res.data : t))
        );
        return { success: true, data: res.data };
      }
      return { success: false, error: 'Failed to update transaction' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update transaction';
      setError(errorMessage);
      console.error('Error updating transaction:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.delete(`/api/transaction/${id}`);
      if (res.status === 200) {
        setTransactions((prev) => prev.filter((t) => t._id !== id));
        return { success: true };
      }
      return { success: false, error: 'Failed to delete transaction' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete transaction';
      setError(errorMessage);
      console.error('Error deleting transaction:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
