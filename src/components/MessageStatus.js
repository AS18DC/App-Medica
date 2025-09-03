// --Imports de React Native--
// Importa las funcionalidades básicas de React y React Native
import React from 'react';
import { View, StyleSheet } from 'react-native';

// --Imports de iconos--
// Importa iconos de Ionicons para la interfaz de usuario
import { Ionicons } from '@expo/vector-icons';

const MessageStatus = ({ status, style }) => {
  // --Obtener icono de estado--
  // Retorna el icono y color apropiados según el estado del mensaje
  const getStatusIcon = () => {
    switch (status || 'sending') {
      case 'sending':
        return { name: 'time-outline', color: '#999' };
      case 'sent':
        return { name: 'checkmark', color: '#999' };
      case 'delivered':
        return { name: 'checkmark-done-outline', color: '#999' };
      case 'read':
        return { name: 'checkmark-done', color: '#007AFF' };
      default:
        return { name: 'time-outline', color: '#999' };
    }
  };

  // --Icono del estado--
  // Almacena la información del icono a mostrar
  const icon = getStatusIcon();

  return (
    <View style={[styles.container, style]}>
      <Ionicons name={icon.name} size={12} color={icon.color} />
    </View>
  );
};

const styles = StyleSheet.create({
  // --Contenedor del estado--
  // Contenedor para mostrar el icono de estado del mensaje
  container: {
    marginLeft: 4,
    justifyContent: 'center',
  },
});

export default MessageStatus;

