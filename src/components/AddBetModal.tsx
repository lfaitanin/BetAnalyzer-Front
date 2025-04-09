'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';

interface AddBetModalProps {
  isOpen: boolean;
  onClose: () => void;
  bet: {
    betId: string;
    playerName: string;
    category: string;
    target: number;
  };
}

export default function AddBetModal({ isOpen, onClose, bet }: AddBetModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    stake: 0,
    meta: 0,
    odd: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      // Preencher com stake padrão do usuário
      setFormData(prev => ({
        ...prev,
        stake: user.defaultStake || 0,
        meta: bet.target
      }));
    }
  }, [isOpen, user, bet.target]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Você precisa estar logado para adicionar apostas');
      return;
    }

    if (formData.odd <= 0) {
      toast.error('A odd deve ser maior que zero');
      return;
    }

    if (formData.stake <= 0) {
      toast.error('A stake deve ser maior que zero');
      return;
    }

    if (formData.meta <= 0) {
      toast.error('A meta deve ser maior que zero');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Bet data before submission:', {
        bet,
        formData,
        user
      });

      await api.addUserBet({
        userId: user.id,
        betId: bet.betId,
        betTitle: `${bet.playerName} - ${bet.category}`,
        odd: formData.odd,
        stake: formData.stake,
        meta: formData.meta,
        date: new Date().toISOString(),
        status: 'Pendente',
        id: ''
      });

      toast.success('Aposta adicionada com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar aposta:', error);
      toast.error('Erro ao adicionar aposta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Adicionar Aposta</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{bet.playerName}</span> - {bet.category}
          </p>
          <p className="text-sm text-gray-600">
            Meta: <span className="font-medium">{bet.target}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="stake" className="block text-sm font-medium text-gray-700 mb-1">
                Stake (R$)
              </label>
              <input
                type="number"
                id="stake"
                name="stake"
                value={formData.stake}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                required
              />
            </div>

            <div>
              <label htmlFor="meta" className="block text-sm font-medium text-gray-700 mb-1">
                Meta
              </label>
              <input
                type="number"
                id="meta"
                name="meta"
                value={formData.meta}
                onChange={handleChange}
                min="0"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                required
              />
            </div>

            <div>
              <label htmlFor="odd" className="block text-sm font-medium text-gray-700 mb-1">
                Odd
              </label>
              <input
                type="number"
                id="odd"
                name="odd"
                value={formData.odd}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </span>
              ) : (
                'Salvar Aposta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 