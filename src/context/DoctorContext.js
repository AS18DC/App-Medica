import React, { createContext, useContext, useState } from 'react';

const DoctorContext = createContext();

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctor must be used within a DoctorProvider');
  }
  return context;
};

export const DoctorProvider = ({ children }) => {
  // Shared state for patients
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Maria Garcia',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      lastVisit: '2024-07-10',
      nextAppointment: '2024-07-15',
      unreadMessages: 2,
      hasPrescription: false,
      age: 28,
      email: 'maria.garcia@email.com',
      phone: '+1 234 567 8901',
      consultations: [
        {
          id: 1,
          date: '10/07/2024',
          reason: 'Control de presión arterial',
          diagnosis: 'Hipertensión leve',
          treatment: 'Lisinopril 10mg diario',
          status: 'Completada',
        },
        {
          id: 2,
          date: '15/07/2024',
          reason: 'Seguimiento de tratamiento',
          diagnosis: 'Pendiente',
          treatment: 'Pendiente',
          status: 'Pendiente',
        },
      ],
    },
    {
      id: 2,
      name: 'Carlos Rodriguez',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      lastVisit: '2024-07-08',
      nextAppointment: '2024-07-20',
      unreadMessages: 0,
      hasPrescription: true,
      age: 35,
      email: 'carlos.rodriguez@email.com',
      phone: '+1 234 567 8902',
      consultations: [
        {
          id: 1,
          date: '08/07/2024',
          reason: 'Dolor de cabeza persistente',
          diagnosis: 'Migraña tensional',
          treatment: 'Ibuprofeno 400mg cada 8 horas',
          status: 'Completada',
        },
      ],
    },
  ]);

  // Shared state for pending requests
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      patientName: 'Ana Torres',
      patientImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      reason: 'Dolor de cabeza persistente y mareos frecuentes',
      date: 'Mañana 10:00 AM',
      clinic: 'Clínica San Martín',
      status: 'pending',
      age: 32,
      email: 'ana.torres@email.com',
      phone: '+1 234 567 8903',
      consultations: [
        {
          id: 1,
          date: '15/07/2024',
          reason: 'Dolor de cabeza persistente y mareos frecuentes',
          diagnosis: 'Migraña tensional',
          treatment: 'Ibuprofeno 400mg cada 8 horas',
          status: 'Pendiente',
        },
      ],
    },
    {
      id: 2,
      patientName: 'Luis Fernández',
      patientImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      reason: 'Control de presión arterial y revisión de medicación',
      date: 'Mañana 02:00 PM',
      clinic: 'Centro Médico Santa María',
      status: 'pending',
      age: 45,
      email: 'luis.fernandez@email.com',
      phone: '+1 234 567 8904',
      consultations: [
        {
          id: 1,
          date: '12/07/2024',
          reason: 'Control de presión arterial',
          diagnosis: 'Hipertensión arterial',
          treatment: 'Lisinopril 10mg diario',
          status: 'Completada',
        },
        {
          id: 2,
          date: 'Mañana 02:00 PM',
          reason: 'Control de presión arterial y revisión de medicación',
          diagnosis: 'Pendiente',
          treatment: 'Pendiente',
          status: 'Pendiente',
        },
      ],
    },
  ]);

  // Shared state for upcoming appointments
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      patientName: 'María González',
      patientImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      type: 'Consulta de seguimiento',
      time: '09:00 AM',
      clinic: 'Clínica San Martín',
      date: 'Hoy',
      age: 28,
      email: 'maria.gonzalez@email.com',
      phone: '+1 234 567 8905',
      consultations: [
        {
          id: 1,
          date: '10/07/2024',
          reason: 'Control de presión arterial',
          diagnosis: 'Hipertensión leve',
          treatment: 'Lisinopril 10mg diario',
          status: 'Completada',
        },
        {
          id: 2,
          date: 'Hoy 09:00 AM',
          reason: 'Consulta de seguimiento',
          diagnosis: 'Pendiente',
          treatment: 'Pendiente',
          status: 'Pendiente',
        },
      ],
    },
    {
      id: 2,
      patientName: 'Carlos Rodríguez',
      patientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      type: 'Primera consulta',
      time: '11:30 AM',
      clinic: 'Centro Médico Santa María',
      date: 'Hoy',
      age: 35,
      email: 'carlos.rodriguez@email.com',
      phone: '+1 234 567 8906',
      consultations: [
        {
          id: 1,
          date: 'Hoy 11:30 AM',
          reason: 'Primera consulta',
          diagnosis: 'Pendiente',
          treatment: 'Pendiente',
          status: 'Pendiente',
        },
      ],
    },
  ]);

  // Shared state for calendar availability
  const [availability, setAvailability] = useState(() => {
    // Initialize weekdays as available (Monday-Friday) from 7 AM to 5 PM
    const initialAvailability = {};
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Set availability for current month weekdays
    for (let day = 1; day <= 31; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
      
      if (!isWeekend && date.getMonth() === currentMonth) {
        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        // Set default availability hours for weekdays (7 AM to 5 PM)
        initialAvailability[dateKey] = [
          { id: 1, time: '7:00 AM', isAvailable: true },
          { id: 2, time: '7:30 AM', isAvailable: true },
          { id: 3, time: '8:00 AM', isAvailable: true },
          { id: 4, time: '8:30 AM', isAvailable: true },
          { id: 5, time: '9:00 AM', isAvailable: true },
          { id: 6, time: '9:30 AM', isAvailable: true },
          { id: 7, time: '10:00 AM', isAvailable: true },
          { id: 8, time: '10:30 AM', isAvailable: true },
          { id: 9, time: '11:00 AM', isAvailable: true },
          { id: 10, time: '11:30 AM', isAvailable: true },
          { id: 11, time: '12:00 PM', isAvailable: true },
          { id: 12, time: '12:30 PM', isAvailable: true },
          { id: 13, time: '1:00 PM', isAvailable: true },
          { id: 14, time: '1:30 PM', isAvailable: true },
          { id: 15, time: '2:00 PM', isAvailable: true },
          { id: 16, time: '2:30 PM', isAvailable: true },
          { id: 17, time: '3:00 PM', isAvailable: true },
          { id: 18, time: '3:30 PM', isAvailable: true },
          { id: 19, time: '4:00 PM', isAvailable: true },
          { id: 20, time: '4:30 PM', isAvailable: true },
          { id: 21, time: '5:00 PM', isAvailable: true },
        ];
      }
    }
    
    return initialAvailability;
  });
  
  const [appointments, setAppointments] = useState(() => {
    // Initialize with some sample appointments
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const sampleAppointments = {};
    
    // Add a sample appointment for today
    const todayKey = `${currentYear}-${currentMonth}-${today.getDate()}`;
    sampleAppointments[todayKey] = [
      {
        id: 1,
        time: '10:00 AM',
        patient: {
          name: 'María González',
          reason: 'Control de presión arterial',
          clinic: 'Clínica San Martín'
        }
      }
    ];
    
    // Add a sample appointment for tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowKey = `${tomorrow.getFullYear()}-${tomorrow.getMonth()}-${tomorrow.getDate()}`;
    sampleAppointments[tomorrowKey] = [
      {
        id: 2,
        time: '2:30 PM',
        patient: {
          name: 'Carlos Rodríguez',
          reason: 'Consulta de seguimiento',
          clinic: 'Centro Médico Santa María'
        }
      }
    ];
    
    return sampleAppointments;
  });

  // Functions to manage patients
  const addPatient = (patient) => {
    setPatients(prev => [...prev, { ...patient, id: Date.now() }]);
  };

  const updatePatient = (id, updates) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const removePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  // Functions to manage pending requests
  const addPendingRequest = (request) => {
    setPendingRequests(prev => [...prev, { ...request, id: Date.now() }]);
  };

  const removePendingRequest = (id) => {
    setPendingRequests(prev => prev.filter(r => r.id !== id));
  };

  // Functions to manage upcoming appointments
  const addUpcomingAppointment = (appointment) => {
    setUpcomingAppointments(prev => [{ ...appointment, id: Date.now() }, ...prev]);
  };

  const removeUpcomingAppointment = (id) => {
    setUpcomingAppointments(prev => prev.filter(a => a.id !== id));
  };

  // Functions to manage calendar
  const updateAvailability = (dateKey, hours) => {
    setAvailability(prev => ({
      ...prev,
      [dateKey]: hours
    }));
  };

  const updateAppointments = (dateKey, dayAppointments) => {
    setAppointments(prev => ({
      ...prev,
      [dateKey]: dayAppointments
    }));
  };

  const value = {
    // State
    patients,
    pendingRequests,
    upcomingAppointments,
    availability,
    appointments,
    
    // Patient functions
    addPatient,
    updatePatient,
    removePatient,
    
    // Request functions
    addPendingRequest,
    removePendingRequest,
    
    // Appointment functions
    addUpcomingAppointment,
    removeUpcomingAppointment,
    
    // Calendar functions
    updateAvailability,
    updateAppointments,
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
}; 