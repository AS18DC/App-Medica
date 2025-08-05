import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { isWeb, isMobileScreen, isTabletScreen, isDesktopScreen, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding, getGridColumns } from '../../utils/responsive';

const PatientHome = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);

  // Mock data for nearby doctors
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

  // Mock data for top rated doctors
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

  // Medical specialties
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

  // Clinics
  const clinics = [
    'Clínica San Martín',
    'Centro Médico Santa María',
    'Clínica del Norte',
    'Hospital General',
    'Centro de Especialidades',
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const handleDoctorPress = (doctor) => {
    navigation.navigate('DoctorDetail', { doctor });
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const applyFilters = () => {
    setShowFilterModal(false);
    // Apply filters logic here
    console.log('Applied filters:', { selectedSpecialty, selectedClinic });
  };

  const clearFilters = () => {
    setSelectedSpecialty(null);
    setSelectedClinic(null);
  };

  // Filter doctors based on search query and selected filters
  const filterDoctors = (doctors) => {
    return doctors.filter(doctor => {
      // Search query filter
      const matchesSearch = !searchQuery.trim() || 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.clinic.toLowerCase().includes(searchQuery.toLowerCase());

      // Specialty filter
      const matchesSpecialty = !selectedSpecialty || 
        doctor.specialty === selectedSpecialty;

      // Clinic filter
      const matchesClinic = !selectedClinic || 
        doctor.clinic === selectedClinic;

      return matchesSearch && matchesSpecialty && matchesClinic;
    });
  };

  const filteredNearbyDoctors = filterDoctors(nearbyDoctors);
  const filteredTopRatedDoctors = filterDoctors(topRatedDoctors);

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

  const renderDoctorSection = (title, doctors, horizontal = true) => {
    if (doctors.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
          {title}
        </Text>
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
              Encuentra un doctor
            </Text>
            <View style={styles.headerRight} />
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Section */}
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
                placeholder="Especialista o Clínica"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
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
  webDoctorCard: {
    flex: '0 1 350px',
    maxWidth: 400,
    minWidth: 300,
    marginHorizontal: 0,
  },
  doctorCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorImage: {
    width: getResponsiveSpacing(60, 70, 80),
    height: getResponsiveSpacing(60, 70, 80),
    borderRadius: getResponsiveSpacing(30, 35, 40),
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  doctorSpecialty: {
    color: '#666',
    marginBottom: 2,
  },
  doctorClinic: {
    color: '#007AFF',
    fontWeight: '500',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsiveSpacing(60, 80, 100),
    paddingHorizontal: getResponsivePadding(20, 40, 60),
  },
  noResultsTitle: {
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtitle: {
    color: '#999',
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterOptionText: {
    color: '#666',
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#F0F0F0',
  },
  applyButton: {
    backgroundColor: '#007AFF',
  },
  clearButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default PatientHome; 