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

// --Imports de contexto--
// Importa el contexto de chat para obtener información de mensajes no leídos
import { useChat } from '../context/ChatContext';

// --Imports de componentes--
// Importa el componente de badge para mostrar mensajes no leídos
import UnreadBadge from '../components/UnreadBadge';

// --Imports de pantallas de paciente--
// Importa las pantallas específicas de la funcionalidad de paciente
import PatientHome from '../screens/patient/PatientHome';
import PatientClinics from '../screens/patient/PatientClinics';
import PatientAppointments from '../screens/patient/PatientAppointments';
import PatientProfile from '../screens/patient/PatientProfile';
import EditPatientProfile from '../screens/patient/EditPatientProfile';
import EditFieldScreen from '../screens/shared/EditFieldScreen';
import EditSelectionScreen from '../screens/shared/EditSelectionScreen';
import EditMultiSelectionScreen from '../screens/shared/EditMultiSelectionScreen';
import EditPhoneScreen from '../screens/shared/EditPhoneScreen';
import EditDateScreen from '../screens/shared/EditDateScreen';
import PatientChat from '../screens/patient/PatientChat';
import PatientPrescriptions from '../screens/patient/PatientPrescriptions';
import DoctorDetail from '../screens/patient/DoctorDetail';
import BookAppointment from '../screens/patient/BookAppointment';
import ChatScreen from '../screens/patient/ChatScreen';
import AppointmentDetails from '../screens/patient/AppointmentDetails';
import ClinicDetail from '../screens/patient/ClinicDetail';
import ClinicDoctors from '../screens/patient/ClinicDoctors';

// --Navegadores--
// Crea instancias de navegadores para tabs y stacks
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// --Stack de inicio del paciente--
// Navegador de stack para la pantalla principal del paciente
const PatientHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PatientHomeMain" component={PatientHome} />
    <Stack.Screen name="DoctorDetail" component={DoctorDetail} />
    <Stack.Screen name="BookAppointment" component={BookAppointment} />
    <Stack.Screen name="ChatScreen" component={ChatScreen} />
  </Stack.Navigator>
);

// --Stack de clínicas del paciente--
// Navegador de stack para la exploración de clínicas
const PatientClinicsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PatientClinicsMain" component={PatientClinics} />
    <Stack.Screen name="ClinicDetail" component={ClinicDetail} />
    <Stack.Screen name="ClinicDoctors" component={ClinicDoctors} />
    <Stack.Screen name="DoctorDetail" component={DoctorDetail} />
    <Stack.Screen name="BookAppointment" component={BookAppointment} />
  </Stack.Navigator>
);

// --Stack de chat del paciente--
// Navegador de stack para la funcionalidad de chat
const PatientChatStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PatientChatMain" component={PatientChat} />
    <Stack.Screen name="ChatScreen" component={ChatScreen} />
  </Stack.Navigator>
);

// --Stack de citas del paciente--
// Navegador de stack para la gestión de citas
const PatientAppointmentsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PatientAppointmentsMain" component={PatientAppointments} />
    <Stack.Screen name="AppointmentDetails" component={AppointmentDetails} />
    <Stack.Screen name="ChatScreen" component={ChatScreen} />
  </Stack.Navigator>
);

// --Stack del perfil del paciente--
// Navegador de stack para la gestión del perfil del paciente
const PatientProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PatientProfileMain" component={PatientProfile} />
    <Stack.Screen name="EditPatientProfile" component={EditPatientProfile} />
    <Stack.Screen name="EditFieldScreen" component={EditFieldScreen} />
    <Stack.Screen name="EditSelectionScreen" component={EditSelectionScreen} />
    <Stack.Screen name="EditMultiSelectionScreen" component={EditMultiSelectionScreen} />
    <Stack.Screen name="EditPhoneScreen" component={EditPhoneScreen} />
    <Stack.Screen name="EditDateScreen" component={EditDateScreen} />
    <Stack.Screen name="PatientAppointmentsMain" component={PatientAppointments} />
  </Stack.Navigator>
);

// --Stack de prescripciones del paciente--
// Navegador de stack para la gestión de prescripciones
const PatientPrescriptionsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PatientPrescriptionsMain" component={PatientPrescriptions} />
  </Stack.Navigator>
);

// --Navegador principal del paciente--
// Navegador principal con tabs para la funcionalidad de paciente
const PatientNavigator = () => {
  // --Contexto de chat--
  // Obtiene las conversaciones del contexto para calcular mensajes no leídos
  const { conversations } = useChat();
  
  // --Cálculo de mensajes no leídos--
  // Calcula el total de mensajes no leídos con verificación de seguridad
  const totalUnreadCount = conversations ? conversations.reduce((total, conv) => total + conv.unreadCount, 0) : 0;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // --Configuración de iconos de tabs--
        // Define qué icono mostrar para cada tab según su estado
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Clinics') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Prescriptions') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          const icon = <Ionicons name={iconName} size={size} color={color} />;

          // --Badge de mensajes no leídos--
          // Muestra badge solo en el tab de Chat cuando hay mensajes sin leer
          if (route.name === 'Chat' && totalUnreadCount > 0) {
            return (
              <React.Fragment>
                {icon}
                <UnreadBadge count={totalUnreadCount} />
              </React.Fragment>
            );
          }

          return icon;
        },
        // --Colores de tabs--
        // Define los colores para tabs activos e inactivos
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={PatientHomeStack} />
      <Tab.Screen name="Clinics" component={PatientClinicsStack} />
      <Tab.Screen name="Chat" component={PatientChatStack} />
      <Tab.Screen name="Appointments" component={PatientAppointmentsStack} />
      <Tab.Screen name="Prescriptions" component={PatientPrescriptionsStack} />
      <Tab.Screen name="Profile" component={PatientProfileStack} />
    </Tab.Navigator>
  );
};

export default PatientNavigator; 