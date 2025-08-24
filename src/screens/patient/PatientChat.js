import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '../../context/ChatContext';
import NewChatModal from '../../components/NewChatModal';
import { isWeb, isMobileScreen, isTabletScreen, isDesktopScreen, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding, webClasses } from '../../utils/responsive';

const PatientChat = ({ navigation }) => {
  const { conversations, markAsRead, dispatch } = useChat();
  const [refreshing, setRefreshing] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simular actualización de datos
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Usar las conversaciones del contexto con verificación de seguridad
  const chatConversations = conversations || [];

  const handleNewChat = (doctor) => {
    // Crear nueva conversación
    const newConversation = {
      id: Date.now(),
      doctor: {
        ...doctor,
        isOnline: doctor.isOnline || false,
      },
      lastMessage: '',
      timestamp: 'Ahora',
      unreadCount: 0,
      messages: [],
    };

    dispatch({ type: 'ADD_CONVERSATION', payload: newConversation });
    setShowNewChatModal(false);
    
    // Navegar al chat
    navigation.navigate('ChatScreen', {
      doctor: newConversation.doctor,
      conversationId: newConversation.id,
    });
  };

  const handleChatPress = (conversation) => {
    navigation.navigate('ChatScreen', {
      doctor: conversation.doctor,
      conversationId: conversation.id,
    });
  };

    const renderChatItem = (conversation) => (
    <TouchableOpacity
      key={conversation.id}
      style={[
        styles.chatItem,
        isWeb && styles.webChatItem,
        isWeb && webStyles.card,
        isWeb && webStyles.button,
      ]}
      onPress={() => handleChatPress(conversation)}
    >
      <View style={styles.chatHeader}>
        <View style={styles.doctorImageContainer}>
          <Image 
            source={{ uri: conversation.doctor?.image || 'https://via.placeholder.com/150' }} 
            style={styles.doctorImage} 
          />
          {conversation.doctor?.isOnline && (
            <View style={styles.onlineIndicator} />
          )}
          {conversation.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={[styles.unreadCount, { fontSize: getResponsiveFontSize(10, 11, 12) }]}>
                {conversation.unreadCount}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.chatInfo}>
          <View style={styles.chatHeaderTop}>
            <Text style={[styles.doctorName, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
              {conversation.doctor?.name || 'Doctor'}
            </Text>
            <Text style={[styles.timestamp, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
              {conversation.timestamp || 'Ahora'}
            </Text>
          </View>
          <Text style={[styles.doctorSpecialty, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
            {conversation.doctor?.specialty || 'Especialidad'}
          </Text>
          <Text style={[styles.lastMessage, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
            {conversation.lastMessage || 'Sin mensajes'}
          </Text>
          {conversation.appointmentDate && conversation.appointmentTime && (
            <View style={styles.appointmentInfo}>
              <Ionicons name="calendar" size={getResponsiveFontSize(12, 13, 14)} color="#007AFF" />
              <Text style={[styles.appointmentText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                Cita: {conversation.appointmentDate} a las {conversation.appointmentTime}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, isWeb && webStyles.container]}>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={getResponsiveFontSize(24, 26, 28)} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={[styles.title, { fontSize: getResponsiveFontSize(28, 30, 32) }]}>
              Chats
            </Text>
            <TouchableOpacity
              style={styles.newChatButton}
              onPress={() => setShowNewChatModal(true)}
            >
              <Ionicons name="add" size={getResponsiveFontSize(24, 26, 28)} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isWeb ? (
            <View style={styles.webGrid}>
              {chatConversations.map(renderChatItem)}
            </View>
          ) : (
            <View style={styles.mobileList}>
              {chatConversations.map(renderChatItem)}
            </View>
          )}

          {chatConversations.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons
                name="chatbubbles-outline"
                size={getResponsiveFontSize(64, 72, 80)}
                color="#CCC"
              />
              <Text style={[styles.emptyTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                No tienes chats activos
              </Text>
              <Text style={[styles.emptySubtitle, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                Inicia una consulta con un doctor para comenzar a chatear
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* New Chat Modal */}
      <NewChatModal
        visible={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onSelectDoctor={handleNewChat}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingTop: getResponsiveSpacing(20, 30, 40),
    paddingBottom: getResponsiveSpacing(16, 20, 24),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
  },
  newChatButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: getResponsiveSpacing(20, 30, 40),
  },
  webGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getResponsiveSpacing(16, 24, 32),
    paddingHorizontal: getResponsivePadding(20, 40, 60),
    justifyContent: 'center',
  },
  mobileList: {
    paddingHorizontal: getResponsivePadding(20, 40, 60),
  },
  chatItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  webChatItem: {
    flex: '0 1 400px',
    maxWidth: 450,
    minWidth: 350,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  doctorImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  doctorImage: {
    width: getResponsiveSpacing(60, 70, 80),
    height: getResponsiveSpacing(60, 70, 80),
    borderRadius: getResponsiveSpacing(30, 35, 40),
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unreadCount: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  doctorName: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  timestamp: {
    color: '#999',
  },
  doctorSpecialty: {
    color: '#666',
    marginBottom: 8,
  },
  lastMessage: {
    color: '#1A1A1A',
    marginBottom: 8,
    lineHeight: 20,
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentText: {
    color: '#007AFF',
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsiveSpacing(60, 80, 100),
    paddingHorizontal: getResponsivePadding(20, 40, 60),
  },
  emptyTitle: {
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default PatientChat; 