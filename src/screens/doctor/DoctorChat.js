// --Imports de React--
// Importa las funcionalidades básicas de React y hooks de estado, referencias y efectos
import React, { useState, useRef, useEffect } from 'react';

// --Imports de React Native--
// Importa componentes básicos de React Native para la interfaz
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

// --Imports de iconos--
// Importa iconos de Ionicons para la interfaz de usuario
import { Ionicons } from '@expo/vector-icons';

// --Imports de componentes--
// Importa componentes personalizados para el chat
import MessageStatus from '../../components/MessageStatus';

// --Imports de Expo--
// Importa funcionalidades de Expo para manejo de archivos y multimedia
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-audio';
import { Video } from 'expo-video';

// --Imports de utilidades responsivas--
// Importa funciones para hacer la interfaz responsiva en diferentes dispositivos
import { isWeb, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';

const DoctorChat = ({ navigation, route }) => {
  // --Estado de adjuntos--
  // Controla si el menú de adjuntos está visible
  const [isAttaching, setIsAttaching] = useState(false);
  
  // --Referencia del scroll--
  // Referencia para controlar el desplazamiento automático del chat
  const scrollViewRef = useRef(null);
  
  // --Estado de grabación--
  // Controla el objeto de grabación de audio actual
  const [recording, setRecording] = useState(null);
  
  // --Estado de reproducción--
  // Controla el sonido que se está reproduciendo actualmente
  const [playingSound, setPlayingSound] = useState(null);
  
  // --Estado de ID de reproducción--
  // Almacena el ID del mensaje de audio que se está reproduciendo
  const [playingId, setPlayingId] = useState(null);

  // --Función de adjuntar imagen--
  // Maneja la selección de imágenes desde la galería
  const handleAttachImage = async () => {
    setIsAttaching(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Agregar imagen como mensaje (stub)
      setMessages([...messages, { id: messages.length + 1, image: result.assets[0].uri, sender: 'doctor', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
  };
  
  // --Función de adjuntar documento--
  // Maneja la selección de documentos para enviar
  const handleAttachDocument = async () => {
    setIsAttaching(false);
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.type === 'success' && result.uri) {
      setMessages([...messages, { id: messages.length + 1, document: { uri: result.uri, name: result.name || 'Documento' }, sender: 'doctor', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
  };
  
  // --Función de adjuntar cámara--
  // Maneja la captura de fotos con la cámara
  const handleAttachCamera = async () => {
    setIsAttaching(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setMessages([...messages, { id: messages.length + 1, image: result.assets[0].uri, sender: 'doctor', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
  };
  
  // --Función de inicio de grabación de audio--
  // Inicia la grabación de audio cuando se presiona el botón
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
  
  // --Función de parada de grabación de audio--
  // Detiene la grabación de audio y envía el mensaje
  const handleAudioRecordStop = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setMessages([...messages, { id: messages.length + 1, audio: uri, sender: 'doctor', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
  };

  // --Función de reproducción de audio--
  // Maneja la reproducción y pausa de mensajes de audio
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

  // --Función de alternar menú de adjuntos--
  // Muestra u oculta el menú de opciones de adjuntos
  const handleAttachment = () => {
    setIsAttaching((prev) => !prev);
  };
  
  // --Función de envío de audio--
  // Maneja el envío de mensajes de audio
  const handleSendAudio = () => {
    console.log('Send audio message');
  };
  
  // --Parámetros de ruta--
  // Obtiene los parámetros pasados desde la navegación
  const { patient, appointment } = route.params || {};
  
  // --Estado del mensaje--
  // Almacena el texto del mensaje que se está escribiendo
  const [message, setMessage] = useState('');
  
  // --Estado de mensajes--
  // Lista de mensajes en la conversación del chat
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

  // --Efecto de desplazamiento automático--
  // Desplaza automáticamente al final del chat cuando llegan nuevos mensajes
  useEffect(() => {
    if (Array.isArray(messages) && scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // --Función de envío de mensaje--
  // Envía un nuevo mensaje de texto al chat
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

  // --Función de renderizado de mensaje--
  // Renderiza cada mensaje individual del chat con su contenido y estilo
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
        {/* Imagen */}
        {msg.image && (
          <Image source={{ uri: msg.image }} style={{ width: 180, height: 180, borderRadius: 12, marginBottom: 8 }} resizeMode="cover" />
        )}
        {/* Documento */}
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
        {/* Texto */}
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

// --Estilos del componente--
// Define todos los estilos visuales del chat del doctor
const styles = StyleSheet.create({
  // --Contenedor principal--
  // Estilo del contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // --Vista de evitación de teclado--
  // Estilo para evitar que el teclado cubra el contenido
  keyboardAvoidingView: {
    flex: 1,
  },
  
  // --Encabezado--
  // Estilo del encabezado del chat
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  
  // --Botón de regreso--
  // Estilo del botón para regresar a la pantalla anterior
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  
  // --Información del encabezado--
  // Estilo del contenedor de información del paciente
  headerInfo: {
    flex: 1,
  },
  
  // --Nombre del paciente--
  // Estilo del nombre del paciente en el encabezado
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  
  // --Información de la cita--
  // Estilo de la información de la cita en el encabezado
  appointmentInfo: {
    fontSize: 14,
    color: '#666',
  },
  
  // --Botón de más opciones--
  // Estilo del botón de opciones adicionales
  moreButton: {
    padding: 4,
  },
  
  // --Contenedor de mensajes--
  // Estilo del contenedor principal de mensajes
  messagesContainer: {
    flex: 1,
  },
  
  // --Contenido de mensajes--
  // Estilo del contenido dentro del contenedor de mensajes
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  
  // --Contenedor de mensaje--
  // Estilo del contenedor de cada mensaje individual
  messageContainer: {
    marginBottom: 16,
  },
  
  // --Mensaje del doctor--
  // Estilo específico para mensajes enviados por el doctor
  doctorMessage: {
    alignItems: 'flex-end',
  },
  
  // --Mensaje del paciente--
  // Estilo específico para mensajes enviados por el paciente
  patientMessage: {
    alignItems: 'flex-start',
  },
  
  // --Burbuja de mensaje--
  // Estilo de la burbuja que contiene el contenido del mensaje
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  
  // --Burbuja del doctor--
  // Estilo específico para las burbujas de mensajes del doctor
  doctorBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  
  // --Burbuja del paciente--
  // Estilo específico para las burbujas de mensajes del paciente
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
  
  // --Texto del mensaje--
  // Estilo del texto principal del mensaje
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  
  // --Texto del mensaje del doctor--
  // Estilo específico para el texto de mensajes del doctor
  doctorMessageText: {
    color: '#FFFFFF',
  },
  
  // --Texto del mensaje del paciente--
  // Estilo específico para el texto de mensajes del paciente
  patientMessageText: {
    color: '#1A1A1A',
  },
  
  // --Hora del mensaje--
  // Estilo de la hora que se muestra en cada mensaje
  messageTime: {
    fontSize: 12,
  },
  
  // --Marca de tiempo del doctor--
  // Estilo específico para la hora de mensajes del doctor
  doctorTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  
  // --Marca de tiempo del paciente--
  // Estilo específico para la hora de mensajes del paciente
  patientTimestamp: {
    color: '#999',
  },
  
  // --Contenedor de entrada--
  // Estilo del contenedor de entrada de mensajes
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  
  // --Contenedor del campo de entrada--
  // Estilo del contenedor que envuelve el campo de texto y botones
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  
  // --Botón de adjuntar--
  // Estilo del botón para adjuntar archivos
  attachButton: {
    padding: 8,
    marginRight: 4,
  },
  
  // --Campo de texto--
  // Estilo del campo de texto para escribir mensajes
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  
  // --Botón de enviar--
  // Estilo del botón para enviar mensajes
  sendButton: {
    padding: 8,
    marginLeft: 4,
  },
  
  // --Botón de enviar deshabilitado--
  // Estilo del botón de enviar cuando está deshabilitado
  sendButtonDisabled: {
    opacity: 0.5,
  },
  
  // --Fila del menú de adjuntos--
  // Estilo del menú que muestra las opciones de adjuntos
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
  
  // --Elemento del menú de adjuntos--
  // Estilo de cada elemento individual del menú de adjuntos
  attachmentMenuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  
  // --Texto del menú de adjuntos--
  // Estilo del texto descriptivo en cada opción del menú de adjuntos
  attachmentMenuText: {
    fontSize: 13,
    color: '#007AFF',
    marginTop: 2,
  },
  
  // --Botón de audio--
  // Estilo del botón para grabar audio
  audioButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  
  // --Contenedor de iconos--
  // Estilo del contenedor que envuelve los iconos de acción
  iconWrapper: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DoctorChat;