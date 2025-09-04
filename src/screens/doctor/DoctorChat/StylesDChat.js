import { StyleSheet } from 'react-native';
import { getResponsivePadding } from '../../../utils/responsive';

// --Estilos del componente--
// Define todos los estilos visuales del chat del doctor
const styles = StyleSheet.create({
    // --Contenedor principal--
    // Estilo del contenedor principal de la pantalla
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    
    // --Vista de evitación de teclado--
    // Estilo para evitar que el teclado cubra el contenido
    keyboardAvoidingView: {
      flex: 1,
    },
    
    // --Encabezado--
    // Estilo del encabezado del chat
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
    },
    
    // --Botón de regreso--
    // Estilo del botón para regresar a la pantalla anterior
    backButton: {
      padding: 4,
      marginRight: 12,
    },
    
    // --Información del encabezado--
    // Estilo del contenedor de información del paciente
    headerInfo: {
      flex: 1,
    },
    
    // --Nombre del paciente--
    // Estilo del nombre del paciente en el encabezado
    patientName: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1A1A1A',
    },
    
    // --Información de la cita--
    // Estilo de la información de la cita en el encabezado
    appointmentInfo: {
      fontSize: 14,
      color: '#666',
    },
    
    // --Botón de más opciones--
    // Estilo del botón de opciones adicionales
    moreButton: {
      padding: 4,
    },
    
    // --Contenedor de mensajes--
    // Estilo del contenedor principal de mensajes
    messagesContainer: {
      flex: 1,
    },
    
    // --Contenido de mensajes--
    // Estilo del contenido dentro del contenedor de mensajes
    messagesContent: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    
    // --Contenedor de mensaje--
    // Estilo del contenedor de cada mensaje individual
    messageContainer: {
      marginBottom: 16,
    },
    
    // --Mensaje del doctor--
    // Estilo específico para mensajes enviados por el doctor
    doctorMessage: {
      alignItems: 'flex-end',
    },
    
    // --Mensaje del paciente--
    // Estilo específico para mensajes enviados por el paciente
    patientMessage: {
      alignItems: 'flex-start',
    },
    
    // --Burbuja de mensaje--
    // Estilo de la burbuja que contiene el contenido del mensaje
    messageBubble: {
      maxWidth: '80%',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 20,
    },
    
    // --Burbuja del doctor--
    // Estilo específico para las burbujas de mensajes del doctor
    doctorBubble: {
      backgroundColor: '#007AFF',
      borderBottomRightRadius: 4,
    },
    
    // --Burbuja del paciente--
    // Estilo específico para las burbujas de mensajes del paciente
    patientBubble: {
      backgroundColor: '#FFFFFF',
      borderBottomLeftRadius: 4,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    
    // --Texto del mensaje--
    // Estilo del texto principal del mensaje
    messageText: {
      fontSize: 16,
      lineHeight: 22,
      marginBottom: 4,
    },
    
    // --Texto del mensaje del doctor--
    // Estilo específico para el texto de mensajes del doctor
    doctorMessageText: {
      color: '#FFFFFF',
    },
    
    // --Texto del mensaje del paciente--
    // Estilo específico para el texto de mensajes del paciente
    patientMessageText: {
      color: '#1A1A1A',
    },
    
    // --Hora del mensaje--
    // Estilo de la hora que se muestra en cada mensaje
    messageTime: {
      fontSize: 12,
    },
    
    // --Marca de tiempo del doctor--
    // Estilo específico para la hora de mensajes del doctor
    doctorTimestamp: {
      color: 'rgba(255, 255, 255, 0.7)',
      textAlign: 'right',
    },
    
    // --Marca de tiempo del paciente--
    // Estilo específico para la hora de mensajes del paciente
    patientTimestamp: {
      color: '#999',
    },
    
    // --Contenedor de entrada--
    // Estilo del contenedor de entrada de mensajes
    inputContainer: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#F0F0F0',
    },
    
    // --Contenedor del campo de entrada--
    // Estilo del contenedor que envuelve el campo de texto y botones
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor: '#F8F9FA',
      borderRadius: 24,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    
    // --Botón de adjuntar--
    // Estilo del botón para adjuntar archivos
    attachButton: {
      padding: 8,
      marginRight: 4,
    },
    
    // --Campo de texto--
    // Estilo del campo de texto para escribir mensajes
    textInput: {
      flex: 1,
      fontSize: 16,
      color: '#1A1A1A',
      maxHeight: 100,
      paddingVertical: 8,
      paddingHorizontal: 8,
    },
    
    // --Botón de enviar--
    // Estilo del botón para enviar mensajes
    sendButton: {
      padding: 8,
      marginLeft: 4,
    },
    
    // --Botón de enviar deshabilitado--
    // Estilo del botón de enviar cuando está deshabilitado
    sendButtonDisabled: {
      opacity: 0.5,
    },
    
    // --Fila del menú de adjuntos--
    // Estilo del menú que muestra las opciones de adjuntos
    attachmentMenuRow: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 16,
      marginHorizontal: getResponsivePadding(20, 40, 60),
      marginBottom: 4,
      paddingVertical: 8,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      zIndex: 20,
    },
    
    // --Elemento del menú de adjuntos--
    // Estilo de cada elemento individual del menú de adjuntos
    attachmentMenuItem: {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 16,
    },
    
    // --Texto del menú de adjuntos--
    // Estilo del texto descriptivo en cada opción del menú de adjuntos
    attachmentMenuText: {
      fontSize: 13,
      color: '#007AFF',
      marginTop: 2,
    },
    
    // --Botón de audio--
    // Estilo del botón para grabar audio
    audioButton: {
      padding: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 4,
    },
    
    // --Contenedor de iconos--
    // Estilo del contenedor que envuelve los iconos de acción
    iconWrapper: {
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });