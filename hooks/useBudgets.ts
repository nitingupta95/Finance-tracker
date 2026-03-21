import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Budget, BudgetFormData } from '@/types/budget';

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/budget');
      setBudgets(res.data);
    } catch (err) {
      setError('Failed to fetch budgets');
      console.error('Error fetching budgets:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const addBudget = useCallback(async (budget: BudgetFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/budget', budget);
      if (res.status === 201) {
        setBudgets((prev) => [res.data, ...prev]);
        return { success: true, data: res.data };
      }
      return { success: false, error: 'Failed to add budget' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to add budget';
      setError(errorMessage);
      console.error('Error adding budget:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateBudget = useCallback(async (id: string, budget: BudgetFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.put(`/api/budget/${id}`, budget);
      if (res.status === 200) {
        setBudgets((prev) =>
          prev.map((b) => (b._id === id ? res.data : b))
        );
        return { success: true, data: res.data };
      }
      return { success: false, error: 'Failed to update budget' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update budget';
      setError(errorMessage);
      console.error('Error updating budget:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteBudget = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.delete(`/api/budget/${id}`);
      if (res.status === 200) {
        setBudgets((prev) => prev.filter((b) => b._id !== id));
        return { success: true };
      }
      return { success: false, error: 'Failed to delete budget' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete budget';
      setError(errorMessage);
      console.error('Error deleting budget:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    budgets,
    isLoading,
    error,
    fetchBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
  };
}
