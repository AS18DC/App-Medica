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
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MessageStatus from '../../components/MessageStatus';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-audio';
import { Video } from 'expo-video';
import { isWeb, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';

const DoctorChat = ({ navigation, route }) => {
  const [isAttaching, setIsAttaching] = useState(false);
  const scrollViewRef = useRef(null);
  // Add state for recording
  const [recording, setRecording] = useState(null);
  const [playingSound, setPlayingSound] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  // Handlers for each attachment type
  // Image picker
  const handleAttachImage = async () => {
    setIsAttaching(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Add image as a message (stub)
      setMessages([...messages, { id: messages.length + 1, image: result.assets[0].uri, sender: 'doctor', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
  };
  // Document picker (send filename and uri)
  const handleAttachDocument = async () => {
    setIsAttaching(false);
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.type === 'success' && result.uri) {
      setMessages([...messages, { id: messages.length + 1, document: { uri: result.uri, name: result.name || 'Documento' }, sender: 'doctor', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
  };
  // Camera
  const handleAttachCamera = async () => {
    setIsAttaching(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setMessages([...messages, { id: messages.length + 1, image: result.assets[0].uri, sender: 'doctor', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
  };
  // Audio recording logic (press and hold)
  const handleAudioRecordStart = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se requiere acceso al micrófono.');
      return;
    }
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await rec.startAsync();
    setRecording(rec);
  };
  const handleAudioRecordStop = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setMessages([...messages, { id: messages.length + 1, audio: uri, sender: 'doctor', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
  };

  // Audio playback logic
  const handlePlayAudio = async (uri, id) => {
    if (playingSound) {
      await playingSound.stopAsync();
      await playingSound.unloadAsync();
      setPlayingSound(null);
      setPlayingId(null);
      if (playingId === id) return; // toggle pause
    }
    const { sound } = await Audio.Sound.createAsync({ uri });
    setPlayingSound(sound);
    setPlayingId(id);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setPlayingSound(null);
        setPlayingId(null);
      }
    });
  };

  // Toggle attachment menu
  const handleAttachment = () => {
    setIsAttaching((prev) => !prev);
  };
  const handleSendAudio = () => {
    console.log('Send audio message');
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
        {/* Image */}
        {msg.image && (
          <Image source={{ uri: msg.image }} style={{ width: 180, height: 180, borderRadius: 12, marginBottom: 8 }} resizeMode="cover" />
        )}
        {/* Document */}
        {msg.document && (
          <TouchableOpacity onPress={() => Linking.openURL(msg.document.uri)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="document-outline" size={24} color="#007AFF" />
            <Text style={{ color: '#007AFF', marginLeft: 6, textDecorationLine: 'underline' }}>{msg.document.name || 'Documento'}</Text>
          </TouchableOpacity>
        )}
        {/* Audio */}
        {msg.audio && (
          <TouchableOpacity onPress={() => handlePlayAudio(msg.audio, msg.id)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name={playingId === msg.id ? 'pause' : 'play'} size={24} color="#007AFF" />
            <Text style={{ color: '#007AFF', marginLeft: 6 }}>{playingId === msg.id ? 'Pausar audio' : 'Reproducir audio'}</Text>
          </TouchableOpacity>
        )}
        {/* Text */}
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
      >
        {/* Header igual al paciente */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.patientName}>{patient?.name || 'Paciente'}</Text>
            <Text style={styles.appointmentInfo}>{appointment?.specialty || 'Especialidad'}</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#666" />
          </TouchableOpacity>
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

        {/* Message Input igual al paciente */}
        <View style={styles.inputContainer}>
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
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.attachButton} onPress={handleAttachment}>
              <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Escribe un mensaje..."
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
              onSubmitEditing={handleSendMessage}
            />
            <View style={styles.iconWrapper}>
              {message.trim() ? (
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendMessage}
                >
                  <Ionicons name="send" size={22} color="#007AFF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.sendButton}
                  onPressIn={handleAudioRecordStart}
                  onPressOut={handleAudioRecordStop}
                >
                  <Ionicons name="mic" size={22} color="#007AFF" />
                </TouchableOpacity>
              )}
            </View>
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
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  appointmentInfo: {
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
    borderRadius: 20,
  },
  doctorBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  patientBubble: {
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
  doctorMessageText: {
    color: '#FFFFFF',
  },
  patientMessageText: {
    color: '#1A1A1A',
  },
  messageTime: {
    fontSize: 12,
  },
  doctorTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  patientTimestamp: {
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
  audioButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  iconWrapper: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DoctorChat;