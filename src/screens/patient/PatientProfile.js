// --Imports de React y React Native--
// {{importa React, useState, useEffect y componentes básicos de React Native}}
import React, { useState, useEffect } from 'react';
// --Imports de componentes de React Native--
// {{importa View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView e Image}}
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
// --Import de iconos--
// {{importa Ionicons de la librería de iconos de Expo}}
import { Ionicons } from '@expo/vector-icons';
// --Import del contexto del perfil del paciente--
// {{importa el hook usePatientProfile para acceder a datos del paciente}}
import { usePatientProfile } from '../../context/PatientProfileContext';
// --Import de utilidades de fecha--
// {{importa función para formatear fechas para visualización}}
import { formatDateForDisplay } from '../../utils/dateUtils';

// --Componente PatientProfile--
// {{pantalla del perfil del paciente con información personal y menú de opciones}}
const PatientProfile = ({ navigation, route }) => {
  // --Hook del contexto del perfil del paciente--
  // {{obtiene los datos del usuario desde el contexto global}}
  const { patientProfile } = usePatientProfile();
  
  // --Variable del usuario--
  // {{usa los datos del contexto directamente para el usuario}}
  const user = patientProfile;

  // --Elementos del menú principal--
  // {{lista de opciones del menú con iconos y acciones de navegación}}
  const menuItems = [
    {
      id: 1,
      title: 'Citas próximas',
      icon: 'calendar-outline',
      action: () => navigation.navigate('PatientAppointmentsMain'),
    },
    {
      id: 2,
      title: 'Historial de citas',
      icon: 'time-outline',
      action: () => navigation.navigate('PatientAppointmentsMain'),
    },
    {
      id: 3,
      title: 'Doctores favoritos',
      icon: 'heart-outline',
      action: () => navigation.navigate('Favorites'),
    },
    {
      id: 4,
      title: 'Historial médico',
      icon: 'medical-outline',
      action: () => {},
    },
    {
      id: 5,
      title: 'Documentos',
      icon: 'document-outline',
      action: () => {},
    },
    {
      id: 6,
      title: 'Configuración',
      icon: 'settings-outline',
      action: () => {},
      hasSubmenu: true,
      // --Subelementos de configuración--
      // {{opciones adicionales dentro de la configuración}}
      subItems: [
        {
          id: 'notifications',
          title: 'Notificaciones',
          icon: 'notifications-outline',
        },
        {
          id: 'preferences',
          title: 'Preferencias de la app',
          icon: 'options-outline',
        },
        {
          id: 'privacy',
          title: 'Privacidad y seguridad',
          icon: 'shield-outline',
        },
      ],
    },
    {
      id: 7,
      title: 'Ayuda y soporte',
      icon: 'help-circle-outline',
      action: () => {},
    },
    {
      id: 8,
      title: 'Acerca de',
      icon: 'information-circle-outline',
      action: () => {},
    },
  ];

  // --Función de renderizado de elemento del menú--
  // {{renderiza un elemento individual del menú con icono y título}}
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

  // --Función de renderizado de subelemento del menú--
  // {{renderiza un subelemento del menú con icono más pequeño y título}}
  const renderSubMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.subMenuItem}
      onPress={() => {}}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons name={item.icon} size={20} color="#666" style={styles.subMenuIcon} />
        <Text style={styles.subMenuTitle}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#CCC" />
    </TouchableOpacity>
  );

  // --Return del componente--
  // {{renderiza la interfaz principal del componente}}
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --Header principal-- */}
        {/* {{encabezado con título de la pantalla}} */}
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        {/* --Información del usuario-- */}
        {/* {{sección con foto, nombre y botón de edición}} */}
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfo}>
            <Image source={{ uri: user.image }} style={styles.userImage} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.membershipText}>Miembro desde {user.membershipDate}</Text>

            </View>
          </View>
          {/* --Botón de edición-- */}
          {/* {{botón para navegar a la pantalla de edición del perfil}} */}
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('EditPatientProfile', { userData: user })}
          >
            <Ionicons name="pencil" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* --Información personal-- */}
        {/* {{sección con datos de contacto y ubicación del usuario}} */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <View style={styles.infoCard}>
            {/* --Fila de email-- */}
            {/* {{muestra el correo electrónico del usuario}} */}
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
            {/* --Fila de teléfono-- */}
            {/* {{muestra el número de teléfono del usuario}} */}
            <View style={styles.infoRow}>
               <Ionicons name="call-outline" size={20} color="#666" />
               <Text style={styles.infoText}>{user.phone}</Text>
             </View>
             {/* --Fila de ciudad-- */}
             {/* {{muestra la ciudad de residencia del usuario}} */}
             <View style={styles.infoRow}>
               <Ionicons name="location-outline" size={20} color="#666" />
               <Text style={styles.infoText}>{user.city}</Text>
             </View>
             {/* --Fila de fecha de membresía-- */}
             {/* {{muestra desde cuándo es miembro el usuario}} */}
             <View style={styles.infoRow}>
               <Ionicons name="calendar-outline" size={20} color="#666" />
               <Text style={styles.infoText}>Miembro desde {user.membershipDate}</Text>
             </View>
          </View>
        </View>

        {/* --Elementos del menú-- */}
        {/* {{sección con todas las opciones del menú principal}} */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opciones</Text>
          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <View key={item.id}>
                {renderMenuItem(item)}
                {/* --Submenú condicional-- */}
                {/* {{muestra subelementos si el elemento los tiene}} */}
                {item.hasSubmenu && (
                  <View style={styles.subMenuContainer}>
                    {item.subItems.map(renderSubMenuItem)}
                  </View>
                )}
              </View>
            ))}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  // --Estilo del header--
  // {{encabezado con padding personalizado}}
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  // --Estilo del título--
  // {{título principal en negrita y tamaño grande}}
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  // --Estilo del contenedor de información del usuario--
  // {{tarjeta con información del usuario y botón de edición}}
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  // --Estilo de la información del usuario--
  // {{layout horizontal para foto y datos del usuario}}
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  // --Estilo de la imagen del usuario--
  // {{imagen circular del usuario}}
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  // --Estilo de los detalles del usuario--
  // {{contenedor flexible para nombre y fecha de membresía}}
  userDetails: {
    flex: 1,
  },
  // --Estilo del nombre del usuario--
  // {{nombre en negrita y tamaño mediano}}
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  // --Estilo del email del usuario--
  // {{email en gris y tamaño pequeño}}
  userEmail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  // --Estilo del texto de membresía--
  // {{texto azul para la fecha de membresía}}
  membershipText: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '500',
  },
  // --Estilo del botón de edición--
  // {{botón con borde azul para editar el perfil}}
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
  },
  // --Estilo del texto del botón de edición--
  // {{texto azul para el botón de edición}}
  editButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  // --Estilo de sección--
  // {{contenedor para cada sección del perfil}}
  section: {
    marginBottom: 24,
  },
  // --Estilo del título de sección--
  // {{título en negrita para cada sección}}
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  // --Estilo de tarjeta de información--
  // {{tarjeta con sombra para mostrar información personal}}
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
  // --Estilo de fila de información--
  // {{layout horizontal para icono y texto de información}}
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  // --Estilo del texto de información--
  // {{texto en gris para datos personales}}
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  // --Estilo del contenedor del menú--
  // {{tarjeta con sombra para mostrar opciones del menú}}
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
  // --Estilo de elemento del menú--
  // {{fila horizontal para cada opción del menú}}
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  // --Estilo del lado izquierdo del elemento del menú--
  // {{contenedor para icono y título del menú}}
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  // --Estilo del icono del menú--
  // {{icono con margen derecho para separación}}
  menuIcon: {
    marginRight: 12,
  },
  // --Estilo del título del menú--
  // {{título en negrita para cada opción del menú}}
  menuTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  // --Estilo del contenedor del submenú--
  // {{fondo gris claro para elementos del submenú}}
  subMenuContainer: {
    backgroundColor: '#F8F9FA',
  },
  // --Estilo de elemento del submenú--
  // {{fila horizontal para opciones del submenú con padding mayor}}
  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  // --Estilo del icono del submenú--
  // {{icono más pequeño para elementos del submenú}}
  subMenuIcon: {
    marginRight: 12,
  },
  // --Estilo del título del submenú--
  // {{título más pequeño y en gris para subelementos}}
  subMenuTitle: {
    fontSize: 14,
    color: '#666',
  },
  // --Estilo del contenedor del botón de logout--
  // {{contenedor con padding para el botón de cerrar sesión}}
  logoutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  // --Estilo del botón de logout--
  // {{botón con borde rojo para cerrar sesión}}
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
  // --Estilo del texto del botón de logout--
  // {{texto rojo en negrita para el botón de cerrar sesión}}
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PatientProfile; 