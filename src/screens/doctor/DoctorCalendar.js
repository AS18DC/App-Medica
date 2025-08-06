import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isWeb, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';
import { useDoctor } from '../../context/DoctorContext';

const DoctorCalendar = ({ navigation }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Use shared context
  const { availability, appointments, updateAvailability } = useDoctor();

  // Generate calendar data for current month
  const generateCalendarData = (date) => {
    const monthData = {
      year: date.getFullYear(),
      month: date.getMonth(),
      monthName: date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
      weeks: [],
    };

    // Get first day of month and number of days
    const firstDay = new Date(monthData.year, monthData.month, 1);
    const lastDay = new Date(monthData.year, monthData.month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Adjust start day to Monday = 0
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

    // Generate weeks
    let currentWeek = [];
    let dayCount = 1;

    // Add empty cells for days before the month starts
    for (let j = 0; j < adjustedStartDay; j++) {
      currentWeek.push(null);
    }

    // Add days of the month
    for (let j = 1; j <= daysInMonth; j++) {
      const currentDate = new Date(monthData.year, monthData.month, j);
      const today = new Date();
      const isPast = currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6; // Sunday or Saturday
      
      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
      const dayAppointments = appointments[dateKey] || [];
      const dayAvailability = availability[dateKey] || [];
      
      // Determine day status based on new requirements
      let dayStatus = 'normal';
      if (isPast) {
        dayStatus = 'past';
      } else {
        // For both weekdays and weekends
        if (dayAvailability.length === 0) {
          // No hours available
          if (dayAppointments.length === 0) {
            dayStatus = 'unavailable'; // No hours available, no patients
          } else {
            dayStatus = 'full'; // No hours available, but has patients
          }
        } else {
          // Has hours available
          if (dayAppointments.length === 0) {
            dayStatus = 'available'; // Has hours available, no patients
          } else {
            dayStatus = 'with-patients'; // Has hours available and has patients
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

    // Add remaining days to complete the last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      monthData.weeks.push(currentWeek);
    }

    return monthData;
  };

  const [calendarData, setCalendarData] = useState(generateCalendarData(currentMonth));

  useEffect(() => {
    setCalendarData(generateCalendarData(currentMonth));
  }, [currentMonth, availability, appointments]);

  const handlePreviousMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(newMonth);
  };

  const handleDatePress = (day) => {
    if (!day || day.isPast) return;

    // Navigate directly to day view
    navigation.navigate('DoctorDayView', { date: day.date });
  };



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

  const renderCalendar = () => (
    <View style={styles.monthContainer}>
      {/* Month Navigation */}
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
      
      {/* Week days header */}
      <View style={styles.weekDaysHeader}>
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
          <View key={index} style={styles.weekDayHeader}>
            <Text style={[styles.weekDayText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
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

          {/* Calendar */}
          <View style={[styles.calendarContainer, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            {renderCalendar()}
          </View>


          {/* Legend */}
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
  calendarContainer: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  monthContainer: {
    marginBottom: getResponsiveSpacing(32, 40, 48),
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontWeight: '600',
    color: '#666',
  },
  calendarGrid: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  weekRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
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
  emptyDay: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#F8F9FA',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  pastDay: {
    backgroundColor: '#F5F5F5',
  },
  pastDayText: {
    color: '#CCC',
  },
  availableDay: {
    backgroundColor: '#E8F5E8', // Light green
  },
  availableDayText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  withPatientsDay: {
    backgroundColor: '#FFF3E0', // Light orange
  },
  withPatientsDayText: {
    color: '#E65100',
    fontWeight: '600',
  },
  fullDay: {
    backgroundColor: '#E1BEE7', // Light purple
  },
  fullDayText: {
    color: '#4A148C',
    fontWeight: '600',
  },
  unavailableDay: {
    backgroundColor: '#FFCDD2', // Light red
  },
  unavailableDayText: {
    color: '#C62828',
    fontWeight: '600',
  },
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