import React, { useState } from "react";
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

const EditPhoneScreen = ({ navigation, route }) => {
  const { 
    field,
    label,
    currentValue, 
    onSave,
    onVerification
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

  // Verificar teléfono
  const handleVerify = () => {
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

    //Guardar el teléfono
    if (onSave) {
      onSave(field, fullPhone);
    }

    // Navegar a la pantalla de verificación
    navigation.navigate('VerificationCodeScreen', {
      field,
      label: label || 'Teléfono',
      fieldType: 'phone',
      value: fullPhone,
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

  // Verificar si se puede verificar
  const canVerify = () => {
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
          <Text style={styles.inputLabel}>{label} *</Text>
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
              !canVerify() ? styles.saveButtonDisabled : null,
            ]}
            onPress={handleVerify}
            disabled={!canVerify()}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={canVerify() ? "#007AFF" : "#999"}
            />
            <Text
              style={[
                styles.saveButtonText,
                !canVerify() ? styles.saveButtonTextDisabled : null,
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
  descriptionContainer: {
    marginBottom: getResponsiveSpacing(24, 30, 36),
  },
  descriptionText: {
    fontSize: getResponsiveFontSize(16, 18, 20),
    color: "#666",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: getResponsiveSpacing(20, 25, 30),
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
  phoneRow: {
    flexDirection: "row",
    gap: getResponsiveSpacing(12, 16, 20),
  },
  areaCodeInput: {
    flex: 0.3,
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
    ...(isWeb && {
      ...webStyles.input,
      flex: 0.25,
      minWidth: 80,
    }),
  },
  phoneNumberInput: {
    flex: 0.7,
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
    ...(isWeb && {
      ...webStyles.input,
      flex: 0.75,
    }),
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
    lineHeight: 20,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    paddingBottom: getResponsiveSpacing(18, 22, 26),
    gap: getResponsiveSpacing(12, 16, 20),
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

export default EditPhoneScreen;
