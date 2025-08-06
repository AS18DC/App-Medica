import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePrescriptions } from '../../context/PrescriptionContext';
import { getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';

const PatientPrescriptions = ({ navigation }) => {
  const { prescriptions } = usePrescriptions();
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock patient name - in a real app this would come from user authentication
  const currentPatientName = 'María González';

  // Filter prescriptions for the current patient
  const patientPrescriptions = prescriptions.filter(
    prescription => prescription.patientName === currentPatientName
  );

  const handlePrescriptionPress = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Activa':
        return '#4CAF50';
      case 'Completada':
        return '#2196F3';
      case 'Vencida':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const renderPrescriptionCard = (prescription) => (
    <TouchableOpacity
      key={prescription.id}
      style={styles.prescriptionCard}
      onPress={() => handlePrescriptionPress(prescription)}
    >
      <View style={styles.cardContent}>
        {/* Header with medication and status */}
        <View style={styles.cardHeader}>
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>{prescription.medication}</Text>
            <Text style={styles.dosage}>{prescription.dosage}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(prescription.status) }]}>
            <Text style={styles.statusText}>{prescription.status}</Text>
          </View>
        </View>
        
        {/* Doctor Information */}
        <View style={styles.doctorSection}>
          <Image 
            source={{ uri: prescription.doctorImage }} 
            style={styles.doctorImage}
          />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{prescription.doctorName}</Text>
            <Text style={styles.doctorSpecialty}>{prescription.doctorSpecialty}</Text>
          </View>
        </View>
        
        {/* Prescription Details */}
        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color="#666" />
            <Text style={styles.detailText}>{prescription.frequency}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color="#666" />
            <Text style={styles.detailText}>{prescription.duration}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="medical-outline" size={18} color="#666" />
            <Text style={styles.detailText}>{prescription.diagnosis}</Text>
          </View>
        </View>
        
        {/* Footer with date */}
        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>Prescrita el {prescription.date}</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPrescriptionModal = () => (
    <Modal
      visible={showModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalles de la Receta</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
                     {selectedPrescription && (
             <ScrollView style={styles.modalBody}>
               {/* Doctor Information Section */}
               <View style={styles.modalDoctorSection}>
                 <Image 
                   source={{ uri: selectedPrescription.doctorImage }} 
                   style={styles.modalDoctorImage}
                 />
                 <View style={styles.modalDoctorInfo}>
                   <Text style={styles.modalDoctorName}>{selectedPrescription.doctorName}</Text>
                   <Text style={styles.modalDoctorSpecialty}>{selectedPrescription.doctorSpecialty}</Text>
                 </View>
               </View>
               
               <View style={styles.modalSection}>
                 <Text style={styles.sectionTitle}>Medicamento</Text>
                 <Text style={styles.modalText}>{selectedPrescription.medication}</Text>
               </View>
               
               <View style={styles.modalSection}>
                 <Text style={styles.sectionTitle}>Dosis</Text>
                 <Text style={styles.modalText}>{selectedPrescription.dosage}</Text>
               </View>
               
               <View style={styles.modalSection}>
                 <Text style={styles.sectionTitle}>Frecuencia</Text>
                 <Text style={styles.modalText}>{selectedPrescription.frequency}</Text>
               </View>
               
               <View style={styles.modalSection}>
                 <Text style={styles.sectionTitle}>Duración</Text>
                 <Text style={styles.modalText}>{selectedPrescription.duration}</Text>
               </View>
               
               <View style={styles.modalSection}>
                 <Text style={styles.sectionTitle}>Instrucciones</Text>
                 <Text style={styles.modalText}>{selectedPrescription.instructions}</Text>
               </View>
               
               <View style={styles.modalSection}>
                 <Text style={styles.sectionTitle}>Diagnóstico</Text>
                 <Text style={styles.modalText}>{selectedPrescription.diagnosis}</Text>
               </View>
               
               <View style={styles.modalSection}>
                 <Text style={styles.sectionTitle}>Estado</Text>
                 <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedPrescription.status) }]}>
                   <Text style={styles.statusText}>{selectedPrescription.status}</Text>
                 </View>
               </View>
               
               <View style={styles.modalSection}>
                 <Text style={styles.sectionTitle}>Fecha de Prescripción</Text>
                 <Text style={styles.modalText}>{selectedPrescription.date}</Text>
               </View>
             </ScrollView>
           )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Recetas Médicas</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {patientPrescriptions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="medical-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No tienes recetas médicas</Text>
            <Text style={styles.emptySubtitle}>
              Las recetas que te prescriban los médicos aparecerán aquí
            </Text>
          </View>
        ) : (
          <View style={styles.prescriptionsList}>
            {patientPrescriptions.map(renderPrescriptionCard)}
          </View>
        )}
      </ScrollView>

      {renderPrescriptionModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: getResponsivePadding(24),
    paddingVertical: getResponsivePadding(20),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: getResponsivePadding(12),
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: '500',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 48,
  },
  content: {
    flex: 1,
    paddingHorizontal: getResponsivePadding(24),
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: getResponsivePadding(80),
  },
  emptyTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: '400',
    color: '#666',
    marginTop: getResponsiveSpacing(24),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: getResponsiveFontSize(16),
    color: '#999',
    marginTop: getResponsiveSpacing(12),
    textAlign: 'center',
    paddingHorizontal: getResponsivePadding(40),
  },
  prescriptionsList: {
    paddingVertical: getResponsiveSpacing(24),
  },
  prescriptionCard: {
    marginBottom: getResponsiveSpacing(20),
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    padding: getResponsivePadding(28),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: getResponsiveSpacing(24),
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: '400',
    color: '#1a1a1a',
    marginBottom: getResponsiveSpacing(8),
  },
  dosage: {
    fontSize: getResponsiveFontSize(16),
    color: '#666',
    fontWeight: '400',
  },
  statusBadge: {
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(8),
    borderRadius: 20,
  },
  statusText: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '500',
    color: '#fff',
  },
  doctorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getResponsivePadding(16),
    marginBottom: getResponsiveSpacing(24),
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  doctorImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: getResponsivePadding(16),
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: getResponsiveSpacing(4),
  },
  doctorSpecialty: {
    fontSize: getResponsiveFontSize(14),
    color: '#666',
  },
  cardDetails: {
    marginBottom: getResponsiveSpacing(24),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveSpacing(16),
  },
  detailText: {
    fontSize: getResponsiveFontSize(16),
    color: '#666',
    fontWeight: '400',
    marginLeft: getResponsiveSpacing(16),
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: getResponsiveSpacing(20),
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  dateText: {
    fontSize: getResponsiveFontSize(14),
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getResponsivePadding(28),
    paddingVertical: getResponsivePadding(24),
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  modalTitle: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: '500',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: getResponsivePadding(8),
  },
  modalBody: {
    paddingHorizontal: getResponsivePadding(28),
    paddingVertical: getResponsivePadding(24),
  },
  modalDoctorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getResponsivePadding(20),
    marginBottom: getResponsiveSpacing(28),
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  modalDoctorImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: getResponsivePadding(20),
  },
  modalDoctorInfo: {
    flex: 1,
  },
  modalDoctorName: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: getResponsiveSpacing(6),
  },
  modalDoctorSpecialty: {
    fontSize: getResponsiveFontSize(16),
    color: '#666',
  },
  modalSection: {
    marginBottom: getResponsiveSpacing(28),
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: getResponsiveSpacing(12),
  },
  modalText: {
    fontSize: getResponsiveFontSize(18),
    color: '#666',
    lineHeight: 28,
  },
});

export default PatientPrescriptions; 