import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AppointmentDetails = ({ navigation, route }) => {
  const { appointment } = route.params;

  // Mock appointment details
  const appointmentDetails = {
    ...appointment,
    location: 'Clínica de Salud Integral',
    address: 'Calle Principal 123, Madrid',
    instructions: [
      'Llega 15 minutos antes de tu cita',
      'Trae tu documento de identidad',
      'Si es tu primera visita, trae estudios previos si los tienes',
      'Usa mascarilla durante la consulta',
    ],
    notes: 'Consulta de seguimiento para revisar el tratamiento actual.',
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      'Cancelar cita',
      '¿Estás seguro de que quieres cancelar esta cita?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Cita cancelada', 'Tu cita ha sido cancelada exitosamente.');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleGetDirections = () => {
    // In a real app, this would open maps with the clinic location
    Alert.alert('Direcciones', 'Abriendo mapa con la ubicación de la clínica...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.title}>Detalles de la cita</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Doctor Info */}
        <View style={styles.doctorInfo}>
          <Image source={{ uri: appointmentDetails.doctor.image }} style={styles.doctorImage} />
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{appointmentDetails.doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{appointmentDetails.doctor.specialty}</Text>
          </View>
        </View>

        {/* Appointment Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailCard}>
            <Text style={styles.cardTitle}>Información de la cita</Text>
            
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color="#007AFF" />
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Fecha</Text>
                <Text style={styles.detailValue}>{appointmentDetails.date}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={20} color="#007AFF" />
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Hora</Text>
                <Text style={styles.detailValue}>{appointmentDetails.time}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="medical-outline" size={20} color="#007AFF" />
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Tipo de consulta</Text>
                <Text style={styles.detailValue}>{appointmentDetails.type}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color="#007AFF" />
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Ubicación</Text>
                <Text style={styles.detailValue}>{appointmentDetails.location}</Text>
                <Text style={styles.detailAddress}>{appointmentDetails.address}</Text>
              </View>
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.detailCard}>
            <Text style={styles.cardTitle}>Instrucciones previas a la consulta</Text>
            {appointmentDetails.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionRow}>
                <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          {/* Notes */}
          {appointmentDetails.notes && (
            <View style={styles.detailCard}>
              <Text style={styles.cardTitle}>Notas adicionales</Text>
              <Text style={styles.notesText}>{appointmentDetails.notes}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelAppointment}
        >
          <Ionicons name="close-circle-outline" size={20} color="#FF3B30" />
          <Text style={styles.cancelButtonText}>Cancelar cita</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={handleGetDirections}
        >
          <Ionicons name="navigate-outline" size={20} color="#007AFF" />
          <Text style={styles.directionsButtonText}>Obtener direcciones</Text>
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 32,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
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
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 16,
    color: '#666',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailInfo: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  detailAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  notesText: {
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
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
    marginLeft: 8,
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  directionsButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default AppointmentDetails; 