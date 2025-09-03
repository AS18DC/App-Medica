// --Imports de React--
// Importa las funcionalidades básicas de React
import React from 'react';

// --Imports de React Native--
// Importa componentes básicos de React Native para la interfaz
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';

// --Imports de iconos--
// Importa iconos de Ionicons para la interfaz de usuario
import { Ionicons } from '@expo/vector-icons';

const DoctorProfile = ({ navigation }) => {
  // --Datos del doctor--
  // Información simulada del perfil del doctor
  const doctor = {
    name: 'Dr. Lucas Ramirez',
    specialty: 'Cardiología',
    licenseNumber: 'COL-12345',
    email: 'dr.lucas.ramirez@email.com',
    phone: '+34 612 345 678',
    image: 'https://via.placeholder.com/100',
    experience: '15 años',
    education: 'Universidad de Medicina de Madrid',
    languages: ['Español', 'Inglés'],
    about: 'Soy un cardiólogo con más de 15 años de experiencia en el diagnóstico y tratamiento de enfermedades cardiovasculares. Me especializo en cardiología preventiva y rehabilitación cardíaca.',
    schedule: {
      monday: '7:00 AM - 5:00 PM',
      tuesday: '7:00 AM - 5:00 PM',
      wednesday: '7:00 AM - 5:00 PM',
      thursday: '7:00 AM - 5:00 PM',
      friday: '7:00 AM - 5:00 PM',
      saturday: 'Cerrado',
      sunday: 'Cerrado',
    },
    location: 'Clínica de Salud Integral',
    address: 'Calle Principal 123, Madrid',
  };

  // --Elementos del menú--
  // Lista de opciones disponibles en el perfil del doctor
  const menuItems = [
    {
      id: 1,
      title: 'Editar perfil',
      icon: 'pencil-outline',
      action: () => {},
    },
    {
      id: 2,
      title: 'Compartir',
      icon: 'share-outline',
      action: () => {},
    },
    {
      id: 3,
      title: 'Horario de atención',
      icon: 'time-outline',
      action: () => {},
    },
    {
      id: 4,
      title: 'Configuración',
      icon: 'settings-outline',
      action: () => {},
    },
    {
      id: 5,
      title: 'Ayuda y soporte',
      icon: 'help-circle-outline',
      action: () => {},
    },
    {
      id: 6,
      title: 'Acerca de',
      icon: 'information-circle-outline',
      action: () => {},
    },
  ];

  // --Función de renderizado de elemento del menú--
  // Renderiza cada elemento individual del menú de opciones
  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.action}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons name={item.icon} size={24} color="#666" style={styles.menuIcon} />
        <Text style={styles.menuTitle}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        {/* Doctor Info */}
        <View style={styles.doctorInfoContainer}>
          <View style={styles.doctorInfo}>
            <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
            <View style={styles.doctorDetails}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
              <Text style={styles.licenseNumber}>Nº Colegiado: {doctor.licenseNumber}</Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={20} color="#34C759" />
              <Text style={styles.editButtonText}>Editar perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share" size={20} color="#007AFF" />
              <Text style={styles.shareButtonText}>Compartir</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Professional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información profesional</Text>
          <View style={styles.infoCard}>
            <Text style={styles.aboutText}>{doctor.about}</Text>
            
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.infoText}>{doctor.experience} de experiencia</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="school-outline" size={16} color="#666" />
              <Text style={styles.infoText}>{doctor.education}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="language-outline" size={16} color="#666" />
              <Text style={styles.infoText}>{doctor.languages.join(', ')}</Text>
            </View>
          </View>
        </View>

        {/* Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horario de atención</Text>
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleDay}>Lunes - Viernes</Text>
              <Text style={styles.scheduleTime}>{doctor.schedule.monday}</Text>
            </View>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleDay}>Sábado</Text>
              <Text style={styles.scheduleTime}>{doctor.schedule.saturday}</Text>
            </View>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleDay}>Domingo</Text>
              <Text style={styles.scheduleTime}>{doctor.schedule.sunday}</Text>
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationInfo}>
              <Ionicons name="location-outline" size={20} color="#007AFF" />
              <View style={styles.locationDetails}>
                <Text style={styles.locationName}>{doctor.location}</Text>
                <Text style={styles.locationAddress}>{doctor.address}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de contacto</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactRow}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <Text style={styles.contactText}>{doctor.email}</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={20} color="#666" />
              <Text style={styles.contactText}>{doctor.phone}</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opciones</Text>
          <View style={styles.menuContainer}>
            {menuItems.map(renderMenuItem)}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --Estilos del componente--
// Define todos los estilos visuales del perfil del doctor
const styles = StyleSheet.create({
  // --Contenedor principal--
  // Estilo del contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  // --Encabezado--
  // Estilo del encabezado de la pantalla
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  // --Título principal--
  // Estilo del título principal de la pantalla
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  // --Contenedor de información del doctor--
  // Estilo del contenedor principal de información del doctor
  doctorInfoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // --Información del doctor--
  // Estilo del contenedor de información básica del doctor
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  // --Imagen del doctor--
  // Estilo de la imagen de perfil del doctor
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  // --Detalles del doctor--
  // Estilo del contenedor de detalles del doctor
  doctorDetails: {
    flex: 1,
  },
  // --Nombre del doctor--
  // Estilo del nombre principal del doctor
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  // --Especialidad del doctor--
  // Estilo de la especialidad médica del doctor
  doctorSpecialty: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  // --Número de licencia--
  // Estilo del número de licencia médica del doctor
  licenseNumber: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  // --Botones de acción--
  // Estilo del contenedor de botones de acción
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  // --Botón de editar--
  // Estilo del botón para editar el perfil
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#34C759',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '600',
    marginLeft: 6,
  },
  // --Botón de compartir--
  // Estilo del botón para compartir el perfil
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
  },
  shareButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  // --Contenedor de sección--
  // Estilo del contenedor de cada sección de información
  section: {
    marginBottom: 24,
  },
  // --Título de sección--
  // Estilo del título de cada sección de información
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  // --Tarjeta de información--
  // Estilo de la tarjeta que contiene información del doctor
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // --Texto de información--
  // Estilo del texto descriptivo del doctor
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  // --Fila de información--
  // Estilo de cada fila individual de información
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  // --Texto de información--
  // Estilo del texto en cada fila de información
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  // --Tarjeta de horario--
  // Estilo de la tarjeta que contiene el horario del doctor
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleDay: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#666',
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationDetails: {
    flex: 1,
    marginLeft: 12,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default DoctorProfile; 