import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

// Import clinic screens
import ClinicDirectory from '../screens/clinic/ClinicDirectory';
import ClinicProfile from '../screens/clinic/ClinicProfile';
import ClinicCalendar from '../screens/clinic/ClinicCalendar';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Simple placeholder component for clinic home
const ClinicHomePlaceholder = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Bienvenido a la clínica</Text>
    <Text style={styles.subtext}>Selecciona una opción del menú inferior</Text>
  </View>
);

const ClinicHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ClinicHomeMain" component={ClinicHomePlaceholder} />
  </Stack.Navigator>
);

const ClinicDirectoryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ClinicDirectoryMain" component={ClinicDirectory} />
  </Stack.Navigator>
);

const ClinicProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ClinicProfileMain" component={ClinicProfile} />
  </Stack.Navigator>
);

const ClinicCalendarStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ClinicCalendarMain" component={ClinicCalendar} />
  </Stack.Navigator>
);

const ClinicNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Directorio') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Calendario') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF9500',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={ClinicHomeStack} />
      <Tab.Screen name="Directorio" component={ClinicDirectoryStack} />
      <Tab.Screen name="Calendario" component={ClinicCalendarStack} />
      <Tab.Screen name="Perfil" component={ClinicProfileStack} />
    </Tab.Navigator>
  );
};

export default ClinicNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 