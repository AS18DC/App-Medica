import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isWeb, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';

const DoctorDashboard = ({ navigation }) => {
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      patientName: 'Ana Torres',
      patientImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      reason: 'Dolor de cabeza persistente y mareos frecuentes',
      date: 'Mañana 10:00 AM',
      clinic: 'Clínica San Martín',
      status: 'pending',
      age: 32,
      email: 'ana.torres@email.com',
      phone: '+1 234 567 8903',
      consultations: [
        {
          id: 1,
          date: '15/07/2024',
          reason: 'Dolor de cabeza persistente y mareos frecuentes',
          diagnosis: 'Migraña tensional',
          treatment: 'Ibuprofeno 400mg cada 8 horas',
          status: 'Pendiente',
        },
      ],
    },
    {
      id: 2,
      patientName: 'Luis Fernández',
      patientImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      reason: 'Control de presión arterial y revisión de medicación',
      date: 'Mañana 02:00 PM',
      clinic: 'Centro Médico Santa María',
      status: 'pending',
      age: 45,
      email: 'luis.fernandez@email.com',
      phone: '+1 234 567 8904',
      consultations: [
        {
          id: 1,
          date: '12/07/2024',
          reason: 'Control de presión arterial',
          diagnosis: 'Hipertensión arterial',
          treatment: 'Lisinopril 10mg diario',
          status: 'Completada',
        },
        {
          id: 2,
          date: 'Mañana 02:00 PM',
          reason: 'Control de presión arterial y revisión de medicación',
          diagnosis: 'Pendiente',
          treatment: 'Pendiente',
          status: 'Pendiente',
        },
      ],
    },
  ]);

  // Mock data for statistics
  const stats = {
    appointments: 12,
    requests: pendingRequests.length,
    patients: 28,
  };

  // Mock data for upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      patientName: 'María González',
      patientImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      type: 'Consulta de seguimiento',
      time: '09:00 AM',
      clinic: 'Clínica San Martín',
      date: 'Hoy',
      age: 28,
      email: 'maria.gonzalez@email.com',
      phone: '+1 234 567 8905',
      consultations: [
        {
          id: 1,
          date: '10/07/2024',
          reason: 'Control de presión arterial',
          diagnosis: 'Hipertensión leve',
          treatment: 'Lisinopril 10mg diario',
          status: 'Completada',
        },
        {
          id: 2,
          date: 'Hoy 09:00 AM',
          reason: 'Consulta de seguimiento',
          diagnosis: 'Pendiente',
          treatment: 'Pendiente',
          status: 'Pendiente',
        },
      ],
    },
    {
      id: 2,
      patientName: 'Carlos Rodríguez',
      patientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      type: 'Primera consulta',
      time: '11:30 AM',
      clinic: 'Centro Médico Santa María',
      date: 'Hoy',
      age: 35,
      email: 'carlos.rodriguez@email.com',
      phone: '+1 234 567 8906',
      consultations: [
        {
          id: 1,
          date: 'Hoy 11:30 AM',
          reason: 'Primera consulta',
          diagnosis: 'Pendiente',
          treatment: 'Pendiente',
          status: 'Pendiente',
        },
      ],
    },
  ];



  const handleAcceptRequest = (request) => {
    Alert.alert(
      'Aceptar solicitud',
      `¿Aceptar la solicitud de ${request.patientName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Aceptar', 
          onPress: () => {
            setPendingRequests(prev => prev.filter(req => req.id !== request.id));
            Alert.alert('Éxito', `Solicitud de ${request.patientName} aceptada`);
          }
        },
      ]
    );
  };

  const handleDeclineRequest = (request) => {
    Alert.alert(
      'Rechazar solicitud',
      `¿Rechazar la solicitud de ${request.patientName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Rechazar', 
          style: 'destructive', 
          onPress: () => {
            setPendingRequests(prev => prev.filter(req => req.id !== request.id));
            Alert.alert('Solicitud rechazada', `La solicitud de ${request.patientName} ha sido rechazada`);
          }
        },
      ]
    );
  };

  const handleChatWithPatient = (appointment) => {
    navigation.navigate('DoctorChat', {
      patient: { name: appointment.patientName },
      appointment: { date: appointment.date },
    });
  };

  const handlePatientPress = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  const renderStatCard = (title, value, icon, color) => (
    <View style={[styles.statCard, isWeb && styles.webStatCard]}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={getResponsiveFontSize(16, 18, 20)} color="#FFFFFF" />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
          {value}
        </Text>
        <Text style={[styles.statTitle, { fontSize: getResponsiveFontSize(10, 11, 12) }]}>
          {title}
        </Text>
      </View>
    </View>
  );

  const renderUpcomingAppointment = (appointment) => (
    <TouchableOpacity
      key={appointment.id}
      style={[styles.appointmentCard, isWeb && styles.webAppointmentCard]}
      onPress={() => handlePatientPress(appointment)}
    >
      <View style={styles.appointmentHeader}>
        <View style={styles.patientImageContainer}>
          <Image source={{ uri: appointment.patientImage }} style={styles.patientImage} />
        </View>
        <View style={styles.appointmentInfo}>
          <Text style={[styles.patientName, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
            {appointment.patientName}
          </Text>
          <Text style={[styles.appointmentType, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
            {appointment.type}
          </Text>
          <Text style={[styles.appointmentTime, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
            {appointment.time} - {appointment.date}
          </Text>
          <Text style={[styles.clinicName, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
            {appointment.clinic}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={(e) => {
            e.stopPropagation();
            handleChatWithPatient(appointment);
          }}
        >
          <Ionicons name="chatbubble" size={getResponsiveFontSize(20, 22, 24)} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderPendingRequest = (request) => (
    <View key={request.id} style={[styles.requestCard, isWeb && styles.webRequestCard]}>
      <TouchableOpacity
        style={styles.requestHeader}
        onPress={() => handlePatientPress(request)}
      >
        <View style={styles.patientImageContainer}>
          <Image source={{ uri: request.patientImage }} style={styles.patientImage} />
        </View>
        <View style={styles.requestInfo}>
          <Text style={[styles.patientName, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
            {request.patientName}
          </Text>
          <Text style={[styles.clinicName, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
            {request.clinic} - {request.date}
          </Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.requestDetails}>
        <Text style={[styles.reasonLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
          Motivo de consulta:
        </Text>
        <Text style={[styles.reasonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
          {request.reason}
        </Text>
      </View>

      <View style={styles.requestActions}>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={() => handleDeclineRequest(request)}
        >
          <Text style={[styles.declineButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
            Rechazar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAcceptRequest(request)}
        >
          <Text style={[styles.acceptButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
            Aceptar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
              Panel del Doctor
            </Text>
            <View style={styles.headerRight} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Statistics */}
          <View style={[styles.statsContainer, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            {isWeb ? (
              <View style={styles.webStatsGrid}>
                {renderStatCard('Citas', stats.appointments, 'calendar', '#007AFF')}
                {renderStatCard('Solicitudes', stats.requests, 'document-text', '#FF9500')}
                {renderStatCard('Pacientes', stats.patients, 'people', '#34C759')}
              </View>
            ) : (
              <View style={styles.statsGrid}>
                {renderStatCard('Citas', stats.appointments, 'calendar', '#007AFF')}
                {renderStatCard('Solicitudes', stats.requests, 'document-text', '#FF9500')}
                {renderStatCard('Pacientes', stats.patients, 'people', '#34C759')}
              </View>
            )}
          </View>

          {/* Upcoming Appointments */}
          <View style={[styles.section, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
              Próximas citas
            </Text>
            <View style={styles.appointmentsList}>
              {upcomingAppointments.map(renderUpcomingAppointment)}
            </View>
          </View>

          {/* Pending Requests */}
          <View style={[styles.section, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
              Solicitudes pendientes
            </Text>
            <View style={styles.requestsList}>
              {pendingRequests.map(renderPendingRequest)}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Patient Details Modal */}
      <Modal
        visible={showPatientModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPatientModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
                Detalles del Paciente
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPatientModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedPatient && (
                <>
                  <View style={styles.patientInfo}>
                    <Text style={[styles.patientInfoTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                      {selectedPatient.patientName}
                    </Text>
                    <Text style={[styles.patientInfoText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      Edad: {selectedPatient.age || 'N/A'} años
                    </Text>
                    <Text style={[styles.patientInfoText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      Email: {selectedPatient.email || 'N/A'}
                    </Text>
                    <Text style={[styles.patientInfoText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      Teléfono: {selectedPatient.phone || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.consultationsSection}>
                    <Text style={[styles.consultationsTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                      Historial de Consultas
                    </Text>
                                        {selectedPatient.consultations && selectedPatient.consultations.map((consultation, index) => (
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
                </>
              )}
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
  statsContainer: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  webStatsGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: getResponsiveSpacing(16, 24, 32),
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  webStatCard: {
    flex: '0 1 150px',
    maxWidth: 180,
    minWidth: 120,
  },
  statIcon: {
    width: getResponsiveSpacing(32, 36, 40),
    height: getResponsiveSpacing(32, 36, 40),
    borderRadius: getResponsiveSpacing(16, 18, 20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statTitle: {
    color: '#666',
  },
  section: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  appointmentsList: {
    gap: getResponsiveSpacing(12, 16, 20),
  },
  requestsList: {
    gap: getResponsiveSpacing(12, 16, 20),
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  webRequestCard: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  patientImageContainer: {
    marginRight: 12,
  },
  patientImage: {
    width: getResponsiveSpacing(40, 45, 50),
    height: getResponsiveSpacing(40, 45, 50),
    borderRadius: getResponsiveSpacing(20, 22, 25),
  },
  appointmentInfo: {
    flex: 1,
  },
  requestInfo: {
    flex: 1,
  },
  patientName: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  appointmentType: {
    color: '#666',
    marginBottom: 2,
  },
  appointmentTime: {
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 2,
  },
  clinicName: {
    color: '#999',
  },
  chatButton: {
    padding: 8,
  },
  requestDetails: {
    marginBottom: 16,
  },
  reasonLabel: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  reasonText: {
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  declineButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
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
    maxHeight: '90%',
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
  patientInfo: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  patientInfoTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  patientInfoText: {
    color: '#666',
    marginBottom: 4,
  },
  consultationsSection: {
    gap: 16,
  },
  consultationsTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  consultationCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  consultationDate: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: '#34C759',
  },
  statusPending: {
    backgroundColor: '#FF9500',
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  consultationLabel: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    marginTop: 8,
  },
  consultationText: {
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default DoctorDashboard; 