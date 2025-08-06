import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isWeb, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';
import { usePrescriptions } from '../../context/PrescriptionContext';
import { useDoctor } from '../../context/DoctorContext';

const DoctorPrescriptions = ({ navigation, route }) => {
  const { patient, mode } = route.params || {};
  const [showNewPrescriptionModal, setShowNewPrescriptionModal] = useState(false);
  const [showEditPrescriptionModal, setShowEditPrescriptionModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPatientList, setShowPatientList] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  
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
  
  // Use shared doctor context to get patients
  const { patients, updatePatient } = useDoctor();

  useEffect(() => {
    if (patient && mode === 'new') {
      setPrescriptionForm({
        patientName: patient.name,
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        diagnosis: '',
      });
      setShowNewPrescriptionModal(true);
    } else if (patient && mode === 'view') {
      // Filter prescriptions for this patient using context
      const patientPrescriptions = getPrescriptionsByPatient(patient.name);
      if (patientPrescriptions.length > 0) {
        setSelectedPrescription(patientPrescriptions[0]);
        setShowPrescriptionModal(true);
      } else {
        Alert.alert('Sin recetas', `${patient.name} no tiene recetas registradas`);
      }
    }
  }, [patient, mode, getPrescriptionsByPatient]);

  const handleNewPrescription = () => {
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
    setShowNewPrescriptionModal(true);
  };

  const handlePatientNameChange = (text) => {
    setPrescriptionForm({...prescriptionForm, patientName: text});
    
    if (text.length > 0) {
      const filtered = patients.filter(patient => 
        patient.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPatients(filtered);
      setShowPatientList(true);
    } else {
      setShowPatientList(false);
      setFilteredPatients([]);
    }
  };

  const handleSelectPatient = (selectedPatient) => {
    setPrescriptionForm({...prescriptionForm, patientName: selectedPatient.name});
    setShowPatientList(false);
    setFilteredPatients([]);
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

    // Check if patient exists in doctor's patient list
    const patientExists = patients.find(p => p.name === prescriptionForm.patientName);
    if (!patientExists) {
      Alert.alert('Error', 'Solo puedes asignar recetas a pacientes que tengas en tu lista');
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
      updatePatient(patientExists.id, { hasPrescription: true });
      
      Alert.alert('Éxito', 'Receta registrada correctamente y actualizada en el chat');
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

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionModal(true);
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

  const renderPrescriptionCard = (prescription) => (
    <TouchableOpacity
      key={prescription.id}
      style={[styles.prescriptionCard, isWeb && styles.webPrescriptionCard]}
      onPress={() => handleViewPrescription(prescription)}
    >
      <View style={styles.prescriptionHeader}>
        <View style={styles.patientInfo}>
          <Text style={[styles.patientName, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
            {prescription.patientName}
          </Text>
          <Text style={[styles.prescriptionDate, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
            {prescription.date}
          </Text>
        </View>
        <View style={[
          styles.statusBadge,
          prescription.status === 'Activa' ? styles.statusActive : styles.statusCompleted
        ]}>
          <Text style={[styles.statusText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
            {prescription.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.prescriptionDetails}>
        <Text style={[styles.medicationText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
          {prescription.medication}
        </Text>
        <Text style={[styles.dosageText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
          {prescription.dosage} - {prescription.frequency}
        </Text>
        <Text style={[styles.diagnosisText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
          Diagnóstico: {prescription.diagnosis}
        </Text>
      </View>

      <View style={styles.prescriptionActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditPrescription(prescription)}
        >
          <Ionicons name="create" size={16} color="#007AFF" />
          <Text style={[styles.actionButtonText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
            Editar
          </Text>
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
              Recetas
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleNewPrescription}
            >
              <Ionicons name="add" size={getResponsiveFontSize(24, 26, 28)} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Prescriptions List */}
          <View style={[styles.prescriptionsContainer, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            {isWeb ? (
              <View style={styles.webGrid}>
                {prescriptions.map(renderPrescriptionCard)}
              </View>
            ) : (
              <View style={styles.mobileList}>
                {prescriptions.map(renderPrescriptionCard)}
              </View>
            )}

            {prescriptions.length === 0 && (
              <View style={styles.emptyResults}>
                <Ionicons name="medical-outline" size={64} color="#CCC" />
                <Text style={[styles.emptyResultsTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                  No hay recetas registradas
                </Text>
                <Text style={[styles.emptyResultsSubtitle, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Toca el botón + para registrar una nueva receta
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

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
                  placeholder="Escribe el nombre del paciente..."
                  value={prescriptionForm.patientName}
                  onChangeText={handlePatientNameChange}
                />
                {showPatientList && filteredPatients.length > 0 && (
                  <View style={styles.patientListContainer}>
                    {filteredPatients.map((patient, index) => (
                      <TouchableOpacity
                        key={patient.id}
                        style={styles.patientListItem}
                        onPress={() => handleSelectPatient(patient)}
                      >
                        <Text style={[styles.patientListItemText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                          {patient.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
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
                      {selectedPrescription.patientName}
                    </Text>
                    <View style={[
                      styles.statusBadge,
                      selectedPrescription.status === 'Activa' ? styles.statusActive : styles.statusCompleted
                    ]}>
                      <Text style={[styles.statusText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                        {selectedPrescription.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={[styles.detailLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      Fecha:
                    </Text>
                    <Text style={[styles.detailValue, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      {selectedPrescription.date}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={[styles.detailLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      Medicamento:
                    </Text>
                    <Text style={[styles.detailValue, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      {selectedPrescription.medication}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={[styles.detailLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      Dosis:
                    </Text>
                    <Text style={[styles.detailValue, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      {selectedPrescription.dosage}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={[styles.detailLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      Frecuencia:
                    </Text>
                    <Text style={[styles.detailValue, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      {selectedPrescription.frequency}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={[styles.detailLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      Duración:
                    </Text>
                    <Text style={[styles.detailValue, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      {selectedPrescription.duration}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={[styles.detailLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      Instrucciones:
                    </Text>
                    <Text style={[styles.detailValue, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      {selectedPrescription.instructions}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={[styles.detailLabel, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      Diagnóstico:
                    </Text>
                    <Text style={[styles.detailValue, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                      {selectedPrescription.diagnosis}
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.editButton]}
                onPress={() => {
                  setShowPrescriptionModal(false);
                  handleEditPrescription(selectedPrescription);
                }}
              >
                <Text style={[styles.editButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Editar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={() => handleDeletePrescription(selectedPrescription)}
              >
                <Text style={[styles.deleteButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Eliminar
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
  addButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: getResponsiveSpacing(20, 30, 40),
  },
  prescriptionsContainer: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
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
  prescriptionCard: {
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
  webPrescriptionCard: {
    flex: '0 1 400px',
    maxWidth: 450,
    minWidth: 350,
  },
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  prescriptionDate: {
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#34C759',
  },
  statusCompleted: {
    backgroundColor: '#FF9500',
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  prescriptionDetails: {
    gap: 4,
  },
  medicationText: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  dosageText: {
    color: '#666',
  },
  diagnosisText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  prescriptionActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 4,
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
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Form Styles
  formSection: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  formLabel: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  // Prescription Details Modal
  prescriptionDetailsModal: {
    gap: 16,
  },
  prescriptionHeaderModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  patientNameModal: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  detailSection: {
    gap: 4,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  detailValue: {
    color: '#666',
    lineHeight: 20,
  },
  // New Modal Specific Styles
  editButton: {
    backgroundColor: '#007AFF',
  },
  editButtonText: {
    color: '#FFFFFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  deleteButtonText: {
    color: '#FFFFFF',
  },
  patientListContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxHeight: 150,
    marginTop: 4,
  },
  patientListItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  patientListItemText: {
    color: '#1A1A1A',
    fontWeight: '500',
  },
});

export default DoctorPrescriptions; 