import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import patient screens
import PatientHome from '../screens/patient/PatientHome';
import PatientClinics from '../screens/patient/PatientClinics';
import PatientAppointments from '../screens/patient/PatientAppointments';
import PatientProfile from '../screens/patient/PatientProfile';
import PatientChat from '../screens/patient/PatientChat';
import DoctorDetail from '../screens/patient/DoctorDetail';
import BookAppointment from '../screens/patient/BookAppointment';
import ChatScreen from '../screens/patient/ChatScreen';
import AppointmentDetails from '../screens/patient/AppointmentDetails';
import ClinicDetail from '../screens/patient/ClinicDetail';
import ClinicDoctors from '../screens/patient/ClinicDoctors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PatientHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PatientHomeMain" component={PatientHome} />
    <Stack.Screen name="DoctorDetail" component={DoctorDetail} />
    <Stack.Screen name="BookAppointment" component={BookAppointment} />
    <Stack.Screen name="ChatScreen" component={ChatScreen} />
  </Stack.Navigator>
);

const PatientClinicsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PatientClinicsMain" component={PatientClinics} />
    <Stack.Screen name="ClinicDetail" component={ClinicDetail} />
    <Stack.Screen name="ClinicDoctors" component={ClinicDoctors} />
    <Stack.Screen name="DoctorDetail" component={DoctorDetail} />
    <Stack.Screen name="BookAppointment" component={BookAppointment} />
  </Stack.Navigator>
);

const PatientChatStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PatientChatMain" component={PatientChat} />
    <Stack.Screen name="ChatScreen" component={ChatScreen} />
  </Stack.Navigator>
);

const PatientAppointmentsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PatientAppointmentsMain" component={PatientAppointments} />
    <Stack.Screen name="AppointmentDetails" component={AppointmentDetails} />
    <Stack.Screen name="ChatScreen" component={ChatScreen} />
  </Stack.Navigator>
);

const PatientProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PatientProfileMain" component={PatientProfile} />
  </Stack.Navigator>
);

const PatientNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={PatientHomeStack} />
      <Tab.Screen name="Clinics" component={PatientClinicsStack} />
      <Tab.Screen name="Chat" component={PatientChatStack} />
      <Tab.Screen name="Appointments" component={PatientAppointmentsStack} />
      <Tab.Screen name="Profile" component={PatientProfileStack} />
    </Tab.Navigator>
  );
};

export default PatientNavigator; 