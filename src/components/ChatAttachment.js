// --Imports de React Native--
// Importa las funcionalidades básicas de React y React Native
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

// --Imports de iconos--
// Importa iconos de Ionicons para la interfaz de usuario
import { Ionicons } from '@expo/vector-icons';

const ChatAttachment = ({ attachment, onPress, style }) => {
  // --Verificación de seguridad--
  // Valida que el archivo adjunto exista y tenga tipo
  if (!attachment || !attachment.type) {
    return null;
  }

  // --Obtener icono del archivo--
  // Retorna el icono apropiado según el tipo de archivo
  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return 'image';
      case 'pdf':
        return 'document-text';
      case 'doc':
        return 'document';
      case 'video':
        return 'videocam';
      case 'audio':
        return 'musical-notes';
      default:
        return 'document';
    }
  };

  // --Obtener color del archivo--
  // Retorna el color apropiado según el tipo de archivo
  const getFileColor = (type) => {
    switch (type) {
      case 'image':
        return '#4CAF50';
      case 'pdf':
        return '#F44336';
      case 'doc':
        return '#2196F3';
      case 'video':
        return '#9C27B0';
      case 'audio':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  // --Renderizar adjunto--
  // Renderiza el archivo adjunto según su tipo (imagen o archivo)
  const renderAttachment = () => {
    if (attachment.type === 'image') {
      return (
        <TouchableOpacity style={[styles.imageContainer, style]} onPress={onPress}>
          <Image source={{ uri: attachment.url || '' }} style={styles.image} />
          <View style={styles.imageOverlay}>
            <Ionicons name="expand" size={20} color="#FFF" />
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={[styles.fileContainer, style]} onPress={onPress}>
        <View style={[styles.fileIcon, { backgroundColor: getFileColor(attachment.type) }]}>
          <Ionicons name={getFileIcon(attachment.type)} size={24} color="#FFF" />
        </View>
        <View style={styles.fileInfo}>
          <Text style={styles.fileName} numberOfLines={1}>
            {attachment.name || 'Archivo'}
          </Text>
          <Text style={styles.fileSize}>{attachment.size || ''}</Text>
        </View>
        <Ionicons name="download" size={20} color="#007AFF" />
      </TouchableOpacity>
    );
  };

  return renderAttachment();
};

const styles = StyleSheet.create({
  // --Contenedor de imagen--
  // Contenedor para mostrar imágenes adjuntas con bordes redondeados
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 4,
  },
  
  // --Imagen adjunta--
  // Estilo para la imagen con dimensiones fijas y bordes redondeados
  image: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  
  // --Superposición de imagen--
  // Overlay con icono de expandir sobre la imagen
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    padding: 4,
  },
  
  // --Contenedor de archivo--
  // Contenedor para archivos no-imagen con diseño horizontal
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  
  // --Icono del archivo--
  // Icono representativo del tipo de archivo con color específico
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  // --Información del archivo--
  // Contenedor para el nombre y tamaño del archivo
  fileInfo: {
    flex: 1,
  },
  
  // --Nombre del archivo--
  // Estilo para el nombre del archivo adjunto
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  
  // --Tamaño del archivo--
  // Estilo para mostrar el tamaño del archivo
  fileSize: {
    fontSize: 12,
    color: '#666',
  },
});

export default ChatAttachment;

