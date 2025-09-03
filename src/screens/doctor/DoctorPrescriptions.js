// --Imports de React y React Native--
// {{importa React, useState y useEffect de React, y componentes básicos de React Native}}
import React, { useState, useEffect } from 'react';
// --Imports de componentes de React Native--
// {{importa View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Modal y Alert}}
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
// --Import de iconos--
// {{importa Ionicons de la librería de iconos de Expo}}
import { Ionicons } from '@expo/vector-icons';
// --Import de utilidades responsivas--
// {{importa funciones para hacer la interfaz responsiva en web y móvil}}
import { isWeb, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';
// --Import del contexto de prescripciones--
// {{importa el hook usePrescriptions para manejar prescripciones}}
import { usePrescriptions } from '../../context/PrescriptionContext';
// --Import del contexto del doctor--
// {{importa el hook useDoctor para acceder a datos del doctor}}
import { useDoctor } from '../../context/DoctorContext';

// --Componente DoctorPrescriptions--
// {{componente principal para gestionar prescripciones médicas}}
const DoctorPrescriptions = ({ navigation, route }) => {
  // --Parámetros de ruta--
  // {{extrae patient y mode de los parámetros de navegación}}
  const { patient, mode } = route.params || {};
  // --Estado del modal de nueva prescripción--
  // {{controla la visibilidad del modal para crear prescripciones}}
  const [showNewPrescriptionModal, setShowNewPrescriptionModal] = useState(false);
  // --Estado del modal de edición--
  // {{controla la visibilidad del modal para editar prescripciones}}
  const [showEditPrescriptionModal, setShowEditPrescriptionModal] = useState(false);
  // --Prescripción seleccionada--
  // {{almacena la prescripción que se está visualizando o editando}}
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  // --Estado del modal de visualización--
  // {{controla la visibilidad del modal para ver prescripciones}}
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  // --Estado de edición--
  // {{indica si se está editando una prescripción existente}}
  const [isEditing, setIsEditing] = useState(false);
  // --Estado de la lista de pacientes--
  // {{controla la visibilidad de la lista filtrada de pacientes}}
  const [showPatientList, setShowPatientList] = useState(false);
  // --Pacientes filtrados--
  // {{almacena la lista de pacientes filtrados por búsqueda}}
  const [filteredPatients, setFilteredPatients] = useState([]);
  
  // --Estado del formulario de prescripción--
  // {{almacena los datos del formulario para crear o editar prescripciones}}
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientName: '',
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    diagnosis: '',
  });

  // --Hook del contexto de prescripciones--
  // {{proporciona funciones y estado para gestionar prescripciones}}
  const { prescriptions, addPrescription, updatePrescription, deletePrescription, getPrescriptionsByPatient } = usePrescriptions();
  
  // --Hook del contexto del doctor--
  // {{proporciona acceso a la lista de pacientes y funciones de actualización}}
  const { patients, updatePatient } = useDoctor();

  // --useEffect para inicialización--
  // {{maneja la inicialización del componente basado en los parámetros de ruta}}
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
      // --Filtrado de prescripciones del paciente--
      // {{obtiene las prescripciones del paciente usando el contexto}}
      const patientPrescriptions = getPrescriptionsByPatient(patient.name);
      if (patientPrescriptions.length > 0) {
        setSelectedPrescription(patientPrescriptions[0]);
        setShowPrescriptionModal(true);
      } else {
        Alert.alert('Sin recetas', `${patient.name} no tiene recetas registradas`);
      }
    }
  }, [patient, mode, getPrescriptionsByPatient]);

  // --Función para nueva prescripción--
  // {{prepara el formulario para crear una nueva prescripción}}
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

  // --Función para cambio de nombre del paciente--
  // {{maneja el cambio en el campo de nombre y filtra pacientes}}
  const handlePatientNameChange = (text) => {
    setPrescriptionForm({...prescriptionForm, patientName: text});
    
    if (text.length > 0) {
      // --Filtrado de pacientes--
      // {{filtra la lista de pacientes basado en el texto ingresado}}
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

  // --Función para seleccionar paciente--
  // {{maneja la selección de un paciente de la lista filtrada}}
  const handleSelectPatient = (selectedPatient) => {
    setPrescriptionForm({...prescriptionForm, patientName: selectedPatient.name});
    setShowPatientList(false);
    setFilteredPatients([]);
  };

  // --Función para editar prescripción--
  // {{prepara el formulario para editar una prescripción existente}}
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

  // --Función para guardar prescripción--
  // {{valida y guarda una nueva prescripción o actualiza una existente}}
  const handleSavePrescription = () => {
    // --Validación de campos obligatorios--
    // {{verifica que los campos requeridos estén completos}}
    if (!prescriptionForm.patientName || !prescriptionForm.medication) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    // --Verificación de paciente--
    // {{verifica que el paciente exista en la lista del doctor}}
    const patientExists = patients.find(p => p.name === prescriptionForm.patientName);
    if (!patientExists) {
      Alert.alert('Error', 'Solo puedes asignar recetas a pacientes que tengas en tu lista');
      return;
    }

    if (isEditing) {
      // --Actualización de prescripción existente--
      // {{actualiza una prescripción existente con nuevos datos}}
      const updatedPrescription = {
        ...prescriptionForm,
        date: new Date().toLocaleDateString('es-ES'),
      };
      updatePrescription(selectedPrescription.id, updatedPrescription);
      Alert.alert('Éxito', 'Receta actualizada correctamente');
    } else {
      // --Creación de nueva prescripción--
      // {{crea una nueva prescripción con datos del formulario}}
      const newPrescription = {
        id: Date.now(),
        patientName: prescriptionForm.patientName,
        patientImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        ...prescriptionForm,
        date: new Date().toLocaleDateString('es-ES'),
        status: 'Activa',
      };
      addPrescription(newPrescription);
      
      // --Actualización del estado del paciente--
      // {{marca al paciente como que tiene prescripción}}
      updatePatient(patientExists.id, { hasPrescription: true });
      
      Alert.alert('Éxito', 'Receta registrada correctamente y actualizada en el chat');
    }

    // --Limpieza del formulario--
    // {{cierra modales y resetea el formulario}}
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

  // --Función para visualizar prescripción--
  // {{muestra el modal para ver los detalles de una prescripción}}
  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionModal(true);
  };

  // --Función para eliminar prescripción--
  // {{muestra confirmación y elimina una prescripción}}
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
            
            // --Verificación de prescripciones restantes--
            // {{verifica si el paciente aún tiene otras prescripciones}}
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

  // --Función para renderizar tarjeta de prescripción--
  // {{renderiza una tarjeta individual de prescripción con información del paciente}}
  const renderPrescriptionCard = (prescription) => (
    <TouchableOpacity
      key={prescription.id}
      style={[styles.prescriptionCard, isWeb && styles.webPrescriptionCard]}
      onPress={() => handleViewPrescription(prescription)}
    >
      {/* --Encabezado de la prescripción-- */}
      {/* {{muestra información del paciente y fecha}} */}
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
      
      {/* --Detalles de la prescripción-- */}
      {/* {{muestra medicamento, dosis y diagnóstico}} */}
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

      {/* --Acciones de la prescripción-- */}
      {/* {{muestra botón para editar la prescripción}} */}
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

  // --Return del componente--
  // {{renderiza la interfaz principal del componente}}
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, isWeb && webStyles.container]}>
        {/* --Header principal-- */}
        {/* {{encabezado con botón de regreso, título y botón de agregar}} */}
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

        {/* --ScrollView principal-- */}
        {/* {{contenedor scrolleable para la lista de prescripciones}} */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --Lista de prescripciones-- */}
          {/* {{contenedor principal para mostrar las prescripciones}} */}
          <View style={[styles.prescriptionsContainer, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            {/* --Renderizado responsivo-- */}
            {/* {{muestra grid en web y lista en móvil}} */}
            {isWeb ? (
              <View style={styles.webGrid}>
                {prescriptions.map(renderPrescriptionCard)}
              </View>
            ) : (
              <View style={styles.mobileList}>
                {prescriptions.map(renderPrescriptionCard)}
              </View>
            )}

            {/* --Estado vacío-- */}
            {/* {{muestra mensaje cuando no hay prescripciones}} */}
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

      {/* --Modal de nueva prescripción-- */}
      {/* {{modal para crear o editar prescripciones médicas}} */}
      <Modal
        visible={showNewPrescriptionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewPrescriptionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* --Header del modal-- */}
            {/* {{encabezado con título dinámico y botón de cerrar}} */}
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

            {/* --Cuerpo del modal-- */}
            {/* {{contenido scrolleable del formulario}} */}
            <ScrollView style={styles.modalBody}>
              {/* --Sección del nombre del paciente-- */}
              {/* {{campo obligatorio para seleccionar el paciente}} */}
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
                {/* --Lista de pacientes filtrados-- */}
                {/* {{muestra lista desplegable de pacientes coincidentes}} */}
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

              {/* --Sección del medicamento-- */}
              {/* {{campo obligatorio para el nombre del medicamento}} */}
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

              {/* --Fila de dosis y frecuencia-- */}
              {/* {{campos en línea para dosis y frecuencia del medicamento}} */}
              <View style={styles.formRow}>
                {/* --Campo de dosis-- */}
                {/* {{especifica la cantidad del medicamento}} */}
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
                {/* --Campo de frecuencia-- */}
                {/* {{especifica cada cuánto tomar el medicamento}} */}
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

              {/* --Sección de duración-- */}
              {/* {{especifica por cuánto tiempo tomar el medicamento}} */}
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

              {/* --Sección de instrucciones-- */}
              {/* {{campo de texto multilínea para instrucciones específicas}} */}
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

              {/* --Sección de diagnóstico-- */}
              {/* {{campo para especificar el diagnóstico del paciente}} */}
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

            {/* --Footer del modal-- */}
            {/* {{botones de cancelar y guardar la prescripción}} */}
            <View style={styles.modalFooter}>
              {/* --Botón de cancelar-- */}
              {/* {{cierra el modal sin guardar cambios}} */}
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowNewPrescriptionModal(false)}
              >
                <Text style={[styles.cancelButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              {/* --Botón de guardar-- */}
              {/* {{guarda la prescripción en el sistema}} */}
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

      {/* --Modal de edición de prescripción-- */}
      {/* {{modal para editar prescripciones existentes}} */}
      <Modal
        visible={showEditPrescriptionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditPrescriptionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* --Header del modal de edición-- */}
            {/* {{encabezado con título y botón de cerrar}} */}
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

            {/* --Modal de visualización de prescripción-- */}
      {/* {{modal para ver los detalles completos de una prescripción}} */}
      <Modal
        visible={showPrescriptionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPrescriptionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* --Header del modal de visualización-- */}
            {/* {{encabezado con título y botón de cerrar}} */}
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
  // --Estilo de tarjeta en web--
  // {{configuración responsiva para tarjetas en versión web}}
  webPrescriptionCard: {
    flex: '0 1 400px',
    maxWidth: 450,
    minWidth: 350,
  },
  // --Estilo del encabezado de prescripción--
  // {{layout horizontal para información del paciente y estado}}
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  // --Estilo de información del paciente--
  // {{contenedor flexible para datos del paciente}}
  patientInfo: {
    flex: 1,
  },
  // --Estilo del nombre del paciente--
  // {{texto en negrita para el nombre del paciente}}
  patientName: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  // --Estilo de la fecha de prescripción--
  // {{texto en color gris para la fecha}}
  prescriptionDate: {
    color: '#666',
  },
  // --Estilo de badge de estado--
  // {{contenedor para mostrar el estado de la prescripción}}
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  // --Estilo de estado activo--
  // {{color verde para prescripciones activas}}
  statusActive: {
    backgroundColor: '#34C759',
  },
  // --Estilo de estado completado--
  // {{color naranja para prescripciones completadas}}
  statusCompleted: {
    backgroundColor: '#FF9500',
  },
  // --Estilo del texto de estado--
  // {{texto blanco en negrita para el estado}}
  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // --Estilo de detalles de prescripción--
  // {{contenedor con espaciado entre elementos}}
  prescriptionDetails: {
    gap: 4,
  },
  // --Estilo del texto de medicamento--
  // {{texto en negrita para el nombre del medicamento}}
  medicationText: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  // --Estilo del texto de dosis--
  // {{texto en color gris para la dosis}}
  dosageText: {
    color: '#666',
  },
  // --Estilo del texto de diagnóstico--
  // {{texto azul para el diagnóstico}}
  diagnosisText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  // --Estilo de acciones de prescripción--
  // {{contenedor horizontal para botones de acción}}
  prescriptionActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  // --Estilo de botón de acción--
  // {{botón con icono y texto para acciones}}
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  // --Estilo del texto del botón de acción--
  // {{texto azul en negrita para botones}}
  actionButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  // --Estilo de resultados vacíos--
  // {{contenedor centrado para cuando no hay prescripciones}}
  emptyResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsiveSpacing(60, 80, 100),
  },
  // --Estilo del título de resultados vacíos--
  // {{título en negrita centrado para estado vacío}}
  emptyResultsTitle: {
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  // --Estilo del subtítulo de resultados vacíos--
  // {{subtítulo centrado para estado vacío}}
  emptyResultsSubtitle: {
    color: '#999',
    textAlign: 'center',
  },
  // --Estilos de modales--
  // {{configuración visual para todos los modales del componente}}
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  // --Estilo del contenido del modal--
  // {{contenedor principal del modal con bordes redondeados}}
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  // --Estilo del header del modal--
  // {{encabezado horizontal con título y botón de cerrar}}
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  // --Estilo del título del modal--
  // {{título en negrita para el encabezado del modal}}
  modalTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  // --Estilo del botón de cerrar--
  // {{botón con padding para cerrar el modal}}
  closeButton: {
    padding: 4,
  },
  // --Estilo del cuerpo del modal--
  // {{contenido principal del modal con padding}}
  modalBody: {
    padding: 20,
  },
  // --Estilo del footer del modal--
  // {{pie del modal con botones y borde superior}}
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  // --Estilo base de botones del modal--
  // {{configuración común para botones de modal}}
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  // --Estilo del botón de cancelar--
  // {{botón gris para cancelar acciones}}
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  // --Estilo del botón de guardar--
  // {{botón azul para confirmar acciones}}
  saveButton: {
    backgroundColor: '#007AFF',
  },
  // --Estilo del texto del botón cancelar--
  // {{texto gris en negrita para botón cancelar}}
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  // --Estilo del texto del botón guardar--
  // {{texto blanco en negrita para botón guardar}}
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // --Estilos del formulario--
  // {{configuración visual para todos los campos del formulario}}
  formSection: {
    marginBottom: 16,
  },
  // --Estilo de fila de formulario--
  // {{layout horizontal para campos en línea}}
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  // --Estilo de etiqueta del formulario--
  // {{texto en negrita para etiquetas de campos}}
  formLabel: {
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  // --Estilo de entrada del formulario--
  // {{campo de texto con fondo gris y bordes}}
  formInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  // --Estilo de área de texto--
  // {{campo multilínea con altura mínima}}
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  // --Estilos del modal de detalles--
  // {{configuración visual para el modal de visualización}}
  prescriptionDetailsModal: {
    gap: 16,
  },
  // --Estilo del header del modal de detalles--
  // {{encabezado con borde inferior para separar secciones}}
  prescriptionHeaderModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  // --Estilo del nombre del paciente en modal--
  // {{título en negrita para el nombre del paciente}}
  patientNameModal: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  // --Estilo de sección de detalle--
  // {{contenedor con espaciado para cada campo}}
  detailSection: {
    gap: 4,
  },
  // --Estilo de etiqueta de detalle--
  // {{texto en negrita para etiquetas de campos en modal}}
  detailLabel: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  // --Estilo de valor de detalle--
  // {{texto en gris con altura de línea para valores}}
  detailValue: {
    color: '#666',
    lineHeight: 20,
  },
  // --Estilos específicos de botones del modal--
  // {{configuración visual para botones de acción en modales}}
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
  // --Estilo del contenedor de lista de pacientes--
  // {{contenedor con borde para la lista desplegable de pacientes}}
  patientListContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxHeight: 150,
    marginTop: 4,
  },
  // --Estilo de elemento de lista de pacientes--
  // {{elemento individual con borde inferior para separación}}
  patientListItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  // --Estilo del texto de elemento de lista de pacientes--
  // {{texto en negrita para nombres de pacientes en lista}}
  patientListItemText: {
    color: '#1A1A1A',
    fontWeight: '500',
  },
});

export default DoctorPrescriptions; 