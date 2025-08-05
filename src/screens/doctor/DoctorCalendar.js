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

const DoctorCalendar = ({ navigation }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState({});

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
      
      currentWeek.push({
        day: j,
        date: currentDate,
        isPast,
        isWeekend,
        isAvailable: !isPast && !isWeekend, // Available by default for weekdays in future
        hasAppointments: !isPast && !isWeekend && Math.random() > 0.8, // Only future weekdays can have appointments
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
  }, [currentMonth]);

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

    const dateKey = `${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`;
    
    // Always navigate to day view, regardless of appointments
    navigation.navigate('DoctorDayView', { 
      date: day.date
    });
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

              const dateKey = `${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`;
              const isAvailable = availability[dateKey] !== undefined ? availability[dateKey] : day.isAvailable;

              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={[
                    styles.dayCell,
                    day.isPast && styles.pastDay,
                    day.isWeekend && styles.weekendDay,
                    isAvailable && !day.isWeekend && !day.isPast && styles.availableDay,
                    day.hasAppointments && styles.appointmentDay,
                    !day.isPast && !day.isWeekend && !isAvailable && styles.futureDay,
                  ]}
                  onPress={() => handleDatePress(day)}
                  disabled={day.isPast}
                >
                  <Text style={[
                    styles.dayText,
                    day.isPast && styles.pastDayText,
                    day.isWeekend && styles.weekendDayText,
                    isAvailable && !day.isWeekend && !day.isPast && styles.availableDayText,
                    day.hasAppointments && styles.appointmentDayText,
                    !day.isPast && !day.isWeekend && !isAvailable && styles.futureDayText,
                    { fontSize: getResponsiveFontSize(14, 15, 16) }
                  ]}>
                    {day.day}
                  </Text>
                  {day.hasAppointments && (
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
                <View style={[styles.legendColor, styles.appointmentDay]} />
                <Text style={[styles.legendText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                  Con citas
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, styles.pastDay]} />
                <Text style={[styles.legendText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                  Pasado
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, styles.weekendDay]} />
                <Text style={[styles.legendText, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                  Fin de semana
                </Text>
              </View>
            </View>
          </View>

          {/* Calendar */}
          <View style={[styles.calendarContainer, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            {renderCalendar()}
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
  weekendDay: {
    backgroundColor: '#F0F0F0',
  },
  weekendDayText: {
    color: '#999',
  },
  availableDay: {
    backgroundColor: '#FFFFFF',
  },
  availableDayText: {
    color: '#1A1A1A',
  },
  appointmentDay: {
    backgroundColor: '#FFF3CD',
  },
  appointmentDayText: {
    color: '#856404',
    fontWeight: '600',
  },
  futureDay: {
    backgroundColor: '#FFFFFF',
  },
  futureDayText: {
    color: '#1A1A1A',
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