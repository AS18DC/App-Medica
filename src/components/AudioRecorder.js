// --Imports de React Native--
// Importa las funcionalidades básicas de React y React Native
import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

// --Imports de Expo--
// Importa la API de audio de Expo para grabación y reproducción
import { Audio } from 'expo-av';

// --Imports de iconos--
// Importa iconos de Ionicons para la interfaz de usuario
import { Ionicons } from '@expo/vector-icons';

const AudioRecorder = ({ onSend, onCancel }) => {
  // --Estado de grabación--
  // Controla el objeto de grabación actual
  const [recording, setRecording] = useState(null);
  
  // --Indicador de grabación activa--
  // Indica si se está grabando audio actualmente
  const [isRecording, setIsRecording] = useState(false);
  
  // --Indicador de pausa--
  // Indica si la grabación está pausada
  const [isPaused, setIsPaused] = useState(false);
  
  // --URI del audio--
  // Almacena la ruta del archivo de audio grabado
  const [audioUri, setAudioUri] = useState(null);
  
  // --Objeto de sonido--
  // Controla la reproducción del audio
  const [sound, setSound] = useState(null);
  
  // --Indicador de reproducción--
  // Indica si se está reproduciendo audio
  const [isPlaying, setIsPlaying] = useState(false);
  
  // --Duración en milisegundos--
  // Almacena la duración total de la grabación
  const [durationMillis, setDurationMillis] = useState(0);

  // --Iniciar grabación--
  // Comienza a grabar audio con permisos y configuración
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

  // --Detener grabación--
  // Finaliza la grabación y envía el audio automáticamente
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

  // --Reproducir audio--
  // Reproduce el audio grabado con controles de estado
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

  // --Pausar grabación--
  // Pausa la grabación actual
  const pauseRecording = async () => {
    if (recording) {
      await recording.pauseAsync();
      setIsPaused(true);
    }
  };

  // --Reanudar grabación--
  // Continúa la grabación desde donde se pausó
  const resumeRecording = async () => {
    if (recording) {
      await recording.startAsync();
      setIsPaused(false);
    }
  };

  // --Eliminar grabación--
  // Cancela y elimina la grabación actual
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

  // --Efecto de duración--
  // Actualiza la duración de la grabación en tiempo real
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

  // --Formatear tiempo--
  // Convierte milisegundos a formato MM:SS
  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // --Enviar audio--
  // Envía el audio grabado y limpia el estado
  const sendAudio = () => {
    if (audioUri && onSend) {
      onSend(audioUri);
      setAudioUri(null);
    }
  };

  // --Manejar cancelación--
  // Permite cancelar la grabación desde el menú
  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    }
    deleteRecording();
  };

  // --Efecto de inicio automático--
  // Inicia la grabación automáticamente al montar el componente
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
  // --Contenedor del menú--
  // Contenedor principal del menú de grabación con diseño horizontal
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
  
  // --Duración del audio--
  // Estilo para mostrar el tiempo de grabación
  duration: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
    minWidth: 40,
  },
  
  // --Botones del menú--
  // Contenedor de los botones de control de grabación
  menuButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  // --Botón de icono del menú--
  // Estilo para cada botón individual del menú
  menuIconButton: {
    padding: 4,
    marginHorizontal: 2,
  },
  
  // --Contenedor principal--
  // Contenedor principal del componente con diseño horizontal
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  
  // --Botón de grabación--
  // Estilo para el botón de iniciar grabación
  recordButton: {
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 24,
  },
  
  // --Botón de parar--
  // Estilo para el botón de detener grabación
  stopButton: {
    padding: 10,
    backgroundColor: '#FFEBEE',
    borderRadius: 24,
  },
  
  // --Vista previa de audio--
  // Contenedor para mostrar la vista previa del audio grabado
  audioPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  
  // --Botón de reproducir--
  // Estilo para el botón de reproducir audio
  playButton: {
    padding: 6,
  },
  
  // --Texto del audio--
  // Estilo para el texto descriptivo del audio
  audioText: {
    marginHorizontal: 8,
    color: '#333',
    fontSize: 14,
  },
  
  // --Botón de enviar--
  // Estilo para el botón de enviar audio
  sendButton: {
    padding: 6,
  },
});

export default AudioRecorder;
