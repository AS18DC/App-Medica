import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getResponsiveFontSize, getResponsivePadding, isWeb, webStyles } from '../../../utils/responsive';
import StylesDChat from './StylesDChat';

const VistasDChat = ({ 
  navigation,
  messages,
  onPreviousChat,
  onNextChat,
  onMessagePress,
  getMessageStyle,
  getMessageTextStyle
}) => {
  const styles = StylesDChat;
 
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
export default VistasDChat;