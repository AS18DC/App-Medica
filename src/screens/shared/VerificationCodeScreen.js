import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { 
  isWeb, 
  webStyles, 
  isTabletScreen, 
  isDesktopScreen, 
  getResponsiveSpacing, 
  getResponsiveFontSize, 
  getResponsivePadding
} from "../../utils/responsive";
import { showAlert } from "../../utils/alertUtils";

const VerificationCodeScreen = ({ navigation, route }) => {
  const { 
    field, 
    label, 
    fieldType, // 'phone' o 'email'
    value,
    onVerificationSuccess 
  } = route.params;



  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '']);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  
  // Referencias para los inputs
  const inputRefs = useRef([]);

  // Simular verificación del código 
  const verifyCode = async (code) => {
    setIsVerifying(true);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Código de ejemplo 
    const isValidCode = code === "12345";
    
    setIsVerifying(false);
    return isValidCode;
  };

  // Manejar cambio en un input específico
  const handleInputChange = (index, value) => {
    // Limpiar error al escribir
    setError("");
    
    // Solo permitir números
    if (!/^\d*$/.test(value)) return;
    
    // Actualizar el código de verificación
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Mover al siguiente input si se escribió un dígito
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Verificar si se completó el código
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 5) {
      handleCodeComplete(newCode.join(''));
    }
  };

  // Manejar cuando se completa el código
  const handleCodeComplete = async (code) => {
    const isValid = await verifyCode(code);
    if (isValid) {
      // Código válido - mostrar notificación y regresar
      showAlert(
        "Verificación exitosa",
        `${label} verificado`,
        () => {
          // Llamar a la función de éxito si existe
          if (onVerificationSuccess) {
            onVerificationSuccess(field, true);
          }
          // Regresar a la pantalla anterior
          navigation.goBack();
        }
      );
    } else {
      // Código inválido - mostrar error y limpiar inputs
      setError("Código de verificación incorrecto");
      setVerificationCode(['', '', '', '', '']);
      
      // Enfocar el primer input
      inputRefs.current[0]?.focus();
    }
  };

  // Manejar tecla de retroceso
  const handleKeyPress = (index, key) => {
    if (key === 'Backspace' && !verificationCode[index] && index > 0) {
      // Mover al input anterior si el actual está vacío
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Reenviar código de verificación
  const handleResendCode = () => {
    if (resendCountdown > 0) return;
    
    // Simular reenvío
    showAlert(
      "Código reenviado",
      `Se ha enviado un nuevo código de verificación a tu ${fieldType === 'phone' ? 'teléfono' : 'correo'}.`,
      () => {}
    );
    
    // Iniciar countdown de 60 segundos
    setResendCountdown(60);
  };

  // Countdown para reenvío
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Limpiar inputs al montar
  useEffect(() => {
    setVerificationCode(['', '', '', '', '']);
    setError("");
    // Enfocar el primer input
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Verificar {label}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Información */}
        <View style={styles.infoContainer}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#007AFF" />
          <Text style={styles.infoText}>
            Se ha enviado un código de verificación de 5 dígitos al {fieldType === 'phone' ? 'teléfono' : 'correo'} {value}.
          </Text>
        </View>

        {/* Código de verificación */}
        <View style={styles.verificationContainer}>
          <Text style={styles.verificationLabel}>Código de verificación</Text>
          
          <View style={styles.codeInputsContainer}>
            {verificationCode.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => inputRefs.current[index] = ref}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputFilled : null,
                  error ? styles.codeInputError : null
                ]}
                value={digit}
                onChangeText={(value) => handleInputChange(index, value)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
                autoFocus={index === 0}
                autoCapitalize="none"
                autoCorrect={false}
              />
            ))}
          </View>

          {/* Mensaje de error */}
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={16} color="#FF3B30" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Indicador de verificación */}
          {isVerifying && (
            <View style={styles.verifyingContainer}>
              <Ionicons name="sync-outline" size={16} color="#007AFF" />
              <Text style={styles.verifyingText}>Verificando código...</Text>
            </View>
          )}
        </View>

        {/* Botón de reenvío */}
        <View style={styles.resendContainer}>
          <TouchableOpacity
            style={[
              styles.resendButton,
              resendCountdown > 0 ? styles.resendButtonDisabled : null
            ]}
            onPress={handleResendCode}
            disabled={resendCountdown > 0}
          >
            <Ionicons 
              name="refresh-outline" 
              size={16} 
              color={resendCountdown > 0 ? "#999" : "#007AFF"} 
            />
            <Text style={[
              styles.resendButtonText,
              resendCountdown > 0 ? styles.resendButtonTextDisabled : null
            ]}>
              {resendCountdown > 0 
                ? `Reenviar en ${resendCountdown}s` 
                : "Reenviar código"
              }
            </Text>
          </TouchableOpacity>
        </View>

        {/* Información adicional */}
        <View style={styles.additionalInfoContainer}>
          <Text style={styles.additionalInfoText}>
            Si no recibiste el código, verifica que tu {fieldType === 'phone' ? 'teléfono' : 'correo'} esté correcto.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: getResponsivePadding(20, 30, 40),
    paddingTop: getResponsiveSpacing(20, 25, 30),
    paddingBottom: getResponsiveSpacing(16, 20, 24),
  },
  backButton: {
    padding: getResponsiveSpacing(8, 10, 12),
  },
  title: {
    maxWidth: '80%',
    fontSize: getResponsiveFontSize(20, 24, 28),
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  placeholder: {
    width: getResponsiveSpacing(40, 50, 60),
  },
  content: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(20, 30, 40),
    paddingTop: getResponsiveSpacing(20, 25, 30),
    width: '100%',
    maxWidth: isDesktopScreen() ? 800 : isTabletScreen() ? 700 : 600,
    ...(isWeb && {
      margin: '0 auto',
      alignSelf: 'center',
    }),
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: getResponsivePadding(16, 20, 24),
    paddingVertical: getResponsiveSpacing(16, 20, 24),
    borderRadius: getResponsiveSpacing(8, 10, 12),
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    marginBottom: getResponsiveSpacing(32, 40, 48),
  },
  infoText: {
    fontSize: getResponsiveFontSize(14, 16, 18),
    color: "#007AFF",
    marginLeft: getResponsiveSpacing(12, 16, 20),
    flex: 1,
    lineHeight: getResponsiveFontSize(20, 22, 24),
  },
  verificationContainer: {
    alignItems: "center",
    marginBottom: getResponsiveSpacing(40, 50, 60),
  },
  verificationLabel: {
    fontSize: getResponsiveFontSize(16, 18, 20),
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: getResponsiveSpacing(20, 25, 30),
  },
  codeInputsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: getResponsiveSpacing(12, 16, 20),
    marginBottom: getResponsiveSpacing(20, 25, 30),
  },
  codeInput: {
    width: getResponsiveSpacing(50, 60, 70),
    height: getResponsiveSpacing(50, 60, 70),
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: getResponsiveSpacing(12, 16, 20),
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    fontSize: getResponsiveFontSize(24, 28, 32),
    fontWeight: "bold",
    color: "#1A1A1A",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    ...(isWeb && webStyles.input),
  },
  codeInputFilled: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  codeInputError: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF5F5",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    paddingHorizontal: getResponsivePadding(12, 16, 20),
    paddingVertical: getResponsiveSpacing(8, 10, 12),
    borderRadius: getResponsiveSpacing(8, 10, 12),
    borderWidth: 1,
    borderColor: "#FFE5E5",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: getResponsiveFontSize(14, 16, 18),
    marginLeft: getResponsiveSpacing(8, 10, 12),
  },
  verifyingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: getResponsivePadding(12, 16, 20),
    paddingVertical: getResponsiveSpacing(8, 10, 12),
    borderRadius: getResponsiveSpacing(8, 10, 12),
    borderWidth: 1,
    borderColor: "#E5F0FF",
  },
  verifyingText: {
    color: "#007AFF",
    fontSize: getResponsiveFontSize(14, 16, 18),
    marginLeft: getResponsiveSpacing(8, 10, 12),
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: getResponsiveSpacing(32, 40, 48),
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: getResponsivePadding(16, 20, 24),
    paddingVertical: getResponsiveSpacing(12, 15, 18),
    borderRadius: getResponsiveSpacing(8, 10, 12),
    borderWidth: 1,
    borderColor: "#007AFF",
    ...(isWeb && webStyles.button),
  },
  resendButtonDisabled: {
    borderColor: "#CCC",
  },
  resendButtonText: {
    color: "#007AFF",
    fontSize: getResponsiveFontSize(14, 16, 18),
    fontWeight: "500",
    marginLeft: getResponsiveSpacing(8, 10, 12),
  },
  resendButtonTextDisabled: {
    color: "#999",
  },
  additionalInfoContainer: {
    alignItems: "center",
    paddingHorizontal: getResponsivePadding(20, 25, 30),
  },
  additionalInfoText: {
    fontSize: getResponsiveFontSize(12, 14, 16),
    color: "#666",
    textAlign: "center",
    lineHeight: getResponsiveFontSize(18, 20, 22),
  },
});

export default VerificationCodeScreen;
