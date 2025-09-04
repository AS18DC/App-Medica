import React, { useState, useEffect } from 'react';
import VistasDCalendar from './VistasDCalendar';
import { useDoctor } from '../../../context/DoctorContext';

const DoctorCalendar = ({ navigation }) => {
  // --Estado del mes actual--
  // Almacena el mes que se está visualizando en el calendario
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // --Contexto del doctor--
  // Obtiene la disponibilidad, citas y funciones del contexto del doctor
  const { availability, appointments } = useDoctor();

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
        return ['dayCell', 'pastDay'];
      case 'available':
        return ['dayCell', 'availableDay'];
      case 'with-patients':
        return ['dayCell', 'withPatientsDay'];
      case 'full':
        return ['dayCell', 'fullDay'];
      case 'unavailable':
        return ['dayCell', 'unavailableDay'];
      default:
        return ['dayCell'];
    }
  };

  // --Función de obtención de estilo del texto del día--
  // Retorna los estilos apropiados para el texto de cada tipo de día
  const getDayTextStyle = (day) => {
    switch (day.dayStatus) {
      case 'past':
        return ['dayText', 'pastDayText'];
      case 'available':
        return ['dayText', 'availableDayText'];
      case 'with-patients':
        return ['dayText', 'withPatientsDayText'];
      case 'full':
        return ['dayText', 'fullDayText'];
      case 'unavailable':
        return ['dayText', 'unavailableDayText'];
      default:
        return ['dayText'];
    }
  };

  // Renderizar el componente VistasDCalendar con todas las props necesarias
  return (
    <VistasDCalendar
      navigation={navigation}
      calendarData={calendarData}
      onPreviousMonth={handlePreviousMonth}
      onNextMonth={handleNextMonth}
      onDatePress={handleDatePress}
      getDayStyle={getDayStyle}
      getDayTextStyle={getDayTextStyle}
    />
  );
};

export default DoctorCalendar;