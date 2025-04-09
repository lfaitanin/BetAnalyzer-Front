'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import { UpdateProfileData } from '@/services/auth';

export default function PerfilPage() {
  const { user, isLoading, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    defaultStake: 0,
    balance: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || '',
        defaultStake: user.defaultStake || 0,
        balance: user.balance || 0
      }));
      setIsLoadingProfile(false);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'defaultStake' ? parseFloat(value) || 0 : value,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData: UpdateProfileData = {
        fullName: formData.fullName,
        email: formData.email,
        defaultStake: formData.defaultStake,
        balance: formData.balance
      };
      
      // Chamar a função de atualização de perfil
      await updateProfile(updateData);
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil. Tente novamente.');
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isLoadingProfile) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Meu Perfil</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-4 text-gray-800">Informações Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4 text-gray-800">Stake Padrão</h2>
            <div>
              <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-1">
                Saldo (R$)
              </label>
              <input
                type="number"
                id="balance"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Este valor é seu saldo atual
              </p>
            </div>
          </div>

          <div>
            <div>
              <label htmlFor="defaultStake" className="block text-sm font-medium text-gray-700 mb-1">
                Valor da Stake (R$)
              </label>
              <input
                type="number"
                id="defaultStake"
                name="defaultStake"
                value={formData.defaultStake}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-700">
                Este valor será usado como padrão para suas apostas
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-4 text-gray-800">Segurança</h2>
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Alterar Senha
            </button>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
} 