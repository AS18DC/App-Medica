import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { isWeb, webStyles, getResponsiveLayout } from "../../utils/responsive";

const { width: screenWidth } = Dimensions.get('window');

const EditPatientProfile = ({ navigation, route }) => {
  // Obtener los datos del usuario desde la navegación o usar datos por defecto
  const userData = route.params?.userData || {
    name: "Maria González",
    email: "maria.gonzalez@email.com",
    phone: "+34 612345678",
    membershipDate: "Enero 2024",
    image: "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ="
  };

  // Referencia para el FlatList
  const flatListRef = useRef(null);

  // Separar el teléfono en código de área y número
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

  // Ciudades de Venezuela
  const venezuelanCities = [
    'Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay',
    'Ciudad Guayana', 'Maturín', 'Barcelona', 'San Cristóbal', 'Cumana',
    'Mérida', 'Barinas', 'Puerto La Cruz', 'Acarigua', 'Los Teques',
    'Punto Fijo', 'Guanare', 'Trujillo', 'La Guaira', 'El Tigre',
    'Ocumare del Tuy', 'Carúpano', 'Coro', 'La Victoria', 'Tinaquillo',
    'San Fernando de Apure', 'San Carlos', 'San Felipe', 'La Asunción',
    'Porlamar', 'Puerto Ayacucho', 'San Juan de los Morros', 'Tucupita'
  ];

  // Estado para los datos en edición
  const [editingUser, setEditingUser] = useState({
    ...userData,
    ...parsePhoneNumber(userData.phone),
    city: userData.city || 'Caracas',
    birthDate: userData.birthDate || '',
    gender: userData.gender || '',
    height: userData.height || '',
    weight: userData.weight || ''
  });

  // Estado para validaciones en tiempo real
  const [errors, setErrors] = useState({});
  
  // Estado para controlar el dropdown de ciudades
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Estado para el índice actual del carrusel
  const [currentIndex, setCurrentIndex] = useState(0);

  // Validar campos al cargar la pantalla
  useEffect(() => {
    const initialErrors = {};
    Object.keys(editingUser).forEach((field) => {
      if (
        field !== "membershipDate" &&
        field !== "image" &&
        field !== "phone"
      ) {
        const validation = validateField(field, editingUser[field]);
        if (!validation.isValid) {
          initialErrors[field] = validation.errorMessage;
        }
      }
    });
    setErrors(initialErrors);
  }, []);

  // Cerrar dropdown de ciudades cuando se toque fuera
  useEffect(() => {
    const handleTouchOutside = () => {
      if (showCityDropdown) {
        setShowCityDropdown(false);
      }
    };

    // Agregar listener para cerrar dropdown
    return () => {
      // Cleanup
    };
  }, [showCityDropdown]);

  // Función para validar un campo específico
  const validateField = (field, value) => {
    let isValid = true;
    let errorMessage = "";

    switch (field) {
      case "name":
        if (!value.trim()) {
          isValid = false;
          errorMessage = "El nombre es obligatorio";
        } else if (value.length > 30) {
          isValid = false;
          errorMessage = "El nombre no puede exceder 30 caracteres";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          isValid = false;
          errorMessage = "El nombre solo puede contener letras y espacios";
        }
        break;
      case "email":
        if (!value.trim()) {
          isValid = false;
          errorMessage = "El email es obligatorio";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          isValid = false;
          errorMessage = "Ingresa un email válido";
        }
        break;
      case "areaCode":
        if (!value.trim()) {
          isValid = false;
          errorMessage = "El código de área es obligatorio";
        } else if (!/^\+\d{1,4}$/.test(value)) {
          isValid = false;
          errorMessage =
            "El código de área debe empezar con + seguido de 1 a 4 números";
        }
        break;
      case "phoneNumber":
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
        break;
      case "city":
        if (!value.trim()) {
          isValid = false;
          errorMessage = "La ciudad es obligatoria";
        }
        break;
      case "birthDate":
        if (!value.trim()) {
          isValid = false;
          errorMessage = "La fecha de nacimiento es obligatoria";
        }
        break;
      case "gender":
        if (!value.trim()) {
          isValid = false;
          errorMessage = "El sexo es obligatorio";
        }
        break;
      case "height":
        if (!value.trim()) {
          isValid = false;
          errorMessage = "La altura es obligatoria";
        } else if (!/^\d+(\.\d+)?$/.test(value)) {
          isValid = false;
          errorMessage = "La altura debe ser un número válido";
        } else if (parseFloat(value) < 50 || parseFloat(value) > 250) {
          isValid = false;
          errorMessage = "La altura debe estar entre 50 y 250 cm";
        }
        break;
      case "weight":
        if (!value.trim()) {
          isValid = false;
          errorMessage = "El peso es obligatorio";
        } else if (!/^\d+(\.\d+)?$/.test(value)) {
          isValid = false;
          errorMessage = "El peso debe ser un número válido";
        } else if (parseFloat(value) < 20 || parseFloat(value) > 300) {
          isValid = false;
          errorMessage = "El peso debe estar entre 20 y 300 kg";
        }
        break;
      default:
        break;
    }

    return { isValid, errorMessage };
  };

  // Función para actualizar un campo específico
  const updateField = (field, value) => {
    setEditingUser((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validar el campo en tiempo real
    const validation = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: validation.isValid ? null : validation.errorMessage,
    }));
  };

  // Función para verificar si hay errores
  const hasErrors = () => {
    return Object.values(errors).some((error) => error !== null);
  };

  // Función para verificar si todos los campos están completos
  const isFormComplete = () => {
    return (
      editingUser.name.trim() &&
      editingUser.email.trim() &&
      editingUser.areaCode.trim() &&
      editingUser.phoneNumber.trim() &&
      editingUser.city.trim() &&
      editingUser.birthDate.trim() &&
      editingUser.gender.trim() &&
      editingUser.height.trim() &&
      editingUser.weight.trim()
    );
  };

  // Función para guardar los cambios
  const handleSave = () => {
    // Verificar si hay errores o campos incompletos
    if (hasErrors() || !isFormComplete()) {
      Alert.alert(
        "Error",
        "Por favor corrige todos los errores antes de guardar"
      );
      return;
    }

    // Combinar el código de área y número de teléfono
    const userDataToSave = {
      ...editingUser,
      phone: `${editingUser.areaCode} ${editingUser.phoneNumber}`,
    };

    // Aquí normalmente enviarías los datos al servidor
    // Por ahora solo mostramos un mensaje de éxito
    Alert.alert("Éxito", "Información actualizada correctamente", [
      {
        text: "OK",
        onPress: () => {
          // Pasar los datos actualizados de vuelta a la pantalla anterior
          navigation.navigate("PatientProfileMain", {
            updatedUser: userDataToSave,
          });
        },
      },
    ]);
  };

  // Función para cancelar la edición
  const handleCancel = () => {
    navigation.goBack();
  };

  // Función para manejar el cambio de página
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  // Función para cambiar de página manualmente
  const goToPage = (index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  // Renderizar la primera pantalla (Información básica)
  const renderBasicInfoScreen = () => (
    <ScrollView 
      style={styles.screenContainer} 
      contentContainerStyle={styles.screenContentContainer}
      showsVerticalScrollIndicator={false}
    >
      
      {/* Nombre */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Nombre completo *</Text>
        <View
          style={[
            styles.inputContainer,
            errors.name ? styles.inputContainerError : null,
          ]}
        >
          <Ionicons
            name="person-outline"
            size={20}
            color={errors.name ? "#FF3B30" : "#666"}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.textInput}
            value={editingUser.name}
            onChangeText={(text) => updateField("name", text)}
            placeholder="Ingresa tu nombre completo"
            placeholderTextColor="#999"
            autoCapitalize="words"
            maxLength={30}
          />
        </View>
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email *</Text>
        <View
          style={[
            styles.inputContainer,
            errors.email ? styles.inputContainerError : null,
          ]}
        >
          <Ionicons
            name="mail-outline"
            size={20}
            color={errors.email ? "#FF3B30" : "#666"}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.textInput}
            value={editingUser.email}
            onChangeText={(text) => updateField("email", text)}
            placeholder="Ingresa tu email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {errors.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}
      </View>

      {/* Teléfono */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Número de teléfono *</Text>
        <View style={styles.phoneInputRow}>
          {/* Input para código de país */}
          <View
            style={[
              styles.countryCodeContainer,
              errors.areaCode ? styles.inputContainerError : null,
            ]}
          >
            <TextInput
              style={styles.countryCodeInput}
              value={editingUser.areaCode}
              onChangeText={(text) => updateField("areaCode", text)}
              placeholder="+58"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={5}
            />
          </View>

          {/* Input para número de teléfono */}
          <View
            style={[
              styles.phoneNumberContainer,
              errors.phoneNumber ? styles.inputContainerError : null,
            ]}
          >
            <TextInput
              style={styles.textInput}
              value={editingUser.phoneNumber}
              onChangeText={(text) => updateField("phoneNumber", text)}
              placeholder="Ingresa tu número"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={14}
            />
          </View>
        </View>

        {/* Mostrar errores */}
        {(errors.areaCode || errors.phoneNumber) && (
          <Text style={styles.errorText}>
            {errors.areaCode || errors.phoneNumber}
          </Text>
        )}
      </View>

      {/* Ciudad */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Ciudad *</Text>
        <View
          style={[
            styles.inputContainer,
            errors.city ? styles.inputContainerError : null,
          ]}
        >
          <TouchableOpacity
            style={styles.cityDropdownButton}
            onPress={() => setShowCityDropdown(!showCityDropdown)}
          >
            <Ionicons
              name="location-outline"
              size={20}
              color={errors.city ? "#FF3B30" : "#666"}
              style={styles.inputIcon}
            />
            <Text style={styles.cityDropdownText}>
              {editingUser.city || "Selecciona tu ciudad"}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
        </View>
        
        {/* Dropdown de ciudades */}
        {showCityDropdown && (
          <View style={styles.cityDropdownContainer}>
            {venezuelanCities.map((city, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.cityDropdownItem,
                  editingUser.city === city && styles.cityDropdownItemSelected
                ]}
                onPress={() => {
                  updateField("city", city);
                  setShowCityDropdown(false);
                }}
              >
                <Text style={[
                  styles.cityDropdownItemText,
                  editingUser.city === city && styles.cityDropdownItemTextSelected
                ]}>
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
      </View>

    </ScrollView>
  );

  // Renderizar la segunda pantalla (Información adicional)
  const renderAdditionalInfoScreen = () => (
    <ScrollView 
      style={styles.screenContainer} 
      contentContainerStyle={styles.screenContentContainer}
      showsVerticalScrollIndicator={false}
    >

      {/* Fecha de nacimiento */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Fecha de nacimiento *</Text>
        <View
          style={[
            styles.inputContainer,
            errors.birthDate ? styles.inputContainerError : null,
          ]}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={errors.birthDate ? "#FF3B30" : "#666"}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.textInput}
            value={editingUser.birthDate}
            onChangeText={(text) => updateField("birthDate", text)}
            placeholder="DD/MM/AAAA"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
        {errors.birthDate && (
          <Text style={styles.errorText}>{errors.birthDate}</Text>
        )}
      </View>

      {/* Sexo */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Sexo *</Text>
        <View
          style={[
            styles.inputContainer,
            errors.gender ? styles.inputContainerError : null,
          ]}
        >
          <Ionicons
            name="person-outline"
            size={20}
            color={errors.gender ? "#FF3B30" : "#666"}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.textInput}
            value={editingUser.gender}
            onChangeText={(text) => updateField("gender", text)}
            placeholder="Masculino, Femenino u Otro"
            placeholderTextColor="#999"
            autoCapitalize="words"
          />
        </View>
        {errors.gender && (
          <Text style={styles.errorText}>{errors.gender}</Text>
        )}
      </View>

      {/* Altura */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Altura (cm) *</Text>
        <View
          style={[
            styles.inputContainer,
            errors.height ? styles.inputContainerError : null,
          ]}
        >
          <Ionicons
            name="resize-outline"
            size={20}
            color={errors.height ? "#FF3B30" : "#666"}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.textInput}
            value={editingUser.height}
            onChangeText={(text) => updateField("height", text)}
            placeholder="Ej: 170"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
        {errors.height && (
          <Text style={styles.errorText}>{errors.height}</Text>
        )}
      </View>

      {/* Peso */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Peso (kg) *</Text>
        <View
          style={[
            styles.inputContainer,
            errors.weight ? styles.inputContainerError : null,
          ]}
        >
          <Ionicons
            name="scale-outline"
            size={20}
            color={errors.weight ? "#FF3B30" : "#666"}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.textInput}
            value={editingUser.weight}
            onChangeText={(text) => updateField("weight", text)}
            placeholder="Ej: 70.5"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={6}
          />
        </View>
        {errors.weight && (
          <Text style={styles.errorText}>{errors.weight}</Text>
        )}
      </View>
    </ScrollView>
  );

  // Datos para el carrusel
  const carouselData = [
    { id: 'basic', render: renderBasicInfoScreen },
    { id: 'additional', render: renderAdditionalInfoScreen }
  ];

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
        <Text style={styles.title}>Editar Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      {/* User Image Section */}
      <View style={styles.imageSection}>
        <Image source={{ uri: editingUser.image }} style={styles.userImage} />
        <TouchableOpacity style={styles.changeImageButton}>
          <Ionicons name="camera" size={20} color="#FFFFFF" />
          <Text style={styles.changeImageText}>Cambiar foto</Text>
        </TouchableOpacity>
      </View>

      {/* Línea superior sutil */}
      <View style={styles.sectionDivider} />

      {/* Carrusel de formularios */}
      <View style={styles.carouselContainer}>
        {/* Título de sección activa con navegación */}
        <View style={styles.sectionTitles}>
          {currentIndex === 0 ? (
            <TouchableOpacity
              style={styles.sectionTitle}
              onPress={() => goToPage(1)}
            >
              <Text style={styles.sectionTitleText}>Perfil</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.sectionTitle}
              onPress={() => goToPage(0)}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color="#999"
              />
              <Text style={styles.sectionTitleText}>Datos Médicos</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* FlatList horizontal para el carrusel */}
        <FlatList
          ref={flatListRef}
          data={carouselData}
          renderItem={({ item }) => (
            <View style={styles.carouselItem}>
              {item.render()}
            </View>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          getItemLayout={(data, index) => ({
            length: screenWidth - 20,
            offset: (screenWidth - 20) * index,
            index,
          })}
        />
      </View>

      {/* Línea inferior sutil */}
      <View style={styles.sectionDivider} />

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            hasErrors() || !isFormComplete()
              ? styles.saveButtonDisabled
              : null,
          ]}
          onPress={handleSave}
          disabled={hasErrors() || !isFormComplete()}
        >
          <Ionicons
            name="checkmark"
            size={20}
            color={hasErrors() || !isFormComplete() ? "#999" : "#007AFF"}
            />
                      <Text
              style={[
                styles.saveButtonText,
                hasErrors() || !isFormComplete()
                  ? styles.saveButtonTextDisabled
                  : null,
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
  imageSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  changeImageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeImageText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  carouselContainer: {
    height: isWeb ? 'auto' : 380,
    marginBottom: 15,
    ...(isWeb && {
      maxWidth: 800,
      margin: '0 auto',
      padding: '10px',
    }),
  },
  sectionTitles: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 0,
    borderRadius: 8,
    backgroundColor: "transparent",
    gap: 8,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 20,
    marginVertical: 8,
  },
  carouselItem: {
    width: isWeb ? 600 : screenWidth - 20,
    paddingHorizontal: isWeb ? 5 : 10,
    ...(isWeb && {
      margin: '0 auto',
      display: 'block',
    }),
  },
  screenContainer: {
    height: isWeb ? 'auto' : 450,
    paddingBottom: 20,
    ...(isWeb && {
      minHeight: 400,
      padding: '20px',
    }),
  },
  screenContentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: isWeb ? 5 : 10,
    ...(isWeb && {
      width: '100%',
      maxWidth: 400,
    }),
  },
  inputGroup: {
    marginBottom: 16,
    width: '100%',
    ...(isWeb && {
      maxWidth: 400,
      margin: '0 auto 16px auto',
    }),
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
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
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
  },
  inputContainerError: {
    borderColor: "#FF3B30",
    borderWidth: 1,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  phoneInputRow: {
    flexDirection: "row",
    gap: 12,
    width: '100%',
    ...(isWeb && {
      maxWidth: 500,
      margin: '0 auto',
    }),
  },
  countryCodeContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 11,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: isWeb ? 60 : 70,
    justifyContent: "center",
  },
  countryCodeInput: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
    minWidth: isWeb ? 40 : 50,
  },
  phoneNumberContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cityDropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cityDropdownText: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    marginLeft: 12,
  },
  cityDropdownContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
    maxHeight: 200,
  },
  cityDropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  cityDropdownItemSelected: {
    backgroundColor: "#F0F8FF",
  },
  cityDropdownItemText: {
    fontSize: 14,
    color: "#1A1A1A",
  },
  cityDropdownItemTextSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 18,
    gap: 12,
    minHeight: 60,
    marginBottom: isWeb ? 80 : 20,
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

export default EditPatientProfile;

