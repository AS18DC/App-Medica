// --Imports de React--
// Importa las funcionalidades básicas de React y hooks de estado
import React, { useState } from 'react';

// --Imports de React Native--
// Importa componentes básicos de React Native para la interfaz
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
} from 'react-native';

// --Imports de iconos--
// Importa iconos de Ionicons para la interfaz de usuario
import { Ionicons } from '@expo/vector-icons';

// --Imports de utilidades responsivas--
// Importa funciones para hacer la interfaz responsiva en diferentes dispositivos
import { isWeb, isMobileScreen, isTabletScreen, isDesktopScreen, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';

const ClinicDirectory = ({ navigation }) => {
  // --Estado de búsqueda--
  // Almacena el texto de búsqueda ingresado por el usuario
  const [searchQuery, setSearchQuery] = useState('');
  
  // --Estado de filtro seleccionado--
  // Almacena el filtro activo para mostrar doctores (todos, activos, inactivos)
  const [selectedFilter, setSelectedFilter] = useState('all');

  // --Datos de doctores--
  // Lista de doctores simulados con información completa
  const [doctors] = useState([
    {
      id: 1,
      name: 'Dr. Sofia Ramirez',
      specialty: 'Cardiología',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      status: 'active',
      clinic: 'Clínica San Martín',
      experience: '15 años',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Dr. Carlos Mendoza',
      specialty: 'Dermatología',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      status: 'active',
      clinic: 'Clínica San Martín',
      experience: '12 años',
      rating: 4.6,
    },
    {
      id: 3,
      name: 'Dr. Ana Torres',
      specialty: 'Pediatría',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      status: 'inactive',
      clinic: 'Clínica San Martín',
      experience: '8 años',
      rating: 4.9,
    },
    {
      id: 4,
      name: 'Dr. Luis Fernandez',
      specialty: 'Neurología',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face',
      status: 'active',
      clinic: 'Clínica San Martín',
      experience: '18 años',
      rating: 4.7,
    },
    {
      id: 5,
      name: 'Dr. Maria Gonzalez',
      specialty: 'Ginecología',
      image: 'https://images.unsplash.com/photo-1594824475544-3b0b3b3b3b3b?w=150&h=150&fit=crop&crop=face',
      status: 'active',
      clinic: 'Clínica San Martín',
      experience: '14 años',
      rating: 4.8,
    },
  ]);

  // --Filtros disponibles--
  // Opciones de filtrado para los doctores
  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'active', label: 'Activos' },
    { id: 'inactive', label: 'Inactivos' },
  ];

  // --Función de agregar doctor--
  // Maneja la acción de agregar un nuevo doctor al directorio
  const handleAddDoctor = () => {
    Alert.alert(
      'Agregar Doctor',
      'Para agregar un nuevo doctor, complete el formulario de registro con la información requerida.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Ir al formulario',
          onPress: () => {
            Alert.alert('Formulario', 'Redirigiendo al formulario de registro de doctores...');
          },
        },
      ]
    );
  };

  // --Función de eliminar doctor--
  // Maneja la acción de eliminar un doctor del directorio
  const handleRemoveDoctor = (doctor) => {
    if (doctor.status === 'active') {
      Alert.alert(
        'No se puede eliminar',
        'Solo se pueden eliminar doctores inactivos.',
        [{ text: 'Entendido' }]
      );
      return;
    }

    Alert.alert(
      'Eliminar Doctor',
      `¿Estás seguro de que quieres eliminar a ${doctor.name}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Eliminado', `${doctor.name} ha sido eliminado del directorio.`);
          },
        },
      ]
    );
  };

  // --Función de renderizado de tarjeta de doctor--
  // Renderiza cada tarjeta individual de doctor con su información
  const renderDoctorCard = (doctor) => (
    <View
      key={doctor.id}
      style={[
        styles.doctorCard,
        isWeb && styles.webDoctorCard,
        isWeb && webStyles.card,
      ]}
    >
      <View style={styles.doctorHeader}>
        <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
        <View style={styles.doctorInfo}>
          <Text style={[styles.doctorName, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
            {doctor.name}
          </Text>
          <Text style={[styles.doctorSpecialty, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
            {doctor.specialty}
          </Text>
          <View style={styles.doctorStats}>
            <Text style={[styles.statText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
              {doctor.experience}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={getResponsiveFontSize(12, 13, 14)} color="#FFD700" />
              <Text style={[styles.ratingText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                {doctor.rating}
              </Text>
            </View>
          </View>
        </View>
        <View style={[
          styles.statusBadge,
          doctor.status === 'active' ? styles.activeBadge : styles.inactiveBadge
        ]}>
          <Text style={[
            styles.statusText,
            { fontSize: getResponsiveFontSize(10, 11, 12) }
          ]}>
            {doctor.status === 'active' ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>

      <View style={styles.doctorActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton, isWeb && webStyles.button]}
          onPress={() => Alert.alert('Perfil', `Ver perfil de ${doctor.name}`)}
        >
          <Ionicons name="eye" size={getResponsiveFontSize(16, 17, 18)} color="#007AFF" />
          <Text style={[styles.actionButtonText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
            Ver perfil
          </Text>
        </TouchableOpacity>
        {doctor.status === 'inactive' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton, isWeb && webStyles.button]}
            onPress={() => handleRemoveDoctor(doctor)}
          >
            <Ionicons name="trash" size={getResponsiveFontSize(16, 17, 18)} color="#FF3B30" />
            <Text style={[styles.actionButtonText, styles.removeButtonText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
              Eliminar
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // --Doctores filtrados--
  // Lista de doctores filtrada según el criterio seleccionado
  const filteredDoctors = doctors.filter(doctor => {
    if (selectedFilter === 'all') return true;
    return doctor.status === selectedFilter;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, isWeb && webStyles.container]}>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={getResponsiveFontSize(24, 26, 28)} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={[styles.title, { fontSize: getResponsiveFontSize(28, 30, 32) }]}>
              Directorio de Doctores
            </Text>
            <View style={styles.headerRight} />
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search and Filter Section */}
          <View style={[styles.searchContainer, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            <View style={[styles.searchBar, isWeb && styles.webSearchBar]}>
              <Ionicons 
                name="search" 
                size={getResponsiveFontSize(20, 22, 24)} 
                color="#666" 
                style={styles.searchIcon} 
              />
              <TextInput
                style={[styles.searchInput, { fontSize: getResponsiveFontSize(16, 17, 18) }]}
                placeholder="Buscar doctores..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View style={[styles.filterContainer, isWeb && styles.webFilterContainer]}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterButton,
                    selectedFilter === filter.id && styles.filterButtonActive,
                    isWeb && webStyles.button,
                  ]}
                  onPress={() => setSelectedFilter(filter.id)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedFilter === filter.id && styles.filterTextActive,
                      { fontSize: getResponsiveFontSize(14, 15, 16) }
                    ]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.addButton, isWeb && webStyles.button]}
              onPress={handleAddDoctor}
            >
              <Ionicons name="add" size={getResponsiveFontSize(20, 22, 24)} color="#FFFFFF" />
              <Text style={[styles.addButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                Agregar Doctor
              </Text>
            </TouchableOpacity>
          </View>

          {/* Doctors Grid */}
          <View style={styles.doctorsSection}>
            <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
              Doctores ({filteredDoctors.length})
            </Text>
            {isWeb ? (
              <View style={styles.webGrid}>
                {filteredDoctors.map(renderDoctorCard)}
              </View>
            ) : (
              <View style={styles.mobileGrid}>
                {filteredDoctors.map(renderDoctorCard)}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// --Estilos del componente--
// Define todos los estilos visuales del directorio de doctores
const styles = StyleSheet.create({
  // --Contenedor principal--
  // Estilo del contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // --Contenido--
  // Estilo del contenido principal de la pantalla
  content: {
    flex: 1,
  },
  
  // --Encabezado--
  // Estilo del encabezado de la pantalla
  header: {
    paddingTop: getResponsiveSpacing(20, 30, 40),
    paddingBottom: getResponsiveSpacing(16, 20, 24),
  },
  
  // --Parte superior del encabezado--
  // Estilo de la parte superior del encabezado
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // --Botón de regreso--
  // Estilo del botón para regresar a la pantalla anterior
  backButton: {
    padding: 8,
  },
  
  // --Título principal--
  // Estilo del título principal de la pantalla
  title: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
  },
  
  // --Parte derecha del encabezado--
  // Estilo de la parte derecha del encabezado
  headerRight: {
    width: 40,
  },
  
  // --Vista de desplazamiento--
  // Estilo de la vista de desplazamiento principal
  scrollView: {
    flex: 1,
  },
  
  // --Contenido del desplazamiento--
  // Estilo del contenido dentro de la vista de desplazamiento
  scrollContent: {
    paddingBottom: getResponsiveSpacing(20, 30, 40),
  },
  
  // --Contenedor de búsqueda--
  // Estilo del contenedor que incluye la barra de búsqueda y filtros
  searchContainer: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  
  // --Barra de búsqueda--
  // Estilo de la barra de búsqueda
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // --Barra de búsqueda web--
  // Estilo específico para la barra de búsqueda en dispositivos web
  webSearchBar: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  
  // --Icono de búsqueda--
  // Estilo del icono de búsqueda
  searchIcon: {
    marginRight: 12,
  },
  
  // --Campo de entrada de búsqueda--
  // Estilo del campo de texto para ingresar la búsqueda
  searchInput: {
    flex: 1,
    color: '#1A1A1A',
  },
  
  // --Contenedor de filtros--
  // Estilo del contenedor que incluye los botones de filtro
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // --Contenedor de filtros web--
  // Estilo específico para el contenedor de filtros en dispositivos web
  webFilterContainer: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  
  // --Botón de filtro--
  // Estilo de cada botón de filtro individual
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  // --Botón de filtro activo--
  // Estilo del botón de filtro cuando está seleccionado
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  
  // --Texto del filtro--
  // Estilo del texto dentro de los botones de filtro
  filterText: {
    fontWeight: '600',
    color: '#666',
  },
  
  // --Texto del filtro activo--
  // Estilo del texto cuando el filtro está activo
  filterTextActive: {
    color: '#FFFFFF',
  },
  
  // --Botón de agregar--
  // Estilo del botón para agregar un nuevo doctor
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // --Texto del botón de agregar--
  // Estilo del texto del botón para agregar doctor
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // --Sección de doctores--
  // Estilo de la sección que contiene la lista de doctores
  doctorsSection: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  
  // --Título de la sección--
  // Estilo del título de la sección de doctores
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
    paddingHorizontal: getResponsivePadding(20, 40, 60),
  },
  
  // --Cuadrícula web--
  // Estilo de la cuadrícula de doctores en dispositivos web
  webGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getResponsiveSpacing(16, 24, 32),
    paddingHorizontal: getResponsivePadding(20, 40, 60),
    justifyContent: 'center',
  },
  
  // --Cuadrícula móvil--
  // Estilo de la cuadrícula de doctores en dispositivos móviles
  mobileGrid: {
    paddingHorizontal: getResponsivePadding(20, 40, 60),
  },
  
  // --Tarjeta de doctor--
  // Estilo de cada tarjeta individual de doctor
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // --Tarjeta de doctor web--
  // Estilo específico para las tarjetas de doctor en dispositivos web
  webDoctorCard: {
    flex: '0 1 400px',
    maxWidth: 450,
    minWidth: 350,
  },
  
  // --Encabezado de la tarjeta de doctor--
  // Estilo del encabezado de cada tarjeta de doctor
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // --Imagen del doctor--
  // Estilo de la imagen de perfil del doctor
  doctorImage: {
    width: getResponsiveSpacing(60, 70, 80),
    height: getResponsiveSpacing(60, 70, 80),
    borderRadius: getResponsiveSpacing(30, 35, 40),
    marginRight: 12,
  },
  
  // --Información del doctor--
  // Estilo del contenedor de información del doctor
  doctorInfo: {
    flex: 1,
  },
  
  // --Nombre del doctor--
  // Estilo del nombre del doctor
  doctorName: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  
  // --Especialidad del doctor--
  // Estilo de la especialidad del doctor
  doctorSpecialty: {
    color: '#666',
    marginBottom: 8,
  },
  
  // --Estadísticas del doctor--
  // Estilo del contenedor de estadísticas del doctor
  doctorStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // --Texto de estadística--
  // Estilo del texto de las estadísticas del doctor
  statText: {
    color: '#999',
  },
  
  // --Contenedor de calificación--
  // Estilo del contenedor de la calificación del doctor
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // --Texto de calificación--
  // Estilo del texto de la calificación del doctor
  ratingText: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  
  // --Insignia de estado--
  // Estilo de la insignia que muestra el estado del doctor
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  // --Insignia activa--
  // Estilo de la insignia para doctores activos
  activeBadge: {
    backgroundColor: '#34C75920',
  },
  
  // --Insignia inactiva--
  // Estilo de la insignia para doctores inactivos
  inactiveBadge: {
    backgroundColor: '#FF3B3020',
  },
  
  // --Texto del estado--
  // Estilo del texto que indica el estado del doctor
  statusText: {
    fontWeight: '600',
  },
  
  // --Acciones del doctor--
  // Estilo del contenedor de botones de acción para cada doctor
  doctorActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  
  // --Botón de acción--
  // Estilo base para todos los botones de acción
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  
  // --Botón de ver--
  // Estilo específico para el botón de ver perfil
  viewButton: {
    backgroundColor: '#FFFFFF',
  },
  
  // --Botón de eliminar--
  // Estilo específico para el botón de eliminar doctor
  removeButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF3B30',
  },
  
  // --Texto del botón de acción--
  // Estilo del texto dentro de los botones de acción
  actionButtonText: {
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 4,
  },
  
  // --Texto del botón de eliminar--
  // Estilo específico del texto para el botón de eliminar
  removeButtonText: {
    color: '#FF3B30',
  },
});

export default ClinicDirectory; 