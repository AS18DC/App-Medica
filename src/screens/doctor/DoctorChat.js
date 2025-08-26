import React, { useState, useRef, useEffect } from 'react';
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
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MessageStatus from '../../components/MessageStatus';
import AudioRecorder from '../../components/AudioRecorder';
// ...existing code...
import { isWeb, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';

const DoctorChat = ({ navigation, route }) => {
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const handleSendAudio = (audioUri) => {
    const newMessage = {
      id: messages.length + 1,
      audio: audioUri,
      sender: 'doctor',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    setMessages([...messages, newMessage]);
  };
  const [isAttaching, setIsAttaching] = useState(false);
  const scrollViewRef = useRef(null);

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

  useEffect(() => {
    if (Array.isArray(messages) && scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

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
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
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
        {msg.text && (
          <Text
            style={[
              styles.messageText,
              msg.sender === 'doctor' ? styles.doctorMessageText : styles.patientMessageText,
              { fontSize: getResponsiveFontSize(14, 15, 16) },
            ]}
          >
            {msg.text}
          </Text>
        )}
        {msg.audio && (
          <TouchableOpacity
            style={styles.audioMessage}
            onPress={() => {
              // Reproducir audio
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
              styles.messageTime,
              { fontSize: getResponsiveFontSize(10, 11, 12) },
            ]}
          >
            {msg.timestamp}
          </Text>
          {msg.sender === 'doctor' && (
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
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
                  {appointment?.specialty ? appointment.specialty : 'Cita: '}{appointment?.date ? ` - ${appointment.date}` : ''}
                </Text>
              </View>
              <View style={styles.headerRight} />
            </View>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(renderMessage)}
          </ScrollView>

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
                    onSend={(audioUri) => {
                      handleSendAudio(audioUri);
                      setShowAudioMenu(false);
                    }}
                    onCancel={() => setShowAudioMenu(false)}
                  />
                </View>
              </View>
            </Modal>
            {/* Input y controles solo si no está el menú de audio */}
            {!showAudioMenu && (
              <View style={[styles.inputWrapper, styles.inputWrapperFit, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}> 
                <View style={styles.inputBoxWithIcon}>
                  <TouchableOpacity style={styles.attachButtonInBox} onPress={handleAttachment}>
                    <Ionicons name="add-circle-outline" size={getResponsiveFontSize(24, 26, 28)} color="#007AFF" />
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.messageInput, styles.messageInputWithIcon, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
                    placeholder="Escribe un mensaje..."
                    placeholderTextColor="#999"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                  />
                </View>
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
                <TouchableOpacity style={styles.audioButton} onPress={() => setShowAudioMenu(true)}>
                  <Ionicons name="mic" size={22} color="#007AFF" />
                </TouchableOpacity>
              </View>
            )}
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
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  inputBoxWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 0,
    marginRight: 8,
  },
  attachButtonInBox: {
    padding: 4,
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageInputWithIcon: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 12,
    minHeight: 44,
    color: '#1A1A1A',
  },
  inputWrapperFit: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  audioMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 4,
  },
  audioText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 14,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
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
  attachButton: {
    padding: 8,
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    minHeight: 44,
    color: '#1A1A1A',
  },
  sendButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 6,
  },
  bottomBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBarText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  attachmentMenuRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: getResponsivePadding(20, 40, 60),
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
});

export default DoctorChat; 