import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ChatContext = createContext();

const initialState = {
  conversations: [],
  activeConversation: null,
  unreadCount: 0,
  isTyping: false,
  onlineDoctors: [],
  notifications: [],
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return {
        ...state,
        conversations: action.payload,
      };
    case 'ADD_CONVERSATION':
      return {
        ...state,
        conversations: [action.payload, ...state.conversations],
      };
    case 'UPDATE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload.id ? { ...conv, ...action.payload } : conv
        ),
      };
    case 'SET_ACTIVE_CONVERSATION':
      return {
        ...state,
        activeConversation: action.payload,
      };
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
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload,
      };
    case 'SET_ONLINE_DOCTORS':
      return {
        ...state,
        onlineDoctors: action.payload,
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload),
      };
    case 'MARK_CONVERSATION_READ':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload ? { ...conv, unreadCount: 0 } : conv
        ),
      };
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

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Simular datos iniciales
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

  const value = {
    ...state,
    dispatch,
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
    markAsRead: (conversationId) => {
      dispatch({ type: 'MARK_CONVERSATION_READ', payload: conversationId });
    },
    setActiveConversation: (conversation) => {
      dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conversation });
    },
    startTyping: () => dispatch({ type: 'SET_TYPING', payload: true }),
    stopTyping: () => dispatch({ type: 'SET_TYPING', payload: false }),
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

