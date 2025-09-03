// --Imports de React--
// Importa las funcionalidades básicas de React y hooks de estado y efectos
import React, { useState, useEffect } from 'react';

// --Imports de React Native--
// Importa componentes básicos de React Native para la interfaz
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';

// --Imports de iconos--
// Importa iconos de Ionicons para la interfaz de usuario
import { Ionicons } from '@expo/vector-icons';

// --Imports de utilidades responsivas--
// Importa funciones para hacer la interfaz responsiva en diferentes dispositivos
import { isWeb, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';

// --Imports de contexto--
// Importa el contexto del doctor para acceder a disponibilidad y citas
import { useDoctor } from '../../context/DoctorContext';

const DoctorDayView = ({ navigation, route }) => {
  // --Parámetros de ruta--
  // Obtiene la fecha pasada desde la navegación
  const { date } = route.params;
  
  // --Estado de horarios--
  // Lista de horarios disponibles para el día seleccionado
  const [timeSlots, setTimeSlots] = useState([]);
  
  // --Estado de disponibilidad del día--
  // Controla si el día completo está marcado como disponible
  const [dayAvailable, setDayAvailable] = useState(true);
  
  // --Contexto del doctor--
  // Obtiene la disponibilidad, citas y funciones del contexto del doctor
  const { availability, appointments, updateAvailability } = useDoctor();

  // --Efecto de generación de horarios--
  // Genera los horarios del día cuando cambia la fecha o la disponibilidad
  useEffect(() => {
    // Generar horarios de 7 AM a 5 PM con intervalos de 30 minutos
    const slots = [];
    for (let hour = 7; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 17 && minute === 30) break; // Parar a las 5:30 PM
        
        const timeString = `${hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
        const adjustedHour = hour > 12 ? hour - 12 : hour;
        const displayTime = `${adjustedHour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
        
        // Verificar si este horario tiene una cita con un paciente
        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        const dayAppointments = appointments[dateKey] || [];
        const dayAvailability = availability[dateKey] || [];
        
        // Encontrar si hay una cita a esta hora
        const appointment = dayAppointments.find(apt => apt.time === displayTime);
        const hasAppointment = appointment && appointment.patient; // Solo contar citas con pacientes
        
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
    
    // Actualizar disponibilidad del día basado en los horarios
    const availableSlots = slots.filter(s => s.available && !s.hasAppointment).length;
    setDayAvailable(availableSlots > 0);
  }, [date, availability, appointments]);

  // --Función de alternar disponibilidad del día--
  // Cambia la disponibilidad de todo el día
  const handleToggleAvailability = () => {
    const newAvailability = !dayAvailable;
    setDayAvailable(newAvailability);
    
    // Actualizar todos los horarios para que coincidan con la disponibilidad del día
    const updatedSlots = timeSlots.map(slot => ({
      ...slot,
      available: newAvailability && !slot.hasAppointment
    }));
    setTimeSlots(updatedSlots);
    
    // Actualizar disponibilidad en el contexto
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    if (newAvailability) {
      // Agregar disponibilidad para todos los horarios sin citas
      const newAvailabilityHours = updatedSlots
        .filter(slot => slot.available && !slot.hasAppointment)
        .map(slot => ({
          id: Date.now() + Math.random(),
          time: slot.time,
          isAvailable: true
        }));
      updateAvailability(dateKey, newAvailabilityHours);
    } else {
      // Remover toda la disponibilidad
      updateAvailability(dateKey, []);
    }
    
    Alert.alert(
      'Disponibilidad del día',
      `El día ha sido marcado como ${newAvailability ? 'disponible' : 'no disponible'}`
    );
  };

  // --Función de remover disponibilidad del día--
  // Elimina toda la disponibilidad para el día seleccionado
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
            
            // Actualizar disponibilidad en el contexto
            const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            updateAvailability(dateKey, []);
            
            Alert.alert('Disponibilidad eliminada', 'La disponibilidad del día ha sido eliminada');
          }
        }
      ]
    );
  };

  // --Función de presión de horario--
  // Maneja la selección de un horario específico
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
      // Alternar disponibilidad para este horario específico
      const newSlots = [...timeSlots];
      newSlots[index].available = !newSlots[index].available;
      setTimeSlots(newSlots);
      
      // Actualizar disponibilidad del día basado en los horarios
      const availableSlots = newSlots.filter(s => s.available && !s.hasAppointment).length;
      setDayAvailable(availableSlots > 0);
      
      // Actualizar disponibilidad en el contexto
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

  // --Función de cancelar cita--
  // Cancela una cita programada
  const handleCancelAppointment = (index) => {
    const newSlots = [...timeSlots];
    newSlots[index].hasAppointment = false;
    newSlots[index].patient = null;
    setTimeSlots(newSlots);
    
    Alert.alert('Cita cancelada', 'La cita ha sido cancelada exitosamente');
  };

  // --Función de chat con paciente--
  // Navega al chat con un paciente específico
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

  // --Función de renderizado de horario--
  // Renderiza cada horario individual del día
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

  // --Cálculos de estadísticas--
  // Calcula el número de horarios disponibles, con citas y no disponibles
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
                  <Text style={[styles.toggleButtonText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                    {dayAvailable ? 'Día disponible' : 'Día no disponible'}
                  </Text>
                </TouchableOpacity>

              </View>
            </View>
            
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={[styles.summaryStatNumber, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
                  {availableSlots}
                </Text>
                <Text style={[styles.summaryStatLabel, { fontSize: getResponsiveFontSize(8, 9, 10) }]}>
                  Horas disponibles
                </Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={[styles.summaryStatNumber, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
                  {appointmentSlots}
                </Text>
                <Text style={[styles.summaryStatLabel, { fontSize: getResponsiveFontSize(8, 9, 10) }]}>
                  Citas programadas
                </Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={[styles.summaryStatNumber, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
                  {unavailableSlots}
                </Text>
                <Text style={[styles.summaryStatLabel, { fontSize: getResponsiveFontSize(8, 9, 10) }]}>
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

// --Estilos del componente--
// Define todos los estilos visuales de la vista del día del doctor
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
  
  // --Información del encabezado--
  // Estilo del contenedor de información del encabezado
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  
  // --Título principal--
  // Estilo del título principal de la pantalla
  title: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  
  // --Subtítulo--
  // Estilo del subtítulo que muestra la fecha
  subtitle: {
    color: '#666',
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
  
  // --Contenedor de resumen--
  // Estilo del contenedor que muestra el resumen del día
  summaryContainer: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  
  // --Encabezado del resumen--
  // Estilo del encabezado de la sección de resumen
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // --Título del resumen--
  // Estilo del título de la sección de resumen
  summaryTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  
  // --Botones del resumen--
  // Estilo del contenedor de botones en el resumen
  summaryButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  // --Botón de alternar--
  // Estilo del botón para alternar la disponibilidad del día
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  
  // --Botón de alternar activo--
  // Estilo del botón cuando el día está disponible
  toggleButtonActive: {
    backgroundColor: '#34C759',
  },
  
  // --Botón de alternar inactivo--
  // Estilo del botón cuando el día no está disponible
  toggleButtonInactive: {
    backgroundColor: '#FF3B30',
  },
  
  // --Texto del botón de alternar--
  // Estilo del texto del botón de alternar disponibilidad
  toggleButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // --Botón de remover día--
  // Estilo del botón para remover la disponibilidad del día
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
  
  // --Texto del botón de remover día--
  // Estilo del texto del botón para remover disponibilidad
  removeDayButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
    marginLeft: 4,
  },
  
  // --Estadísticas del resumen--
  // Estilo del contenedor de estadísticas del resumen
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
  
  // --Estadística del resumen--
  // Estilo de cada estadística individual del resumen
  summaryStat: {
    alignItems: 'center',
  },
  
  // --Número de estadística del resumen--
  // Estilo del número principal en cada estadística del resumen
  summaryStatNumber: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  
  // --Etiqueta de estadística del resumen--
  // Estilo de la etiqueta descriptiva en cada estadística del resumen
  summaryStatLabel: {
    color: '#666',
    textAlign: 'center',
  },
  
  // --Contenedor de horarios--
  // Estilo del contenedor que muestra todos los horarios del día
  timeSlotsContainer: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  
  // --Encabezado de horarios--
  // Estilo del encabezado de la sección de horarios
  timeSlotsHeader: {
    marginBottom: 8,
  },
  
  // --Título de horarios--
  // Estilo del título de la sección de horarios
  timeSlotsTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  
  // --Subtítulo de horarios--
  // Estilo del subtítulo explicativo de la sección de horarios
  timeSlotsSubtitle: {
    color: '#666',
    marginBottom: 16,
  },
  
  // --Cuadrícula de horarios--
  // Estilo de la cuadrícula que organiza todos los horarios
  timeSlotsGrid: {
    gap: 12,
  },
  
  // --Horario--
  // Estilo de cada horario individual
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
  
  // --Horario disponible--
  // Estilo para horarios que están disponibles para citas
  availableSlot: {
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  
  // --Horario con cita--
  // Estilo para horarios que tienen citas programadas
  appointmentSlot: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  
  // --Horario no disponible--
  // Estilo para horarios que no están disponibles para citas
  unavailableSlot: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  
  // --Texto del horario--
  // Estilo del texto que muestra la hora del horario
  timeText: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  
  // --Texto del horario disponible--
  // Estilo específico para el texto de horarios disponibles
  availableTimeText: {
    color: '#34C759',
  },
  
  // --Texto del horario con cita--
  // Estilo específico para el texto de horarios con citas
  appointmentTimeText: {
    color: '#FF9500',
  },
  
  // --Texto del horario no disponible--
  // Estilo específico para el texto de horarios no disponibles
  unavailableTimeText: {
    color: '#FF3B30',
  },
  
  // --Información de la cita--
  // Estilo del contenedor de información de la cita en cada horario
  appointmentInfo: {
    gap: 4,
    marginTop: 8,
  },
  
  // --Motivo de la cita--
  // Estilo del texto que describe el motivo de la cita
  appointmentReason: {
    color: '#666',
  },
  
  // --Clínica de la cita--
  // Estilo del texto que muestra la clínica de la cita
  appointmentClinic: {
    color: '#007AFF',
    fontWeight: '500',
  },
  
  // --Botón de chat--
  // Estilo del botón para iniciar chat con el paciente
  chatButton: {
    padding: 4,
  },
  
  // --Texto disponible--
  // Estilo del texto que indica que un horario está disponible
  availableText: {
    color: '#34C759',
    fontWeight: '500',
  },
  
  // --Texto no disponible--
  // Estilo del texto que indica que un horario no está disponible
  unavailableText: {
    color: '#FF3B30',
    fontWeight: '500',
  },
  
  // --Contenedor de leyenda--
  // Estilo del contenedor que muestra la leyenda de colores
  legendContainer: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  
  // --Título de la leyenda--
  // Estilo del título de la sección de leyenda
  legendTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  
  // --Elementos de la leyenda--
  // Estilo del contenedor de elementos de la leyenda
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  
  // --Elemento de la leyenda--
  // Estilo de cada elemento individual de la leyenda
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  // --Color de la leyenda--
  // Estilo del indicador de color en cada elemento de la leyenda
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  
  // --Texto de la leyenda--
  // Estilo del texto descriptivo en cada elemento de la leyenda
  legendText: {
    color: '#666',
  },
});

export default DoctorDayView; 