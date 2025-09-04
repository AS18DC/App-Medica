import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getResponsiveFontSize, getResponsivePadding, isWeb, webStyles } from '../../../utils/responsive';
import StylesDCalendar from './StylesDCalendar';

const VistasDCalendar = ({ 
  navigation,
  calendarData,
  onPreviousMonth,
  onNextMonth,
  onDatePress,
  getDayStyle,
  getDayTextStyle
}) => {
  const styles = StylesDCalendar;

  // --Función de renderizado del calendario--
  // Renderiza el calendario completo con navegación y cuadrícula
  const renderCalendar = () => (
    <View style={styles.monthContainer}>
      {/* Navegación del mes */}
      <View style={styles.monthNavigation}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={onPreviousMonth}
        >
          <Ionicons name="chevron-back" size={getResponsiveFontSize(24, 26, 28)} color="#007AFF" />
        </TouchableOpacity>
        
        <Text style={[styles.monthTitle, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
          {calendarData.monthName.charAt(0).toUpperCase() + calendarData.monthName.slice(1)}
        </Text>
        
        <TouchableOpacity
          style={styles.navButton}
          onPress={onNextMonth}
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
                  style={getDayStyle(day).map(styleKey => styles[styleKey])}
                  onPress={() => onDatePress(day)}
                  disabled={day.isPast}
                >
                  <Text style={[
                    ...getDayTextStyle(day).map(styleKey => styles[styleKey]),
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

export default VistasDCalendar;