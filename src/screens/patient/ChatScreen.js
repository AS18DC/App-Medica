import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '../../context/ChatContext';
import MessageStatus from '../../components/MessageStatus';
import TypingIndicator from '../../components/TypingIndicator';
import ChatAttachment from '../../components/ChatAttachment';
import { isWeb, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';

const ChatScreen = ({ navigation, route }) => {
  const { doctor, conversationId } = route.params;
  const { 
    conversations, 
    activeConversation, 
    sendMessage, 
    markAsRead, 
    setActiveConversation,
    isTyping 
  } = useChat();
  
  const [message, setMessage] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);
  const scrollViewRef = useRef(null);
  const inputRef = useRef(null);

  // Encontrar la conversación actual
  const currentConversation = conversations.find(conv => conv.id === conversationId) || activeConversation;

  useEffect(() => {
    if (currentConversation) {
      setActiveConversation(currentConversation);
      markAsRead(conversationId);
    }
  }, [conversationId, currentConversation]);

  useEffect(() => {
    // Scroll al final cuando lleguen nuevos mensajes
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentConversation?.messages]);

  const messages = currentConversation?.messages || [];

  const handleSendMessage = () => {
    if (message.trim() && conversationId) {
      sendMessage(conversationId, message.trim());
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const handleAttachment = () => {
    Alert.alert(
      'Adjuntar archivo',
      'Selecciona el tipo de archivo',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Imagen', onPress: () => console.log('Adjuntar imagen') },
        { text: 'Documento', onPress: () => console.log('Adjuntar documento') },
        { text: 'Cámara', onPress: () => console.log('Tomar foto') },
      ]
    );
  };

  const renderMessage = (msg) => (
    <View
      key={msg.id}
      style={[
        styles.messageContainer,
        msg.sender === 'patient' ? styles.patientMessage : styles.doctorMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          msg.sender === 'patient' ? styles.patientBubble : styles.doctorBubble,
        ]}
      >
        {msg.attachment && (
          <ChatAttachment 
            attachment={msg.attachment} 
            onPress={() => console.log('Abrir archivo:', msg.attachment)}
            style={styles.attachment}
          />
        )}
        {msg.text && (
          <Text
            style={[
              styles.messageText,
              msg.sender === 'patient' ? styles.patientText : styles.doctorText,
            ]}
          >
            {msg.text}
          </Text>
        )}
        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.timestamp,
              msg.sender === 'patient' ? styles.patientTimestamp : styles.doctorTimestamp,
            ]}
          >
            {msg.timestamp}
          </Text>
          {msg.sender === 'patient' && (
            <MessageStatus status={msg.status} />
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessage)}
          <TypingIndicator isTyping={isTyping} doctorName={doctor?.name} />
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.attachButton} onPress={handleAttachment}>
              <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              placeholder="Escribe un mensaje..."
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={message.trim() ? '#007AFF' : '#CCC'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
  },
  moreButton: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  patientMessage: {
    alignItems: 'flex-end',
  },
  doctorMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  patientBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  doctorBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  patientText: {
    color: '#FFFFFF',
  },
  doctorText: {
    color: '#1A1A1A',
  },
  timestamp: {
    fontSize: 12,
  },
  patientTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  doctorTimestamp: {
    color: '#999',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  attachButton: {
    padding: 8,
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  sendButton: {
    padding: 8,
    marginLeft: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  attachment: {
    marginBottom: 8,
  },
});

export default ChatScreen; 