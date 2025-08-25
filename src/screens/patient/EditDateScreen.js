import React, { useState, useEffect } from "react";
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
import { 
  getDefaultDate, 
  isValidDateComponents, 
  formatDateToSpanish 
} from "../../utils/dateUtils";

const { width: screenWidth } = Dimensions.get('window');

const EditDateScreen = ({ navigation, route }) => {
  const { 
    field, 
    label, 
    currentValue, 
    onSave 
  } = route.params;

  // Inicializar estado con fecha por defecto o valor actual
  const initializeDate = () => {
    if (currentValue) {
      try {
        // Si es un string en formato DD/MM/AAAA
        if (typeof currentValue === 'string' && currentValue.includes('/')) {
          const [day, month, year] = currentValue.split('/').map(num => parseInt(num));
          if (day && month && year && !isNaN(day) && !isNaN(month) && !isNaN(year)) {
            return { day, month, year };
          }
        }
        
        // Si es un objeto Date
        if (currentValue instanceof Date && !isNaN(currentValue.getTime())) {
          return {
            day: currentValue.getDate(),
            month: currentValue.getMonth() + 1,
            year: currentValue.getFullYear()
          };
        }
        
        // Si es otro formato, intentar crear Date
        const date = new Date(currentValue);
        if (!isNaN(date.getTime())) {
          return {
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear()
          };
        }
      } catch (error) {
        console.log("Error parsing current date value:", error);
      }
    }
    
    const defaultDate = getDefaultDate();
    return {
      day: defaultDate.getDate(),
      month: defaultDate.getMonth() + 1,
      year: defaultDate.getFullYear()
    };
  };

  const [dateValues, setDateValues] = useState(initializeDate());
  const [error, setError] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  // Actualizar fecha formateada cuando cambien los valores
  useEffect(() => {
    if (isValidDateComponents(dateValues.day, dateValues.month, dateValues.year)) {
      const selectedDate = new Date(dateValues.year, dateValues.month - 1, dateValues.day);
      setFormattedDate(formatDateToSpanish(selectedDate));
      setError("");
    } else {
      setFormattedDate("");
      // Verificar si la fecha es demasiado reciente
      const today = new Date();
      const maxAllowedYear = today.getFullYear() - 5;
      const selectedDate = new Date(dateValues.year, dateValues.month - 1, dateValues.day);
      const maxAllowedDate = new Date(maxAllowedYear, today.getMonth(), today.getDate());
      
      if (selectedDate > maxAllowedDate) {
        setError(`La fecha no puede ser posterior a ${formatDateToSpanish(maxAllowedDate)}`);
      } else {
        setError("Fecha seleccionada inválida");
      }
    }
  }, [dateValues]);

  // Manejar cambios en los inputs
  const handleInputChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    
    setDateValues(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  // Guardar cambios
  const handleSave = () => {
    if (!isValidDateComponents(dateValues.day, dateValues.month, dateValues.year)) {
      setError("Fecha seleccionada inválida");
      return;
    }

    // Crear objeto Date para enviar
    const selectedDate = new Date(dateValues.year, dateValues.month - 1, dateValues.day);
    
    // Llamar a la función de guardado
    if (onSave) {
      onSave(field, selectedDate);
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
    return isValidDateComponents(dateValues.day, dateValues.month, dateValues.year);
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
        {/* Campo de entrada de fecha */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{label}</Text>
          
          {/* Inputs de fecha en fila */}
          <View style={styles.dateInputsContainer}>
            <View style={styles.dateInputWrapper}>
              <Text style={styles.dateInputLabel}>Día</Text>
              <TextInput
                style={[
                  styles.dateInput,
                  error ? styles.dateInputError : null
                ]}
                value={dateValues.day.toString()}
                onChangeText={(text) => handleInputChange('day', text)}
                placeholder="DD"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={2}
                autoFocus={true}
              />
            </View>

            <View style={styles.dateInputWrapper}>
              <Text style={styles.dateInputLabel}>Mes</Text>
              <TextInput
                style={[
                  styles.dateInput,
                  error ? styles.dateInputError : null
                ]}
                value={dateValues.month.toString()}
                onChangeText={(text) => handleInputChange('month', text)}
                placeholder="MM"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={2}
              />
            </View>

            <View style={styles.dateInputWrapper}>
              <Text style={styles.dateInputLabel}>Año</Text>
              <TextInput
                style={[
                  styles.dateInput,
                  error ? styles.dateInputError : null
                ]}
                value={dateValues.year.toString()}
                onChangeText={(text) => handleInputChange('year', text)}
                placeholder="AAAA"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </View>

          {/* Mensaje de error */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Fecha formateada */}
          {formattedDate && !error ? (
            <View style={styles.formattedDateContainer}>
              <Ionicons name="calendar-outline" size={20} color="#007AFF" />
              <Text style={styles.formattedDateText}>{formattedDate}</Text>
            </View>
          ) : null}


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
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  dateInputsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  dateInputWrapper: {
    flex: 1,
  },
  dateInputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  dateInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#1A1A1A",
    textAlign: "center",
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
  dateInputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
    textAlign: "center",
  },

  formattedDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    marginTop: 16,
  },
  formattedDateText: {
    fontSize: 16,
    color: "#007AFF",
    marginLeft: 8,
    fontWeight: "500",
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
      marginHorizontal: 8,
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

export default EditDateScreen;
