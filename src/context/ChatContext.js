// --Imports de React--
// Importa las funcionalidades básicas de React para crear contexto y manejar estado
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// --Contexto de chat--
// Contexto principal para manejar el estado del chat en toda la aplicación
const ChatContext = createContext();

// --Estado inicial--
// Estado inicial del contexto con conversaciones, conversación activa y contadores
const initialState = {
  conversations: [],
  activeConversation: null,
  unreadCount: 0,
  isTyping: false,
  onlineDoctors: [],
  notifications: [],
};

// --Reducer del chat--
// Maneja todas las acciones del chat (agregar mensajes, actualizar estado, etc.)
const chatReducer = (state, action) => {
  switch (action.type) {
    // --Establecer conversaciones--
    // Reemplaza la lista completa de conversaciones
    case 'SET_CONVERSATIONS':
      return {
        ...state,
        conversations: action.payload,
      };
    // --Agregar conversación--
    // Añade una nueva conversación al inicio de la lista
    case 'ADD_CONVERSATION':
      return {
        ...state,
        conversations: [action.payload, ...state.conversations],
      };
    // --Actualizar conversación--
    // Actualiza una conversación existente con nuevos datos
    case 'UPDATE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload.id ? { ...conv, ...action.payload } : conv
        ),
      };
    // --Establecer conversación activa--
    // Define cuál es la conversación actualmente activa
    case 'SET_ACTIVE_CONVERSATION':
      return {
        ...state,
        activeConversation: action.payload,
      };
    // --Agregar mensaje--
    // Añade un nuevo mensaje a una conversación específica
    case 'ADD_MESSAGE':
      const { conversationId, message } = action.payload;
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                lastMessage: message.text,
                timestamp: message.timestamp,
                unreadCount: conv.unreadCount + (message.sender === 'doctor' ? 1 : 0),
                messages: [...(conv.messages || []), message],
              }
            : conv
        ),
        activeConversation: state.activeConversation?.id === conversationId
          ? {
              ...state.activeConversation,
              messages: [...(state.activeConversation.messages || []), message],
            }
          : state.activeConversation,
      };
    // --Establecer estado de escritura--
    // Indica si alguien está escribiendo en el chat
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload,
      };
    // --Establecer doctores en línea--
    // Actualiza la lista de doctores disponibles para chatear
    case 'SET_ONLINE_DOCTORS':
      return {
        ...state,
        onlineDoctors: action.payload,
      };
    // --Agregar notificación--
    // Añade una nueva notificación al sistema
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    // --Limpiar notificación--
    // Elimina una notificación específica del sistema
    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload),
      };
    // --Marcar conversación como leída--
    // Resetea el contador de mensajes no leídos de una conversación
    case 'MARK_CONVERSATION_READ':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload ? { ...conv, unreadCount: 0 } : conv
        ),
      };
    // --Actualizar estado del mensaje--
    // Cambia el estado de un mensaje (enviando, enviado, entregado, leído)
    case 'UPDATE_MESSAGE_STATUS':
      const { conversationId: updateConvId, messageId, status } = action.payload;
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === updateConvId
            ? {
                ...conv,
                messages: (conv.messages || []).map(msg =>
                  msg.id === messageId ? { ...msg, status } : msg
                ),
              }
            : conv
        ),
        activeConversation: state.activeConversation?.id === updateConvId
          ? {
              ...state.activeConversation,
              messages: (state.activeConversation.messages || []).map(msg =>
                msg.id === messageId ? { ...msg, status } : msg
              ),
            }
          : state.activeConversation,
      };
    default:
      return state;
  }
};

// --Proveedor del contexto--
// Componente que envuelve la aplicación y proporciona el contexto del chat
export const ChatProvider = ({ children }) => {
  // --Estado y dispatch--
  // Hook useReducer para manejar el estado del chat
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // --Efecto de datos iniciales--
  // Simula conversaciones de ejemplo al cargar la aplicación
  useEffect(() => {
    const mockConversations = [
      {
        id: 1,
        doctor: {
          id: 1,
          name: 'Dr. Sofia Ramirez',
          specialty: 'Cardiología',
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
          isOnline: true,
        },
        lastMessage: 'Perfecto, nos vemos mañana a las 10:00 AM',
        timestamp: '10:30 AM',
        unreadCount: 2,
        appointmentDate: '2024-07-15',
        appointmentTime: '10:00 AM',
        messages: [
          {
            id: 1,
            text: 'Hola Maria, ¿cómo te sientes hoy?',
            sender: 'doctor',
            timestamp: '10:30 AM',
            status: 'read',
          },
          {
            id: 2,
            text: 'Hola doctora, me siento mejor. ¿Puedo hacer ejercicio?',
            sender: 'patient',
            timestamp: '10:32 AM',
            status: 'read',
          },
          {
            id: 3,
            text: 'Sí, puedes hacer ejercicio ligero. Evita actividades intensas por ahora.',
            sender: 'doctor',
            timestamp: '10:35 AM',
            status: 'read',
          },
        ],
      },
      {
        id: 2,
        doctor: {
          id: 2,
          name: 'Dr. Carlos Mendoza',
          specialty: 'Dermatología',
          image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
          isOnline: false,
        },
        lastMessage: '¿Cómo te sientes después del tratamiento?',
        timestamp: 'Ayer',
        unreadCount: 0,
        appointmentDate: '2024-07-10',
        appointmentTime: '2:30 PM',
        messages: [
          {
            id: 1,
            text: '¿Cómo te sientes después del tratamiento?',
            sender: 'doctor',
            timestamp: 'Ayer',
            status: 'read',
          },
        ],
      },
      {
        id: 3,
        doctor: {
          id: 3,
          name: 'Dr. Ana Torres',
          specialty: 'Pediatría',
          image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
          isOnline: true,
        },
        lastMessage: 'Recuerda tomar la medicación antes de dormir',
        timestamp: 'Lun',
        unreadCount: 1,
        appointmentDate: '2024-07-08',
        appointmentTime: '9:00 AM',
        messages: [
          {
            id: 1,
            text: 'Recuerda tomar la medicación antes de dormir',
            sender: 'doctor',
            timestamp: 'Lun',
            status: 'delivered',
          },
        ],
      },
    ];

    dispatch({ type: 'SET_CONVERSATIONS', payload: mockConversations });
  }, []);

  // --Valor del contexto--
  // Objeto que contiene el estado y las funciones del chat
  const value = {
    ...state,
    dispatch,
    
    // --Enviar mensaje--
    // Función para enviar un nuevo mensaje de texto o audio
    sendMessage: (conversationId, text, audioUri) => {
      const message = {
        id: Date.now(),
        text,
        sender: 'patient',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sending',
        ...(audioUri ? { audio: audioUri } : {}),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: { conversationId, message } });
      // Simular envío exitoso
      setTimeout(() => {
        dispatch({
          type: 'UPDATE_MESSAGE_STATUS',
          payload: {
            conversationId,
            messageId: message.id,
            status: 'sent',
          },
        });
      }, 1000);
    },
    
    // --Marcar como leído--
    // Función para marcar una conversación como leída
    markAsRead: (conversationId) => {
      dispatch({ type: 'MARK_CONVERSATION_READ', payload: conversationId });
    },
    
    // --Establecer conversación activa--
    // Función para cambiar la conversación activa
    setActiveConversation: (conversation) => {
      dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conversation });
    },
    
    // --Iniciar escritura--
    // Función para indicar que se está escribiendo
    startTyping: () => dispatch({ type: 'SET_TYPING', payload: true }),
    
    // --Detener escritura--
    // Función para indicar que se dejó de escribir
    stopTyping: () => dispatch({ type: 'SET_TYPING', payload: false }),
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// --Hook personalizado--
// Hook para usar el contexto del chat en otros componentes
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

