import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatAttachment = ({ attachment, onPress, style }) => {
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

  const renderAttachment = () => {
    if (attachment.type === 'image') {
      return (
        <TouchableOpacity style={[styles.imageContainer, style]} onPress={onPress}>
          <Image source={{ uri: attachment.url }} style={styles.image} />
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
            {attachment.name}
          </Text>
          <Text style={styles.fileSize}>{attachment.size}</Text>
        </View>
        <Ionicons name="download" size={20} color="#007AFF" />
      </TouchableOpacity>
    );
  };

  return renderAttachment();
};

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 4,
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    padding: 4,
  },
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
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
  },
});

export default ChatAttachment;

