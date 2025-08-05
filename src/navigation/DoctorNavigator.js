import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import doctor screens
import DoctorDashboard from '../screens/doctor/DoctorDashboard';
import DoctorPatients from '../screens/doctor/DoctorPatients';
import DoctorProfile from '../screens/doctor/DoctorProfile';
import DoctorChat from '../screens/doctor/DoctorChat';
import DoctorCalendar from '../screens/doctor/DoctorCalendar';
import DoctorDayView from '../screens/doctor/DoctorDayView';
import DoctorPrescriptions from '../screens/doctor/DoctorPrescriptions';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DoctorDashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DoctorDashboardMain" component={DoctorDashboard} />
    <Stack.Screen name="DoctorChat" component={DoctorChat} />
  </Stack.Navigator>
);

const DoctorPatientsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DoctorPatientsMain" component={DoctorPatients} />
    <Stack.Screen name="DoctorChat" component={DoctorChat} />
  </Stack.Navigator>
);

const DoctorCalendarStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DoctorCalendarMain" component={DoctorCalendar} />
    <Stack.Screen name="DoctorDayView" component={DoctorDayView} />
  </Stack.Navigator>
);

const DoctorPrescriptionsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DoctorPrescriptionsMain" component={DoctorPrescriptions} />
  </Stack.Navigator>
);

const DoctorProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DoctorProfileMain" component={DoctorProfile} />
  </Stack.Navigator>
);

const DoctorNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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