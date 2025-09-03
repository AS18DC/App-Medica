// --Imports de React Native--
// Importa las funcionalidades básicas de React y React Native
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UnreadBadge = ({ count, style }) => {
  // --Validación de conteo--
  // No muestra el badge si no hay mensajes sin leer
  if (count === 0) return null;

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>
        {count > 99 ? '99+' : count.toString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // --Badge de mensajes no leídos--
  // Badge circular rojo que muestra el número de mensajes sin leer
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  
  // --Texto del badge--
  // Estilo para el número de mensajes no leídos
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default UnreadBadge;

