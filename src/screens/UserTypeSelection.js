// --Imports de React y React Native--
// {{importa React y componentes básicos de React Native}}
import React from 'react';
// --Imports de componentes de React Native--
// {{importa View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image y ScrollView}}
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
// --Import de iconos--
// {{importa Ionicons de la librería de iconos de Expo}}
import { Ionicons } from '@expo/vector-icons';
// --Import de utilidades responsivas--
// {{importa funciones para hacer la interfaz responsiva en web, móvil y tablet}}
import { isWeb, isMobileScreen, isTabletScreen, isDesktopScreen, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../utils/responsive';

// --Componente UserTypeSelection--
// {{pantalla de selección del tipo de usuario para determinar la navegación}}
const UserTypeSelection = ({ navigation }) => {
  // --Función de selección de tipo de usuario--
  // {{maneja la navegación según el tipo de usuario seleccionado}}
  const handleUserTypeSelection = (userType) => {
    switch (userType) {
      case 'patient':
        navigation.navigate('PatientNavigator');
        break;
      case 'doctor':
        navigation.navigate('DoctorNavigator');
        break;
      case 'clinic':
        navigation.navigate('ClinicNavigator');
        break;
    }
  };

  // --Tipos de usuario disponibles--
  // {{lista de opciones con información, iconos y colores para cada tipo}}
  const userTypes = [
    {
      id: 'patient',
      title: 'Paciente',
      description: 'Busca doctores y agenda citas',
      icon: 'person',
      color: '#007AFF',
      gradient: ['#007AFF', '#0056CC'],
    },
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Gestiona citas y pacientes',
      icon: 'medical',
      color: '#34C759',
      gradient: ['#34C759', '#28A745'],
    },
    {
      id: 'clinic',
      title: 'Clínica',
      description: 'Administra doctores y servicios',
      icon: 'business',
      color: '#FF9500',
      gradient: ['#FF9500', '#E67E00'],
    },
  ];

  // --Función de renderizado de tarjeta de tipo de usuario--
  // {{renderiza una tarjeta individual con icono, título y descripción responsiva}}
  const renderUserTypeCard = (userType) => (
    <TouchableOpacity
      key={userType.id}
      style={[
        styles.option,
        isWeb && styles.webOption,
        isWeb && webStyles.card,
        isWeb && webStyles.button,
      ]}
      onPress={() => handleUserTypeSelection(userType.id)}
    >
      {/* --Contenedor del icono-- */}
      {/* {{contenedor con fondo semitransparente del color del tipo de usuario}} */}
      <View style={[styles.iconContainer, { backgroundColor: userType.color + '20' }]}>
        <Ionicons name={userType.icon} size={getResponsiveFontSize(40, 48, 56)} color={userType.color} />
      </View>
      {/* --Título de la opción-- */}
      {/* {{título principal con tamaño de fuente responsivo}} */}
      <Text style={[styles.optionTitle, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
        {userType.title}
      </Text>
      {/* --Descripción de la opción-- */}
      {/* {{descripción secundaria con tamaño de fuente responsivo}} */}
      <Text style={[styles.optionDescription, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
        {userType.description}
      </Text>
    </TouchableOpacity>
  );

  // --Return del componente--
  // {{renderiza la interfaz principal del componente}}
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.content, isWeb && webStyles.container]}>
          {/* --Header principal-- */}
          {/* {{encabezado con título de la app y subtítulo explicativo}} */}
          <View style={styles.header}>
            <Text style={[styles.title, { fontSize: getResponsiveFontSize(32, 36, 40) }]}>
              Medic App
            </Text>
            <Text style={[styles.subtitle, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
              ¿Cómo quieres usar la aplicación?
            </Text>
          </View>

          {/* --Contenedor de opciones-- */}
          {/* {{contenedor principal para las tarjetas de tipos de usuario}} */}
          <View style={[
            styles.optionsContainer,
            isWeb && styles.webOptionsContainer,
            { 
              paddingHorizontal: getResponsivePadding(20, 40, 60),
              gap: getResponsiveSpacing(16, 24, 32)
            }
          ]}>
            {/* --Renderizado responsivo-- */}
            {/* {{muestra grid en web y lista vertical en móvil}} */}
            {isWeb ? (
              <View style={styles.webGrid}>
                {userTypes.map(renderUserTypeCard)}
              </View>
            ) : (
              userTypes.map(renderUserTypeCard)
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --Estilos del componente--
// {{configuración visual para todos los elementos del componente}}
const styles = StyleSheet.create({
  // --Estilo del contenedor principal--
  // {{contenedor principal con fondo gris claro}}
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  // --Estilo del contenido scrolleable--
  // {{contenido que puede crecer para scroll}}
  scrollContent: {
    flexGrow: 1,
  },
  // --Estilo del contenido principal--
  // {{contenido centrado verticalmente}}
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  // --Estilo del header--
  // {{encabezado centrado con padding responsivo}}
  header: {
    alignItems: 'center',
    paddingTop: getResponsiveSpacing(60, 80, 100),
    paddingBottom: getResponsiveSpacing(40, 50, 60),
  },
  // --Estilo del título--
  // {{título principal en negrita y centrado}}
  title: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
    textAlign: 'center',
  },
  // --Estilo del subtítulo--
  // {{subtítulo en gris, centrado y con ancho máximo}}
  subtitle: {
    color: '#666',
    textAlign: 'center',
    maxWidth: 300,
  },
  // --Estilo del contenedor de opciones--
  // {{contenedor principal centrado para las opciones}}
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  // --Estilo del contenedor de opciones en web--
  // {{contenedor alineado al inicio en versión web}}
  webOptionsContainer: {
    justifyContent: 'flex-start',
  },
  // --Estilo del grid en web--
  // {{layout horizontal con wrap para opciones en versión web}}
  webGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  // --Estilo de opción--
  // {{tarjeta individual con sombra y contenido centrado}}
  option: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: getResponsivePadding(24, 32, 40),
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    minHeight: 200,
    justifyContent: 'center',
  },
  // --Estilo de opción en web--
  // {{configuración responsiva específica para versión web}}
  webOption: {
    flex: isWeb ? '0 1 300px' : undefined,
    maxWidth: isWeb ? 350 : undefined,
    minHeight: isWeb ? 250 : 200,
    transition: 'all 0.3s ease',
    border: '1px solid #E0E0E0',
  },
  // --Estilo del contenedor del icono--
  // {{contenedor circular centrado para el icono de cada opción}}
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: getResponsiveSpacing(80, 96, 112),
    height: getResponsiveSpacing(80, 96, 112),
    borderRadius: getResponsiveSpacing(40, 48, 56),
    marginBottom: getResponsiveSpacing(16, 20, 24),
  },
  // --Estilo del título de la opción--
  // {{título en negrita para cada tipo de usuario}}
  optionTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  // --Estilo de la descripción de la opción--
  // {{descripción en gris, centrada y con altura de línea específica}}
  optionDescription: {
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default UserTypeSelection; 