import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isWeb, isMobileScreen, isTabletScreen, isDesktopScreen, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';

const PatientClinics = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock clinics data
  const clinics = [
    {
      id: 1,
      name: 'Clínica San Martín',
      specialty: 'Medicina General',
      address: 'Calle Principal 123, Madrid',
      rating: 4.7,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=150&h=150&fit=crop',
      distance: '0.8 km',
      doctors: 15,
    },
    {
      id: 2,
      name: 'Centro Médico Santa María',
      specialty: 'Cardiología',
      address: 'Avenida Central 456, Madrid',
      rating: 4.5,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150&h=150&fit=crop',
      distance: '1.2 km',
      doctors: 22,
    },
    {
      id: 3,
      name: 'Clínica del Norte',
      specialty: 'Dermatología',
      address: 'Plaza Mayor 789, Madrid',
      rating: 4.8,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=150&h=150&fit=crop',
      distance: '1.5 km',
      doctors: 18,
    },
    {
      id: 4,
      name: 'Centro de Salud Familiar',
      specialty: 'Pediatría',
      address: 'Calle San Martín 321, Madrid',
      rating: 4.6,
      reviews: 178,
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=150&h=150&fit=crop',
      distance: '2.1 km',
      doctors: 12,
    },
    {
      id: 5,
      name: 'Clínica de Urgencias',
      specialty: 'Emergencias',
      address: 'Avenida de la Paz 654, Madrid',
      rating: 4.4,
      reviews: 92,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150&h=150&fit=crop',
      distance: '0.5 km',
      doctors: 8,
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const handleClinicPress = (clinic) => {
    navigation.navigate('ClinicDetail', { clinic });
  };

  const handleViewDoctors = (clinic) => {
    navigation.navigate('ClinicDoctors', { clinic });
  };

  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clinic.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={getResponsiveFontSize(12, 13, 14)}
          color={i <= rating ? '#FFD700' : '#DDD'}
        />
      );
    }
    return stars;
  };

  const renderClinicCard = (clinic) => (
    <TouchableOpacity
      key={clinic.id}
      style={[
        styles.clinicCard,
        isWeb && styles.webClinicCard,
        isWeb && webStyles.card,
        isWeb && webStyles.button,
      ]}
      onPress={() => handleClinicPress(clinic)}
    >
      <View style={styles.clinicCardContent}>
        <Image source={{ uri: clinic.image }} style={styles.clinicImage} />
        <View style={styles.clinicInfo}>
          <Text style={[styles.clinicName, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
            {clinic.name}
          </Text>
          <Text style={[styles.clinicSpecialty, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
            {clinic.specialty}
          </Text>
          <Text style={[styles.clinicAddress, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
            {clinic.address}
          </Text>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(clinic.rating)}
            </View>
            <Text style={[styles.ratingText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
              {clinic.rating} ({clinic.reviews} reseñas)
            </Text>
          </View>
          <View style={styles.clinicDetails}>
            <Text style={[styles.distanceText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
              {clinic.distance}
            </Text>
            <Text style={[styles.doctorsText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
              {clinic.doctors} doctores
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.viewDoctorsButton}
          onPress={() => handleViewDoctors(clinic)}
        >
          <Text style={[styles.viewDoctorsText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
            Ver doctores
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
              Clínicas
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
                placeholder="Buscar clínicas..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
            </View>
          </View>

          {/* Clinics List */}
          <View style={styles.clinicsContainer}>
            {isWeb ? (
              <View style={styles.webGrid}>
                {filteredClinics.map(renderClinicCard)}
              </View>
            ) : (
              <View style={styles.mobileList}>
                {filteredClinics.map(renderClinicCard)}
              </View>
            )}

            {filteredClinics.length === 0 && (
              <View style={styles.emptyResults}>
                <Ionicons name="business-outline" size={64} color="#CCC" />
                <Text style={[styles.emptyResultsTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                  No se encontraron clínicas
                </Text>
                <Text style={[styles.emptyResultsSubtitle, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  {searchQuery ? 'Intenta con otros términos de búsqueda' : 'No hay clínicas disponibles'}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
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
  clinicsContainer: {
    paddingHorizontal: getResponsivePadding(20, 40, 60),
  },
  webGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getResponsiveSpacing(16, 24, 32),
    justifyContent: 'center',
  },
  mobileList: {
    gap: getResponsiveSpacing(12, 16, 20),
  },
  clinicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  webClinicCard: {
    flex: '0 1 400px',
    maxWidth: 450,
    minWidth: 350,
  },
  clinicCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clinicImage: {
    width: getResponsiveSpacing(60, 70, 80),
    height: getResponsiveSpacing(60, 70, 80),
    borderRadius: getResponsiveSpacing(30, 35, 40),
    marginRight: 16,
  },
  clinicInfo: {
    flex: 1,
  },
  clinicName: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  clinicSpecialty: {
    color: '#666',
    marginBottom: 4,
  },
  clinicAddress: {
    color: '#999',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    color: '#666',
  },
  clinicDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distanceText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  doctorsText: {
    color: '#34C759',
    fontWeight: '500',
  },
  viewDoctorsButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  viewDoctorsText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsiveSpacing(60, 80, 100),
  },
  emptyResultsTitle: {
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyResultsSubtitle: {
    color: '#999',
    textAlign: 'center',
  },
});

export default PatientClinics; 