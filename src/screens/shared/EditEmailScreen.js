import React, { useState, useEffect } from "react";
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

const EditEmailScreen = ({ navigation, route }) => {
  const { 
    field,
    label,
    currentValue, 
    onSave, 
    onVerification
  } = route.params;

  const [email, setEmail] = useState(currentValue || "");
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  // Validación específica para correo
  const validateEmail = (emailValue) => {
    if (!emailValue.trim()) {
      return { isValid: false, errorMessage: "El correo es obligatorio" };
    }

    // Patrón básico de correo
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
      return { isValid: false, errorMessage: "Formato de correo inválido" };
    }

    // Validaciones adicionales
    if (emailValue.length < 5) {
      return { isValid: false, errorMessage: "El correo debe tener al menos 5 caracteres" };
    }

    if (emailValue.length > 100) {
      return { isValid: false, errorMessage: "El correo no puede exceder 100 caracteres" };
    }

    // Validar que no tenga espacios al inicio o final
    if (emailValue !== emailValue.trim()) {
      return { isValid: false, errorMessage: "El correo no puede tener espacios al inicio o final" };
    }

    // Validar que tenga un dominio válido
    const parts = emailValue.split('@');
    if (parts.length !== 2 || parts[1].length < 3) {
      return { isValid: false, errorMessage: "El dominio del correo no es válido" };
    }

    return { isValid: true, errorMessage: "" };
  };

  // Manejar cambios en el input
  const handleEmailChange = (text) => {
    setEmail(text);
    setError(""); // Limpiar error al escribir
  };

  // Validar al perder el foco
  const handleBlur = () => {
    setIsValidating(true);
    const validation = validateEmail(email);
    setError(validation.errorMessage);
    setIsValidating(false);
  };

  // Verificar correo
  const handleVerify = () => {
    const validation = validateEmail(email);
    
    if (!validation.isValid) {
      setError(validation.errorMessage);
      return;
    }

    //Guardar el correo
    if (onSave) {
      onSave(field, email.trim());
    }

    // Navegar a la pantalla de verificación
    navigation.navigate('VerificationCodeScreen', {
      field,
      label: label || 'Correo',
      fieldType: 'email',
      value: email.trim(),
      onVerificationSuccess: (field, isVerified) => {
        if (isVerified) {
          // Marcar el campo como verificado
          if(onVerification) {
            onVerification(field, true);
          }
          navigation.goBack();
        }
      }
    });
  };

  // Cancelar edición
  const handleCancel = () => {
    navigation.goBack();
  };

  // Verificar si se puede guardar
  const canSave = () => {
    return email.trim() !== "" && !error && !isValidating;
  };

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
        <Text style={styles.title}>Editar {label}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Campo de entrada */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{label}</Text>
          <TextInput
            style={[
              styles.textInput,
              error ? styles.textInputError : null
            ]}
            value={email}
            onChangeText={handleEmailChange}
            onBlur={handleBlur}
            placeholder="Ingresa tu correo"
            placeholderTextColor="#999"
            keyboardType="email-address"
            maxLength={100}
            autoFocus={true}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Text style={styles.characterCount}>
            {email.length}/100 caracteres
          </Text>
        </View>

        {/* Información sobre el correo */}
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
          <Text style={styles.infoText}>
            El correo debe tener un formato válido (ejemplo@dominio.com). 
          </Text>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              !canSave() ? styles.saveButtonDisabled : null,
            ]}
            onPress={handleVerify}
            disabled={!canSave()}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={canSave() ? "#007AFF" : "#999"}
            />
            <Text
              style={[
                styles.saveButtonText,
                !canSave() ? styles.saveButtonTextDisabled : null,
              ]}
            >
              Verificar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Ionicons name="close" size={20} color="#666" />
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
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
  inputContainer: {
    marginBottom: getResponsiveSpacing(24, 30, 36),
  },
  inputLabel: {
    fontSize: getResponsiveFontSize(18, 20, 22),
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: getResponsiveSpacing(12, 15, 18),
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: getResponsiveSpacing(12, 16, 20),
    paddingHorizontal: getResponsivePadding(16, 20, 24),
    paddingVertical: getResponsiveSpacing(16, 20, 24),
    fontSize: getResponsiveFontSize(16, 18, 20),
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
  textInputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: getResponsiveFontSize(14, 16, 18),
    marginTop: getResponsiveSpacing(8, 10, 12),
    marginLeft: 4,
  },
  characterCount: {
    fontSize: getResponsiveFontSize(12, 14, 16),
    color: "#999",
    textAlign: "right",
    marginTop: getResponsiveSpacing(8, 10, 12),
    marginRight: 4,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: getResponsivePadding(16, 20, 24),
    paddingVertical: getResponsiveSpacing(12, 15, 18),
    borderRadius: getResponsiveSpacing(8, 10, 12),
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    marginBottom: getResponsiveSpacing(20, 25, 30),
  },
  infoText: {
    fontSize: getResponsiveFontSize(14, 16, 18),
    color: "#007AFF",
    marginLeft: getResponsiveSpacing(8, 10, 12),
    flex: 1,
    lineHeight: getResponsiveFontSize(20, 22, 24),
  },

  actionButtonsContainer: {
    flexDirection: "row",
    paddingBottom: getResponsiveSpacing(18, 22, 26),
    gap: getResponsiveSpacing(8, 12, 16),
    minHeight: getResponsiveSpacing(60, 70, 80),
    marginBottom: isWeb ? getResponsiveSpacing(80, 100, 120) : getResponsiveSpacing(20, 25, 30),
    ...(isWeb && {
      marginHorizontal: getResponsiveSpacing(8, 10, 12),
    }),
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    paddingVertical: getResponsiveSpacing(18, 22, 26),
    borderRadius: getResponsiveSpacing(12, 16, 20),
    borderWidth: 2,
    borderColor: "#007AFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    ...(isWeb && webStyles.button),
  },
  saveButtonDisabled: {
    borderColor: "#CCC",
  },
  saveButtonText: {
    color: "#007AFF",
    fontSize: getResponsiveFontSize(16, 18, 20),
    fontWeight: "600",
    marginLeft: getResponsiveSpacing(8, 10, 12),
  },
  saveButtonTextDisabled: {
    color: "#999",
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    paddingVertical: getResponsiveSpacing(18, 22, 26),
    borderRadius: getResponsiveSpacing(12, 16, 20),
    borderWidth: 2,
    borderColor: "#666",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    ...(isWeb && webStyles.button),
  },
  cancelButtonText: {
    color: "#666",
    fontSize: getResponsiveFontSize(16, 18, 20),
    fontWeight: "600",
    marginLeft: getResponsiveSpacing(8, 10, 12),
  },
});

export default EditEmailScreen;
