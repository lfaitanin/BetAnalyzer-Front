'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { Bell, X } from 'lucide-react';

export interface Notification {
  id: string;
  title: string;
  message: string | object; // se a mensagem por ventura vier como objeto
  priority: number;
  timestamp: Date;
  read: boolean;
}

// Função auxiliar para formatar o timestamp
const formatTimestamp = (timestamp: Date): string => {
  // Se o timestamp não for uma data válida, usa a data atual
  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleString();
};

export function NotificationBell() {
  // Extrai as notificações armazenadas no contexto
  const { messages, markMessageAsRead, markAllAsRead } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtra somente as notificações não lidas
  const unreadNotifications = messages.filter(
    (notification) => !notification.read
  );
  const unreadCount = unreadNotifications.length;

  // Fecha o dropdown ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Função para "remover" uma notificação (ou seja, marcá-la como lida)
  const removeNotification = (id: string) => {
    markMessageAsRead(id);
  };

  // Retorna a classe de cores conforme a prioridade
  const getPriorityColor = (priority: number): string => {
    switch (priority) {
      case 1:
        return 'bg-red-100 text-red-800 border-red-200';
      case 2:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 3:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 4:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900">Notificações</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {unreadNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Nenhuma notificação</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {unreadNotifications.map((notification) => {
                  // Se a mensagem não for string, converte para string
                  const messageText =
                    typeof notification.message === 'string'
                      ? notification.message
                      : JSON.stringify(notification.message);
                  return (
                    <li
                      key={notification.id}
                      className={`p-4 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                    >
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title || 'Notificação'}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">{messageText}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                      {notification.priority > 0 && (
                        <div
                          className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                            notification.priority
                          )}`}
                        >
                          Prioridade {notification.priority}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
