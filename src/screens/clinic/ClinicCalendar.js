import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ClinicCalendar = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Mock calendar data
  const months = [
    {
      name: 'Julio 2024',
      weeks: [
        [
          { day: 1, available: true },
          { day: 2, available: true },
          { day: 3, available: true },
          { day: 4, available: true },
          { day: 5, available: true },
          { day: 6, available: false },
          { day: 7, available: false },
        ],
        [
          { day: 8, available: true },
          { day: 9, available: true },
          { day: 10, available: true },
          { day: 11, available: true },
          { day: 12, available: true },
          { day: 13, available: false },
          { day: 14, available: false },
        ],
        [
          { day: 15, available: true },
          { day: 16, available: true },
          { day: 17, available: true },
          { day: 18, available: true },
          { day: 19, available: true },
          { day: 20, available: false },
          { day: 21, available: false },
        ],
        [
          { day: 22, available: true },
          { day: 23, available: true },
          { day: 24, available: true },
          { day: 25, available: true },
          { day: 26, available: true },
          { day: 27, available: false },
          { day: 28, available: false },
        ],
        [
          { day: 29, available: true },
          { day: 30, available: true },
          { day: 31, available: true },
        ],
      ],
    },
    {
      name: 'Agosto 2024',
      weeks: [
        [
          { day: 1, available: true },
          { day: 2, available: true },
          { day: 3, available: false },
          { day: 4, available: false },
          { day: 5, available: true },
          { day: 6, available: true },
          { day: 7, available: true },
        ],
        [
          { day: 8, available: true },
          { day: 9, available: true },
          { day: 10, available: false },
          { day: 11, available: false },
          { day: 12, available: true },
          { day: 13, available: true },
          { day: 14, available: true },
        ],
      ],
    },
  ];

  // Mock available time slots
  const availableTimeSlots = [
    { time: '9:00 AM', room: 'Sala 1', available: true },
    { time: '9:30 AM', room: 'Sala 2', available: true },
    { time: '10:00 AM', room: 'Sala 1', available: false },
    { time: '10:30 AM', room: 'Sala 3', available: true },
    { time: '11:00 AM', room: 'Sala 2', available: true },
    { time: '11:30 AM', room: 'Sala 1', available: true },
    { time: '2:00 PM', room: 'Sala 3', available: true },
    { time: '2:30 PM', room: 'Sala 1', available: true },
    { time: '3:00 PM', room: 'Sala 2', available: false },
    { time: '3:30 PM', room: 'Sala 3', available: true },
    { time: '4:00 PM', room: 'Sala 1', available: true },
    { time: '4:30 PM', room: 'Sala 2', available: true },
  ];

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const handleDateSelect = (day) => {
    setSelectedDate(day);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    if (timeSlot.available) {
      console.log('Selected time slot:', timeSlot);
    }
  };

  const renderCalendar = (month) => (
    <View key={month.name} style={styles.monthContainer}>
      <Text style={styles.monthTitle}>{month.name}</Text>
      <View style={styles.weekDaysHeader}>
        {weekDays.map((day) => (
          <Text key={day} style={styles.weekDayHeader}>
            {day}
          </Text>
        ))}
      </View>
      {month.weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {week.map((day, dayIndex) => (
            <TouchableOpacity
              key={dayIndex}
              style={[
                styles.dayCell,
                !day.available && styles.dayUnavailable,
                selectedDate === day.day && styles.daySelected,
              ]}
              onPress={() => day.available && handleDateSelect(day.day)}
              disabled={!day.available}
            >
              <Text
                style={[
                  styles.dayText,
                  !day.available && styles.dayTextUnavailable,
                  selectedDate === day.day && styles.dayTextSelected,
                ]}
              >
                {day.day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Calendario</Text>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          {months.map(renderCalendar)}
        </View>

        {/* Available Time Slots */}
        {selectedDate && (
          <View style={styles.timeSlotsContainer}>
            <Text style={styles.timeSlotsTitle}>
              Horarios disponibles - {selectedDate} de Julio
            </Text>
            <View style={styles.timeSlotsGrid}>
              {availableTimeSlots.map((timeSlot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeSlotCard,
                    !timeSlot.available && styles.timeSlotUnavailable,
                  ]}
                  onPress={() => handleTimeSlotSelect(timeSlot)}
                  disabled={!timeSlot.available}
                >
                  <Text
                    style={[
                      styles.timeSlotTime,
                      !timeSlot.available && styles.timeSlotTextUnavailable,
                    ]}
                  >
                    {timeSlot.time}
                  </Text>
                  <Text
                    style={[
                      styles.timeSlotRoom,
                      !timeSlot.available && styles.timeSlotTextUnavailable,
                    ]}
                  >
                    {timeSlot.room}
                  </Text>
                  {timeSlot.available && (
                    <TouchableOpacity style={styles.reserveButton}>
                      <Text style={styles.reserveButtonText}>Reservar</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  calendarContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  monthContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 2,
  },
  dayUnavailable: {
    backgroundColor: '#F0F0F0',
  },
  daySelected: {
    backgroundColor: '#FF9500',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  dayTextUnavailable: {
    color: '#CCC',
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
  timeSlotsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  timeSlotsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
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
  timeSlotUnavailable: {
    backgroundColor: '#F0F0F0',
  },
  timeSlotTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  timeSlotRoom: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  timeSlotTextUnavailable: {
    color: '#CCC',
  },
  reserveButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reserveButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default ClinicCalendar; 