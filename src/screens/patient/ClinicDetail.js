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

const ClinicDetail = ({ navigation, route }) => {
  const { clinic } = route.params;
  const [activeTab, setActiveTab] = useState('home');

  // Mock clinic data
  const clinicData = {
    ...clinic,
    description: 'Clínica San Lucas es un centro médico integral que ofrece servicios de alta calidad en múltiples especialidades. Contamos con un equipo de profesionales altamente calificados y tecnología de vanguardia para brindar la mejor atención a nuestros pacientes.',
    services: [
      'Consulta General',
      'Cardiología',
      'Vacunación',
      'Primeros Auxilios',
      'Laboratorio',
      'Radiología',
    ],
    doctors: [
      {
        id: 1,
        name: 'Dr. Sofia Ramirez',
        specialty: 'Cardiología',
        experience: '15 años',
        image: 'https://via.placeholder.com/60',
        rating: 4.8,
      },
      {
        id: 2,
        name: 'Dr. Carlos Mendoza',
        specialty: 'Medicina General',
        experience: '12 años',
        image: 'https://via.placeholder.com/60',
        rating: 4.6,
      },
      {
        id: 3,
        name: 'Dr. Ana Torres',
        specialty: 'Pediatría',
        experience: '8 años',
        image: 'https://via.placeholder.com/60',
        rating: 4.9,
      },
    ],
    schedule: {
      monday: '8:00 AM - 8:00 PM',
      tuesday: '8:00 AM - 8:00 PM',
      wednesday: '8:00 AM - 8:00 PM',
      thursday: '8:00 AM - 8:00 PM',
      friday: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Cerrado',
    },
    reviews: [
      {
        id: 1,
        patient: 'Maria G.',
        rating: 5,
        comment: 'Excelente atención, muy profesionales.',
        date: 'Hace 2 días',
      },
      {
        id: 2,
        patient: 'Carlos L.',
        rating: 4,
        comment: 'Buena clínica, personal muy amable.',
        date: 'Hace 1 semana',
      },
      {
        id: 3,
        patient: 'Ana M.',
        rating: 5,
        comment: 'La mejor clínica que he visitado.',
        date: 'Hace 2 semanas',
      },
    ],
  };

  // Mock available doctors for home view
  const availableDoctors = [
    {
      id: 1,
      name: 'Dr. Sofia Ramirez',
      specialty: 'Cardiología',
      experience: '15 años',
      image: 'https://via.placeholder.com/80',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Dr. Carlos Mendoza',
      specialty: 'Dermatología',
      experience: '12 años',
      image: 'https://via.placeholder.com/80',
      rating: 4.6,
    },
    {
      id: 3,
      name: 'Dr. Ana Torres',
      specialty: 'Pediatría',
      experience: '8 años',
      image: 'https://via.placeholder.com/80',
      rating: 4.9,
    },
    {
      id: 4,
      name: 'Dr. Javier Rodriguez',
      specialty: 'Neurología',
      experience: '10 años',
      image: 'https://via.placeholder.com/80',
      rating: 4.7,
    },
  ];

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

  const renderHomeContent = () => (
    <View style={styles.tabContent}>
      {/* Clinic Info */}
      <View style={styles.clinicInfo}>
        <Image source={{ uri: clinicData.image }} style={styles.clinicImage} />
        <View style={styles.clinicDetails}>
          <Text style={styles.clinicName}>{clinicData.name}</Text>
          <Text style={styles.clinicAddress}>{clinicData.address}</Text>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(clinicData.rating)}
            </View>
            <Text style={styles.ratingText}>{clinicData.rating}</Text>
            <Text style={styles.reviewsCount}>({clinicData.reviews.length} reseñas)</Text>
          </View>
        </View>
      </View>

      {/* Specialties */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Especialidades</Text>
        <View style={styles.specialtiesContainer}>
          {clinicData.specialties?.map((specialty, index) => (
            <View key={index} style={styles.specialtyChip}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Available Doctors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Médicos disponibles</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.doctorsScroll}>
          {availableDoctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={styles.doctorCard}
              onPress={() => navigation.navigate('DoctorDetail', { doctor })}
            >
              <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                <Text style={styles.doctorExperience}>{doctor.experience}</Text>
                <View style={styles.doctorRating}>
                  <View style={styles.starsContainer}>
                    {renderStars(doctor.rating)}
                  </View>
                  <Text style={styles.doctorRatingText}>{doctor.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="calendar-outline" size={32} color="#FF9500" />
            <Text style={styles.actionTitle}>Agendar cita</Text>
            <Text style={styles.actionDescription}>Reserva tu consulta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="call-outline" size={32} color="#007AFF" />
            <Text style={styles.actionTitle}>Contactar</Text>
            <Text style={styles.actionDescription}>Llama a la clínica</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="location-outline" size={32} color="#34C759" />
            <Text style={styles.actionTitle}>Ubicación</Text>
            <Text style={styles.actionDescription}>Ver en mapa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderInfoContent = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Sobre la clínica</Text>
      <Text style={styles.descriptionText}>{clinicData.description}</Text>
      
      <Text style={styles.sectionTitle}>Servicios</Text>
      <View style={styles.servicesContainer}>
        {clinicData.services.map((service, index) => (
          <View key={index} style={styles.serviceItem}>
            <Ionicons name="checkmark-circle" size={16} color="#34C759" />
            <Text style={styles.serviceText}>{service}</Text>
          </View>
        ))}
      </View>
      
      <Text style={styles.sectionTitle}>Horarios</Text>
      <View style={styles.scheduleContainer}>
        <View style={styles.scheduleRow}>
          <Text style={styles.scheduleDay}>Lunes - Viernes</Text>
          <Text style={styles.scheduleTime}>{clinicData.schedule.monday}</Text>
        </View>
        <View style={styles.scheduleRow}>
          <Text style={styles.scheduleDay}>Sábado</Text>
          <Text style={styles.scheduleTime}>{clinicData.schedule.saturday}</Text>
        </View>
        <View style={styles.scheduleRow}>
          <Text style={styles.scheduleDay}>Domingo</Text>
          <Text style={styles.scheduleTime}>{clinicData.schedule.sunday}</Text>
        </View>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'info':
        return renderInfoContent();
      case 'doctors':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Médicos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {clinicData.doctors.map((doctor) => (
                <TouchableOpacity
                  key={doctor.id}
                  style={styles.doctorCard}
                  onPress={() => navigation.navigate('DoctorDetail', { doctor })}
                >
                  <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                  <Text style={styles.doctorExperience}>{doctor.experience}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );
      case 'reviews':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Opiniones</Text>
            {clinicData.reviews.map((review) => (
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
          <Text style={styles.headerTitle}>{clinicData.name}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'home' && styles.activeTab]}
            onPress={() => setActiveTab('home')}
          >
            <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>
              Inicio
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'info' && styles.activeTab]}
            onPress={() => setActiveTab('info')}
          >
            <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
              Info
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'doctors' && styles.activeTab]}
            onPress={() => setActiveTab('doctors')}
          >
            <Text style={[styles.tabText, activeTab === 'doctors' && styles.activeTabText]}>
              Médicos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              Opiniones
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
          onPress={() => {}}
        >
          <Ionicons name="call-outline" size={20} color="#007AFF" />
          <Text style={styles.contactButtonText}>Contactar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => {}}
        >
          <Text style={styles.bookButtonText}>Agendar cita</Text>
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
  clinicInfo: {
    flexDirection: 'row',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clinicImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 16,
    marginLeft: 16,
  },
  clinicDetails: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 16,
  },
  clinicName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  clinicAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyChip: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  specialtyText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  doctorsScroll: {
    paddingLeft: 0,
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  doctorExperience: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 8,
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorRatingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  servicesContainer: {
    marginTop: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  scheduleContainer: {
    marginTop: 8,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleDay: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#666',
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

export default ClinicDetail; 