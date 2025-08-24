import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TypingIndicator = ({ isTyping, doctorName }) => {
  const [dotAnimation] = useState(new Animated.Value(0));

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
  container: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  bubble: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
    borderBottomLeftRadius: 4,
  },
  typingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    marginRight: 4,
  },
  typingText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default TypingIndicator;

