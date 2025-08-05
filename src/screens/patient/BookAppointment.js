import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isWeb, isMobileScreen, isTabletScreen, isDesktopScreen, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';

const BookAppointment = ({ navigation, route }) => {
  const { doctor } = route.params || {};
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [consultationReason, setConsultationReason] = useState('');
  const [availableDates, setAvailableDates] = useState([]);

  // Mock available time slots
  const availableTimeSlots = [
    '9:00 AM',
    '9:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '2:00 PM',
    '2:30 PM',
    '3:00 PM',
    '3:30 PM',
    '4:00 PM',
    '4:30 PM',
  ];

  // Generate available dates for the next 3 months
  useEffect(() => {
    const generateAvailableDates = () => {
      const dates = [];
      const today = new Date();
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(today.getMonth() + 3);

      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const monthNames = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ];

      let currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow

      while (currentDate <= threeMonthsFromNow) {
        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
        
        dates.push({
          date: currentDate.getDate().toString(),
          day: dayNames[dayOfWeek],
          month: monthNames[currentDate.getMonth()],
          fullDate: new Date(currentDate),
          available: !isWeekend, // Available on weekdays only
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      setAvailableDates(dates);
    };

    generateAvailableDates();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime || !consultationReason.trim()) {
      Alert.alert(
        'Información incompleta',
        'Por favor completa todos los campos: fecha, hora y motivo de la consulta.',
        [{ text: 'OK' }]
      );
      return;
    }

    const selectedDateObj = availableDates.find(d => d.date === selectedDate);
    const monthName = selectedDateObj ? selectedDateObj.month : '';

    Alert.alert(
      'Cita solicitada',
      `Tu cita ha sido solicitada para el ${selectedDate} de ${monthName} a las ${selectedTime}. El doctor revisará tu solicitud y te confirmará la cita.`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to doctor detail or appointments
            navigation.navigate('PatientAppointments');
          },
        },
      ]
    );
  };

  const renderDateItem = (dateItem) => (
    <TouchableOpacity
      key={`${dateItem.month}-${dateItem.date}`}
      style={[
        styles.dateItem,
        !dateItem.available && styles.dateItemUnavailable,
        selectedDate === dateItem.date && styles.dateItemSelected,
        isWeb && webStyles.button,
      ]}
      onPress={() => dateItem.available && handleDateSelect(dateItem.date)}
      disabled={!dateItem.available}
    >
      <Text
        style={[
          styles.dateDay,
          !dateItem.available && styles.dateTextUnavailable,
          selectedDate === dateItem.date && styles.dateTextSelected,
          { fontSize: getResponsiveFontSize(12, 13, 14) }
        ]}
      >
        {dateItem.day}
      </Text>
      <Text
        style={[
          styles.dateNumber,
          !dateItem.available && styles.dateTextUnavailable,
          selectedDate === dateItem.date && styles.dateTextSelected,
          { fontSize: getResponsiveFontSize(16, 17, 18) }
        ]}
      >
        {dateItem.date}
      </Text>
      <Text
        style={[
          styles.dateMonth,
          !dateItem.available && styles.dateTextUnavailable,
          selectedDate === dateItem.date && styles.dateTextSelected,
          { fontSize: getResponsiveFontSize(10, 11, 12) }
        ]}
      >
        {dateItem.month}
      </Text>
    </TouchableOpacity>
  );

  const renderTimeSlot = (time) => (
    <TouchableOpacity
      key={time}
      style={[
        styles.timeSlot,
        selectedTime === time && styles.timeSlotSelected,
        isWeb && webStyles.button,
      ]}
      onPress={() => handleTimeSelect(time)}
    >
      <Text
        style={[
          styles.timeSlotText,
          selectedTime === time && styles.timeSlotTextSelected,
          { fontSize: getResponsiveFontSize(14, 15, 16) }
        ]}
      >
        {time}
      </Text>
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
              Agendar cita
            </Text>
            <View style={styles.headerRight} />
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Doctor Info */}
          <View style={[styles.doctorInfo, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            <Text style={[styles.doctorName, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
              {doctor?.name || 'Dr. Sofia Ramirez'}
            </Text>
            <Text style={[styles.doctorSpecialty, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
              {doctor?.specialty || 'Cardiología'}
            </Text>
          </View>

          {/* Date Selection */}
          <View style={[styles.section, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
              Seleccionar fecha
            </Text>
            <Text style={[styles.sectionSubtitle, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
              Disponible para los próximos 3 meses
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datesContainer}
            >
              {availableDates.map(renderDateItem)}
            </ScrollView>
          </View>

          {/* Time Selection */}
          {selectedDate && (
            <View style={[styles.section, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
              <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                Seleccionar hora
              </Text>
              <View style={styles.timeSlotsContainer}>
                {availableTimeSlots.map(renderTimeSlot)}
              </View>
            </View>
          )}

          {/* Consultation Reason */}
          <View style={[styles.section, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            <Text style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
              Motivo de la consulta
            </Text>
            <TextInput
              style={[
                styles.reasonInput,
                { fontSize: getResponsiveFontSize(14, 15, 16) },
                isWeb && webStyles.input,
              ]}
              placeholder="Describe el motivo de tu consulta..."
              value={consultationReason}
              onChangeText={setConsultationReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Book Button */}
          <View style={[styles.buttonContainer, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            <TouchableOpacity
              style={[
                styles.bookButton,
                isWeb && webStyles.button,
                isWeb && webStyles.buttonPrimary,
              ]}
              onPress={handleBookAppointment}
            >
              <Text style={[styles.bookButtonText, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
                Solicitar cita
              </Text>
            </TouchableOpacity>
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
  doctorInfo: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  doctorName: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  doctorSpecialty: {
    color: '#666',
  },
  section: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: '#666',
    marginBottom: 16,
  },
  datesContainer: {
    paddingHorizontal: 4,
  },
  dateItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateItemUnavailable: {
    backgroundColor: '#F0F0F0',
    opacity: 0.5,
  },
  dateItemSelected: {
    backgroundColor: '#007AFF',
  },
  dateDay: {
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  dateNumber: {
    color: '#1A1A1A',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateMonth: {
    color: '#666',
    fontWeight: '500',
  },
  dateTextUnavailable: {
    color: '#999',
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 100,
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  timeSlotText: {
    color: '#1A1A1A',
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
  reasonInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: getResponsiveSpacing(20, 30, 40),
  },
  bookButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
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
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default BookAppointment; 