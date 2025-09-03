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

const ClinicProfile = ({ navigation }) => {
  // --Datos de la clínica--
  // Información simulada de la clínica con todos sus detalles
  const clinic = {
    name: 'Clínica San Martín',
    address: 'Calle San Martín 123, Madrid',
    phone: '+34 912 345 678',
    email: 'info@clinicasanmartin.com',
    website: 'www.clinicasanmartin.com',
    image: 'https://via.placeholder.com/120',
    description: 'Clínica San Martín es un centro médico integral que ofrece servicios de alta calidad en múltiples especialidades. Contamos con un equipo de profesionales altamente calificados y tecnología de vanguardia.',
    specialties: ['Cardiología', 'Dermatología', 'Pediatría', 'Neurología', 'Ginecología'],
    schedule: {
      monday: '8:00 AM - 8:00 PM',
      tuesday: '8:00 AM - 8:00 PM',
      wednesday: '8:00 AM - 8:00 PM',
      thursday: '8:00 AM - 8:00 PM',
      friday: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 2:00 PM',
      sunday: 'Cerrado',
    },
    stats: {
      doctors: 12,
      patients: 1500,
      appointments: 89,
    },
  };

  // --Elementos del menú--
  // Lista de opciones disponibles en el menú del perfil
  const menuItems = [
    {
      id: 1,
      title: 'Editar perfil',
      icon: 'pencil-outline',
      action: () => {},
    },
    {
      id: 2,
      title: 'Gestionar médicos',
      icon: 'people-outline',
      action: () => {},
    },
    {
      id: 3,
      title: 'Horarios',
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
  // Renderiza cada elemento individual del menú con su icono y título
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

        {/* Clinic Info */}
        <View style={styles.clinicInfoContainer}>
          <View style={styles.clinicInfo}>
            <Image source={{ uri: clinic.image }} style={styles.clinicImage} />
            <View style={styles.clinicDetails}>
              <Text style={styles.clinicName}>{clinic.name}</Text>
              <Text style={styles.clinicAddress}>{clinic.address}</Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={20} color="#FF9500" />
              <Text style={styles.editButtonText}>Editar perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color="#FF9500" />
            <Text style={styles.statNumber}>{clinic.stats.doctors}</Text>
            <Text style={styles.statLabel}>Médicos</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="person" size={24} color="#007AFF" />
            <Text style={styles.statNumber}>{clinic.stats.patients}</Text>
            <Text style={styles.statLabel}>Pacientes</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={24} color="#34C759" />
            <Text style={styles.statNumber}>{clinic.stats.appointments}</Text>
            <Text style={styles.statLabel}>Citas hoy</Text>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre la clínica</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>{clinic.description}</Text>
          </View>
        </View>

        {/* Specialties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especialidades</Text>
          <View style={styles.specialtiesContainer}>
            {clinic.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyChip}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horarios de atención</Text>
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleDay}>Lunes - Viernes</Text>
              <Text style={styles.scheduleTime}>{clinic.schedule.monday}</Text>
            </View>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleDay}>Sábado</Text>
              <Text style={styles.scheduleTime}>{clinic.schedule.saturday}</Text>
            </View>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleDay}>Domingo</Text>
              <Text style={styles.scheduleTime}>{clinic.schedule.sunday}</Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de contacto</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={20} color="#666" />
              <Text style={styles.contactText}>{clinic.phone}</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <Text style={styles.contactText}>{clinic.email}</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="globe-outline" size={20} color="#666" />
              <Text style={styles.contactText}>{clinic.website}</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.contactText}>{clinic.address}</Text>
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
// Define todos los estilos visuales del perfil de la clínica
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
  // Estilo del título principal del perfil
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  
  // --Contenedor de información de la clínica--
  // Estilo del contenedor principal de información de la clínica
  clinicInfoContainer: {
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
  
  // --Información de la clínica--
  // Estilo del contenedor de información básica de la clínica
  clinicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // --Imagen de la clínica--
  // Estilo de la imagen de perfil de la clínica
  clinicImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 16,
  },
  
  // --Detalles de la clínica--
  // Estilo del contenedor de detalles de la clínica
  clinicDetails: {
    flex: 1,
  },
  
  // --Nombre de la clínica--
  // Estilo del nombre de la clínica
  clinicName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  
  // --Dirección de la clínica--
  // Estilo de la dirección de la clínica
  clinicAddress: {
    fontSize: 14,
    color: '#666',
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
    borderColor: '#FF9500',
    borderRadius: 8,
  },
  
  // --Texto del botón de editar--
  // Estilo del texto del botón de editar
  editButtonText: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '600',
    marginLeft: 6,
  },
  
  // --Contenedor de estadísticas--
  // Estilo del contenedor que muestra las estadísticas de la clínica
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  
  // --Tarjeta de estadística--
  // Estilo de cada tarjeta individual de estadística
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // --Número de estadística--
  // Estilo del número principal en cada tarjeta de estadística
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 8,
    marginBottom: 4,
  },
  
  // --Etiqueta de estadística--
  // Estilo de la etiqueta descriptiva en cada tarjeta de estadística
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  
  // --Sección--
  // Estilo base para cada sección del perfil
  section: {
    marginBottom: 24,
  },
  
  // --Título de sección--
  // Estilo del título de cada sección
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  
  // --Tarjeta de información--
  // Estilo de la tarjeta que contiene información sobre la clínica
  aboutCard: {
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
  // Estilo del texto descriptivo sobre la clínica
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  
  // --Contenedor de especialidades--
  // Estilo del contenedor que muestra las especialidades de la clínica
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
  },
  
  // --Chip de especialidad--
  // Estilo de cada chip individual que representa una especialidad
  specialtyChip: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  
  // --Texto de especialidad--
  // Estilo del texto dentro de cada chip de especialidad
  specialtyText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  
  // --Tarjeta de horarios--
  // Estilo de la tarjeta que muestra los horarios de atención
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
  
  // --Fila de horario--
  // Estilo de cada fila individual que muestra un día y su horario
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  // --Día del horario--
  // Estilo del texto que indica el día de la semana
  scheduleDay: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  
  // --Hora del horario--
  // Estilo del texto que muestra la hora de atención
  scheduleTime: {
    fontSize: 14,
    color: '#666',
  },
  
  // --Tarjeta de contacto--
  // Estilo de la tarjeta que muestra la información de contacto
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
  
  // --Fila de contacto--
  // Estilo de cada fila individual que muestra un tipo de contacto
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  // --Texto de contacto--
  // Estilo del texto que muestra la información de contacto
  contactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  
  // --Contenedor del menú--
  // Estilo del contenedor que incluye todas las opciones del menú
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
  
  // --Elemento del menú--
  // Estilo de cada elemento individual del menú
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  
  // --Parte izquierda del elemento del menú--
  // Estilo del contenedor izquierdo de cada elemento del menú
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  // --Icono del menú--
  // Estilo del icono de cada elemento del menú
  menuIcon: {
    marginRight: 12,
  },
  
  // --Título del menú--
  // Estilo del título de cada elemento del menú
  menuTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  
  // --Contenedor de cerrar sesión--
  // Estilo del contenedor del botón de cerrar sesión
  logoutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  
  // --Botón de cerrar sesión--
  // Estilo del botón para cerrar sesión
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
  
  // --Texto de cerrar sesión--
  // Estilo del texto del botón de cerrar sesión
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ClinicProfile; 