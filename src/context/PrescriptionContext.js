import React, { createContext, useContext, useState } from 'react';

const PrescriptionContext = createContext();

export const usePrescriptions = () => {
  const context = useContext(PrescriptionContext);
  if (!context) {
    throw new Error('usePrescriptions must be used within a PrescriptionProvider');
  }
  return context;
};

export const PrescriptionProvider = ({ children }) => {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: 'María González',
      patientImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      medication: 'Ibuprofeno 400mg',
      dosage: '1 tableta',
      frequency: 'Cada 8 horas',
      duration: '7 días',
      instructions: 'Tomar después de las comidas',
      diagnosis: 'Migraña tensional',
      date: '15/07/2024',
      status: 'Activa',
      doctorName: 'Dr. Carlos Mendoza',
      doctorSpecialty: 'Neurología',
      doctorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 2,
      patientName: 'Carlos Rodríguez',
      patientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      medication: 'Lisinopril 10mg',
      dosage: '1 tableta',
      frequency: 'Diario',
      duration: '30 días',
      instructions: 'Tomar en la mañana',
      diagnosis: 'Hipertensión arterial',
      date: '10/07/2024',
      status: 'Activa',
      doctorName: 'Dr. Ana García',
      doctorSpecialty: 'Cardiología',
      doctorImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 3,
      patientName: 'Ana Torres',
      patientImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      medication: 'Paracetamol 500mg',
      dosage: '1 tableta',
      frequency: 'Cada 6 horas',
      duration: '5 días',
      instructions: 'Tomar con agua',
      diagnosis: 'Dolor de cabeza',
      date: '12/07/2024',
      status: 'Completada',
      doctorName: 'Dr. Roberto Silva',
      doctorSpecialty: 'Medicina General',
      doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 4,
      patientName: 'María González',
      patientImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      medication: 'Omeprazol 20mg',
      dosage: '1 cápsula',
      frequency: 'Diario',
      duration: '14 días',
      instructions: 'Tomar en ayunas',
      diagnosis: 'Gastritis',
      date: '20/07/2024',
      status: 'Activa',
      doctorName: 'Dra. Patricia López',
      doctorSpecialty: 'Gastroenterología',
      doctorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 5,
      patientName: 'María González',
      patientImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      medication: 'Vitamina D3 1000 UI',
      dosage: '1 cápsula',
      frequency: 'Diario',
      duration: '90 días',
      instructions: 'Tomar con las comidas',
      diagnosis: 'Deficiencia de vitamina D',
      date: '05/07/2024',
      status: 'Activa',
      doctorName: 'Dr. Miguel Torres',
      doctorSpecialty: 'Endocrinología',
      doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    },
  ]);

  const addPrescription = (prescription) => {
    setPrescriptions(prev => [...prev, prescription]);
  };

  const updatePrescription = (id, updatedPrescription) => {
    setPrescriptions(prev => 
      prev.map(p => p.id === id ? { ...p, ...updatedPrescription } : p)
    );
  };

  const deletePrescription = (id) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id));
  };

  const getPrescriptionsByPatient = (patientName) => {
    return prescriptions.filter(p => p.patientName === patientName);
  };

  const value = {
    prescriptions,
    addPrescription,
    updatePrescription,
    deletePrescription,
    getPrescriptionsByPatient,
  };

  return (
    <PrescriptionContext.Provider value={value}>
      {children}
    </PrescriptionContext.Provider>
  );
}; 