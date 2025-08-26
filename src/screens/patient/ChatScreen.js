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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '../../context/ChatContext';
import MessageStatus from '../../components/MessageStatus';
import TypingIndicator from '../../components/TypingIndicator';
import ChatAttachment from '../../components/ChatAttachment';
import { isWeb, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';
import AudioRecorder from '../../components/AudioRecorder';

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
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  // Enviar audio grabado
  const handleSendAudio = (audioUri) => {
    if (conversationId && audioUri) {
      sendMessage(conversationId, '', audioUri); // Se envía el audio, texto vacío
      setShowAudioMenu(false);
    }
  };
  const scrollViewRef = useRef(null);
  const inputRef = useRef(null);

  // Encontrar la conversación actual con verificación de seguridad
  const currentConversation = conversations ? conversations.find(conv => conv.id === conversationId) || activeConversation : activeConversation;

  useEffect(() => {
    if (currentConversation && conversationId) {
      setActiveConversation(currentConversation);
      markAsRead(conversationId);
    }
  }, [conversationId]);

  const messages = currentConversation?.messages || [];

  useEffect(() => {
    // Scroll al final cuando lleguen nuevos mensajes
    if (scrollViewRef.current && messages && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSendMessage = () => {
    if (message.trim() && conversationId) {
      sendMessage(conversationId, message.trim());
      setMessage('');
      inputRef.current?.focus();
    }
  };

  // Handlers for each attachment type
  const handleAttachImage = () => {
    setIsAttaching(false);
    console.log('Adjuntar imagen');
  };
  const handleAttachDocument = () => {
    setIsAttaching(false);
    console.log('Adjuntar documento');
  };
  const handleAttachCamera = () => {
    setIsAttaching(false);
    console.log('Tomar foto');
  };

  // Toggle attachment menu
  const handleAttachment = () => {
    setIsAttaching((prev) => !prev);
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
        {msg.audio && (
          <TouchableOpacity
            style={styles.audioMessage}
            onPress={() => {
              import('expo-av').then(({ Audio }) => {
                Audio.Sound.createAsync({ uri: msg.audio }).then(({ sound }) => {
                  sound.playAsync();
                });
              });
            }}
          >
            <Ionicons name="play" size={24} color="#007AFF" />
            <Text style={styles.audioText}>Audio</Text>
          </TouchableOpacity>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
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
            <Text style={styles.doctorName}>{doctor?.name || 'Doctor'}</Text>
            <Text style={styles.doctorSpecialty}>{doctor?.specialty || 'Especialidad'}</Text>
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
          {/* Modal de audio tipo pestaña temporal */}
          <Modal
            visible={showAudioMenu}
            animationType="slide"
            transparent
            onRequestClose={() => setShowAudioMenu(false)}
          >
            <View style={styles.audioModalOverlay}>
              <View style={styles.audioModalSheet}>
                <AudioRecorder 
                  onSend={handleSendAudio}
                  onCancel={() => setShowAudioMenu(false)}
                />
              </View>
            </View>
          </Modal>
          {/* Menú de attachments si está activo */}
          {isAttaching && (
            <View style={styles.attachmentMenuRow}>
              <TouchableOpacity style={styles.attachmentMenuItem} onPress={handleAttachImage}>
                <Ionicons name="image-outline" size={28} color="#007AFF" />
                <Text style={styles.attachmentMenuText}>Imagen</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentMenuItem} onPress={handleAttachDocument}>
                <Ionicons name="document-outline" size={28} color="#007AFF" />
                <Text style={styles.attachmentMenuText}>Documento</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentMenuItem} onPress={handleAttachCamera}>
                <Ionicons name="camera-outline" size={28} color="#007AFF" />
                <Text style={styles.attachmentMenuText}>Cámara</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Input y controles solo si no está el menú de audio */}
          {!showAudioMenu && (
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
              <TouchableOpacity style={styles.audioButton} onPress={() => setShowAudioMenu(true)}>
                <Ionicons name="mic" size={22} color="#007AFF" />
              </TouchableOpacity>
            </View>
          )}
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
  attachmentMenuRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 0,
    marginBottom: 4,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 20,
  },
  attachmentMenuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  attachmentMenuText: {
    fontSize: 13,
    color: '#007AFF',
    marginTop: 2,
  },
  audioModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  audioModalSheet: {
    marginTop: 40,
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  audioButton: {
    padding: 8,
    marginLeft: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 4,
  },
  audioText: {
    color: '#007AFF',
    fontSize: 15,
    marginLeft: 8,
  },
});

export default ChatScreen;