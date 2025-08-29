import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
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

const EditSelectionScreen = ({ navigation, route }) => {
  const { 
    field, 
    label, 
    currentValue, 
    options, 
    validationRules,
    onSave,
    allowOther = false 
  } = route.params;

  // Detectar si el valor actual es personalizado (no está en las opciones predefinidas)
  const isCustomValue = (value) => {
    if (!value || !options || options.length === 0) return false;
    return !options.some(option => option.value === value);
  };

  const [selectedValue, setSelectedValue] = useState(() => {
    // Si el valor actual es personalizado, seleccionar "Otra"
    if (allowOther && isCustomValue(currentValue)) {
      return "Otra";
    }
    return currentValue || "";
  });
  
  const [otherValue, setOtherValue] = useState(() => {
    // Si el valor actual es personalizado, usarlo como valor de "Otra"
    if (allowOther && isCustomValue(currentValue)) {
      return currentValue;
    }
    return "";
  });
  
  const [isEditingOther, setIsEditingOther] = useState(() => {
    // Si el valor actual es personalizado, habilitar edición
    return allowOther && isCustomValue(currentValue);
  });

  // Sincronizar el estado cuando cambie currentValue (por ejemplo, al navegar de vuelta)
  useEffect(() => {
    if (allowOther && isCustomValue(currentValue)) {
      setSelectedValue("Otra");
      setOtherValue(currentValue);
      setIsEditingOther(true);
    } else {
      setSelectedValue(currentValue || "");
      setOtherValue("");
      setIsEditingOther(false);
    }
  }, [currentValue, allowOther, options]);

  // Validar la selección
  const validateSelection = (value) => {
    if (!validationRules) return true;

    if (validationRules.required && !value) {
      return false;
    }

    // Si se seleccionó "Otra", validar que se haya escrito algo
    if (value === "Otra" && allowOther) {
      return otherValue.trim() !== "";
    }

    return true;
  };

  // Manejar selección
  const handleSelection = (value) => {
    setSelectedValue(value);
    
    // Si se selecciona "Otra", habilitar edición
    if (value === "Otra" && allowOther) {
      setIsEditingOther(true);
      // No limpiar otherValue si ya tiene un valor (para mantener el valor personalizado)
      if (!otherValue.trim()) {
        setOtherValue("");
      }
    } else {
      setIsEditingOther(false);
      setOtherValue(""); // Limpiar valor de "Otra" solo si se selecciona otra opción
    }
  };

  // Guardar cambios
  const handleSave = () => {
    const validation = validateSelection(selectedValue);
    
    if (!validation) {
      return;
    }

    // Si se seleccionó "Otra", usar el valor personalizado
    let finalValue = selectedValue;
    if (selectedValue === "Otra" && allowOther) {
      finalValue = otherValue.trim();
    }

    // Llamar a la función de guardado
    if (onSave) {
      onSave(field, finalValue);
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
    if (selectedValue === "") return false;
    
    // Si se seleccionó "Otra", verificar que se haya escrito algo
    if (selectedValue === "Otra" && allowOther) {
      return otherValue.trim() !== "";
    }
    
    return true;
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
        <Text style={styles.title}>Seleccionar {label}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Descripción */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            Selecciona una opción para {label.toLowerCase()}
          </Text>
        </View>

        {/* Opciones */}
        <ScrollView 
          style={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
        >
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                selectedValue === option.value && styles.optionItemSelected
              ]}
              onPress={() => handleSelection(option.value)}
            >
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionText,
                  selectedValue === option.value && styles.optionTextSelected
                ]}>
                  {option.label}
                </Text>
                {option.description && (
                  <Text style={[
                    styles.optionDescription,
                    selectedValue === option.value && styles.optionDescriptionSelected
                  ]}>
                    {option.description}
                  </Text>
                )}
              </View>
              
              {selectedValue === option.value && (
                <View style={styles.checkmarkContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
          
          {/* Opción "Otra" si está habilitada */}
          {allowOther && (
            <TouchableOpacity
              style={[
                styles.optionItem,
                selectedValue === "Otra" && styles.optionItemSelected
              ]}
              onPress={() => handleSelection("Otra")}
            >
              <View style={styles.optionContent}>
                                {isEditingOther ? (
                  <View style={styles.otherInputContainer}>
                    <TextInput
                      style={styles.otherTextInput}
                      value={otherValue}
                      onChangeText={setOtherValue}
                      placeholder="Especificar valor personalizado"
                      placeholderTextColor="#999"
                      autoFocus={true}
                      autoCapitalize="words"
                      autoCorrect={false}
                      maxLength={20}
                    />
                    <Text style={styles.characterCount}>
                      {otherValue.length}/20
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text style={[
                      styles.optionText,
                      selectedValue === "Otra" && styles.optionTextSelected
                    ]}>
                      Otra
                    </Text>
                    <Text style={[
                      styles.optionDescription,
                      selectedValue === "Otra" && styles.optionDescriptionSelected
                    ]}>
                      Especificar valor personalizado
                    </Text>
                  </>
                )}
              </View>
              
              {selectedValue === "Otra" ? (
                <View style={styles.checkmarkContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              )}
            </TouchableOpacity>
          )}
        </ScrollView>

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
  descriptionContainer: {
    marginBottom: getResponsiveSpacing(24, 30, 36),
  },
  descriptionText: {
    fontSize: getResponsiveFontSize(16, 18, 20),
    color: "#666",
    textAlign: "center",
  },
  optionsContainer: {
    flex: 0,
    marginBottom: getResponsiveSpacing(20, 25, 30),
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: getResponsiveSpacing(12, 16, 20),
    paddingHorizontal: getResponsivePadding(20, 25, 30),
    paddingVertical: getResponsiveSpacing(16, 20, 24),
    marginBottom: getResponsiveSpacing(12, 15, 18),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
    ...(isWeb && webStyles.menuItem),
  },
  optionItemSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: getResponsiveFontSize(16, 18, 20),
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: getResponsiveSpacing(4, 6, 8),
  },
  optionTextSelected: {
    color: "#007AFF",
  },
  optionDescription: {
    fontSize: getResponsiveFontSize(14, 16, 18),
    color: "#666",
  },
  optionDescriptionSelected: {
    color: "#007AFF",
    opacity: 0.8,
  },
  checkmarkContainer: {
    marginLeft: getResponsiveSpacing(16, 20, 24),
  },

  otherInputContainer: {
    flex: 1,
  },
  otherTextInput: {
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: getResponsiveFontSize(16, 18, 20),
    fontWeight: "600",
    color: "#007AFF",
    flex: 1,
  },
  characterCount: {
    fontSize: getResponsiveFontSize(12, 14, 16),
    color: "#999",
    textAlign: "right",
    marginTop: getResponsiveSpacing(4, 6, 8),
  },
  actionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 0,
    paddingTop: getResponsiveSpacing(10, 15, 20),
    paddingBottom: getResponsiveSpacing(8, 10, 12),
    gap: getResponsiveSpacing(8, 12, 16),
    minHeight: getResponsiveSpacing(60, 70, 80),
    marginBottom: getResponsiveSpacing(20, 25, 30),
    marginHorizontal: getResponsiveSpacing(8, 10, 12)
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
  }

});

export default EditSelectionScreen;
