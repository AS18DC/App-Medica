// --Imports de React--
// Importa las funcionalidades básicas de React para crear contexto y manejar estado
import React, { createContext, useContext, useState } from 'react';

// --Contexto del perfil del paciente--
// Contexto principal para manejar el perfil del paciente en toda la aplicación
const PatientProfileContext = createContext();

// --Hook personalizado--
// Hook para usar el contexto del perfil del paciente en otros componentes
export const usePatientProfile = () => {
  const context = useContext(PatientProfileContext);
  if (!context) {
    throw new Error('usePatientProfile debe ser usado dentro de PatientProfileProvider');
  }
  return context;
};

// --Proveedor del contexto--
// Componente que envuelve la aplicación y proporciona el contexto del perfil del paciente
export const PatientProfileProvider = ({ children }) => {
  // --Datos por defecto del usuario--
  // Perfil inicial del paciente con información básica
  const [patientProfile, setPatientProfile] = useState({
    name: "Maria González",
    email: "maria.gonzalez@email.com",
    phone: "+58 4121234567",
    cardId: "V-12345678",
    membershipDate: "Enero 2024",
    image: "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=",
    city: 'Caracas',
    birthDate: new Date(1990, 0, 15).toISOString(), 
    gender: '',
    height: '',
    weight: '',
    bloodType: '',
    allergies: [],
    disability: []
  });

  // --Función para actualizar un campo específico--
  // Actualiza un campo específico del perfil del paciente
  const updateProfileField = (field, value) => {
    // Convertir fechas a string ISO para evitar problemas de serialización
    let finalValue = value;
    if (field === 'birthDate' && value instanceof Date) {
      finalValue = value.toISOString();
    }
    
    setPatientProfile(prev => ({
      ...prev,
      [field]: finalValue
    }));
  };

  // --Función para actualizar múltiples campos--
  // Actualiza varios campos del perfil del paciente a la vez
  const updateProfileFields = (updates) => {
    // Convertir fechas a string ISO para evitar problemas de serialización
    const processedUpdates = {};
    Object.keys(updates).forEach(key => {
      if (key === 'birthDate' && updates[key] instanceof Date) {
        processedUpdates[key] = updates[key].toISOString();
      } else {
        processedUpdates[key] = updates[key];
      }
    });
    
    setPatientProfile(prev => ({
      ...prev,
      ...processedUpdates
    }));
  };

  // --Función para resetear el perfil--
  // Restaura el perfil a los valores por defecto
  const resetProfile = () => {
    setPatientProfile({
      name: "Maria González",
      email: "maria.gonzalez@email.com",
      phone: "+58 4121234567",
      membershipDate: "Enero 2024",
      image: "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=",
      city: 'Caracas',
      birthDate: new Date(1990, 0, 15).toISOString(), // Fecha por defecto como string ISO
      gender: '',
      height: '',
      weight: '',
      bloodType: '',
      allergies: [],
      disability: []
    });
  };

  // --Valor del contexto--
  // Objeto que contiene el estado y las funciones del perfil del paciente
  const value = {
    patientProfile,
    updateProfileField,
    updateProfileFields,
    resetProfile
  };

  return (
    <PatientProfileContext.Provider value={value}>
      {children}
    </PatientProfileContext.Provider>
  );
};

