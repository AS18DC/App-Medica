import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { isWeb, webStyles } from "../../utils/responsive";

const { width: screenWidth } = Dimensions.get('window');

const EditFieldScreen = ({ navigation, route }) => {
  const { 
    field, 
    label, 
    currentValue, 
    placeholder, 
    keyboardType = "default", 
    maxLength = null,
    validationRules,
    onSave 
  } = route.params;

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

    // Llamar a la función de guardado
    if (onSave) {
      onSave(field, value);
    }

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
    backgroundColor: "#F8F9FA",
    ...(isWeb && webStyles.container),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    ...(isWeb && {
      maxWidth: 600,
      margin: '0 auto',
    }),
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
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
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  infoText: {
    fontSize: 14,
    color: "#007AFF",
    marginLeft: 8,
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 0,
    paddingTop: 32,
    paddingBottom: 18,
    gap: 12,
    minHeight: 60,
    marginBottom: isWeb ? 80 : 20,
    ...(isWeb && {
      marginHorizontal: 8, // Agregar margen horizontal en web móvil
    }),
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    paddingVertical: 18,
    borderRadius: 12,
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
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
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
    paddingVertical: 18,
    borderRadius: 12,
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
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default EditFieldScreen;
