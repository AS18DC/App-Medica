// --Imports de React--
// Importa las funcionalidades básicas de React
import React from 'react';

// --Imports de navegación--
// Importa las librerías de navegación para crear tabs y stacks
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// --Imports de iconos--
// Importa iconos de Ionicons para la interfaz de navegación
import { Ionicons } from '@expo/vector-icons';

// --Imports de pantallas de doctor--
// Importa las pantallas específicas de la funcionalidad de doctor
import DoctorDashboard from '../screens/doctor/DoctorDashboard';
import DoctorPatients from '../screens/doctor/DoctorPatients';
import DoctorProfile from '../screens/doctor/DoctorProfile';
import DoctorChat from '../screens/doctor/DoctorChat';
import DoctorCalendar from '../screens/doctor/DoctorCalendar/DoctorCalendar';
import DoctorDayView from '../screens/doctor/DoctorDayView';
import DoctorPrescriptions from '../screens/doctor/DoctorPrescriptions';

// --Navegadores--
// Crea instancias de navegadores para tabs y stacks
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// --Stack del dashboard del doctor--
// Navegador de stack para el dashboard principal del doctor
const DoctorDashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DoctorDashboardMain" component={DoctorDashboard} />
    <Stack.Screen name="DoctorChat" component={DoctorChat} />
    <Stack.Screen name="DoctorPrescriptions" component={DoctorPrescriptions} />
  </Stack.Navigator>
);

// --Stack de pacientes del doctor--
// Navegador de stack para la gestión de pacientes
const DoctorPatientsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DoctorPatientsMain" component={DoctorPatients} />
    <Stack.Screen name="DoctorChat" component={DoctorChat} />
    <Stack.Screen name="DoctorPrescriptions" component={DoctorPrescriptions} />
  </Stack.Navigator>
);

// --Stack del calendario del doctor--
// Navegador de stack para el calendario y vista diaria
const DoctorCalendarStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DoctorCalendarMain" component={DoctorCalendar} />
    <Stack.Screen name="DoctorDayView" component={DoctorDayView} />
  </Stack.Navigator>
);

// --Stack de prescripciones del doctor--
// Navegador de stack para la gestión de prescripciones
const DoctorPrescriptionsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DoctorPrescriptionsMain" component={DoctorPrescriptions} />
  </Stack.Navigator>
);

// --Stack del perfil del doctor--
// Navegador de stack para el perfil del doctor
const DoctorProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DoctorProfileMain" component={DoctorProfile} />
  </Stack.Navigator>
);

// --Navegador principal del doctor--
// Navegador principal con tabs para la funcionalidad de doctor
const DoctorNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // --Configuración de iconos de tabs--
        // Define qué icono mostrar para cada tab según su estado
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Patients') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Prescriptions') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // --Colores de tabs--
        // Define los colores para tabs activos e inactivos
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DoctorDashboardStack} />
      <Tab.Screen name="Patients" component={DoctorPatientsStack} />
      <Tab.Screen name="Calendar" component={DoctorCalendarStack} />
      <Tab.Screen name="Prescriptions" component={DoctorPrescriptionsStack} />
      <Tab.Screen name="Profile" component={DoctorProfileStack} />
    </Tab.Navigator>
  );
};

export default DoctorNavigator; 