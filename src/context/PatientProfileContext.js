import React, { createContext, useContext, useState } from 'react';

const PatientProfileContext = createContext();

export const usePatientProfile = () => {
  const context = useContext(PatientProfileContext);
  if (!context) {
    throw new Error('usePatientProfile debe ser usado dentro de PatientProfileProvider');
  }
  return context;
};

export const PatientProfileProvider = ({ children }) => {
  // Datos por defecto del usuario
  const [patientProfile, setPatientProfile] = useState({
    name: "Maria González",
    email: "maria.gonzalez@email.com",
    phone: "+58 4121234567",
    membershipDate: "Enero 2024",
    image: "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=",
    city: 'Caracas',
    birthDate: new Date(1990, 0, 15), // Fecha por defecto como objeto Date
    gender: '',
    height: '',
    weight: '',
    bloodType: '',
    allergies: '',
    disability: ''
  });

  // Función para actualizar un campo específico del perfil
  const updateProfileField = (field, value) => {
    setPatientProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para actualizar múltiples campos del perfil
  const updateProfileFields = (updates) => {
    setPatientProfile(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Función para resetear el perfil a los valores por defecto
  const resetProfile = () => {
    setPatientProfile({
      name: "Maria González",
      email: "maria.gonzalez@email.com",
      phone: "+58 4121234567",
      membershipDate: "Enero 2024",
      image: "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ=",
      city: 'Caracas',
      birthDate: new Date(1990, 0, 15), // Fecha por defecto como objeto Date
      gender: '',
      height: '',
      weight: '',
      bloodType: '',
      allergies: '',
      disability: ''
    });
  };

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

