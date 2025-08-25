import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Image, Platform } from 'react-native';

// Import web-specific CSS
if (Platform.OS === 'web') {
  require('./src/styles/web.css');
}

// Import context
import { PrescriptionProvider } from './src/context/PrescriptionContext';
import { DoctorProvider } from './src/context/DoctorContext';
import { PatientProfileProvider } from './src/context/PatientProfileContext';

// Import screens
import UserTypeSelection from './src/screens/UserTypeSelection';
import PatientNavigator from './src/navigation/PatientNavigator';
import DoctorNavigator from './src/navigation/DoctorNavigator';
import ClinicNavigator from './src/navigation/ClinicNavigator';

const Stack = createStackNavigator();

export default function App() {
  const [userType, setUserType] = useState(null);

  return (
    <PatientProfileProvider>
      <PrescriptionProvider>
        <DoctorProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="UserTypeSelection">
                {(props) => <UserTypeSelection {...props} setUserType={setUserType} />}
              </Stack.Screen>
              <Stack.Screen name="PatientNavigator" component={PatientNavigator} />
              <Stack.Screen name="DoctorNavigator" component={DoctorNavigator} />
              <Stack.Screen name="ClinicNavigator" component={ClinicNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </DoctorProvider>
      </PrescriptionProvider>
    </PatientProfileProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 