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
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isWeb, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';
import { usePrescriptions } from '../../context/PrescriptionContext';
import { useDoctor } from '../../context/DoctorContext';

const DoctorPatients = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showNewPrescriptionModal, setShowNewPrescriptionModal] = useState(false);
  const [showEditPrescriptionModal, setShowEditPrescriptionModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state for new/edit prescription
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientName: '',
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    diagnosis: '',
  });

  // Use shared prescription context
  const { prescriptions, addPrescription, updatePrescription, deletePrescription, getPrescriptionsByPatient } = usePrescriptions();

    // Use shared doctor context
  const { patients, updatePatient } = useDoctor();

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (patient) => {
    navigation.navigate('DoctorChat', { 
      patient: { name: patient.name },
      appointment: { date: patient.nextAppointment }
    });
  };

  const handlePrescriptionPress = (patient) => {
    navigation.navigate('DoctorPrescriptions', { 
      patient: patient,
      mode: 'new'
    });
  };

  const handleViewPrescriptions = (patient) => {
    // Filter prescriptions for this patient using context
    const patientPrescriptions = getPrescriptionsByPatient(patient.name);
    if (patientPrescriptions.length > 0) {
      // Show all prescriptions for this patient
      setSelectedPrescription(patientPrescriptions[0]); // Set first one as default
      setShowPrescriptionModal(true);
    } else {
      Alert.alert('Sin recetas', `${patient.name} no tiene recetas registradas`);
    }
  };

  const handleNewPrescription = (patient) => {
    setPrescriptionForm({
      patientName: patient.name,
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      diagnosis: '',
    });
    setIsEditing(false);
    setShowNewPrescriptionModal(true);
  };

  const handleEditPrescription = (prescription) => {
    setPrescriptionForm({
      patientName: prescription.patientName,
      medication: prescription.medication,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration,
      instructions: prescription.instructions,
      diagnosis: prescription.diagnosis,
    });
    setIsEditing(true);
    setSelectedPrescription(prescription);
    setShowEditPrescriptionModal(true);
  };

  const handleSavePrescription = () => {
    if (!prescriptionForm.patientName || !prescriptionForm.medication) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    if (isEditing) {
      // Update existing prescription
      const updatedPrescription = {
        ...prescriptionForm,
        date: new Date().toLocaleDateString('es-ES'),
      };
      updatePrescription(selectedPrescription.id, updatedPrescription);
      Alert.alert('Éxito', 'Receta actualizada correctamente');
    } else {
      // Add new prescription
      const newPrescription = {
        id: Date.now(),
        patientName: prescriptionForm.patientName,
        patientImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        ...prescriptionForm,
        date: new Date().toLocaleDateString('es-ES'),
        status: 'Activa',
      };
      addPrescription(newPrescription);
      
      // Update patient's hasPrescription status
      const patientToUpdate = patients.find(p => p.name === prescriptionForm.patientName);
      if (patientToUpdate) {
        updatePatient(patientToUpdate.id, { hasPrescription: true });
      }
      
      Alert.alert('Éxito', 'Receta registrada correctamente');
    }

    setShowNewPrescriptionModal(false);
    setShowEditPrescriptionModal(false);
    setPrescriptionForm({
      patientName: '',
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      diagnosis: '',
    });
    setIsEditing(false);
  };

  const handleDeletePrescription = (prescription) => {
    Alert.alert(
      'Eliminar receta',
      `¿Estás seguro de que quieres eliminar la receta de ${prescription.patientName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            deletePrescription(prescription.id);
            setShowPrescriptionModal(false);
            
            // Check if patient still has other prescriptions
            const patientPrescriptions = getPrescriptionsByPatient(prescription.patientName);
            if (patientPrescriptions.length === 0) {
              const patientToUpdate = patients.find(p => p.name === prescription.patientName);
              if (patientToUpdate) {
                updatePatient(patientToUpdate.id, { hasPrescription: false });
              }
            }
            
            Alert.alert('Éxito', 'Receta eliminada correctamente');
          }
        },
      ]
    );
  };

  const handlePatientPress = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  const renderPatientCard = (patient) => (
    <TouchableOpacity
      key={patient.id}
      style={styles.patientCard}
      onPress={() => handlePatientPress(patient)}
    >
      <View style={styles.patientInfo}>
        <View style={styles.patientImageContainer}>
          <Image source={{ uri: patient.image }} style={styles.patientImage} />
        </View>
        <View style={styles.patientDetails}>
          <Text style={[styles.patientName, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
            {patient.name}
          </Text>
          <Text style={[styles.patientDates, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
            Última visita: {patient.lastVisit}
          </Text>
          <Text style={[styles.patientDates, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
            Próxima cita: {patient.nextAppointment}
          </Text>
          {patient.hasPrescription && (
            <View style={styles.prescriptionIndicator}>
              <Ionicons name="medical" size={12} color="#34C759" />
              <Text style={[styles.prescriptionText, { fontSize: getResponsiveFontSize(10, 11, 12) }]}>
                Tiene receta activa
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.patientActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.chatButton]}
          onPress={(e) => {
            e.stopPropagation();
            handleChatPress(patient);
          }}
        >
          <Ionicons name="chatbubble" size={getResponsiveFontSize(16, 17, 18)} color="#FFFFFF" />
          <Text style={[styles.actionButtonText, styles.chatButtonText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
            Chat
          </Text>
          {patient.unreadMessages > 0 && (
            <View style={styles.actionUnreadBadge}>
              <Text style={styles.actionUnreadBadgeText}>{patient.unreadMessages}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.prescriptionButton]}
          onPress={(e) => {
            e.stopPropagation();
            handlePrescriptionPress(patient);
          }}
        >
          <Ionicons name="add-circle" size={getResponsiveFontSize(16, 17, 18)} color="#FFFFFF" />
          <Text style={[styles.actionButtonText, styles.prescriptionButtonText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
            Nueva receta
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.viewPrescriptionButton]}
          onPress={(e) => {
            e.stopPropagation();
            handleViewPrescriptions(patient);
          }}
        >
          <Ionicons name="document-text" size={getResponsiveFontSize(16, 17, 18)} color="#FFFFFF" />
          <Text style={[styles.actionButtonText, styles.viewPrescriptionButtonText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
            Ver recetas
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.title}>Pacientes</Text>
            <View style={styles.headerRight} />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar pacientes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color="#34C759" />
            <Text style={styles.statNumber}>{patients.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="chatbubbles" size={24} color="#007AFF" />
            <Text style={styles.statNumber}>
              {patients.filter(p => p.unreadMessages > 0).length}
            </Text>
            <Text style={styles.statLabel}>Con mensajes</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="medical" size={24} color="#FF9500" />
            <Text style={styles.statNumber}>
              {patients.filter(p => p.hasPrescription).length}
            </Text>
            <Text style={styles.statLabel}>Con recetas</Text>
          </View>
        </View>

        {/* Patients List */}
        <View style={styles.patientsContainer}>
          <Text style={styles.sectionTitle}>Lista de pacientes</Text>
          {filteredPatients.length > 0 ? (
            filteredPatients.map(renderPatientCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color="#CCC" />
              <Text style={styles.emptyTitle}>No se encontraron pacientes</Text>
              <Text style={styles.emptySubtitle}>
                Intenta con otro término de búsqueda
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Patient Modal */}
      <Modal
        visible={showPatientModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPatientModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPatientModal(false)}
            >
              <Ionicons name="close" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <View style={styles.modalHeader}>
              <Image source={{ uri: selectedPatient?.image }} style={styles.modalImage} />
              <Text style={styles.modalName}>{selectedPatient?.name}</Text>
            </View>
            <View style={styles.modalDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="person" size={20} color="#666" />
                <Text style={styles.detailLabel}>Edad: {selectedPatient?.age}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="mail" size={20} color="#666" />
                <Text style={styles.detailLabel}>Email: {selectedPatient?.email}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="call" size={20} color="#666" />
                <Text style={styles.detailLabel}>Teléfono: {selectedPatient?.phone}</Text>
              </View>
            </View>
            <View style={styles.modalConsultations}>
              <Text style={styles.consultationsTitle}>Consultas</Text>
              {selectedPatient?.consultations && selectedPatient.consultations.length > 0 ? (
                selectedPatient.consultations.map(consultation => (
                  <View key={consultation.id} style={styles.consultationItem}>
                    <Text style={styles.consultationDate}>{consultation.date}</Text>
                    <Text style={styles.consultationReason}>{consultation.reason}</Text>
                    <Text style={styles.consultationDiagnosis}>Diagnóstico: {consultation.diagnosis}</Text>
                    <Text style={styles.consultationTreatment}>Tratamiento: {consultation.treatment}</Text>
                    <Text style={styles.consultationStatus}>Estado: {consultation.status}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noConsultationsText}>No hay consultas registradas.</Text>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* New Prescription Modal */}
      <Modal
        visible={showNewPrescriptionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewPrescriptionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
                {isEditing ? 'Editar Receta' : 'Nueva Receta'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowNewPrescriptionModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Nombre del Paciente *
                </Text>
                <TextInput
                  style={[styles.formInput, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
                  placeholder="Nombre completo del paciente"
                  value={prescriptionForm.patientName}
                  onChangeText={(text) => setPrescriptionForm({...prescriptionForm, patientName: text})}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Medicamento *
                </Text>
                <TextInput
                  style={[styles.formInput, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
                  placeholder="Ej: Ibuprofeno 400mg"
                  value={prescriptionForm.medication}
                  onChangeText={(text) => setPrescriptionForm({...prescriptionForm, medication: text})}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formSection, { flex: 1, marginRight: 8 }]}>
                  <Text style={[styles.formLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                    Dosis
                  </Text>
                  <TextInput
                    style={[styles.formInput, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
                    placeholder="Ej: 1 tableta"
                    value={prescriptionForm.dosage}
                    onChangeText={(text) => setPrescriptionForm({...prescriptionForm, dosage: text})}
                  />
                </View>
                <View style={[styles.formSection, { flex: 1, marginLeft: 8 }]}>
                  <Text style={[styles.formLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                    Frecuencia
                  </Text>
                  <TextInput
                    style={[styles.formInput, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
                    placeholder="Ej: Cada 8 horas"
                    value={prescriptionForm.frequency}
                    onChangeText={(text) => setPrescriptionForm({...prescriptionForm, frequency: text})}
                  />
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Duración
                </Text>
                <TextInput
                  style={[styles.formInput, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
                  placeholder="Ej: 7 días"
                  value={prescriptionForm.duration}
                  onChangeText={(text) => setPrescriptionForm({...prescriptionForm, duration: text})}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Instrucciones
                </Text>
                <TextInput
                  style={[styles.formInput, styles.textArea, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
                  placeholder="Instrucciones específicas para el paciente"
                  value={prescriptionForm.instructions}
                  onChangeText={(text) => setPrescriptionForm({...prescriptionForm, instructions: text})}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Diagnóstico
                </Text>
                <TextInput
                  style={[styles.formInput, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
                  placeholder="Diagnóstico del paciente"
                  value={prescriptionForm.diagnosis}
                  onChangeText={(text) => setPrescriptionForm({...prescriptionForm, diagnosis: text})}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowNewPrescriptionModal(false)}
              >
                <Text style={[styles.cancelButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSavePrescription}
              >
                <Text style={[styles.saveButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Guardar Receta
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Prescription Modal */}
      <Modal
        visible={showEditPrescriptionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditPrescriptionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
                Editar Receta
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowEditPrescriptionModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Nombre del Paciente *
                </Text>
                <TextInput
                  style={[styles.formInput, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
                  placeholder="Nombre completo del paciente"
                  value={prescriptionForm.patientName}
                  onChangeText={(text) => setPrescriptionForm({...prescriptionForm, patientName: text})}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Medicamento *
                </Text>
                <TextInput
                  style={[styles.formInput, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
                  placeholder="Ej: Ibuprofeno 400mg"
                  value={prescriptionForm.medication}
                  onChangeText={(text) => setPrescriptionForm({...prescriptionForm, medication: text})}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formSection, { flex: 1, marginRight: 8 }]}>
                  <Text style={[styles.formLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                    Dosis
                  </Text>
                  <TextInput
                    style={[styles.formInput, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
                    placeholder="Ej: 1 tableta"
                    value={prescriptionForm.dosage}
                    onChangeText={(text) => setPrescriptionForm({...prescriptionForm, dosage: text})}
                  />
                </View>
                <View style={[styles.formSection, { flex: 1, marginLeft: 8 }]}>
                  <Text style={[styles.formLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                    Frecuencia
                  </Text>
                  <TextInput
                    style={[styles.formInput, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
                    placeholder="Ej: Cada 8 horas"
                    value={prescriptionForm.frequency}
                    onChangeText={(text) => setPrescriptionForm({...prescriptionForm, frequency: text})}
                  />
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Duración
                </Text>
                <TextInput
                  style={[styles.formInput, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
                  placeholder="Ej: 7 días"
                  value={prescriptionForm.duration}
                  onChangeText={(text) => setPrescriptionForm({...prescriptionForm, duration: text})}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Instrucciones
                </Text>
                <TextInput
                  style={[styles.formInput, styles.textArea, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
                  placeholder="Instrucciones específicas para el paciente"
                  value={prescriptionForm.instructions}
                  onChangeText={(text) => setPrescriptionForm({...prescriptionForm, instructions: text})}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Diagnóstico
                </Text>
                <TextInput
                  style={[styles.formInput, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
                  placeholder="Diagnóstico del paciente"
                  value={prescriptionForm.diagnosis}
                  onChangeText={(text) => setPrescriptionForm({...prescriptionForm, diagnosis: text})}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditPrescriptionModal(false)}
              >
                <Text style={[styles.cancelButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSavePrescription}
              >
                <Text style={[styles.saveButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Actualizar Receta
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* View Prescription Modal */}
      <Modal
        visible={showPrescriptionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPrescriptionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
                Detalles de la Receta
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPrescriptionModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedPrescription && (
                <View style={styles.prescriptionDetailsModal}>
                  <View style={styles.prescriptionHeaderModal}>
                    <Text style={[styles.patientNameModal, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                      Recetas de {selectedPrescription.patientName}
                    </Text>
                  </View>

                  {getPrescriptionsByPatient(selectedPrescription.patientName).map((prescription, index) => (
                    <View key={prescription.id} style={styles.prescriptionCard}>
                      <View style={styles.prescriptionCardHeader}>
                        <Text style={[styles.prescriptionCardTitle, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
                          Receta #{index + 1}
                        </Text>
                        <View style={[
                          styles.statusBadge,
                          prescription.status === 'Activa' ? styles.statusActive : styles.statusCompleted
                        ]}>
                          <Text style={[styles.statusText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                            {prescription.status}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={[styles.detailLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          Fecha:
                        </Text>
                        <Text style={[styles.detailValue, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          {prescription.date}
                        </Text>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={[styles.detailLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          Medicamento:
                        </Text>
                        <Text style={[styles.detailValue, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          {prescription.medication}
                        </Text>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={[styles.detailLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          Dosis:
                        </Text>
                        <Text style={[styles.detailValue, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          {prescription.dosage}
                        </Text>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={[styles.detailLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          Frecuencia:
                        </Text>
                        <Text style={[styles.detailValue, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          {prescription.frequency}
                        </Text>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={[styles.detailLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          Duración:
                        </Text>
                        <Text style={[styles.detailValue, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          {prescription.duration}
                        </Text>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={[styles.detailLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          Instrucciones:
                        </Text>
                        <Text style={[styles.detailValue, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          {prescription.instructions}
                        </Text>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={[styles.detailLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          Diagnóstico:
                        </Text>
                        <Text style={[styles.detailValue, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          {prescription.diagnosis}
                        </Text>
                      </View>

                      <View style={styles.prescriptionCardActions}>
                        <TouchableOpacity
                          style={[styles.prescriptionActionButton, styles.editActionButton]}
                          onPress={() => {
                            setShowPrescriptionModal(false);
                            handleEditPrescription(prescription);
                          }}
                        >
                          <Text style={[styles.prescriptionActionText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                            Editar
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.prescriptionActionButton, styles.deleteActionButton]}
                          onPress={() => handleDeletePrescription(prescription)}
                        >
                          <Text style={[styles.prescriptionActionText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                            Eliminar
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPrescriptionModal(false)}
              >
                <Text style={[styles.cancelButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Cerrar
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  patientsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  patientCard: {
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
  patientInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  patientImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  patientImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  patientDates: {
    marginBottom: 8,
  },
  prescriptionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prescriptionText: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '600',
    marginLeft: 4,
  },
  patientActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    position: 'relative',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  chatButton: {
    backgroundColor: '#007AFF',
  },
  chatButtonText: {
    color: '#FFFFFF',
  },
  prescriptionButton: {
    backgroundColor: '#34C759',
  },
  prescriptionButtonText: {
    color: '#FFFFFF',
  },
  viewPrescriptionButton: {
    backgroundColor: '#FF9500',
  },
  viewPrescriptionButtonText: {
    color: '#FFFFFF',
  },
  actionUnreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionUnreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
    paddingTop: 50, // Adjust for status bar
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  modalDetails: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  modalConsultations: {
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
  consultationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  consultationItem: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  consultationDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  consultationReason: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  consultationDiagnosis: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  consultationTreatment: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  consultationStatus: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: 'bold',
  },
  noConsultationsText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalBody: {
    flex: 1,
    marginBottom: 20,
  },
  formSection: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 14,
    color: '#1A1A1A',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  statusActive: {
    backgroundColor: '#34C759',
  },
  statusCompleted: {
    backgroundColor: '#FF9500',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  prescriptionDetailsModal: {
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
  prescriptionHeaderModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  patientNameModal: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  detailSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  prescriptionCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  prescriptionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  prescriptionCardTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  prescriptionCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  prescriptionActionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editActionButton: {
    backgroundColor: '#007AFF',
  },
  deleteActionButton: {
    backgroundColor: '#FF3B30',
  },
  prescriptionActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default DoctorPatients; 