// --Imports de React y React Native--
// {{importa React, useState y componentes básicos de React Native}}
import React, { useState } from 'react';
// --Imports de componentes de React Native--
// {{importa View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Image, Modal y Alert}}
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Modal,
  Alert,
} from 'react-native';
// --Import de iconos--
// {{importa Ionicons de la librería de iconos de Expo}}
import { Ionicons } from '@expo/vector-icons';
// --Import de utilidades responsivas--
// {{importa funciones para hacer la interfaz responsiva en web, móvil y tablet}}
import { isWeb, isMobileScreen, isTabletScreen, isDesktopScreen, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding, getGridColumns } from '../../utils/responsive';

// --Componente PatientHome--
// {{pantalla principal del paciente con búsqueda y recomendaciones de doctores}}
const PatientHome = ({ navigation }) => {
  // --Estado de búsqueda--
  // {{almacena el texto de búsqueda del usuario}}
  const [searchQuery, setSearchQuery] = useState('');
  // --Estado del modal de filtros--
  // {{controla la visibilidad del modal de filtros}}
  const [showFilterModal, setShowFilterModal] = useState(false);
  // --Estado de especialidad seleccionada--
  // {{almacena la especialidad médica seleccionada para filtrar}}
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  // --Estado de clínica seleccionada--
  // {{almacena la clínica seleccionada para filtrar}}
  const [selectedClinic, setSelectedClinic] = useState(null);

  // --Datos mock de doctores cercanos--
  // {{lista de doctores cercanos con información personal y profesional}}
  const nearbyDoctors = [
    {
      id: 1,
      name: 'Dr. Sofia Ramirez',
      specialty: 'Cardiología',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      clinic: 'Clínica San Martín',
      experience: '10 años',
    },
    {
      id: 2,
      name: 'Dr. Javier Rodriguez',
      specialty: 'Dermatología',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      clinic: 'Centro Médico Santa María',
      experience: '8 años',
    },
    {
      id: 3,
      name: 'Dr. Ana Torres',
      specialty: 'Pediatría',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      clinic: 'Clínica del Norte',
      experience: '12 años',
    },
  ];

  // --Datos mock de doctores mejor calificados--
  // {{lista de doctores con las mejores calificaciones del sistema}}
  const topRatedDoctors = [
    {
      id: 4,
      name: 'Dr. Lucas Ramirez',
      specialty: 'Pediatría',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face',
      clinic: 'Clínica San Martín',
      experience: '15 años',
    },
    {
      id: 5,
      name: 'Dr. Sofia Ramirez',
      specialty: 'Cardiología',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      clinic: 'Clínica San Martín',
      experience: '12 años',
    },
    {
      id: 6,
      name: 'Dr. Roberto Silva',
      specialty: 'Ortopedia',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      clinic: 'Centro Médico Santa María',
      experience: '18 años',
    },
  ];

  // --Especialidades médicas--
  // {{lista de especialidades médicas disponibles para filtrado}}
  const medicalSpecialties = [
    'Cardiología',
    'Dermatología',
    'Pediatría',
    'Neurología',
    'Ginecología',
    'Ortopedia',
    'Psiquiatría',
    'Oftalmología',
    'Otorrinolaringología',
    'Urología',
    'Endocrinología',
    'Gastroenterología',
  ];

  // --Lista de clínicas--
  // {{lista de clínicas disponibles para filtrado}}
  const clinics = [
    'Clínica San Martín',
    'Centro Médico Santa María',
    'Clínica del Norte',
    'Hospital General',
    'Centro de Especialidades',
  ];

  // --Función de búsqueda--
  // {{maneja la búsqueda de doctores por texto}}
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // --Implementación de búsqueda--
      // {{lógica para buscar doctores por consulta}}
      console.log('Searching for:', searchQuery);
    }
  };

  // --Función de selección de doctor--
  // {{navega a la pantalla de detalles del doctor}}
  const handleDoctorPress = (doctor) => {
    navigation.navigate('DoctorDetail', { doctor });
  };

  // --Función de apertura de filtros--
  // {{muestra el modal de filtros de búsqueda}}
  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  // --Función de aplicación de filtros--
  // {{aplica los filtros seleccionados y cierra el modal}}
  const applyFilters = () => {
    setShowFilterModal(false);
    // --Lógica de aplicación de filtros--
    // {{aplica filtros de especialidad y clínica}}
    console.log('Applied filters:', { selectedSpecialty, selectedClinic });
  };

  // --Función de limpieza de filtros--
  // {{resetea todos los filtros seleccionados}}
  const clearFilters = () => {
    setSelectedSpecialty(null);
    setSelectedClinic(null);
  };

  // --Función de filtrado de doctores--
  // {{filtra doctores basado en consulta de búsqueda y filtros seleccionados}}
  const filterDoctors = (doctors) => {
    return doctors.filter(doctor => {
      // --Filtro de consulta de búsqueda--
      // {{verifica si el doctor coincide con el texto de búsqueda}}
      const matchesSearch = !searchQuery.trim() || 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.clinic.toLowerCase().includes(searchQuery.toLowerCase());

      // --Filtro de especialidad--
      // {{verifica si el doctor coincide con la especialidad seleccionada}}
      const matchesSpecialty = !selectedSpecialty || 
        doctor.specialty === selectedSpecialty;

      // --Filtro de clínica--
      // {{verifica si el doctor coincide con la clínica seleccionada}}
      const matchesClinic = !selectedClinic || 
        doctor.clinic === selectedClinic;

      return matchesSearch && matchesSpecialty && matchesClinic;
    });
  };

  // --Doctores filtrados cercanos--
  // {{lista de doctores cercanos después de aplicar filtros}}
  const filteredNearbyDoctors = filterDoctors(nearbyDoctors);
  // --Doctores filtrados mejor calificados--
  // {{lista de doctores mejor calificados después de aplicar filtros}}
  const filteredTopRatedDoctors = filterDoctors(topRatedDoctors);

  // --Función de renderizado de tarjeta de doctor--
  // {{renderiza una tarjeta individual de doctor con información y estilos responsivos}}
  const renderDoctorCard = (doctor) => (
    <TouchableOpacity
      key={doctor.id}
      style={[
        styles.doctorCard,
        isWeb && styles.webDoctorCard,
        isWeb && webStyles.card,
        isWeb && webStyles.button,
      ]}
      onPress={() => handleDoctorPress(doctor)}
    >
      <View style={styles.doctorCardContent}>
        <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
        <View style={styles.doctorInfo}>
          <Text style={[styles.doctorName, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
            {doctor.name}
          </Text>
          <Text style={[styles.doctorSpecialty, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
            {doctor.specialty}
          </Text>
          <Text style={[styles.doctorClinic, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
            {doctor.clinic}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // --Función de renderizado de sección de doctores--
  // {{renderiza una sección completa de doctores con título y layout responsivo}}
  const renderDoctorSection = (title, doctors, horizontal = true) => {
    if (doctors.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
          {title}
        </Text>
        {/* --Renderizado responsivo-- */}
        {/* {{muestra grid en web y scroll horizontal en móvil}} */}
        {isWeb ? (
          <View style={styles.webGrid}>
            {doctors.map(renderDoctorCard)}
          </View>
        ) : (
          <ScrollView
            horizontal={horizontal}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {doctors.map(renderDoctorCard)}
          </ScrollView>
        )}
      </View>
    );
  };

  // --Return del componente--
  // {{renderiza la interfaz principal del componente}}
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, isWeb && webStyles.container]}>
        {/* --Header principal-- */}
        {/* {{encabezado con botón de regreso y título}} */}
        <View style={[styles.header, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={getResponsiveFontSize(24, 26, 28)} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={[styles.title, { fontSize: getResponsiveFontSize(28, 30, 32) }]}>
              Encuentra un doctor
            </Text>
            <View style={styles.headerRight} />
          </View>
        </View>

        {/* --ScrollView principal-- */}
        {/* {{contenedor scrolleable para todo el contenido}} */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --Sección de búsqueda-- */}
          {/* {{barra de búsqueda con filtros y campo de texto}} */}
          <View style={[styles.searchContainer, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            <View style={[styles.searchBar, isWeb && styles.webSearchBar]}>
              {/* --Icono de búsqueda-- */}
              {/* {{icono de lupa para indicar funcionalidad de búsqueda}} */}
              <Ionicons 
                name="search" 
                size={getResponsiveFontSize(20, 22, 24)} 
                color="#666" 
                style={styles.searchIcon} 
              />
              {/* --Campo de entrada de búsqueda-- */}
              {/* {{input de texto para ingresar consulta de búsqueda}} */}
              <TextInput
                style={[styles.searchInput, { fontSize: getResponsiveFontSize(16, 17, 18) }]}
                placeholder="Especialista o Clínica"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
              {/* --Botón de filtros-- */}
              {/* {{botón para abrir modal de filtros avanzados}} */}
              <TouchableOpacity
                style={styles.filterButton}
                onPress={handleFilterPress}
              >
                <Ionicons 
                  name="filter" 
                  size={getResponsiveFontSize(20, 22, 24)} 
                  color="#007AFF" 
                />
              </TouchableOpacity>
            </View>

            {/* Active Filters Display */}
            {(selectedSpecialty || selectedClinic) && (
              <View style={styles.activeFiltersContainer}>
                <Text style={[styles.activeFiltersTitle, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Filtros activos:
                </Text>
                <View style={styles.activeFiltersList}>
                  {selectedSpecialty && (
                    <View style={styles.activeFilterChip}>
                      <Text style={[styles.activeFilterText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                        {selectedSpecialty}
                      </Text>
                      <TouchableOpacity onPress={() => setSelectedSpecialty(null)}>
                        <Ionicons name="close-circle" size={16} color="#007AFF" />
                      </TouchableOpacity>
                    </View>
                  )}
                  {selectedClinic && (
                    <View style={styles.activeFilterChip}>
                      <Text style={[styles.activeFilterText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                        {selectedClinic}
                      </Text>
                      <TouchableOpacity onPress={() => setSelectedClinic(null)}>
                        <Ionicons name="close-circle" size={16} color="#007AFF" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>

          {/* Doctor Sections */}
          {renderDoctorSection('Doctores cerca de ti', filteredNearbyDoctors)}
          {renderDoctorSection('Doctores mejor calificados', filteredTopRatedDoctors)}

          {/* No Results Message */}
          {filteredNearbyDoctors.length === 0 && filteredTopRatedDoctors.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={64} color="#CCC" />
              <Text style={[styles.noResultsTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                No se encontraron doctores
              </Text>
              <Text style={[styles.noResultsSubtitle, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                {searchQuery || selectedSpecialty || selectedClinic 
                  ? 'Intenta con otros términos de búsqueda o ajusta los filtros' 
                  : 'No hay doctores disponibles'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
                Filtros de búsqueda
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Specialties Section */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                  Especialidades médicas
                </Text>
                <View style={styles.filterOptions}>
                  {medicalSpecialties.map((specialty) => (
                    <TouchableOpacity
                      key={specialty}
                      style={[
                        styles.filterOption,
                        selectedSpecialty === specialty && styles.filterOptionSelected,
                      ]}
                      onPress={() => setSelectedSpecialty(selectedSpecialty === specialty ? null : specialty)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedSpecialty === specialty && styles.filterOptionTextSelected,
                          { fontSize: getResponsiveFontSize(14, 15, 16) }
                        ]}
                      >
                        {specialty}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Clinics Section */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterSectionTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                  Clínicas
                </Text>
                <View style={styles.filterOptions}>
                  {clinics.map((clinic) => (
                    <TouchableOpacity
                      key={clinic}
                      style={[
                        styles.filterOption,
                        selectedClinic === clinic && styles.filterOptionSelected,
                      ]}
                      onPress={() => setSelectedClinic(selectedClinic === clinic ? null : clinic)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          selectedClinic === clinic && styles.filterOptionTextSelected,
                          { fontSize: getResponsiveFontSize(14, 15, 16) }
                        ]}
                      >
                        {clinic}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.clearButton]}
                onPress={clearFilters}
              >
                <Text style={[styles.clearButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Limpiar filtros
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.applyButton]}
                onPress={applyFilters}
              >
                <Text style={[styles.applyButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Aplicar filtros
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingTop: getResponsiveSpacing(20, 30, 40),
    paddingBottom: getResponsiveSpacing(16, 20, 24),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: getResponsiveSpacing(20, 30, 40),
  },
  searchContainer: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  webSearchBar: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#1A1A1A',
  },
  filterButton: {
    padding: 8,
  },
  activeFiltersContainer: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  activeFiltersTitle: {
    color: '#666',
    marginBottom: 8,
  },
  activeFiltersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  activeFilterText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  section: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
    paddingHorizontal: getResponsivePadding(20, 40, 60),
  },
  webGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getResponsiveSpacing(16, 24, 32),
    paddingHorizontal: getResponsivePadding(20, 40, 60),
    justifyContent: 'center',
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    width: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // --Estilo de tarjeta de doctor en web--
  // {{configuración responsiva para tarjetas en versión web}}
  webDoctorCard: {
    flex: '0 1 350px',
    maxWidth: 400,
    minWidth: 300,
    marginHorizontal: 0,
  },
  // --Estilo del contenido de la tarjeta de doctor--
  // {{layout horizontal para imagen e información del doctor}}
  doctorCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // --Estilo de la imagen del doctor--
  // {{imagen circular responsiva del doctor}}
  doctorImage: {
    width: getResponsiveSpacing(60, 70, 80),
    height: getResponsiveSpacing(60, 70, 80),
    borderRadius: getResponsiveSpacing(30, 35, 40),
    marginRight: 16,
  },
  // --Estilo de la información del doctor--
  // {{contenedor flexible para datos del doctor}}
  doctorInfo: {
    flex: 1,
  },
  // --Estilo del nombre del doctor--
  // {{texto en negrita para el nombre del doctor}}
  doctorName: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  // --Estilo de la especialidad del doctor--
  // {{texto en gris para la especialidad médica}}
  doctorSpecialty: {
    color: '#666',
    marginBottom: 2,
  },
  // --Estilo de la clínica del doctor--
  // {{texto azul para el nombre de la clínica}}
  doctorClinic: {
    color: '#007AFF',
    fontWeight: '500',
  },
  // --Estilo de contenedor sin resultados--
  // {{contenedor centrado para cuando no hay resultados de búsqueda}}
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsiveSpacing(60, 80, 100),
    paddingHorizontal: getResponsivePadding(20, 40, 60),
  },
  // --Estilo del título sin resultados--
  // {{título en negrita centrado para estado sin resultados}}
  noResultsTitle: {
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  // --Estilo del subtítulo sin resultados--
  // {{subtítulo centrado para estado sin resultados}}
  noResultsSubtitle: {
    color: '#999',
    textAlign: 'center',
  },
  // --Estilos de modales--
  // {{configuración visual para todos los modales del componente}}
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  // --Estilo del contenido del modal--
  // {{contenedor principal del modal con bordes redondeados}}
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  // --Estilo del header del modal--
  // {{encabezado horizontal con título y botón de cerrar}}
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  // --Estilo del título del modal--
  // {{título en negrita para el encabezado del modal}}
  modalTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  // --Estilo del botón de cerrar--
  // {{botón con padding para cerrar el modal}}
  closeButton: {
    padding: 4,
  },
  // --Estilo del cuerpo del modal--
  // {{contenido principal del modal con padding}}
  modalBody: {
    padding: 20,
  },
  // --Estilo de sección de filtro--
  // {{contenedor para cada grupo de filtros}}
  filterSection: {
    marginBottom: 24,
  },
  // --Estilo del título de sección de filtro--
  // {{título en negrita para cada grupo de filtros}}
  filterSectionTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  // --Estilo de opciones de filtro--
  // {{contenedor flexible para opciones de filtro}}
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  // --Estilo de opción de filtro--
  // {{botón individual para cada opción de filtro}}
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  // --Estilo de opción de filtro seleccionada--
  // {{estado visual para opción de filtro activa}}
  filterOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  // --Estilo del texto de opción de filtro--
  // {{texto en gris para opciones de filtro normales}}
  filterOptionText: {
    color: '#666',
    fontWeight: '500',
  },
  // --Estilo del texto de opción de filtro seleccionada--
  // {{texto blanco para opciones de filtro activas}}
  filterOptionTextSelected: {
    color: '#FFFFFF',
  },
  // --Estilo del footer del modal--
  // {{pie del modal con botones y borde superior}}
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  // --Estilo base de botones del modal--
  // {{configuración común para botones de modal}}
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  // --Estilo del botón de limpiar--
  // {{botón gris para limpiar filtros}}
  clearButton: {
    backgroundColor: '#F0F0F0',
  },
  // --Estilo del botón de aplicar--
  // {{botón azul para confirmar filtros}}
  applyButton: {
    backgroundColor: '#007AFF',
  },
  // --Estilo del texto del botón limpiar--
  // {{texto gris en negrita para botón limpiar}}
  clearButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  // --Estilo del texto del botón aplicar--
  // {{texto blanco en negrita para botón aplicar}}
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default PatientHome; 