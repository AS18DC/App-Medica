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
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isWeb, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';
import { useDoctor } from '../../context/DoctorContext';

const DoctorDashboard = ({ navigation }) => {
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  
    // Use shared context
  const {
    patients,
    pendingRequests,
    upcomingAppointments,
    addPatient,
    removePendingRequest,
    addUpcomingAppointment,
    appointments,
    updateAppointments,
    availability,
    updateAvailability,
  } = useDoctor();



  // Mock data for statistics
  const stats = {
    appointments: 12,
    requests: pendingRequests.length,
    patients: patients.length,
  };



  const handleAcceptRequest = (request) => {
    Alert.alert(
      'Aceptar solicitud',
      `¿Aceptar la solicitud de ${request.patientName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Aceptar', 
          onPress: () => {
            // Remove from pending requests
            removePendingRequest(request.id);
            
            // Add to patients list
            const newPatient = {
              name: request.patientName,
              image: request.patientImage,
              lastVisit: new Date().toISOString().split('T')[0],
              nextAppointment: request.date,
              unreadMessages: 0,
              hasPrescription: false,
              age: request.age,
              email: request.email,
              phone: request.phone,
              consultations: request.consultations,
            };
            addPatient(newPatient);
            
            // Add to upcoming appointments
            const newAppointment = {
              patientName: request.patientName,
              patientImage: request.patientImage,
              type: 'Nueva consulta',
              time: (request.date.split(' ')[1] + ' ' + request.date.split(' ')[2]) || '10:00 AM',
              clinic: request.clinic,
              date: request.date.split(' ')[0] || 'Mañana',
              age: request.age,
              email: request.email,
              phone: request.phone,
              consultations: request.consultations,
            };
            addUpcomingAppointment(newAppointment);
            
            // Add appointment to calendar
            const appointmentDate = new Date();
            if (request.date.includes('Mañana')) {
              appointmentDate.setDate(appointmentDate.getDate() + 1);
            }
            // Use the same date key format as in DoctorContext
            const dateKey = `${appointmentDate.getFullYear()}-${appointmentDate.getMonth()}-${appointmentDate.getDate()}`;
            
            // Get current appointments for this date
            const currentAppointments = appointments[dateKey] || [];
            const newCalendarAppointment = {
              id: Date.now(),
              time: (request.date.split(' ')[1] + ' ' + request.date.split(' ')[2]) || '10:00 AM',
              patient: {
                name: request.patientName,
                reason: request.reason,
                clinic: request.clinic
              }
            };
            
            // Update calendar appointments
            updateAppointments(dateKey, [...currentAppointments, newCalendarAppointment]);
            
            // Update availability - remove the time slot that was booked
            const currentAvailability = availability[dateKey] || [];
            const appointmentTime = (request.date.split(' ')[1] + ' ' + request.date.split(' ')[2]) || '10:00 AM';
            const updatedAvailability = currentAvailability.filter(slot => slot.time !== appointmentTime);
            updateAvailability(dateKey, updatedAvailability);
            
            Alert.alert('Éxito', `Solicitud de ${request.patientName} aceptada. El paciente ha sido agregado a tu lista, la cita ha sido programada y agregada al calendario.`);
          }
        },
      ]
    );
  };

  const handleDeclineRequest = (request) => {
    setSelectedRequest(request);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      Alert.alert('Error', 'Por favor proporciona una razón para rechazar la solicitud');
      return;
    }

    // Remove from pending requests
    removePendingRequest(selectedRequest.id);
    
    // Here you would typically send the rejection reason to the backend
    console.log(`Solicitud rechazada para ${selectedRequest.patientName}. Razón: ${rejectReason}`);
    
    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectReason('');
    
    Alert.alert('Solicitud rechazada', `La solicitud de ${selectedRequest.patientName} ha sido rechazada`);
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

      {/* Reject Reason Modal */}
      <Modal
        visible={showRejectModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
                Rechazar Solicitud
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowRejectModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={[styles.modalText, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
                Por favor, proporciona una razón para rechazar la solicitud de {selectedRequest?.patientName}.
              </Text>
              <TextInput
                style={[styles.rejectReasonInput, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
                placeholder="Razón de rechazo..."
                multiline
                numberOfLines={4}
                value={rejectReason}
                onChangeText={setRejectReason}
              />
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.confirmRejectButton}
                onPress={handleConfirmReject}
              >
                <Text style={[styles.confirmRejectButtonText, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
                  Confirmar Rechazo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelRejectButton}
                onPress={() => setShowRejectModal(false)}
              >
                <Text style={[styles.cancelRejectButtonText, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
                  Cancelar
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
  // Reject Reason Modal Styles
  modalText: {
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  rejectReasonInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: getResponsiveFontSize(14, 15, 16),
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  confirmRejectButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  confirmRejectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cancelRejectButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelRejectButtonText: {
    color: '#333',
    fontWeight: '600',
  },
});

export default DoctorDashboard; 