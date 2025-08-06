import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isWeb, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';

const DoctorChat = ({ navigation, route }) => {
  const { patient, appointment } = route.params || {};
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hola doctor, tengo una consulta sobre mi tratamiento.',
      sender: 'patient',
      timestamp: '10:30 AM',
    },
    {
      id: 2,
      text: 'Hola, por supuesto. ¿En qué puedo ayudarte?',
      sender: 'doctor',
      timestamp: '10:32 AM',
    },
    {
      id: 3,
      text: 'He notado algunos efectos secundarios con la medicación.',
      sender: 'patient',
      timestamp: '10:33 AM',
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message.trim(),
        sender: 'doctor',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const renderMessage = (msg) => (
    <View
      key={msg.id}
      style={[
        styles.messageContainer,
        msg.sender === 'doctor' ? styles.doctorMessage : styles.patientMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          msg.sender === 'doctor' ? styles.doctorBubble : styles.patientBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            msg.sender === 'doctor' ? styles.doctorMessageText : styles.patientMessageText,
            { fontSize: getResponsiveFontSize(14, 15, 16) },
          ]}
        >
          {msg.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            { fontSize: getResponsiveFontSize(10, 11, 12) },
          ]}
        >
          {msg.timestamp}
        </Text>
      </View>
    </View>
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
            <View style={styles.headerInfo}>
              <Text style={[styles.patientName, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                {patient?.name || 'Paciente'}
              </Text>
              <Text style={[styles.appointmentInfo, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                Cita: {appointment?.date || 'Fecha no especificada'}
              </Text>
            </View>
            <View style={styles.headerRight} />
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Message Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <View style={[styles.inputWrapper, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            <TextInput
              style={[styles.messageInput, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
              placeholder="Escribe un mensaje..."
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Ionicons
                name="send"
                size={getResponsiveFontSize(20, 22, 24)}
                color={message.trim() ? '#007AFF' : '#CCC'}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  patientName: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  appointmentInfo: {
    color: '#666',
  },
  headerRight: {
    width: 40,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: getResponsiveSpacing(16, 20, 24),
  },
  messageContainer: {
    marginBottom: 12,
  },
  doctorMessage: {
    alignItems: 'flex-end',
  },
  patientMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  doctorBubble: {
    backgroundColor: '#007AFF',
  },
  patientBubble: {
    backgroundColor: '#E0E0E0',
  },
  messageText: {
    marginBottom: 4,
  },
  doctorMessageText: {
    color: '#FFFFFF',
  },
  patientMessageText: {
    color: '#1A1A1A',
  },
  messageTime: {
    color: '#999',
    textAlign: 'right',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: getResponsiveSpacing(12, 16, 20),
    gap: 12,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    padding: 12,
  },
});

export default DoctorChat; 