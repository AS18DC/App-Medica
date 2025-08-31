import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  FlatList,
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
import { usePatientProfile} from "../../context/PatientProfileContext";
import { formatDateForDisplay } from "../../utils/dateUtils";

const { width: screenWidth } = Dimensions.get('window');

const EditPatientProfile = ({ navigation }) => {
  // Obtener los datos del usuario desde el contexto
  const { patientProfile, updateProfileField, updateVerifiedField } = usePatientProfile();
  
  // Referencia para el FlatList
  const flatListRef = useRef(null);
  
  // Estado para el índice de página actual
  const [currentPage, setCurrentPage] = useState(0);

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

  // Estado para los datos en edición - usar datos del contexto
  const [editingUser, setEditingUser] = useState({
    ...patientProfile,
    ...parsePhoneNumber(patientProfile.phone)
  });

  // Estado para campos verificados 
  const [verifiedFields, setVerifiedFields] = useState(patientProfile.verifiedFields);

  // Sincronizar el estado local cuando cambie el contexto
  useEffect(() => {
    setEditingUser({
      ...patientProfile,
      ...parsePhoneNumber(patientProfile.phone)
    });
  }, [patientProfile]);

  // Función para manejar la edición de un campo
  const handleEditField = (field) => {
    // Navegar a la pantalla de edición correspondiente
    const fieldConfig = getFieldConfig(field);
    const saveFunction = verifiedFields.hasOwnProperty(field) ? handleFieldSaveWithVerification : handleFieldSave;
    const verificationFunction = verifiedFields.hasOwnProperty(field) ? handleFieldVerification : undefined;
    
    if (fieldConfig.type === 'phone') {
      navigation.navigate('EditPhoneScreen', {
        field,
        label: fieldConfig.label,
        currentValue: editingUser[field],
        onSave: saveFunction,
        onVerification: verificationFunction
      });
    } else if (fieldConfig.type === 'date') {
      navigation.navigate('EditDateScreen', {
        field,
        label: fieldConfig.label,
        currentValue: editingUser[field],
        validationRules: fieldConfig.validationRules,
        onSave: saveFunction,
        onVerification: verificationFunction
      });
    } else if (fieldConfig.type === 'email') {
      navigation.navigate('EditEmailScreen', {
        field,
        label: fieldConfig.label,
        currentValue: editingUser[field],
        onSave: saveFunction,
        onVerification: verificationFunction
      });
    } else if (fieldConfig.type === 'selection') {
      navigation.navigate('EditSelectionScreen', {
        field,
        label: fieldConfig.label,
        currentValue: editingUser[field],
        options: fieldConfig.options,
        validationRules: fieldConfig.validationRules,
        allowOther: fieldConfig.allowOther || false,
        onSave: saveFunction,
        onVerification: verificationFunction
      });
    } else if (fieldConfig.type === 'multiSelection') {
      navigation.navigate('EditMultiSelectionScreen', {
        field,
        label: fieldConfig.label,
        currentValue: editingUser[field],
        options: fieldConfig.options,
        validationRules: fieldConfig.validationRules,
        allowOther: fieldConfig.allowOther || false,
        maxSelections: fieldConfig.maxSelections || null,
        uniqueOptions: fieldConfig.uniqueOptions || [],
        onSave: saveFunction,
        onVerification: verificationFunction
      });
    } else {
      navigation.navigate('EditFieldScreen', {
        field,
        label: fieldConfig.label,
        currentValue: editingUser[field],
        placeholder: fieldConfig.placeholder,
        keyboardType: fieldConfig.keyboardType,
        maxLength: fieldConfig.maxLength,
        minLength: fieldConfig.minLength,
        validationRules: fieldConfig.validationRules,
        onSave: saveFunction,
        onVerification: verificationFunction
      });
    }
  };

  // Función para guardar cambios de un campo individual
  const handleFieldSave = (field, value) => {
    // Actualizar el estado local
    setEditingUser(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Actualizar el contexto global
    updateProfileField(field, value);
  };

  // Función para guardar cambios de un campo individual que requiere verificación
  const handleFieldSaveWithVerification = (field, value) => {
    // Actualizar el estado local
    handleFieldSave(field, value);

    // Desmarcar el campo como verificado
    setVerifiedFields(prev => ({
      ...prev,
      [field]: false
    }));

    // Actualizar el contexto global
    updateVerifiedField(field, false);
  };

  const handleFieldVerification = (field, isVerified) => {
    // Actualizar el estado de verificación
    setVerifiedFields(prev => ({
      ...prev,
      [field]: isVerified
    }));

    // Actualizar el contexto global
    updateVerifiedField(field, isVerified);
  };

  // Configuración de campos editables
  const getFieldConfig = (field) => {
    const configs = {
      email: {
        type: 'email',
        label: 'Correo',
      },
      phone: {
        type: 'phone',
        label: 'Teléfono',
      },
      city: {
        type: 'selection',
        label: 'Ciudad',
        options: venezuelanCities.map(city => ({
          value: city,
          label: city
        })),
        validationRules: {
          required: true,
          info: 'Selecciona la ciudad donde resides actualmente. Esta información es importante para coordinar citas y servicios médicos.'
        },
        allowOther: true
      },
      gender: {
        type: 'selection',
        label: 'Sexo',
        options: [
          { value: 'Masculino', label: 'Masculino' },
          { value: 'Femenino', label: 'Femenino' }
        ],
        validationRules: {
          required: true,
          info: 'Selecciona tu identidad de género. Esta información es importante para proporcionar atención médica personalizada y respetuosa.'
        },
        allowOther: false
      },
      height: {
        type: 'input',
        label: 'Altura (cm)',
        placeholder: 'Ej: 170',
        keyboardType: 'numeric',
        maxLength: 3,
        minLength: 2,
        validationRules: {
          required: true,
          minLength: 2,
          maxLength: 3,
          range: { min: 50, max: 250 },
          info: 'La altura es la medida desde la base de los pies hasta la parte superior de la cabeza. Debe estar entre 50 y 250 centímetros para ser válida.'
        }
      },
      weight: {
        type: 'input',
        label: 'Peso (kg)',
        placeholder: 'Ej: 70.5',
        keyboardType: 'numeric',
        maxLength: 5,
        minLength: 2,
        validationRules: {
          required: true,
          minLength: 2,
          maxLength: 5,
          range: { min: 20, max: 300 },
          info: 'El peso corporal se mide en kilogramos. Debe estar entre 20 y 300 kg para ser considerado válido.'
        }
      },
      bloodType: {
        type: 'selection',
        label: 'Grupo sanguíneo',
        options: [
          { value: 'A+', label: 'A+' },
          { value: 'A-', label: 'A-' },
          { value: 'B+', label: 'B+' },
          { value: 'B-', label: 'B-' },
          { value: 'AB+', label: 'AB+' },
          { value: 'AB-', label: 'AB-' },
          { value: 'O+', label: 'O+' },
          { value: 'O-', label: 'O-' }
        ],
        validationRules: {
          required: true,
          info: 'Tu grupo sanguíneo es importante en caso de emergencias médicas o transfusiones.'
        },
        allowOther: false
      },
      allergies: {
        type: 'multiSelection',
        label: 'Alergias',
        options: [
          { value: 'Ninguna', label: 'Ninguna' },
          { value: 'Penicilina', label: 'Penicilina' },
          { value: 'Aspirina', label: 'Aspirina' },
          { value: 'Ibuprofeno', label: 'Ibuprofeno' },
          { value: 'Látex', label: 'Látex' },
          { value: 'Polen', label: 'Polen' },
          { value: 'Ácaros', label: 'Ácaros' },
          { value: 'Mariscos', label: 'Mariscos' },
          { value: 'Frutos secos', label: 'Frutos secos' },
          { value: 'Huevos', label: 'Huevos' },
          { value: 'Leche', label: 'Leche' },
          { value: 'Gluten', label: 'Gluten' }
        ],
        validationRules: {
          required: true,
          minSelections: 1,
          maxSelections: 15,
          info: 'Informa sobre cualquier alergia que tengas para evitar reacciones adversas durante tratamientos médicos.'
        },
        allowOther: true,
        maxSelections: 15,
        uniqueOptions: ['Ninguna'] // 'Ninguna' es exclusiva
      },
      disability: {
        type: 'multiSelection',
        label: 'Discapacidad',
        options: [
          { value: 'Ninguna', label: 'Ninguna' },
          { value: 'Visual', label: 'Visual' },
          { value: 'Auditiva', label: 'Auditiva' },
          { value: 'Motora', label: 'Motora' },
          { value: 'Intelectual', label: 'Intelectual' },
          { value: 'Psicosocial', label: 'Psicosocial' },
          { value: 'Múltiple', label: 'Múltiple' }
        ],
        validationRules: {
          required: true,
          minSelections: 1,
          maxSelections: 10,
          info: 'Esta información ayuda a adaptar la atención médica y garantizar accesibilidad en nuestros servicios.'
        },
        allowOther: true,
        maxSelections: 10,
        uniqueOptions: ['Ninguna'] // 'Ninguna' es exclusiva
      }
    };

    return configs[field] || { type: 'input', label: field };
  };

  // Función para renderizar un item del menú de solo lectura
  const renderReadOnlyMenuItem = (field, label, icon) => {
    // Campos que muestran indicador de verificación
    const showVerificationIcon = verifiedFields.hasOwnProperty(field);

    return (
      <View style={styles.menuItemContainer}>
        {showVerificationIcon && renderVerificationIcon(field)}
        <View style={[styles.menuItem, styles.menuItemReadOnly]}>
          <View style={[styles.menuItemLeft, showVerificationIcon && styles.menuItemLeftVerify]}>
            <View style={styles.menuItemIcon}>
              <Ionicons name={icon} size={20} color="#999" />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemLabel}>{label}</Text>
              <Text style={styles.menuItemValue}>
                {getFieldDisplayValue(field, editingUser[field])}
              </Text>
            </View>
          </View>
          <View style={styles.menuItemRight}>
            <Text style={styles.readOnlyText}>Solo lectura</Text>
          </View>
        </View>
      </View>
    );
  };

  // Función para obtener el valor de visualización de un campo
  const getFieldDisplayValue = (field, value) => {
    // Campo de teléfono
    if (field === 'phone') {
      return `${editingUser.areaCode} ${editingUser.phoneNumber}`;
    }
    
    // Campo de fecha de nacimiento
    if (field === 'birthDate' && value) {
      return formatDateForDisplay(value, 'long');
    }
    
    // Campos de selección múltiple (alergias, discapacidad)
    if (field === 'allergies' || field === 'disability') {
      return getMultiSelectionDisplayValue(value);
    }
    
    // Campos de texto normales
    if (value) {
      return String(value);
    }
    
    // Valor por defecto
    return "No especificado";
  };

  // Función para obtener el valor de visualización de selecciones múltiples
  const getMultiSelectionDisplayValue = (selections) => {
    if (!Array.isArray(selections) || selections.length === 0) {
      return "No especificado";
    }
    
    if (selections.length === 1) {
      return selections[0];
    }
    
    if (selections.length <= 3) {
      return selections.join(', ');
    }
    
    return `${selections.length} seleccionadas`;
  };

  // Función para renderizar el indicador de verificación
  const renderVerificationIcon = (field) => {
    const isVerified = verifiedFields[field];
    
    return (
      <View style={[
        styles.verificationIcon      
        ]}>
        <Ionicons 
          name={isVerified ? "shield-checkmark" : "shield-outline"} 
          size={getResponsiveFontSize(20, 25, 30)} 
          color={isVerified ? "#34C759" : "#999"} 
        />
      </View>
    );
  };

  // Función para renderizar un item del menú editable
  const renderMenuItem = (field, label, icon) => {
    // Campos que muestran indicador de verificación
    const showVerificationIcon = verifiedFields.hasOwnProperty(field);

    return (
      <View style={styles.menuItemContainer}>
        {showVerificationIcon && renderVerificationIcon(field)}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => handleEditField(field)}
        >
          <View style={[styles.menuItemLeft, showVerificationIcon && styles.menuItemLeftVerify]}>
            <View style={styles.menuItemIcon}>
              <Ionicons name={icon} size={20} color="#666" />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemLabel}>{label}</Text>
              <Text style={styles.menuItemValue}>
                {getFieldDisplayValue(field, editingUser[field])}
              </Text>
            </View>
          </View>
          <View style={styles.menuItemRight}>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Función para renderizar la página de Datos de Perfil
  const renderProfilePage = () => (
    <View style={styles.pageContainer}>
      <View 
        contentContainerStyle={styles.pageContentContainer}
 
      >
        {/* User Image Section - Ahora hace scroll */}
        <View style={styles.imageSection}>
          <Image source={{ uri: editingUser.image }} style={styles.userImage} />
          <TouchableOpacity style={styles.changeImageButton}>
            <Ionicons name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.changeImageText}>Cambiar foto</Text>
          </TouchableOpacity>
        </View>

        {/* Línea superior sutil */}
        <View style={styles.sectionDivider} />

        {/* Sección: Datos de Perfil */}
        <View style={styles.menuSection}>
          {renderReadOnlyMenuItem('name', 'Nombre completo', 'person-outline')}
          {renderReadOnlyMenuItem('cardId', 'Cédula de identidad', 'card-outline')}
          {renderMenuItem('email', 'Email', 'mail-outline')}
          {renderMenuItem('phone', 'Teléfono', 'call-outline')}
          {renderMenuItem('city', 'Ciudad', 'location-outline')}
        </View>
      </View>
    </View>
  );

  // Función para renderizar la página de Datos Médicos
  const renderMedicalPage = () => (
    <View style={styles.pageContainer}>
      <View 
        contentContainerStyle={styles.pageContentContainer}
      >
        {/* Sección: Datos Médicos */}
        <View style={styles.menuSection}>
          {renderReadOnlyMenuItem('birthDate', 'Fecha de nacimiento', 'calendar-outline')}
          {renderMenuItem('gender', 'Sexo', 'person-outline')}
          {renderMenuItem('height', 'Altura (cm)', 'resize-outline')}
          {renderMenuItem('weight', 'Peso (kg)', 'scale-outline')}
          {renderMenuItem('bloodType', 'Grupo sanguíneo', 'water-outline')}
          {renderMenuItem('allergies', 'Alergias', 'warning-outline')}
          {renderMenuItem('disability', 'Discapacidad', 'accessibility-outline')}
        </View>
      </View>
    </View>
  );

  // Datos para el FlatList
  const carouselData = [
    { id: 'profile', render: renderProfilePage },
    { id: 'medical', render: renderMedicalPage }
  ];

  // Función para renderizar cada página del carrusel
  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselItem}>
      {item.render()}
    </View>
  );

  // Función para manejar el cambio de página
  const handlePageChange = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const itemWidth = isWeb ? (isDesktopScreen() ? 1000 : isTabletScreen() ? 800 : screenWidth) : screenWidth;
    const page = Math.round(contentOffset / itemWidth);
    setCurrentPage(page);
  };

  // Indicadores de página mejorados
  const renderPageIndicators = () => (
    <View style={styles.pageIndicators}>
      {carouselData.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.pageIndicator
          ]}
          onPress={() => {
            flatListRef.current?.scrollToIndex({ index, animated: true });
          }}
        >
          <Text style={[
            styles.pageIndicatorText,
            currentPage === index && styles.pageIndicatorTextActive
          ]}>
            {item.id === 'profile' ? 'Información personal' : 'Datos médicos'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View 
        style={styles.mainScrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainScrollContent}
      >
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

        {/* Indicadores de página - Ahora en la parte superior */}
        {renderPageIndicators()}

        {/* Carrusel horizontal - SOLO para las secciones de datos */}
        <ScrollView style={styles.carouselContainer} showsVerticalScrollIndicator={false}>
          <FlatList
            ref={flatListRef}
            data={carouselData}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handlePageChange}
            onScroll={handlePageChange}
            getItemLayout={(data, index) => ({
              length: isWeb ? (isDesktopScreen() ? 1000 : isTabletScreen() ? 800 : screenWidth) : screenWidth,
              offset: (isWeb ? (isDesktopScreen() ? 1000 : isTabletScreen() ? 800 : screenWidth) : screenWidth) * index,
              index,
            })}
            style={styles.carousel}
            scrollEnabled={true}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: getResponsivePadding(20, 30, 40),
    paddingTop: getResponsiveSpacing(20, 25, 30),
    paddingBottom: getResponsiveSpacing(10, 15, 20),
    marginBottom: 5,
  },
  backButton: {
    padding: getResponsiveSpacing(8, 10, 12),
  },
  title: {
    fontSize: getResponsiveFontSize(20, 24, 28),
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  placeholder: {
    width: getResponsiveSpacing(40, 50, 60),
  },
  imageSection: {
    alignItems: "center",
    paddingVertical: getResponsiveSpacing(20, 25, 30),
    paddingHorizontal: getResponsivePadding(20, 30, 40),
    marginBottom: getResponsiveSpacing(10, 15, 20),
  },
  userImage: {
    width: getResponsiveImageSize(80, 100, 120),
    height: getResponsiveImageSize(80, 100, 120),
    borderRadius: getResponsiveImageSize(40, 50, 60),
    marginBottom: getResponsiveSpacing(12, 15, 18),
  },
  changeImageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: getResponsiveSpacing(12, 16, 20),
    paddingVertical: getResponsiveSpacing(6, 8, 10),
    borderRadius: getResponsiveSpacing(16, 20, 24),
  },
  changeImageText: {
    color: "#FFFFFF",
    fontSize: getResponsiveFontSize(12, 14, 16),
    fontWeight: "500",
    marginLeft: getResponsiveSpacing(6, 8, 10),
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: getResponsivePadding(20, 30, 40),
    marginVertical: getResponsiveSpacing(8, 12, 16),
  },
  mainScrollView: {
    flex: 1,
    width: '100%',
    ...(isWeb && {
      maxWidth: isDesktopScreen() ? 1200 : isTabletScreen() ? 900 : '100%',
      margin: '0 auto',
    }),
  },
  mainScrollContent: {
    flexGrow: 1,
    paddingBottom: getResponsiveSpacing(10, 15, 20),
    width: '100%',
    ...(isWeb && {
      alignItems: 'center',
    }),
  },
  carouselContainer: {
    height: 'auto',
    position: 'relative',
    width: '100%',
    ...(isWeb && {
      maxWidth: isDesktopScreen() ? 1000 : isTabletScreen() ? 800 : '100%',
      margin: '0 auto',
      alignSelf: 'center',
    }),
  },
  carousel: {
    height: '100%',
    width: '100%',
  },
  carouselItem: {
    width: isWeb ? (isDesktopScreen() ? 1000 : isTabletScreen() ? 800 : screenWidth) : screenWidth,
    height: '100%',
    alignSelf: 'center',
  },
  pageContainer: {
    height: '100%',
    paddingHorizontal: getResponsivePadding(20, 30, 40),
    paddingTop: getResponsiveSpacing(16, 20, 24),
    paddingBottom: getResponsiveSpacing(20, 30, 40),
    width: '100%',
    ...(isWeb && {
      maxWidth: isDesktopScreen() ? 1000 : isTabletScreen() ? 800 : '100%',
      margin: '0 auto',
      alignSelf: 'center',
    }),
  },
  pageContentContainer: {
    paddingBottom: getResponsiveSpacing(20, 30, 40),
    flexGrow: 1,
  },
  menuSection: {
    marginBottom: getResponsiveSpacing(10, 15, 20),
    paddingBottom: getResponsiveSpacing(10, 15, 20),
  },
  menuItemContainer: {
    position: "relative",
    marginBottom: getResponsiveSpacing(10, 15, 20),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: getResponsiveSpacing(12, 16, 20),
    paddingHorizontal: getResponsivePadding(16, 20, 24),
    paddingVertical: getResponsiveSpacing(14, 18, 22),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    ...(isWeb && webStyles.menuItem),
  },
  menuItemLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemLeftVerify: {
    marginLeft: getResponsiveSpacing(20, 25, 30),
  },
  menuItemIcon: {
    width: getResponsiveImageSize(40, 50, 60),
    height: getResponsiveImageSize(40, 50, 60),
    borderRadius: getResponsiveImageSize(20, 25, 30),
    backgroundColor: "#F0F8FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: getResponsiveSpacing(16, 20, 24),
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: getResponsiveFontSize(16, 18, 20),
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: getResponsiveSpacing(4, 6, 8),
  },
  menuItemValue: {
    fontSize: getResponsiveFontSize(14, 16, 18),
    color: "#666",
  },
  menuItemRight: {
    marginLeft: getResponsiveSpacing(16, 20, 24),
  },
  verificationIcon: {
    position: "absolute",
    top: getResponsiveSpacing(12, 15, 18),
    left: getResponsiveSpacing(8, 10, 12),
    zIndex: 1,
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: getResponsiveSpacing(12, 16, 20),
    paddingHorizontal: getResponsivePadding(20, 30, 40),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pageIndicator: {
    paddingHorizontal: getResponsiveSpacing(16, 20, 24),
    paddingVertical: getResponsiveSpacing(8, 10, 12),
    marginHorizontal: getResponsiveSpacing(6, 8, 10),
    borderRadius: getResponsiveSpacing(16, 20, 24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageIndicatorText: {
    fontSize: getResponsiveFontSize(16, 18, 20),
    fontWeight: '500',
    color: '#666666',
  },
  pageIndicatorTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  menuItemReadOnly: {
    opacity: 0.7,
    backgroundColor: '#F8F9FA',
  },
  readOnlyText: {
    fontSize: getResponsiveFontSize(12, 14, 16),
    color: '#999999',
    fontStyle: 'italic',
  }
});

export default EditPatientProfile;