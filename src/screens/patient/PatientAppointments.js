import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isWeb, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';

const PatientAppointments = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Mock patient profile data
  const patientProfile = {
    name: 'María González',
    age: 28,
    email: 'maria.gonzalez@email.com',
    phone: '+1 234 567 8901',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    consultations: [
      {
        id: 1,
        date: '10/01/2024',
        doctor: 'Dr. Ana Torres',
        reason: 'Control de presión arterial',
        diagnosis: 'Hipertensión leve',
        treatment: 'Lisinopril 10mg diario',
        status: 'Completada',
      },
      {
        id: 2,
        date: '15/01/2024',
        doctor: 'Dr. Sofia Ramirez',
        reason: 'Consulta de seguimiento',
        diagnosis: 'Pendiente',
        treatment: 'Pendiente',
        status: 'Pendiente',
      },
    ],
  };

  // Mock appointments data
  const upcomingAppointments = [
    {
      id: 1,
      doctor: {
        name: 'Dr. Sofia Ramirez',
        specialty: 'Cardiología',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      },
      date: '15 Ene 2024',
      time: '10:00 AM',
      type: 'Consulta de seguimiento',
      status: 'confirmed',
    },
    {
      id: 2,
      doctor: {
        name: 'Dr. Carlos Mendoza',
        specialty: 'Dermatología',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      },
      date: '18 Ene 2024',
      time: '2:30 PM',
      type: 'Revisión de tratamiento',
      status: 'pending',
    },
  ];

  const pastAppointments = [
    {
      id: 3,
      doctor: {
        name: 'Dr. Ana Torres',
        specialty: 'Pediatría',
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      },
      date: '10 Ene 2024',
      time: '9:00 AM',
      type: 'Consulta inicial',
      status: 'completed',
    },
    {
      id: 4,
      doctor: {
        name: 'Dr. Javier Rodriguez',
        specialty: 'Neurología',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face',
      },
      date: '5 Ene 2024',
      time: '11:30 AM',
      type: 'Seguimiento',
      status: 'completed',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#34C759';
      case 'pending':
        return '#FF9500';
      case 'completed':
        return '#007AFF';
      default:
        return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'completed':
        return 'Completada';
      default:
        return 'Desconocido';
    }
  };

  const handleProfilePress = () => {
    setShowProfileModal(true);
  };

  const renderAppointmentCard = (appointment) => (
    <TouchableOpacity
      key={appointment.id}
      style={[styles.appointmentCard, isWeb && styles.webAppointmentCard]}
      onPress={() => navigation.navigate('AppointmentDetails', { appointment })}
    >
      <View style={styles.appointmentHeader}>
        <Image source={{ uri: appointment.doctor.image }} style={styles.doctorImage} />
        <View style={styles.appointmentInfo}>
          <Text style={[styles.doctorName, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
            {appointment.doctor.name}
          </Text>
          <Text style={[styles.doctorSpecialty, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
            {appointment.doctor.specialty}
          </Text>
          <Text style={[styles.appointmentType, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
            {appointment.type}
          </Text>
        </View>
        <View style={styles.appointmentTime}>
          <Text style={[styles.dateText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
            {appointment.date}
          </Text>
          <Text style={[styles.timeText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
            {appointment.time}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(appointment.status) }
          ]}>
            <Text style={[styles.statusText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
              {getStatusText(appointment.status)}
            </Text>
          </View>
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
              Mis Citas
            </Text>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={handleProfilePress}
            >
              <Ionicons name="person-circle" size={getResponsiveFontSize(24, 26, 28)} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
              { fontSize: getResponsiveFontSize(16, 17, 18) }
            ]}>
              Próximas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'past' && styles.activeTab]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'past' && styles.activeTabText,
              { fontSize: getResponsiveFontSize(16, 17, 18) }
            ]}>
              Pasadas
            </Text>
          </TouchableOpacity>
        </View>

        {/* Appointments List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.appointmentsContainer, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            {activeTab === 'upcoming' ? (
              upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(renderAppointmentCard)
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="calendar-outline" size={64} color="#CCC" />
                  <Text style={[styles.emptyStateTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                    No tienes citas próximas
                  </Text>
                  <Text style={[styles.emptyStateSubtitle, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                    Busca un doctor y agenda tu próxima cita
                  </Text>
                </View>
              )
            ) : (
              pastAppointments.length > 0 ? (
                pastAppointments.map(renderAppointmentCard)
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="checkmark-circle-outline" size={64} color="#CCC" />
                  <Text style={[styles.emptyStateTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                    No hay citas pasadas
                  </Text>
                  <Text style={[styles.emptyStateSubtitle, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                    Aquí aparecerán tus citas completadas
                  </Text>
                </View>
              )
            )}
          </View>
        </ScrollView>
      </View>

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
                Mi Perfil
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowProfileModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.profileInfo}>
                <Image source={{ uri: patientProfile.image }} style={styles.profileImage} />
                <Text style={[styles.profileName, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                  {patientProfile.name}
                </Text>
                <Text style={[styles.profileDetails, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Edad: {patientProfile.age} años
                </Text>
                <Text style={[styles.profileDetails, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Email: {patientProfile.email}
                </Text>
                <Text style={[styles.profileDetails, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Teléfono: {patientProfile.phone}
                </Text>
              </View>

              <View style={styles.consultationsSection}>
                <Text style={[styles.consultationsTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                  Historial de Consultas
                </Text>
                {patientProfile.consultations.map((consultation, index) => (
                  <View key={consultation.id} style={styles.consultationCard}>
                    <View style={styles.consultationHeader}>
                      <Text style={[styles.consultationDate, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
                        {consultation.date}
                      </Text>
                      <View style={[
                        styles.statusBadge,
                        consultation.status === 'Completada' ? styles.statusCompleted : styles.statusPending
                      ]}>
                        <Text style={[styles.statusText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                          {consultation.status}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.consultationLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      Doctor: {consultation.doctor}
                    </Text>
                    <Text style={[styles.consultationLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      Motivo:
                    </Text>
                    <Text style={[styles.consultationText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      {consultation.reason}
                    </Text>
                    {consultation.diagnosis !== 'Pendiente' && (
                      <>
                        <Text style={[styles.consultationLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          Diagnóstico:
                        </Text>
                        <Text style={[styles.consultationText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          {consultation.diagnosis}
                        </Text>
                        <Text style={[styles.consultationLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          Tratamiento:
                        </Text>
                        <Text style={[styles.consultationText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          {consultation.treatment}
                        </Text>
                      </>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
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
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  profileButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  appointmentsContainer: {
    // paddingHorizontal: 20, // This is now handled by the content view
  },
  appointmentCard: {
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
  webAppointmentCard: {
    ...webStyles.shadow,
    ...webStyles.borderRadius,
    ...webStyles.padding,
    ...webStyles.marginBottom,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  doctorSpecialty: {
    color: '#666',
  },
  appointmentType: {
    color: '#666',
    marginTop: 4,
  },
  appointmentTime: {
    alignItems: 'flex-end',
  },
  dateText: {
    color: '#666',
    marginBottom: 4,
  },
  timeText: {
    color: '#666',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontWeight: '500',
  },
  statusCompleted: {
    backgroundColor: '#34C759',
  },
  statusPending: {
    backgroundColor: '#FF9500',
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    ...webStyles.shadow,
    ...webStyles.borderRadius,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    padding: 16,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  profileDetails: {
    color: '#666',
    marginBottom: 4,
  },
  consultationsSection: {
    marginTop: 20,
  },
  consultationsTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  consultationCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  consultationDate: {
    fontWeight: '500',
    color: '#1A1A1A',
  },
  consultationLabel: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  consultationText: {
    color: '#666',
    marginBottom: 4,
  },
});

export default PatientAppointments; 