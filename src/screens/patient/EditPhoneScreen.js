import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { isWeb, webStyles } from "../../utils/responsive";

const { width: screenWidth } = Dimensions.get('window');

const EditPhoneScreen = ({ navigation, route }) => {
  const { 
    field, 
    label, 
    currentValue, 
    validationRules,
    onSave 
  } = route.params;

  // Separar el teléfono actual en código de área y número
  const parsePhoneNumber = (phoneString) => {
    const match = phoneString.match(/^\+(\d+)\s*(.+)$/);
    if (match) {
      return {
        areaCode: `+${match[1]}`,
        phoneNumber: match[2].replace(/\s/g, ""),
      };
    }
    return { areaCode: "+58", phoneNumber: "" }; // Venezuela por defecto
  };

  const [phoneData, setPhoneData] = useState(parsePhoneNumber(currentValue || ""));
  const [errors, setErrors] = useState({});

  // Validar el campo en tiempo real
  const validateField = (fieldName, value) => {
    let isValid = true;
    let errorMessage = "";

    if (fieldName === "areaCode") {
      if (!value.trim()) {
        isValid = false;
        errorMessage = "El código de área es obligatorio";
      } else if (!/^\+\d{1,4}$/.test(value)) {
        isValid = false;
        errorMessage = "El código de área debe empezar con + seguido de 1 a 4 números";
      }
    } else if (fieldName === "phoneNumber") {
      if (!value.trim()) {
        isValid = false;
        errorMessage = "El número de teléfono es obligatorio";
      } else if (!/^\d+$/.test(value)) {
        isValid = false;
        errorMessage = "El número solo debe contener dígitos";
      } else if (value.length < 8 || value.length > 14) {
        isValid = false;
        errorMessage = "El número debe tener entre 8 y 14 dígitos";
      }
    }

    return { isValid, errorMessage };
  };

  // Manejar cambios en los inputs
  const handleInputChange = (fieldName, text) => {
    setPhoneData(prev => ({
      ...prev,
      [fieldName]: text
    }));

    const validation = validateField(fieldName, text);
    setErrors(prev => ({
      ...prev,
      [fieldName]: validation.isValid ? "" : validation.errorMessage
    }));
  };

  // Guardar cambios
  const handleSave = () => {
    // Validar ambos campos
    const areaCodeValidation = validateField("areaCode", phoneData.areaCode);
    const phoneNumberValidation = validateField("phoneNumber", phoneData.phoneNumber);

    if (!areaCodeValidation.isValid || !phoneNumberValidation.isValid) {
      setErrors({
        areaCode: areaCodeValidation.isValid ? "" : areaCodeValidation.errorMessage,
        phoneNumber: phoneNumberValidation.isValid ? "" : phoneNumberValidation.errorMessage
      });
      return;
    }

    // Combinar el código de área y número de teléfono
    const fullPhone = `${phoneData.areaCode} ${phoneData.phoneNumber}`;

    // Llamar a la función de guardado
    if (onSave) {
      onSave(field, fullPhone);
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
    return phoneData.areaCode.trim() !== "" && 
           phoneData.phoneNumber.trim() !== "" && 
           !errors.areaCode && 
           !errors.phoneNumber;
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
        {/* Descripción del campo */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            Ingresa tu número de teléfono completo
          </Text>
        </View>

        {/* Campo de teléfono en una sola fila */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Teléfono *</Text>
          <View style={styles.phoneRow}>
            <TextInput
              style={[
                styles.areaCodeInput,
                errors.areaCode ? styles.textInputError : null
              ]}
              value={phoneData.areaCode}
              onChangeText={(text) => handleInputChange("areaCode", text)}
              placeholder="+58"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={5}
              autoFocus={true}
            />
            <TextInput
              style={[
                styles.phoneNumberInput,
                errors.phoneNumber ? styles.textInputError : null
              ]}
              value={phoneData.phoneNumber}
              onChangeText={(text) => handleInputChange("phoneNumber", text)}
              placeholder="Ej: 4121234567"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={14}
            />
          </View>
          {/* Mostrar errores debajo de la fila */}
          {errors.areaCode ? <Text style={styles.errorText}>{errors.areaCode}</Text> : null}
          {errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}
        </View>

        {/* Información adicional */}
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
          <Text style={styles.infoText}>
            El código de país debe empezar con + (ej: +58). El número debe tener entre 8 y 14 dígitos.
          </Text>
        </View>

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
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
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
  phoneRow: {
    flexDirection: "row",
    gap: 12,
  },
  areaCodeInput: {
    flex: 0.3,
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
    ...(isWeb && {
      ...webStyles.input,
      flex: 0.25, // Reducir el tamaño en web móvil
      minWidth: 80, // Ancho mínimo para evitar que se corte
    }),
  },
  phoneNumberInput: {
    flex: 0.7,
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
    ...(isWeb && {
      ...webStyles.input,
      flex: 0.75, // Aumentar proporcionalmente en web móvil
    }),
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
    alignItems: "flex-start",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    marginBottom: 32,
  },
  infoText: {
    fontSize: 14,
    color: "#007AFF",
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 0,
    paddingTop: 0,
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

export default EditPhoneScreen;
