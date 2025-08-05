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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isWeb, isMobileScreen, isTabletScreen, isDesktopScreen, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';

const ClinicDoctors = ({ navigation, route }) => {
  const { clinic } = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for clinic doctors
  const clinicDoctors = [
    {
      id: 1,
      name: 'Dr. Sofia Ramirez',
      specialty: 'Cardiología',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      experience: '10 años',
      availability: 'Lun-Vie 9:00-17:00',
    },
    {
      id: 2,
      name: 'Dr. Javier Rodriguez',
      specialty: 'Dermatología',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      experience: '8 años',
      availability: 'Mar-Jue 10:00-18:00',
    },
    {
      id: 3,
      name: 'Dr. Ana Torres',
      specialty: 'Pediatría',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      experience: '12 años',
      availability: 'Lun-Sáb 8:00-16:00',
    },
    {
      id: 4,
      name: 'Dr. Luis Fernandez',
      specialty: 'Neurología',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face',
      experience: '15 años',
      availability: 'Mie-Vie 11:00-19:00',
    },
    {
      id: 5,
      name: 'Dr. Maria Gonzalez',
      specialty: 'Ginecología',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1594824475544-3b0b3b3b3b3b?w=150&h=150&fit=crop&crop=face',
      experience: '14 años',
      availability: 'Lun-Vie 8:00-16:00',
    },
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

  const filteredDoctors = clinicDoctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <View style={styles.doctorDetails}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={getResponsiveFontSize(12, 13, 14)} color="#FFD700" />
              <Text style={[styles.ratingText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                {doctor.rating}
              </Text>
            </View>
            <Text style={[styles.experienceText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
              {doctor.experience}
            </Text>
          </View>
          <Text style={[styles.availabilityText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
            {doctor.availability}
          </Text>
        </View>
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
              Doctores
            </Text>
            <View style={styles.headerRight} />
          </View>
          <Text style={[styles.clinicName, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
            {clinic?.name || 'Clínica'}
          </Text>
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
                placeholder="Buscar doctor..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
            </View>
          </View>

          {/* Doctors List */}
          <View style={styles.doctorsContainer}>
            {isWeb ? (
              <View style={styles.webGrid}>
                {filteredDoctors.map(renderDoctorCard)}
              </View>
            ) : (
              <View style={styles.mobileList}>
                {filteredDoctors.map(renderDoctorCard)}
              </View>
            )}

            {filteredDoctors.length === 0 && (
              <View style={styles.emptyResults}>
                <Ionicons name="people-outline" size={64} color="#CCC" />
                <Text style={[styles.emptyResultsTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                  No se encontraron doctores
                </Text>
                <Text style={[styles.emptyResultsSubtitle, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  {searchQuery ? 'Intenta con otros términos de búsqueda' : 'No hay doctores disponibles en esta clínica'}
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
    marginBottom: 8,
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
  clinicName: {
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
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
  doctorsContainer: {
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
  doctorCard: {
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
  webDoctorCard: {
    flex: '0 1 400px',
    maxWidth: 450,
    minWidth: 350,
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
    marginBottom: 8,
  },
  doctorDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  experienceText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  availabilityText: {
    color: '#34C759',
    fontWeight: '500',
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

export default ClinicDoctors; 