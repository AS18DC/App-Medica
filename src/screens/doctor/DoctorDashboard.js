// --Imports de React--
// Importa las funcionalidades básicas de React y hooks de estado
import React, { useState } from 'react';

// --Imports de React Native--
// Importa componentes básicos de React Native para la interfaz
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

// --Imports de iconos--
// Importa iconos de Ionicons para la interfaz de usuario
import { Ionicons } from '@expo/vector-icons';

// --Imports de utilidades responsivas--
// Importa funciones para hacer la interfaz responsiva en diferentes dispositivos
import { isWeb, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';

// --Imports de contexto--
// Importa el contexto del doctor para acceder a datos y funciones
import { useDoctor } from '../../context/DoctorContext';

const DoctorDashboard = ({ navigation }) => {
  // --Estado del modal de paciente--
  // Controla la visibilidad del modal que muestra detalles del paciente
  const [showPatientModal, setShowPatientModal] = useState(false);
  
  // --Estado de paciente seleccionado--
  // Almacena el paciente seleccionado para mostrar en el modal
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // --Estado del modal de rechazo--
  // Controla la visibilidad del modal para rechazar solicitudes
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  // --Estado de solicitud seleccionada--
  // Almacena la solicitud seleccionada para rechazar
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // --Estado de razón de rechazo--
  // Almacena la razón ingresada para rechazar una solicitud
  const [rejectReason, setRejectReason] = useState('');
  
  // --Contexto del doctor--
  // Obtiene datos y funciones del contexto del doctor
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

  // --Estadísticas--
  // Datos simulados para las estadísticas del dashboard
  const stats = {
    appointments: 12,
    requests: pendingRequests.length,
    patients: patients.length,
  };

  // --Función de aceptar solicitud--
  // Maneja la aceptación de una solicitud de paciente
  const handleAcceptRequest = (request) => {
    Alert.alert(
      'Aceptar solicitud',
      `¿Aceptar la solicitud de ${request.patientName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Aceptar', 
          onPress: () => {
            // Remover de solicitudes pendientes
            removePendingRequest(request.id);
            
            // Agregar a la lista de pacientes
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
            
            // Agregar a próximas citas
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
            
            // Agregar cita al calendario
            const appointmentDate = new Date();
            if (request.date.includes('Mañana')) {
              appointmentDate.setDate(appointmentDate.getDate() + 1);
            }
            // Usar el mismo formato de clave de fecha que en DoctorContext
            const dateKey = `${appointmentDate.getFullYear()}-${appointmentDate.getMonth()}-${appointmentDate.getDate()}`;
            
            // Obtener citas actuales para esta fecha
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
            
            // Actualizar citas del calendario
            updateAppointments(dateKey, [...currentAppointments, newCalendarAppointment]);
            
            // Actualizar disponibilidad - remover el horario que fue reservado
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

  // --Función de rechazar solicitud--
  // Maneja el rechazo de una solicitud de paciente
  const handleDeclineRequest = (request) => {
    setSelectedRequest(request);
    setRejectReason('');
    setShowRejectModal(true);
  };

  // --Función de confirmar rechazo--
  // Confirma el rechazo de una solicitud con la razón proporcionada
  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      Alert.alert('Error', 'Por favor proporciona una razón para rechazar la solicitud');
      return;
    }

    // Remover de solicitudes pendientes
    removePendingRequest(selectedRequest.id);
    
    // Aquí típicamente enviarías la razón de rechazo al backend
    console.log(`Solicitud rechazada para ${selectedRequest.patientName}. Razón: ${rejectReason}`);
    
    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectReason('');
    
    Alert.alert('Solicitud rechazada', `La solicitud de ${selectedRequest.patientName} ha sido rechazada`);
  };

  // --Función de chat con paciente--
  // Navega al chat con un paciente específico
  const handleChatWithPatient = (appointment) => {
    navigation.navigate('DoctorChat', {
      patient: { name: appointment.patientName },
      appointment: { date: appointment.date },
    });
  };

  // --Función de presión de paciente--
  // Maneja la selección de un paciente para mostrar sus detalles
  const handlePatientPress = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  // --Función de renderizado de tarjeta de estadística--
  // Renderiza cada tarjeta individual de estadística
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

  // --Función de renderizado de próxima cita--
  // Renderiza cada tarjeta individual de próxima cita
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

  // --Función de renderizado de solicitud pendiente--
  // Renderiza cada tarjeta individual de solicitud pendiente
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

// --Estilos del componente--
// Define todos los estilos visuales del dashboard del doctor
const styles = StyleSheet.create({
  // --Contenedor principal--
  // Estilo del contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // --Contenido--
  // Estilo del contenido principal de la pantalla
  content: {
    flex: 1,
  },
  
  // --Encabezado--
  // Estilo del encabezado de la pantalla
  header: {
    paddingTop: getResponsiveSpacing(20, 30, 40),
    paddingBottom: getResponsiveSpacing(16, 20, 24),
  },
  
  // --Parte superior del encabezado--
  // Estilo de la parte superior del encabezado
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // --Botón de regreso--
  // Estilo del botón para regresar a la pantalla anterior
  backButton: {
    padding: 8,
  },
  
  // --Título principal--
  // Estilo del título principal de la pantalla
  title: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
  },
  
  // --Parte derecha del encabezado--
  // Estilo de la parte derecha del encabezado
  headerRight: {
    width: 40,
  },
  
  // --Vista de desplazamiento--
  // Estilo de la vista de desplazamiento principal
  scrollView: {
    flex: 1,
  },
  
  // --Contenido del desplazamiento--
  // Estilo del contenido dentro de la vista de desplazamiento
  scrollContent: {
    paddingBottom: getResponsiveSpacing(20, 30, 40),
  },
  
  // --Contenedor de estadísticas--
  // Estilo del contenedor que muestra las estadísticas principales
  statsContainer: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  
  // --Cuadrícula de estadísticas--
  // Estilo de la cuadrícula de estadísticas en dispositivos móviles
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  
  // --Cuadrícula de estadísticas web--
  // Estilo de la cuadrícula de estadísticas en dispositivos web
  webStatsGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: getResponsiveSpacing(16, 24, 32),
  },
  
  // --Tarjeta de estadística--
  // Estilo de cada tarjeta individual de estadística
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
  
  // --Tarjeta de estadística web--
  // Estilo específico para las tarjetas de estadística en dispositivos web
  webStatCard: {
    flex: '0 1 150px',
    maxWidth: 180,
    minWidth: 120,
  },
  
  // --Icono de estadística--
  // Estilo del icono en cada tarjeta de estadística
  statIcon: {
    width: getResponsiveSpacing(32, 36, 40),
    height: getResponsiveSpacing(32, 36, 40),
    borderRadius: getResponsiveSpacing(16, 18, 20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  
  // --Contenido de estadística--
  // Estilo del contenedor de texto en cada tarjeta de estadística
  statContent: {
    flex: 1,
  },
  
  // --Valor de estadística--
  // Estilo del número principal en cada tarjeta de estadística
  statValue: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  
  // --Título de estadística--
  // Estilo de la etiqueta descriptiva en cada tarjeta de estadística
  statTitle: {
    color: '#666',
  },
  
  // --Sección--
  // Estilo base para cada sección del dashboard
  section: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  
  // --Título de sección--
  // Estilo del título de cada sección
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  
  // --Lista de citas--
  // Estilo del contenedor de la lista de citas
  appointmentsList: {
    gap: getResponsiveSpacing(12, 16, 20),
  },
  
  // --Lista de solicitudes--
  // Estilo del contenedor de la lista de solicitudes
  requestsList: {
    gap: getResponsiveSpacing(12, 16, 20),
  },
  
  // --Tarjeta de cita--
  // Estilo de cada tarjeta individual de cita
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
  
  // --Tarjeta de cita web--
  // Estilo específico para las tarjetas de cita en dispositivos web
  webAppointmentCard: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  
  // --Tarjeta de solicitud--
  // Estilo de cada tarjeta individual de solicitud
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
  
  // --Tarjeta de solicitud web--
  // Estilo específico para las tarjetas de solicitud en dispositivos web
  webRequestCard: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  
  // --Encabezado de cita--
  // Estilo del encabezado de cada tarjeta de cita
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // --Encabezado de solicitud--
  // Estilo del encabezado de cada tarjeta de solicitud
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // --Contenedor de imagen del paciente--
  // Estilo del contenedor de la imagen del paciente
  patientImageContainer: {
    marginRight: 12,
  },
  
  // --Imagen del paciente--
  // Estilo de la imagen del paciente
  patientImage: {
    width: getResponsiveSpacing(40, 45, 50),
    height: getResponsiveSpacing(40, 45, 50),
    borderRadius: getResponsiveSpacing(20, 22, 25),
  },
  
  // --Información de la cita--
  // Estilo del contenedor de información de la cita
  appointmentInfo: {
    flex: 1,
  },
  
  // --Información de la solicitud--
  // Estilo del contenedor de información de la solicitud
  requestInfo: {
    flex: 1,
  },
  
  // --Nombre del paciente--
  // Estilo del nombre del paciente
  patientName: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  
  // --Tipo de cita--
  // Estilo del tipo de cita
  appointmentType: {
    color: '#666',
    marginBottom: 2,
  },
  
  // --Hora de la cita--
  // Estilo de la hora de la cita
  appointmentTime: {
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 2,
  },
  
  // --Nombre de la clínica--
  // Estilo del nombre de la clínica
  clinicName: {
    color: '#999',
  },
  
  // --Botón de chat--
  // Estilo del botón para iniciar chat con el paciente
  chatButton: {
    padding: 8,
  },
  
  // --Detalles de la solicitud--
  // Estilo del contenedor de detalles de la solicitud
  requestDetails: {
    marginBottom: 16,
  },
  
  // --Etiqueta de razón--
  // Estilo de la etiqueta que describe el motivo de consulta
  reasonLabel: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  
  // --Texto de razón--
  // Estilo del texto que describe el motivo de consulta
  reasonText: {
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  
  // --Acciones de la solicitud--
  // Estilo del contenedor de botones de acción para cada solicitud
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  
  // --Botón de rechazar--
  // Estilo del botón para rechazar una solicitud
  declineButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  
  // --Botón de aceptar--
  // Estilo del botón para aceptar una solicitud
  acceptButton: {
    flex: 1,
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  
  // --Texto del botón de rechazar--
  // Estilo del texto del botón de rechazar
  declineButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // --Texto del botón de aceptar--
  // Estilo del texto del botón de aceptar
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // --Estilos del modal--
  // Estilos para los modales de detalles del paciente y rechazo
  
  // --Superposición del modal--
  // Estilo de la superposición oscura del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  
  // --Contenido del modal--
  // Estilo del contenido principal del modal
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  
  // --Encabezado del modal--
  // Estilo del encabezado del modal
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  
  // --Título del modal--
  // Estilo del título del modal
  modalTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  
  // --Botón de cerrar--
  // Estilo del botón para cerrar el modal
  closeButton: {
    padding: 4,
  },
  
  // --Cuerpo del modal--
  // Estilo del cuerpo principal del modal
  modalBody: {
    padding: 20,
  },
  
  // --Información del paciente--
  // Estilo del contenedor de información básica del paciente
  patientInfo: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  
  // --Título de información del paciente--
  // Estilo del título de la información del paciente
  patientInfoTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  
  // --Texto de información del paciente--
  // Estilo del texto de la información del paciente
  patientInfoText: {
    color: '#666',
    marginBottom: 4,
  },
  
  // --Sección de consultas--
  // Estilo del contenedor de la sección de consultas
  consultationsSection: {
    gap: 16,
  },
  
  // --Título de consultas--
  // Estilo del título de la sección de consultas
  consultationsTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  
  // --Tarjeta de consulta--
  // Estilo de cada tarjeta individual de consulta
  consultationCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  
  // --Encabezado de consulta--
  // Estilo del encabezado de cada tarjeta de consulta
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  // --Fecha de consulta--
  // Estilo de la fecha de la consulta
  consultationDate: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  
  // --Insignia de estado--
  // Estilo de la insignia que muestra el estado de la consulta
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  // --Estado completado--
  // Estilo para consultas completadas
  statusCompleted: {
    backgroundColor: '#34C759',
  },
  
  // --Estado pendiente--
  // Estilo para consultas pendientes
  statusPending: {
    backgroundColor: '#FF9500',
  },
  
  // --Texto del estado--
  // Estilo del texto que indica el estado de la consulta
  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // --Etiqueta de consulta--
  // Estilo de la etiqueta descriptiva en cada consulta
  consultationLabel: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    marginTop: 8,
  },
  
  // --Texto de consulta--
  // Estilo del texto descriptivo de cada consulta
  consultationText: {
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  
  // --Estilos del modal de razón de rechazo--
  // Estilos específicos para el modal de rechazo
  
  // --Texto del modal--
  // Estilo del texto explicativo del modal de rechazo
  modalText: {
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  // --Campo de entrada de razón--
  // Estilo del campo de texto para ingresar la razón de rechazo
  rejectReasonInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: getResponsiveFontSize(14, 15, 16),
  },
  
  // --Pie del modal--
  // Estilo del pie del modal con botones de acción
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  
  // --Botón de confirmar rechazo--
  // Estilo del botón para confirmar el rechazo
  confirmRejectButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  
  // --Texto del botón de confirmar rechazo--
  // Estilo del texto del botón de confirmar rechazo
  confirmRejectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // --Botón de cancelar rechazo--
  // Estilo del botón para cancelar el rechazo
  cancelRejectButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  
  // --Texto del botón de cancelar rechazo--
  // Estilo del texto del botón de cancelar rechazo
  cancelRejectButtonText: {
    color: '#333',
    fontWeight: '600',
  },
});

export default DoctorDashboard; 