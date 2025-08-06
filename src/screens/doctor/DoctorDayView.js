import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isWeb, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';
import { useDoctor } from '../../context/DoctorContext';

const DoctorDayView = ({ navigation, route }) => {
  const { date } = route.params;
  const [timeSlots, setTimeSlots] = useState([]);
  const [dayAvailable, setDayAvailable] = useState(true);
  
  // Use shared context
  const { availability, appointments, updateAvailability } = useDoctor();

  useEffect(() => {
    // Generate time slots from 7 AM to 5 PM with 30-minute intervals
    const slots = [];
    for (let hour = 7; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 17 && minute === 30) break; // Stop at 5:30 PM
        
        const timeString = `${hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
        const adjustedHour = hour > 12 ? hour - 12 : hour;
        const displayTime = `${adjustedHour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
        
        // Check if this time slot has an appointment with a patient
        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        const dayAppointments = appointments[dateKey] || [];
        const dayAvailability = availability[dateKey] || [];
        
        // Find if there's an appointment at this time
        const appointment = dayAppointments.find(apt => apt.time === displayTime);
        const hasAppointment = appointment && appointment.patient; // Only count appointments with patients
        
        slots.push({
          time: displayTime,
          originalTime: timeString,
          available: dayAvailability.some(avail => avail.time === displayTime),
          hasAppointment: hasAppointment,
          patient: hasAppointment ? appointment.patient : null,
        });
      }
    }
    setTimeSlots(slots);
    
    // Update day availability based on slots
    const availableSlots = slots.filter(s => s.available && !s.hasAppointment).length;
    setDayAvailable(availableSlots > 0);
  }, [date, availability, appointments]);

  const handleToggleAvailability = () => {
    const newAvailability = !dayAvailable;
    setDayAvailable(newAvailability);
    
    // Update all time slots to match day availability
    const updatedSlots = timeSlots.map(slot => ({
      ...slot,
      available: newAvailability && !slot.hasAppointment
    }));
    setTimeSlots(updatedSlots);
    
    // Update availability in context
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    if (newAvailability) {
      // Add availability for all non-appointment slots
      const newAvailabilityHours = updatedSlots
        .filter(slot => slot.available && !slot.hasAppointment)
        .map(slot => ({
          id: Date.now() + Math.random(),
          time: slot.time,
          isAvailable: true
        }));
      updateAvailability(dateKey, newAvailabilityHours);
    } else {
      // Remove all availability
      updateAvailability(dateKey, []);
    }
    
    Alert.alert(
      'Disponibilidad del día',
      `El día ha sido marcado como ${newAvailability ? 'disponible' : 'no disponible'}`
    );
  };

  const handleRemoveDayAvailability = () => {
    Alert.alert(
      'Eliminar disponibilidad del día',
      '¿Estás seguro de que quieres eliminar toda la disponibilidad para este día?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            const updatedSlots = timeSlots.map(slot => ({
              ...slot,
              available: false
            }));
            setTimeSlots(updatedSlots);
            setDayAvailable(false);
            
            // Update availability in context
            const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            updateAvailability(dateKey, []);
            
            Alert.alert('Disponibilidad eliminada', 'La disponibilidad del día ha sido eliminada');
          }
        }
      ]
    );
  };

  const handleTimeSlotPress = (slot, index) => {
    if (slot.hasAppointment) {
      Alert.alert(
        'Cita programada',
        `Hay una cita programada a las ${slot.time}`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Ver detalles', 
            onPress: () => {
              Alert.alert(
                'Detalles de la cita',
                `Paciente: ${slot.patient?.name || 'N/A'}\nMotivo: ${slot.patient?.reason || 'N/A'}\nClínica: ${slot.patient?.clinic || 'N/A'}`
              );
            }
          },
          { 
            text: 'Cancelar cita', 
            style: 'destructive',
            onPress: () => handleCancelAppointment(index)
          },
          {
            text: 'Chat con paciente',
            onPress: () => handleChatWithPatient(slot.patient, slot)
          }
        ]
      );
    } else {
      // Toggle availability for this specific slot
      const newSlots = [...timeSlots];
      newSlots[index].available = !newSlots[index].available;
      setTimeSlots(newSlots);
      
      // Update day availability based on slots
      const availableSlots = newSlots.filter(s => s.available && !s.hasAppointment).length;
      setDayAvailable(availableSlots > 0);
      
      // Update availability in context
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const newAvailabilityHours = newSlots
        .filter(s => s.available && !s.hasAppointment)
        .map(s => ({
          id: Date.now() + Math.random(),
          time: s.time,
          isAvailable: true
        }));
      updateAvailability(dateKey, newAvailabilityHours);
    }
  };

  const handleCancelAppointment = (index) => {
    const newSlots = [...timeSlots];
    newSlots[index].hasAppointment = false;
    newSlots[index].patient = null;
    setTimeSlots(newSlots);
    
    Alert.alert('Cita cancelada', 'La cita ha sido cancelada exitosamente');
  };

  const handleChatWithPatient = (patient, appointment) => {
    if (!patient) {
      Alert.alert('Error', 'No hay información del paciente disponible');
      return;
    }
    
    navigation.navigate('DoctorChat', {
      patient: patient,
      appointment: appointment
    });
  };

  const renderTimeSlot = (slot, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.timeSlot,
        slot.available && !slot.hasAppointment && styles.availableSlot,
        slot.hasAppointment && styles.appointmentSlot,
        !slot.available && !slot.hasAppointment && styles.unavailableSlot,
      ]}
      onPress={() => handleTimeSlotPress(slot, index)}
    >
      <Text style={[
        styles.timeText,
        slot.available && !slot.hasAppointment && styles.availableTimeText,
        slot.hasAppointment && styles.appointmentTimeText,
        !slot.available && !slot.hasAppointment && styles.unavailableTimeText,
        { fontSize: getResponsiveFontSize(14, 15, 16) }
      ]}>
        {slot.time}
      </Text>
      
      {slot.hasAppointment && slot.patient && (
        <View style={styles.appointmentInfo}>
          <Text style={[styles.appointmentReason, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
            {slot.patient.reason}
          </Text>
          <Text style={[styles.appointmentClinic, { fontSize: getResponsiveFontSize(10, 11, 12) }]}>
            {slot.patient.clinic}
          </Text>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => handleChatWithPatient(slot.patient, slot)}
          >
            <Ionicons name="chatbubble" size={12} color="#007AFF" />
          </TouchableOpacity>
        </View>
      )}
      
      {slot.available && !slot.hasAppointment && (
        <Text style={[styles.availableText, { fontSize: getResponsiveFontSize(10, 11, 12) }]}>
          Disponible
        </Text>
      )}
      
      {!slot.available && !slot.hasAppointment && (
        <Text style={[styles.unavailableText, { fontSize: getResponsiveFontSize(10, 11, 12) }]}>
          No disponible
        </Text>
      )}
    </TouchableOpacity>
  );

  const availableSlots = timeSlots.filter(slot => slot.available && !slot.hasAppointment).length;
  const appointmentSlots = timeSlots.filter(slot => slot.hasAppointment).length;
  const unavailableSlots = timeSlots.filter(slot => !slot.available && !slot.hasAppointment).length;

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
            <View style={styles.headerInfo}>
              <Text style={[styles.title, { fontSize: getResponsiveFontSize(28, 30, 32) }]}>
                Horario del día
              </Text>
              <Text style={[styles.subtitle, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
                {date.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
            <View style={styles.headerRight} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary */}
          <View style={[styles.summaryContainer, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            <View style={styles.summaryHeader}>
              <Text style={[styles.summaryTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                Resumen del día
              </Text>
              <View style={styles.summaryButtons}>
                <TouchableOpacity
                  style={[styles.toggleButton, dayAvailable ? styles.toggleButtonActive : styles.toggleButtonInactive]}
                  onPress={handleToggleAvailability}
                >
                  <Text style={[styles.toggleButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                    {dayAvailable ? 'Día disponible' : 'Día no disponible'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeDayButton}
                  onPress={handleRemoveDayAvailability}
                >
                  <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                  <Text style={[styles.removeDayButtonText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                    Eliminar día
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={[styles.summaryStatNumber, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
                  {availableSlots}
                </Text>
                <Text style={[styles.summaryStatLabel, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                  Horas disponibles
                </Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={[styles.summaryStatNumber, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
                  {appointmentSlots}
                </Text>
                <Text style={[styles.summaryStatLabel, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                  Citas programadas
                </Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={[styles.summaryStatNumber, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
                  {unavailableSlots}
                </Text>
                <Text style={[styles.summaryStatLabel, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                  Horas no disponibles
                </Text>
              </View>
            </View>
          </View>

          {/* Time Slots */}
          <View style={[styles.timeSlotsContainer, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            <View style={styles.timeSlotsHeader}>
              <Text style={[styles.timeSlotsTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                Horarios
              </Text>
              <Text style={[styles.timeSlotsSubtitle, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                Toca en una hora para cambiar su disponibilidad
              </Text>
            </View>
            
            <View style={styles.timeSlotsGrid}>
              {timeSlots.map(renderTimeSlot)}
            </View>
          </View>

          {/* Legend */}
          <View style={[styles.legendContainer, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            <Text style={[styles.legendTitle, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
              Leyenda
            </Text>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, styles.availableSlot]} />
                <Text style={[styles.legendText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                  Disponible
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, styles.appointmentSlot]} />
                <Text style={[styles.legendText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                  Con cita
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, styles.unavailableSlot]} />
                <Text style={[styles.legendText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                  No disponible
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
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
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
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
  summaryContainer: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  summaryButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleButtonActive: {
    backgroundColor: '#34C759',
  },
  toggleButtonInactive: {
    backgroundColor: '#FF3B30',
  },
  toggleButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  removeDayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  removeDayButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
    marginLeft: 4,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  summaryStat: {
    alignItems: 'center',
  },
  summaryStatNumber: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  summaryStatLabel: {
    color: '#666',
    textAlign: 'center',
  },
  timeSlotsContainer: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  timeSlotsHeader: {
    marginBottom: 8,
  },
  timeSlotsTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  timeSlotsSubtitle: {
    color: '#666',
    marginBottom: 16,
  },
  timeSlotsGrid: {
    gap: 12,
  },
  timeSlot: {
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
  availableSlot: {
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  appointmentSlot: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  unavailableSlot: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  timeText: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  availableTimeText: {
    color: '#34C759',
  },
  appointmentTimeText: {
    color: '#FF9500',
  },
  unavailableTimeText: {
    color: '#FF3B30',
  },
  appointmentInfo: {
    gap: 4,
    marginTop: 8,
  },
  appointmentReason: {
    color: '#666',
  },
  appointmentClinic: {
    color: '#007AFF',
    fontWeight: '500',
  },
  chatButton: {
    padding: 4,
  },
  availableText: {
    color: '#34C759',
    fontWeight: '500',
  },
  unavailableText: {
    color: '#FF3B30',
    fontWeight: '500',
  },
  legendContainer: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  legendTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendText: {
    color: '#666',
  },
});

export default DoctorDayView; 