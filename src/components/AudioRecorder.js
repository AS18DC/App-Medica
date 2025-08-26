import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const AudioRecorder = ({ onSend, onCancel }) => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationMillis, setDurationMillis] = useState(0);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      setIsPaused(false);
      setDurationMillis(0);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsPaused(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    // Enviar el audio directamente y cerrar el menú
    if (onSend) {
      onSend(uri);
    }
  };

  const playAudio = async () => {
    if (!audioUri) return;
    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    setSound(sound);
    setIsPlaying(true);
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setIsPlaying(false);
        sound.unloadAsync();
      }
    });
    await sound.playAsync();
  };

  const pauseRecording = async () => {
    if (recording) {
      await recording.pauseAsync();
      setIsPaused(true);
    }
  };

  const resumeRecording = async () => {
    if (recording) {
      await recording.startAsync();
      setIsPaused(false);
    }
  };

  const deleteRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
    }
    setRecording(null);
    setIsRecording(false);
    setIsPaused(false);
    setAudioUri(null);
    setDurationMillis(0);
  };

  useEffect(() => {
    let interval;
    if (isRecording && recording && !isPaused) {
      interval = setInterval(async () => {
        const status = await recording.getStatusAsync();
        setDurationMillis(status.durationMillis || 0);
      }, 200);
    } else if (!isRecording || isPaused) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused, recording]);

  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const sendAudio = () => {
    if (audioUri && onSend) {
      onSend(audioUri);
      setAudioUri(null);
    }
  };

  // Permitir cancelar desde el menú
  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    }
    deleteRecording();
  };

  // Iniciar grabación automáticamente al montar
  useEffect(() => {
    if (!isRecording && !audioUri) {
      startRecording();
    }
    // Limpieza: detener grabación si se desmonta
    return () => {
      if (isRecording && recording) {
        recording.stopAndUnloadAsync();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      {isRecording && (
        <View style={styles.menuContainer}>
          <Text style={styles.duration}>{formatTime(durationMillis)}</Text>
          <View style={styles.menuButtons}>
            <TouchableOpacity onPress={handleCancel} style={styles.menuIconButton}>
              <Ionicons name="trash" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={isPaused ? resumeRecording : pauseRecording}
              style={styles.menuIconButton}
            >
              <Ionicons name={isPaused ? "play" : "pause"} size={28} color="#FF3B30" />
            </TouchableOpacity>
            <TouchableOpacity onPress={stopRecording} style={styles.menuIconButton}>
              <Ionicons name="arrow-forward-circle" size={32} color="#1AD160" />
            </TouchableOpacity>
          </View>
        </View>
      )}
  {/* Ya no se muestra el preview/modal de audio grabado */}
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  duration: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
    minWidth: 40,
  },
  menuButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconButton: {
    padding: 4,
    marginHorizontal: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  recordButton: {
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 24,
  },
  stopButton: {
    padding: 10,
    backgroundColor: '#FFEBEE',
    borderRadius: 24,
  },
  audioPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  playButton: {
    padding: 6,
  },
  audioText: {
    marginHorizontal: 8,
    color: '#333',
    fontSize: 14,
  },
  sendButton: {
    padding: 6,
  },
});

export default AudioRecorder;
