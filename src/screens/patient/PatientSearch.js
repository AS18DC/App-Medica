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

const PatientSearch = ({ navigation, route }) => {
  const { query = '', filterType = 'doctor' } = route.params || {};
  const [searchQuery, setSearchQuery] = useState(query);
  const [selectedFilter, setSelectedFilter] = useState(filterType);

  // Mock data for search results
  const searchResults = [
    {
      id: 1,
      name: 'Dr. Sofia Ramirez',
      specialty: 'Cardiología',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      distance: '0.5 km',
      experience: '10 años',
      isFavorite: false,
    },
    {
      id: 2,
      name: 'Dr. Javier Rodriguez',
      specialty: 'Dermatología',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      distance: '1.2 km',
      experience: '8 años',
      isFavorite: true,
    },
    {
      id: 3,
      name: 'Dr. Ana Torres',
      specialty: 'Pediatría',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      distance: '0.8 km',
      experience: '12 años',
      isFavorite: false,
    },
  ];

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleDoctorPress = (doctor) => {
    navigation.navigate('DoctorDetail', { doctor });
  };

  const toggleFavorite = (doctorId) => {
    // Implement favorite toggle functionality
    console.log('Toggle favorite for doctor:', doctorId);
  };

  const renderDoctorResult = (doctor) => (
    <TouchableOpacity
      key={doctor.id}
      style={[
        styles.doctorResult,
        isWeb && styles.webDoctorResult,
        isWeb && webStyles.card,
        isWeb && webStyles.button,
      ]}
      onPress={() => handleDoctorPress(doctor)}
    >
      <View style={styles.doctorResultContent}>
        <Image source={{ uri: doctor.image }} style={styles.doctorResultImage} />
        <View style={styles.doctorResultInfo}>
          <Text style={[styles.doctorResultName, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
            {doctor.name}
          </Text>
          <Text style={[styles.doctorResultSpecialty, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
            {doctor.specialty}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={getResponsiveFontSize(14, 15, 16)} color="#FFD700" />
            <Text style={[styles.ratingText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
              {doctor.rating}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(doctor.id)}
        >
          <Ionicons 
            name={doctor.isFavorite ? "heart" : "heart-outline"} 
            size={getResponsiveFontSize(20, 22, 24)} 
            color={doctor.isFavorite ? "#FF3B30" : "#CCC"} 
          />
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
              Resultados de la búsqueda
            </Text>
            <View style={styles.headerRight} />
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Bar */}
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
                placeholder="Buscar..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setSelectedFilter(selectedFilter === 'doctor' ? 'clinic' : 'doctor')}
              >
                <Ionicons 
                  name="filter" 
                  size={getResponsiveFontSize(20, 22, 24)} 
                  color="#007AFF" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Results */}
          <View style={styles.resultsContainer}>
            {isWeb ? (
              <View style={styles.webGrid}>
                {searchResults.map(renderDoctorResult)}
              </View>
            ) : (
              <View style={styles.mobileList}>
                {searchResults.map(renderDoctorResult)}
              </View>
            )}

            {searchResults.length === 0 && (
              <View style={styles.emptyResults}>
                <Ionicons name="search-outline" size={64} color="#CCC" />
                <Text style={[styles.emptyResultsTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                  No se encontraron resultados
                </Text>
                <Text style={[styles.emptyResultsSubtitle, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Intenta con otros términos de búsqueda
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
  filterButton: {
    padding: 8,
  },
  resultsContainer: {
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
  doctorResult: {
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
  webDoctorResult: {
    flex: '0 1 400px',
    maxWidth: 450,
    minWidth: 350,
  },
  doctorResultContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorResultImage: {
    width: getResponsiveSpacing(60, 70, 80),
    height: getResponsiveSpacing(60, 70, 80),
    borderRadius: getResponsiveSpacing(30, 35, 40),
    marginRight: 16,
  },
  doctorResultInfo: {
    flex: 1,
  },
  doctorResultName: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  doctorResultSpecialty: {
    color: '#666',
    marginBottom: 8,
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
  favoriteButton: {
    padding: 8,
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

export default PatientSearch; 