import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DoctorDetail = ({ navigation, route }) => {
  const { doctor } = route.params;
  const [activeTab, setActiveTab] = useState('about');

  // Mock data for the doctor
  const doctorData = {
    ...doctor,
    experience: '15 años',
    education: 'Universidad de Medicina de Madrid',
    languages: ['Español', 'Inglés'],
    about: 'La Dra. Sofia Ramirez es una cardióloga altamente calificada con más de 15 años de experiencia en el diagnóstico y tratamiento de enfermedades cardiovasculares. Se especializa en cardiología preventiva y rehabilitación cardíaca.',
    reviews: [
      {
        id: 1,
        patient: 'Maria G.',
        rating: 5,
        comment: 'Excelente doctora, muy profesional y atenta.',
        date: 'Hace 2 días',
      },
      {
        id: 2,
        patient: 'Carlos L.',
        rating: 4,
        comment: 'Muy buena atención, explica todo claramente.',
        date: 'Hace 1 semana',
      },
      {
        id: 3,
        patient: 'Ana M.',
        rating: 5,
        comment: 'La mejor cardióloga que he visitado.',
        date: 'Hace 2 semanas',
      },
    ],
    availability: {
      schedule: 'Lunes a Viernes: 9:00 AM - 6:00 PM',
      location: 'Clínica de Salud Integral',
      address: 'Calle Principal 123, Madrid',
    },
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color={i <= rating ? '#FFD700' : '#DDD'}
        />
      );
    }
    return stars;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Biografía</Text>
            <Text style={styles.aboutText}>{doctorData.about}</Text>
            
            <Text style={styles.sectionTitle}>Experiencia Profesional</Text>
            <View style={styles.experienceItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.experienceText}>{doctorData.experience} de experiencia</Text>
            </View>
            <View style={styles.experienceItem}>
              <Ionicons name="school-outline" size={16} color="#666" />
              <Text style={styles.experienceText}>{doctorData.education}</Text>
            </View>
            <View style={styles.experienceItem}>
              <Ionicons name="language-outline" size={16} color="#666" />
              <Text style={styles.experienceText}>{doctorData.languages.join(', ')}</Text>
            </View>
            
            <Text style={styles.sectionTitle}>Calificaciones de Pacientes</Text>
            <View style={styles.ratingBreakdown}>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingLabel}>5 estrellas</Text>
                <View style={styles.ratingBar}>
                  <View style={[styles.ratingFill, { width: '80%' }]} />
                </View>
                <Text style={styles.ratingPercent}>80%</Text>
              </View>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingLabel}>4 estrellas</Text>
                <View style={styles.ratingBar}>
                  <View style={[styles.ratingFill, { width: '15%' }]} />
                </View>
                <Text style={styles.ratingPercent}>15%</Text>
              </View>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingLabel}>3 estrellas</Text>
                <View style={styles.ratingBar}>
                  <View style={[styles.ratingFill, { width: '3%' }]} />
                </View>
                <Text style={styles.ratingPercent}>3%</Text>
              </View>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingLabel}>2 estrellas</Text>
                <View style={styles.ratingBar}>
                  <View style={[styles.ratingFill, { width: '1%' }]} />
                </View>
                <Text style={styles.ratingPercent}>1%</Text>
              </View>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingLabel}>1 estrella</Text>
                <View style={styles.ratingBar}>
                  <View style={[styles.ratingFill, { width: '1%' }]} />
                </View>
                <Text style={styles.ratingPercent}>1%</Text>
              </View>
            </View>
          </View>
        );
      
      case 'reviews':
        return (
          <View style={styles.tabContent}>
            {doctorData.reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewPatient}>{review.patient}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <View style={styles.reviewStars}>
                  {renderStars(review.rating)}
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>
        );
      
      case 'availability':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Horario de Atención</Text>
            <View style={styles.availabilityItem}>
              <Ionicons name="time-outline" size={20} color="#007AFF" />
              <Text style={styles.availabilityText}>{doctorData.availability.schedule}</Text>
            </View>
            
            <Text style={styles.sectionTitle}>Ubicación</Text>
            <View style={styles.availabilityItem}>
              <Ionicons name="location-outline" size={20} color="#007AFF" />
              <Text style={styles.availabilityText}>{doctorData.availability.location}</Text>
            </View>
            <Text style={styles.addressText}>{doctorData.availability.address}</Text>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{doctorData.name}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Doctor Info */}
        <View style={styles.doctorInfo}>
          <Image source={{ uri: doctorData.image }} style={styles.doctorImage} />
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{doctorData.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctorData.specialty}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(doctorData.rating)}
              </View>
              <Text style={styles.ratingText}>{doctorData.rating}</Text>
              <Text style={styles.reviewsCount}>({doctorData.reviews.length} reseñas)</Text>
            </View>
            <Text style={styles.experienceText}>{doctorData.experience} de experiencia</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.activeTab]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              Reviews
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'availability' && styles.activeTab]}
            onPress={() => setActiveTab('availability')}
          >
            <Text style={[styles.tabText, activeTab === 'availability' && styles.activeTabText]}>
              Availability
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => navigation.navigate('ChatScreen', { doctor: doctorData })}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#007AFF" />
          <Text style={styles.contactButtonText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('BookAppointment', { doctor: doctorData })}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 32,
  },
  doctorInfo: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  doctorDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 16,
    color: '#666',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 4,
  },
  reviewsCount: {
    fontSize: 14,
    color: '#666',
  },
  experienceText: {
    fontSize: 14,
    color: '#666',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    marginTop: 20,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  experienceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  experienceText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  ratingBreakdown: {
    marginTop: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#666',
    width: 60,
  },
  ratingBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  ratingFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  ratingPercent: {
    fontSize: 12,
    color: '#666',
    width: 30,
    textAlign: 'right',
  },
  reviewCard: {
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
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewPatient: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  availabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  availabilityText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 32,
    marginTop: 4,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    marginRight: 8,
  },
  contactButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  bookButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default DoctorDetail; 