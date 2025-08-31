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
import { usePatientProfile } from "../../context/PatientProfileContext";

const EditFieldScreen = ({ navigation, route }) => {
  const { 
    field, 
    label, 
    currentValue, 
    placeholder, 
    keyboardType = "default", 
    maxLength = null,
    minLength = null,
    validationRules
  } = route.params;
  
  const { updateProfileField } = usePatientProfile();

  const [value, setValue] = useState(currentValue || "");
  const [error, setError] = useState("");

  // Validar el campo en tiempo real
  const validateField = (inputValue) => {
    if (!validationRules) return { isValid: true, errorMessage: "" };

    let isValid = true;
    let errorMessage = "";

    // Aplicar reglas de validación específicas
    if (validationRules.required && !inputValue.trim()) {
      isValid = false;
      errorMessage = `El campo ${label.toLowerCase()} es obligatorio`;
    } else if (validationRules.minLength && inputValue.length < validationRules.minLength) {
      isValid = false;
      errorMessage = `Debe tener al menos ${validationRules.minLength} caracteres`;
    } else if (validationRules.maxLength && inputValue.length > validationRules.maxLength) {
      isValid = false;
      errorMessage = `No puede exceder ${validationRules.maxLength} caracteres`;
    } else if (validationRules.pattern && !validationRules.pattern.test(inputValue)) {
      isValid = false;
      errorMessage = validationRules.errorMessage || `Formato inválido`;
    } else if (validationRules.range) {
      const numValue = parseFloat(inputValue);
      if (isNaN(numValue) || numValue < validationRules.range.min || numValue > validationRules.range.max) {
        isValid = false;
        errorMessage = `Debe estar entre ${validationRules.range.min} y ${validationRules.range.max}`;
      }
    }

    return { isValid, errorMessage };
  };

  // Manejar cambios en el input
  const handleInputChange = (text) => {
    setValue(text);
    const validation = validateField(text);
    setError(validation.isValid ? "" : validation.errorMessage);
  };

  // Guardar cambios
  const handleSave = () => {
    const validation = validateField(value);
    
    if (!validation.isValid) {
      setError(validation.errorMessage);
      return;
    }

    // Actualizar el contexto directamente
    updateProfileField(field, value);

    // Navegar de vuelta
    navigation.goBack();
  };

  // Cancelar edición
  const handleCancel = () => {
    navigation.goBack();
  };

  // Verificar si se puede guardar
  const canSave = () => {
    return value.trim() !== "" && !error;
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
            value={value}
            onChangeText={handleInputChange}
            placeholder={placeholder}
            placeholderTextColor="#999"
            keyboardType={keyboardType}
            maxLength={maxLength}
            autoFocus={true}
            autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
            autoCorrect={false}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {(maxLength || minLength) && (
            <Text style={styles.characterCount}>
              {value.length}{maxLength ? `/${maxLength}` : ''}{minLength ? ` (mín: ${minLength})` : ''}
            </Text>
          )}
        </View>

        {/* Información adicional si existe */}
        {validationRules?.info && (
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
            <Text style={styles.infoText}>{validationRules.info}</Text>
          </View>
        )}

        {/* Botones de acción */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              !canSave() ? styles.saveButtonDisabled : null,
            ]}
            onPress={handleSave}
            disabled={!canSave()}
          >
            <Ionicons
              name="checkmark"
              size={20}
              color={canSave() ? "#007AFF" : "#999"}
            />
            <Text
              style={[
                styles.saveButtonText,
                !canSave() ? styles.saveButtonTextDisabled : null,
              ]}
            >
              Guardar
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
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: getResponsivePadding(16, 20, 24),
    paddingVertical: getResponsiveSpacing(12, 15, 18),
    borderRadius: getResponsiveSpacing(8, 10, 12),
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  infoText: {
    fontSize: getResponsiveFontSize(14, 16, 18),
    color: "#007AFF",
    marginLeft: getResponsiveSpacing(8, 10, 12),
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 0,
    paddingTop: getResponsiveSpacing(32, 40, 48),
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

export default EditFieldScreen;
