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

// --Imports de React Native--
// Importa componentes básicos de React Native para el placeholder
import { View, Text, StyleSheet } from 'react-native';

// --Imports de pantallas de clínica--
// Importa las pantallas específicas de la funcionalidad de clínica
import ClinicDirectory from '../screens/clinic/ClinicDirectory';
import ClinicProfile from '../screens/clinic/ClinicProfile';
import ClinicCalendar from '../screens/clinic/ClinicCalendar';

// --Navegadores--
// Crea instancias de navegadores para tabs y stacks
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// --Componente placeholder para inicio de clínica--
// Pantalla temporal que muestra un mensaje de bienvenida
const ClinicHomePlaceholder = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Bienvenido a la clínica</Text>
    <Text style={styles.subtext}>Selecciona una opción del menú inferior</Text>
  </View>
);

// --Stack de inicio de clínica--
// Navegador de stack para la pantalla principal de la clínica
const ClinicHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ClinicHomeMain" component={ClinicHomePlaceholder} />
  </Stack.Navigator>
);

// --Stack de directorio de clínica--
// Navegador de stack para el directorio de la clínica
const ClinicDirectoryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ClinicDirectoryMain" component={ClinicDirectory} />
  </Stack.Navigator>
);

// --Stack de perfil de clínica--
// Navegador de stack para el perfil de la clínica
const ClinicProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ClinicProfileMain" component={ClinicProfile} />
  </Stack.Navigator>
);

// --Stack de calendario de clínica--
// Navegador de stack para el calendario de la clínica
const ClinicCalendarStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ClinicCalendarMain" component={ClinicCalendar} />
  </Stack.Navigator>
);

// --Navegador principal de clínica--
// Navegador principal con tabs para la funcionalidad de clínica
const ClinicNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // --Configuración de iconos de tabs--
        // Define qué icono mostrar para cada tab según su estado
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
        // --Colores de tabs--
        // Define los colores para tabs activos e inactivos
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

// --Estilos del placeholder--
// Estilos para el componente temporal de bienvenida
const styles = StyleSheet.create({
  // --Contenedor principal--
  // Contenedor centrado para el mensaje de bienvenida
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  
  // --Texto principal--
  // Estilo para el mensaje principal de bienvenida
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  
  // --Texto secundario--
  // Estilo para el mensaje secundario de instrucciones
  subtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 