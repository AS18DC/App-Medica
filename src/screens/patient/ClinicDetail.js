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
    specialties: [
      'Cardiología',
      'Dermatología',
      'Endocrinología',
      'Gastroenterología',
      'Ginecología',
      'Neurología',
      'Oftalmología',
      'Ortopedia',
      'Pediatría',
      'Psiquiatría',
      'Radiología',
      'Urología',
      'Medicina General',
      'Fisioterapia',
      'Nutrición',
    ],
    services: [
      'Consulta General',
      'Cardiología',
      'Vacunación',
      'Primeros Auxilios',
      'Laboratorio',
      'Radiología',
      'Ecografías',
      'Tomografías',
      'Resonancia Magnética',
      'Análisis de Sangre',
      'Electrocardiograma',
      'Espirometría',
    ],
    doctors: [
      {
        id: 1,
        name: 'Dr. Sofia Ramirez',
        specialty: 'Cardiología',
        experience: '15 años',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
        rating: 4.8,
      },
      {
        id: 2,
        name: 'Dr. Carlos Mendoza',
        specialty: 'Medicina General',
        experience: '12 años',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
        rating: 4.6,
      },
      {
        id: 3,
        name: 'Dr. Ana Torres',
        specialty: 'Pediatría',
        experience: '8 años',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face',
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
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Dr. Carlos Mendoza',
      specialty: 'Dermatología',
      experience: '12 años',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      rating: 4.6,
    },
    {
      id: 3,
      name: 'Dr. Ana Torres',
      specialty: 'Pediatría',
      experience: '8 años',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
    },
    {
      id: 4,
      name: 'Dr. Javier Rodriguez',
      specialty: 'Neurología',
      experience: '10 años',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face',
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
        <Text style={styles.sectionTitle}>Especialidades Médicas</Text>
        <View style={styles.specialtiesContainer}>
          {clinicData.specialties?.map((specialty, index) => (
            <View key={index} style={styles.specialtyChip}>
              <Ionicons name="medical" size={14} color="#FFFFFF" style={styles.specialtyIcon} />
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.specialtiesNote}>
          Contamos con {clinicData.specialties?.length} especialidades médicas
        </Text>
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
            <Ionicons name="calendar-outline" size={28} color="#FF9500" />
            <Text style={styles.actionTitle}>Agendar cita</Text>
            <Text style={styles.actionDescription}>Reserva tu consulta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="call-outline" size={28} color="#007AFF" />
            <Text style={styles.actionTitle}>Contactar</Text>
            <Text style={styles.actionDescription}>Llama a la clínica</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="location-outline" size={28} color="#34C759" />
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
      case 'doctors':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Médicos</Text>
            <View style={styles.doctorsVerticalContainer}>
              {clinicData.doctors.map((doctor) => (
                <TouchableOpacity
                  key={doctor.id}
                  style={styles.doctorHorizontalCard}
                  onPress={() => navigation.navigate('DoctorDetail', { doctor })}
                >
                  <Image source={{ uri: doctor.image }} style={styles.doctorHorizontalImage} />
                  <View style={styles.doctorHorizontalInfo}>
                    <Text style={styles.doctorHorizontalName}>{doctor.name}</Text>
                    <Text style={styles.doctorHorizontalSpecialty}>{doctor.specialty}</Text>
                    <Text style={styles.doctorHorizontalExperience}>{doctor.experience}</Text>
                    <View style={styles.doctorHorizontalRating}>
                      <View style={styles.starsContainer}>
                        {renderStars(doctor.rating)}
                      </View>
                      <Text style={styles.doctorHorizontalRatingText}>{doctor.rating}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 'info':
        return renderInfoContent();
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
            style={[styles.tab, activeTab === 'doctors' && styles.activeTab]}
            onPress={() => setActiveTab('doctors')}
          >
            <Text style={[styles.tabText, activeTab === 'doctors' && styles.activeTabText]}>
              Médicos
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 32,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginHorizontal: 1,
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
  },
  tabContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  clinicInfo: {
    flexDirection: 'row',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  clinicImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    marginLeft: 12,
  },
  clinicDetails: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 12,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  clinicAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 3,
  },
  reviewsCount: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  specialtyChip: {
    backgroundColor: '#7B909E', // Un gris neutro, un poco más oscuro que el blanco
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centra el contenido horizontalmente también
    
    // Sombra para el efecto de "luz" (arriba y a la izquierda)
    shadowColor: '#fff',
    shadowOffset: { width: -5, height: -5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    
    // Sombra para el efecto de "oscuridad" (abajo y a la derecha)
    // Esta sombra requiere un View o componente adicional en React Native para aplicarse
    // Por simplicidad, se puede simular con una única sombra si es necesario
    elevation: 10, // Sombra para Android
  },


  specialtyIcon: {
    marginRight: 4,
  },
  specialtyText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  specialtiesNote: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 6,
    textAlign: 'center',
  },
  specialtiesDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  specialtyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  specialtyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  specialtyCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  specialtiesStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  doctorsVerticalContainer: {
    gap: 12,
  },
  doctorVerticalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  doctorVerticalImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
    alignSelf: 'center',
  },
  doctorVerticalInfo: {
    alignItems: 'center',
  },
  doctorVerticalName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
    textAlign: 'center',
  },
  doctorVerticalSpecialty: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    textAlign: 'center',
  },
  doctorVerticalExperience: {
    fontSize: 10,
    color: '#007AFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  doctorVerticalRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorVerticalRatingText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 3,
  },
  doctorsScroll: {
    paddingLeft: 0,
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    width: 140,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  doctorExperience: {
    fontSize: 10,
    color: '#007AFF',
    marginBottom: 6,
  },
  doctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorRatingText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 3,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 8,
    marginBottom: 2,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  servicesContainer: {
    marginTop: 6,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  serviceText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  scheduleContainer: {
    marginTop: 6,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  scheduleDay: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  scheduleTime: {
    fontSize: 13,
    color: '#666',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewPatient: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  reviewDate: {
    fontSize: 10,
    color: '#666',
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  reviewComment: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 6,
    marginRight: 6,
  },
  contactButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  bookButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  doctorHorizontalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  doctorHorizontalImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  doctorHorizontalInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorHorizontalName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  doctorHorizontalSpecialty: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  doctorHorizontalExperience: {
    fontSize: 10,
    color: '#007AFF',
    marginBottom: 6,
  },
  doctorHorizontalRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorHorizontalRatingText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 3,
  },
});

export default ClinicDetail; 