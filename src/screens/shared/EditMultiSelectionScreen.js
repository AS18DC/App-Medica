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
  getResponsivePadding,
  getResponsiveImageSize 
} from "../../utils/responsive";
import { usePatientProfile } from "../../context/PatientProfileContext";

/**
 * EditMultiSelectionScreen - Pantalla para selección múltiple de opciones
 * 
 * Esta pantalla permite al usuario seleccionar múltiples opciones de una lista
 * predefinida y agregar opciones personalizadas. Es ideal para campos como:
 * - Alergias
 * - Discapacidades
 * - Síntomas
 * - Medicamentos
 * - Preferencias
 * 
 * Parámetros de navegación:
 * @param {string} field - Nombre del campo a editar
 * @param {string} label - Etiqueta descriptiva del campo
 * @param {Array|string} currentValue - Valor actual (array o string)
 * @param {Array} options - Opciones predefinidas [{value, label, description?}]
 * @param {Object} validationRules - Reglas de validación
 * @param {Function} onSave - Función para guardar cambios
 * @param {boolean} allowOther - Si permite opciones personalizadas
 * @param {number} maxSelections - Número máximo de selecciones
 * @param {Array} uniqueOptions - Opciones que son únicas/exclusivas (ej: ['Ninguna'])
 * 
 * Ejemplo de uso:
 * navigation.navigate('EditMultiSelectionScreen', {
 *   field: 'allergies',
 *   label: 'Alergias',
 *   currentValue: ['Penicilina', 'Látex'],
 *   options: [
 *     { value: 'Ninguna', label: 'Ninguna' },
 *     { value: 'Penicilina', label: 'Penicilina' },
 *     { value: 'Látex', label: 'Látex' }
 *   ],
 *   validationRules: {
 *     required: true,
 *     minSelections: 1,
 *     maxSelections: 15
 *   },
 *   allowOther: true,
 *   maxSelections: 15,
 *   uniqueOptions: ['Ninguna'], // 'Ninguna' es exclusiva
 *   onSave: (field, value) => console.log(field, value)
 * });
 */

const EditMultiSelectionScreen = ({ navigation, route }) => {
  const { 
    field, 
    label, 
    currentValue, 
    options, 
    validationRules,
    allowOther = false,
    maxSelections = null, // Número máximo de selecciones permitidas
    uniqueOptions = [] // Array de opciones que son únicas/exclusivas
  } = route.params;
  
  const { updateProfileField } = usePatientProfile();

  // Convertir currentValue a array si no lo es
  const initialValues = Array.isArray(currentValue) ? currentValue : (currentValue ? [currentValue] : []);
  
  // Separar valores predefinidos de valores personalizados
  const [selectedValues, setSelectedValues] = useState(() => {
    return initialValues.filter(value => 
      options.some(option => option.value === value)
    );
  });
  
  const [otherValues, setOtherValues] = useState(() => {
    return initialValues.filter(value => 
      !options.some(option => option.value === value)
    );
  });

  // Estado para agregar nueva opción personalizada
  const [newOtherValue, setNewOtherValue] = useState("");
  const [isAddingOther, setIsAddingOther] = useState(false);

  // Sincronizar el estado cuando cambie currentValue
  useEffect(() => {
    const values = Array.isArray(currentValue) ? currentValue : (currentValue ? [currentValue] : []);
    setSelectedValues(values.filter(value => 
      options.some(option => option.value === value)
    ));
    setOtherValues(values.filter(value => 
      !options.some(option => option.value === value)
    ));
  }, [currentValue, options]);

  // Validar la selección
  const validateSelection = () => {
    if (!validationRules) return true;

    if (validationRules.required && selectedValues.length === 0 && otherValues.length === 0) {
      return false;
    }

    if (validationRules.minSelections && (selectedValues.length + otherValues.length) < validationRules.minSelections) {
      return false;
    }

    if (validationRules.maxSelections && (selectedValues.length + otherValues.length) > validationRules.maxSelections) {
      return false;
    }

    return true;
  };

  // Manejar selección/deselección de opciones predefinidas
  const handleSelection = (value) => {
    setSelectedValues(prev => {
      if (prev.includes(value)) {
        // Deseleccionar la opción
        return prev.filter(v => v !== value);
      } else {
        // Verificar si es una opción única
        const isUniqueOption = uniqueOptions.includes(value);
        
        if (isUniqueOption) {
          // Si es única, deseleccionar todas las demás y seleccionar solo esta
          // También limpiar las opciones personalizadas
          setOtherValues([]);
          return [value];
        } else {
          // Si no es única, verificar si ya hay una opción única seleccionada
          const hasUniqueSelected = prev.some(v => uniqueOptions.includes(v));
          
          if (hasUniqueSelected) {
            // Si hay una opción única seleccionada, deseleccionarla primero
            const withoutUnique = prev.filter(v => !uniqueOptions.includes(v));
            
            // Verificar límite máximo si está configurado
            if (maxSelections && (withoutUnique.length + otherValues.length) >= maxSelections) {
              return prev;
            }
            
            return [...withoutUnique, value];
          } else {
            // Verificar límite máximo si está configurado
            if (maxSelections && (prev.length + otherValues.length) >= maxSelections) {
              return prev;
            }
            return [...prev, value];
          }
        }
      }
    });
  };

  // Agregar nueva opción personalizada
  const handleAddOther = () => {
    const trimmedValue = newOtherValue.trim();
    if (trimmedValue && !otherValues.includes(trimmedValue)) {
      // Verificar límite máximo si está configurado
      if (maxSelections && (selectedValues.length + otherValues.length) >= maxSelections) {
        return;
      }
      
      // Si hay opciones únicas seleccionadas, deseleccionarlas
      const hasUniqueSelected = selectedValues.some(v => uniqueOptions.includes(v));
      if (hasUniqueSelected) {
        setSelectedValues(prev => prev.filter(v => !uniqueOptions.includes(v)));
      }
      
      setOtherValues(prev => [...prev, trimmedValue]);
      setNewOtherValue("");
      setIsAddingOther(false);
    }
  };

  // Eliminar opción personalizada
  const handleRemoveOther = (value) => {
    setOtherValues(prev => prev.filter(v => v !== value));
  };

  // Cancelar agregar nueva opción
  const handleCancelAddOther = () => {
    setNewOtherValue("");
    setIsAddingOther(false);
  };

  // Guardar cambios
  const handleSave = () => {
    const validation = validateSelection();
    
    if (!validation) {
      return;
    }

    // Combinar valores seleccionados y personalizados
    const finalValues = [...selectedValues, ...otherValues];

    // Actualizar el contexto directamente
    updateProfileField(field, finalValues);

    // Navegar de vuelta
    navigation.goBack();
  };

  // Cancelar edición
  const handleCancel = () => {
    navigation.goBack();
  };

  // Verificar si se puede guardar
  const canSave = () => {
    if (validationRules?.required && selectedValues.length === 0 && otherValues.length === 0) {
      return false;
    }
    
    if (validationRules?.minSelections && (selectedValues.length + otherValues.length) < validationRules.minSelections) {
      return false;
    }
    
    return true;
  };

  // Verificar si se puede agregar más opciones
  const canAddMore = () => {
    if (!maxSelections) return true;
    return (selectedValues.length + otherValues.length) < maxSelections;
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
            Selecciona múltiples opciones para {label.toLowerCase()}
          </Text>
        </View>

        {/* Opciones predefinidas */}
        <ScrollView 
          style={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
        >
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                selectedValues.includes(option.value) && styles.optionItemSelected
              ]}
              onPress={() => handleSelection(option.value)}
            >
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionText,
                  selectedValues.includes(option.value) && styles.optionTextSelected
                ]}>
                  {option.label}
                </Text>
                {option.description && (
                  <Text style={[
                    styles.optionDescription,
                    selectedValues.includes(option.value) && styles.optionDescriptionSelected
                  ]}>
                    {option.description}
                  </Text>
                )}
              </View>
              
              {selectedValues.includes(option.value) ? (
                <View style={styles.checkmarkContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                </View>
              ) : (
                <View style={styles.circleContainer}>
                  <View style={styles.emptyCircle} />
                </View>
              )}
            </TouchableOpacity>
          ))}
          
          {/* Opciones personalizadas existentes */}
          {otherValues.map((value, index) => (
            <TouchableOpacity
              key={`other-${index}`}
              style={[
                styles.optionItem,
                styles.optionItemSelected
              ]}
              onPress={() => handleRemoveOther(value)}
            >
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionText,
                  styles.optionTextSelected
                ]}>
                  {value}
                </Text>
              </View>
              
              <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
              </View>
            </TouchableOpacity>
          ))}

          {/* Input para nueva opción personalizada */}
          {isAddingOther && (
            <View style={styles.addOtherInputContainer}>
              <TextInput
                style={styles.addOtherInput}
                value={newOtherValue}
                onChangeText={setNewOtherValue}
                placeholder="Escribir nueva opción"
                placeholderTextColor="#999"
                autoFocus={true}
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={20}
                onSubmitEditing={handleAddOther}
              />
              <View style={styles.addOtherActions}>
                <TouchableOpacity
                  style={styles.addOtherActionButton}
                  onPress={handleAddOther}
                  disabled={!newOtherValue.trim()}
                >
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color={newOtherValue.trim() ? "#007AFF" : "#CCC"} 
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addOtherActionButton}
                  onPress={handleCancelAddOther}
                >
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              <Text style={styles.characterCount}>
                {newOtherValue.length}/20
              </Text>
            </View>
          )}

          {/* Botón para agregar nueva opción personalizada */}
          {allowOther && canAddMore() && (
            <TouchableOpacity
              style={styles.addOtherButton}
              onPress={() => setIsAddingOther(true)}
            >
              <View style={styles.optionContent}>
                <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
                <Text style={styles.addOtherText}>
                  Agregar opción
                </Text>
              </View>
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
    marginBottom: getResponsiveSpacing(8, 10, 12),
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
    flexDirection: "row",
    alignItems: "center",
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
  circleContainer: {
    marginLeft: getResponsiveSpacing(16, 20, 24),
  },
  emptyCircle: {
    width: getResponsiveImageSize(24, 28, 32),
    height: getResponsiveImageSize(24, 28, 32),
    borderRadius: getResponsiveImageSize(12, 14, 16),
    borderWidth: 2,
    borderColor: "#CCC",
  },

  addOtherButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    borderRadius: getResponsiveSpacing(12, 16, 20),
    paddingHorizontal: getResponsivePadding(20, 25, 30),
    paddingVertical: getResponsiveSpacing(16, 20, 24),
    marginBottom: getResponsiveSpacing(12, 15, 18),
    borderWidth: 2,
    borderColor: "#007AFF",
    borderStyle: "dashed",
  },
  addOtherText: {
    fontSize: getResponsiveFontSize(16, 18, 20),
    fontWeight: "600",
    color: "#007AFF",
    marginLeft: getResponsiveSpacing(8, 10, 12),
  },
  addOtherInputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: getResponsiveSpacing(12, 16, 20),
    paddingHorizontal: getResponsivePadding(20, 25, 30),
    paddingVertical: getResponsiveSpacing(16, 20, 24),
    marginBottom: getResponsiveSpacing(12, 15, 18),
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
  },
  addOtherInput: {
    fontSize: getResponsiveFontSize(16, 18, 20),
    color: "#1A1A1A",
    paddingVertical: getResponsiveSpacing(8, 10, 12),
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: getResponsiveSpacing(12, 15, 18),
  },
  addOtherActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: getResponsiveSpacing(12, 16, 20),
  },
  addOtherActionButton: {
    padding: getResponsiveSpacing(8, 10, 12),
  },
  characterCount: {
    fontSize: getResponsiveFontSize(12, 14, 16),
    color: "#999",
    textAlign: "right",
    marginTop: getResponsiveSpacing(8, 10, 12),
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

export default EditMultiSelectionScreen;
