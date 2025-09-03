// --Imports de React Native--
// Importa las funcionalidades básicas de React y React Native
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

// --Imports de iconos--
// Importa iconos de Ionicons para la interfaz de usuario
import { Ionicons } from '@expo/vector-icons';

const TypingIndicator = ({ isTyping, doctorName }) => {
  // --Animación de puntos--
  // Controla la animación de los puntos de escritura
  const [dotAnimation] = useState(new Animated.Value(0));

  // --Efecto de animación--
  // Inicia la animación de los puntos cuando se está escribiendo
  useEffect(() => {
    if (isTyping) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(dotAnimation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
          }),
          Animated.timing(dotAnimation, {
            toValue: 0,
            duration: 600,
            useNativeDriver: false,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [isTyping, dotAnimation]);

  if (!isTyping) return null;

  // --Opacidad interpolada--
  // Calcula la opacidad para la animación de los puntos
  const opacity = dotAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.typingContent}>
          <Ionicons name="ellipse" size={8} color="#999" style={styles.dot} />
          <Animated.View style={[styles.dot, { opacity }]}>
            <Ionicons name="ellipse" size={8} color="#999" />
          </Animated.View>
          <Animated.View style={[styles.dot, { opacity }]}>
            <Ionicons name="ellipse" size={8} color="#999" />
          </Animated.View>
        </View>
        <Text style={styles.typingText}>{doctorName || 'Doctor'} está escribiendo...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // --Contenedor principal--
  // Contenedor principal del indicador de escritura
  container: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  
  // --Burbuja del indicador--
  // Burbuja de chat que contiene los puntos y texto
  bubble: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
    borderBottomLeftRadius: 4,
  },
  
  // --Contenido de escritura--
  // Contenedor para los puntos animados de escritura
  typingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  // --Punto del indicador--
  // Estilo para cada punto individual del indicador
  dot: {
    marginRight: 4,
  },
  
  // --Texto de escritura--
  // Texto que indica que alguien está escribiendo
  typingText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default TypingIndicator;

