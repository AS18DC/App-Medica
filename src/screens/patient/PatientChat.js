import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isWeb, isMobileScreen, isTabletScreen, isDesktopScreen, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding, webClasses } from '../../utils/responsive';

const PatientChat = ({ navigation }) => {
  // Mock data for chat conversations
  const [chatConversations] = useState([
    {
      id: 1,
      doctor: {
        id: 1,
        name: 'Dr. Sofia Ramirez',
        specialty: 'Cardiología',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      },
      lastMessage: 'Perfecto, nos vemos mañana a las 10:00 AM',
      timestamp: '10:30 AM',
      unreadCount: 2,
      appointmentDate: '2024-07-15',
      appointmentTime: '10:00 AM',
    },
    {
      id: 2,
      doctor: {
        id: 2,
        name: 'Dr. Carlos Mendoza',
        specialty: 'Dermatología',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      },
      lastMessage: '¿Cómo te sientes después del tratamiento?',
      timestamp: 'Ayer',
      unreadCount: 0,
      appointmentDate: '2024-07-10',
      appointmentTime: '2:30 PM',
    },
    {
      id: 3,
      doctor: {
        id: 3,
        name: 'Dr. Ana Torres',
        specialty: 'Pediatría',
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      },
      lastMessage: 'Recuerda tomar la medicación antes de dormir',
      timestamp: 'Lun',
      unreadCount: 1,
      appointmentDate: '2024-07-08',
      appointmentTime: '9:00 AM',
    },
  ]);

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
          <Image source={{ uri: conversation.doctor.image }} style={styles.doctorImage} />
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
              {conversation.doctor.name}
            </Text>
            <Text style={[styles.timestamp, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
              {conversation.timestamp}
            </Text>
          </View>
          <Text style={[styles.doctorSpecialty, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
            {conversation.doctor.specialty}
          </Text>
          <Text style={[styles.lastMessage, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
            {conversation.lastMessage}
          </Text>
          <View style={styles.appointmentInfo}>
            <Ionicons name="calendar" size={getResponsiveFontSize(12, 13, 14)} color="#007AFF" />
            <Text style={[styles.appointmentText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
              Cita: {conversation.appointmentDate} a las {conversation.appointmentTime}
            </Text>
          </View>
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
            <View style={styles.headerRight} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
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
  headerRight: {
    width: 40,
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