import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MessageStatus = ({ status, style }) => {
  const getStatusIcon = () => {
    switch (status) {
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

  const icon = getStatusIcon();

  return (
    <View style={[styles.container, style]}>
      <Ionicons name={icon.name} size={12} color={icon.color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 4,
    justifyContent: 'center',
  },
});

export default MessageStatus;

