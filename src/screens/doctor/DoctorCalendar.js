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

const DoctorCalendar = ({ navigation }) => {
  // --Estado del mes actual--
  // Almacena el mes que se está visualizando en el calendario
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // --Contexto del doctor--
  // Obtiene la disponibilidad, citas y funciones del contexto del doctor
  const { availability, appointments, updateAvailability } = useDoctor();

  // --Función de generación de datos del calendario--
  // Genera la estructura de datos del calendario para el mes especificado
  const generateCalendarData = (date) => {
    const monthData = {
      year: date.getFullYear(),
      month: date.getMonth(),
      monthName: date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
      weeks: [],
    };

    // Obtener el primer día del mes y el número de días
    const firstDay = new Date(monthData.year, monthData.month, 1);
    const lastDay = new Date(monthData.year, monthData.month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // 0 = Domingo, 1 = Lunes, etc.

    // Ajustar día de inicio para que Lunes = 0
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

    // Generar semanas
    let currentWeek = [];
    let dayCount = 1;

    // Agregar celdas vacías para días antes de que comience el mes
    for (let j = 0; j < adjustedStartDay; j++) {
      currentWeek.push(null);
    }

    // Agregar días del mes
    for (let j = 1; j <= daysInMonth; j++) {
      const currentDate = new Date(monthData.year, monthData.month, j);
      const today = new Date();
      const isPast = currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6; // Domingo o Sábado
      
      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
      const dayAppointments = appointments[dateKey] || [];
      const dayAvailability = availability[dateKey] || [];
      
      // Determinar estado del día basado en nuevos requerimientos
      let dayStatus = 'normal';
      if (isPast) {
        dayStatus = 'past';
      } else {
        // Para días laborables y fines de semana
        if (dayAvailability.length === 0) {
          // No hay horas disponibles
          if (dayAppointments.length === 0) {
            dayStatus = 'unavailable'; // No hay horas disponibles, no hay pacientes
          } else {
            dayStatus = 'full'; // No hay horas disponibles, pero hay pacientes
          }
        } else {
          // Hay horas disponibles
          if (dayAppointments.length === 0) {
            dayStatus = 'available'; // Hay horas disponibles, no hay pacientes
          } else {
            dayStatus = 'with-patients'; // Hay horas disponibles y hay pacientes
          }
        }
      }
      
      currentWeek.push({
        day: j,
        date: currentDate,
        isPast,
        isWeekend,
        dayStatus,
        appointments: dayAppointments,
        availability: dayAvailability,
      });

      if (currentWeek.length === 7) {
        monthData.weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Agregar días restantes para completar la última semana
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      monthData.weeks.push(currentWeek);
    }

    return monthData;
  };

  // --Estado de datos del calendario--
  // Almacena los datos generados del calendario para el mes actual
  const [calendarData, setCalendarData] = useState(generateCalendarData(currentMonth));

  // --Efecto de actualización del calendario--
  // Actualiza los datos del calendario cuando cambia el mes, disponibilidad o citas
  useEffect(() => {
    setCalendarData(generateCalendarData(currentMonth));
  }, [currentMonth, availability, appointments]);

  // --Función de mes anterior--
  // Navega al mes anterior en el calendario
  const handlePreviousMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(newMonth);
  };

  // --Función de mes siguiente--
  // Navega al mes siguiente en el calendario
  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(newMonth);
  };

  // --Función de presión de fecha--
  // Maneja la selección de una fecha en el calendario
  const handleDatePress = (day) => {
    if (!day || day.isPast) return;

    // Navegar directamente a la vista del día
    navigation.navigate('DoctorDayView', { date: day.date });
  };

  // --Función de obtención de estilo del día--
  // Retorna los estilos apropiados para cada tipo de día
  const getDayStyle = (day) => {
    switch (day.dayStatus) {
      case 'past':
        return [styles.dayCell, styles.pastDay];
      case 'available':
        return [styles.dayCell, styles.availableDay];
      case 'with-patients':
        return [styles.dayCell, styles.withPatientsDay];
      case 'full':
        return [styles.dayCell, styles.fullDay];
      case 'unavailable':
        return [styles.dayCell, styles.unavailableDay];
      default:
        return [styles.dayCell];
    }
  };

  // --Función de obtención de estilo del texto del día--
  // Retorna los estilos apropiados para el texto de cada tipo de día
  const getDayTextStyle = (day) => {
    switch (day.dayStatus) {
      case 'past':
        return [styles.dayText, styles.pastDayText];
      case 'available':
        return [styles.dayText, styles.availableDayText];
      case 'with-patients':
        return [styles.dayText, styles.withPatientsDayText];
      case 'full':
        return [styles.dayText, styles.fullDayText];
      case 'unavailable':
        return [styles.dayText, styles.unavailableDayText];
      default:
        return [styles.dayText];
    }
  };

  // --Función de renderizado del calendario--
  // Renderiza el calendario completo con navegación y cuadrícula
  const renderCalendar = () => (
    <View style={styles.monthContainer}>
      {/* Navegación del mes */}
      <View style={styles.monthNavigation}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handlePreviousMonth}
        >
          <Ionicons name="chevron-back" size={getResponsiveFontSize(24, 26, 28)} color="#007AFF" />
        </TouchableOpacity>
        
        <Text style={[styles.monthTitle, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
          {calendarData.monthName.charAt(0).toUpperCase() + calendarData.monthName.slice(1)}
        </Text>
        
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleNextMonth}
        >
          <Ionicons name="chevron-forward" size={getResponsiveFontSize(24, 26, 28)} color="#007AFF" />
        </TouchableOpacity>
      </View>
      
      {/* Encabezado de días de la semana */}
      <View style={styles.weekDaysHeader}>
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
          <View key={index} style={styles.weekDayHeader}>
            <Text style={[styles.weekDayText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Cuadrícula del calendario */}
      <View style={styles.calendarGrid}>
        {calendarData.weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => {
              if (!day) {
                return <View key={dayIndex} style={styles.emptyDay} />;
              }

              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={getDayStyle(day)}
                  onPress={() => handleDatePress(day)}
                  disabled={day.isPast}
                >
                  <Text style={[
                    ...getDayTextStyle(day),
                    { fontSize: getResponsiveFontSize(14, 15, 16) }
                  ]}>
                    {day.day}
                  </Text>
                  {day.appointments.length > 0 && (
                    <View style={styles.appointmentIndicator} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
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
              Calendario
            </Text>
            <View style={styles.headerRight} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          <View style={{paddingVertical: getResponsivePadding(20, 40, 40)}}>
          </View>

          {/* Calendario */}
          <View style={[styles.calendarContainer, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            {renderCalendar()}
          </View>


          {/* Leyenda */}
          <View style={[styles.legendContainer, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            <Text style={[styles.legendTitle, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
              Leyenda
            </Text>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, styles.availableDay]} />
                <Text style={[styles.legendText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                  Disponible
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, styles.withPatientsDay]} />
                <Text style={[styles.legendText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                  Con pacientes
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, styles.fullDay]} />
                <Text style={[styles.legendText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                  Completo
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, styles.unavailableDay]} />
                <Text style={[styles.legendText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                  No disponible
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, styles.pastDay]} />
                <Text style={[styles.legendText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                  Pasado
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
// Define todos los estilos visuales del calendario del doctor
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
  
  // --Contenedor de leyenda--
  // Estilo del contenedor que muestra la leyenda del calendario
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
  
  // --Contenedor del calendario--
  // Estilo del contenedor principal del calendario
  calendarContainer: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  
  // --Contenedor del mes--
  // Estilo del contenedor de cada mes individual
  monthContainer: {
    marginBottom: getResponsiveSpacing(32, 40, 48),
  },
  
  // --Navegación del mes--
  // Estilo del contenedor de navegación entre meses
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // --Botón de navegación--
  // Estilo de los botones para navegar entre meses
  navButton: {
    padding: 8,
  },
  
  // --Título del mes--
  // Estilo del título que muestra el mes y año actual
  monthTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  
  // --Encabezado de días de la semana--
  // Estilo del encabezado que muestra los días de la semana
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  
  // --Encabezado de día de la semana--
  // Estilo de cada encabezado individual de día de la semana
  weekDayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  
  // --Texto del día de la semana--
  // Estilo del texto de cada día de la semana en el encabezado
  weekDayText: {
    fontWeight: '600',
    color: '#666',
  },
  
  // --Cuadrícula del calendario--
  // Estilo de la cuadrícula principal del calendario
  calendarGrid: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  
  // --Fila de la semana--
  // Estilo de cada fila que representa una semana
  weekRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  
  // --Celda del día--
  // Estilo de cada celda individual que representa un día
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  
  // --Día vacío--
  // Estilo para las celdas vacías al inicio o final del mes
  emptyDay: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#F8F9FA',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  
  // --Día pasado--
  // Estilo para los días que ya han pasado
  pastDay: {
    backgroundColor: '#F5F5F5',
  },
  
  // --Texto del día pasado--
  // Estilo del texto para los días que ya han pasado
  pastDayText: {
    color: '#CCC',
  },
  
  // --Día disponible--
  // Estilo para los días que están disponibles para citas
  availableDay: {
    backgroundColor: '#E8F5E8', // Verde claro
  },
  
  // --Texto del día disponible--
  // Estilo del texto para los días disponibles
  availableDayText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  
  // --Día con pacientes--
  // Estilo para los días que tienen pacientes programados
  withPatientsDay: {
    backgroundColor: '#FFF3E0', // Naranja claro
  },
  
  // --Texto del día con pacientes--
  // Estilo del texto para los días con pacientes
  withPatientsDayText: {
    color: '#E65100',
    fontWeight: '600',
  },
  
  // --Día completo--
  // Estilo para los días que están completamente ocupados
  fullDay: {
    backgroundColor: '#E1BEE7', // Púrpura claro
  },
  
  // --Texto del día completo--
  // Estilo del texto para los días completamente ocupados
  fullDayText: {
    color: '#4A148C',
    fontWeight: '600',
  },
  
  // --Día no disponible--
  // Estilo para los días que no están disponibles para citas
  unavailableDay: {
    backgroundColor: '#FFCDD2', // Rojo claro
  },
  
  // --Texto del día no disponible--
  // Estilo del texto para los días no disponibles
  unavailableDayText: {
    color: '#C62828',
    fontWeight: '600',
  },
  
  // --Indicador de cita--
  // Estilo del indicador visual que muestra cuando hay citas programadas
  appointmentIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFC107',
  },
});

export default DoctorCalendar; 