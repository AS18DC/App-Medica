import { StyleSheet } from 'react-native';
import { getResponsiveSpacing } from '../../../utils/responsive';

// --Estilos del componente--
// Define todos los estilos visuales del calendario del doctor
const StylesDCalendar = StyleSheet.create({
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
  
  export default StylesDCalendar;