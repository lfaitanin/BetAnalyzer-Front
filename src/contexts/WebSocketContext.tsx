'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

/**
 * Definimos uma interface para cada mensagem recebida,
 * incluindo um 'id' e a flag 'read'.
 */
export interface NotificationMessage {
  timestamp: Date;
  id: string;
  type?: 'success' | 'error' | 'info';
  title?: string;
  message: string;
  priority: number;
  read: boolean; // se foi lida ou não
}

/**
 * Este contexto expõe os métodos e estados de notificação
 * para qualquer componente que consome `useWebSocket()`.
 */
interface WebSocketContextType {
  messages: NotificationMessage[];
  isConnected: boolean;
  markMessageAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  messages: [],
  isConnected: false,
  markMessageAsRead: () => {},
  markAllAsRead: () => {},
});

/**
 * Função auxiliar que tenta converter o campo value, que pode ser um JSON aninhado,
 * em uma string simples. Se value for uma string e puder ser parseado para um objeto
 * que possua a propriedade "message", retorna apenas essa propriedade; caso contrário,
 * retorna value.
 */
const parseIfJson = (value: unknown): string => {
  if (typeof value !== 'string') {
    return JSON.stringify(value);
  }
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object' && parsed.message) {
      return String(parsed.message);
    }
    return value;
  } catch {
    return value;
  }
};

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<NotificationMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Se não estiver logado ou não houver user, não inicia WebSocket
    if (!user) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (!wsUrl) {
      console.error('WebSocket URL não configurada em NEXT_PUBLIC_WS_URL');
      return;
    }

    let ws: WebSocket | null = null;

    // Função para se conectar ao WebSocket
    const connectWebSocket = (url: string) => {
      ws = new WebSocket(url);

      ws.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket conectado com sucesso:', url);
      };

      ws.onmessage = (event) => {
        try {
          // Converte a string recebida em objeto
          // Supondo que o servidor envie: { title, message, priority, timestamp? }
          const data = JSON.parse(event.data) as Omit<NotificationMessage, 'id' | 'read'>;
          if (!data.title && !data.message) {
            console.warn('Recebeu notificação vazia, ignorando.');
            return;
          }
          // Trata o campo message para evitar exibir JSON aninhado
          const messageText = parseIfJson(data.message);
          
          // Trata o timestamp: se não existir ou for inválido, utiliza new Date()
          const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
          if (isNaN(timestamp.getTime())) {
            // Se o timestamp for inválido, usa a data atual
            console.warn('Timestamp inválido recebido, usando a data atual.');
          }
          
          // Gera um ID e marca como não lida
          const newMessage: NotificationMessage = {
            id: crypto.randomUUID(),
            title: data.title,
            message: messageText,
            priority: data.priority,
            timestamp: isNaN(timestamp.getTime()) ? new Date() : timestamp,
            read: false,
          };

          // Atualiza o array de mensagens, adicionando a nova
          setMessages((prev) => [...prev, newMessage]);

          // Exibe toast (opcional, para alerta imediato)
          showToast(newMessage);
        } catch (error) {
          console.error('Erro ao processar mensagem WebSocket:', error);
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        console.log('WebSocket desconectado.', event.code, event.reason);
      };

      ws.onerror = (error) => {
        setIsConnected(false);
        console.error('Erro na conexão WebSocket:', error);
      };
    };

    // Exemplo: se seu backend já usa wss:// com query param do userId
    const secureUrl = `${wsUrl}?userId=${user.id}`;
    connectWebSocket(secureUrl);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [user]);

  // Exibe um toast estilizado conforme a prioridade
  const showToast = (message: NotificationMessage) => {
    const toastStyle = {
      duration: 5000,
      position: 'top-right' as const,
      style: {
        background: '#333',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
        maxWidth: '500px',
      },
    };
  
    // Ajuste de cor/estilo conforme a prioridade
    if (message.priority) {
      switch (message.priority) {
        case 1:
          toastStyle.style.background = '#dc2626';
          toastStyle.style.color = '#ffffff';
          break;
        case 2:
          toastStyle.style.background = '#f97316';
          toastStyle.style.color = '#ffffff';
          break;
        case 3:
          toastStyle.style.background = '#eab308';
          toastStyle.style.color = '#000000';
          break;
        case 4:
          toastStyle.style.background = '#3b82f6';
          toastStyle.style.color = '#ffffff';
          break;
      }
    }
  
    // Cria um componente de conteúdo para o toast que inclui um botão para fechar
    let toastId = '';
    const toastContent = (
      <div className="flex justify-between items-start">
        <div>
          {message.title && (
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {message.title}
            </div>
          )}
          <div>{message.message}</div>
        </div>
        <button
          onClick={() => toast.dismiss(toastId)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '8px',
          }}
        >
          <X size={16} />
        </button>
      </div>
    );
  
    // Armazena o toastId para que o botão de fechar possa usá-lo
    toastId = toast(toastContent, toastStyle);
  };

  // Função para marcar UMA mensagem específica como lida
  const markMessageAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  };

  // Função para marcar TODAS as mensagens como lidas
  const markAllAsRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  };

  return (
    <WebSocketContext.Provider
      value={{
        messages,
        isConnected,
        markMessageAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}
