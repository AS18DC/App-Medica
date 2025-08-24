import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PatientProfile = ({ navigation, route }) => {
  // Mock user data
  const [user, setUser] = useState({
    name: 'Maria González',
    email: 'maria.gonzalez@email.com',
    phone: '+58 412 345 6789',
    city: 'Caracas',
    birthDate: '15/03/1990',
    gender: 'Femenino',
    height: '165',
    weight: '58',
    membershipDate: 'Enero 2024',
    image: "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ="
  });

  // Verificar si hay datos actualizados desde la pantalla de edición
  useEffect(() => {
    if (route.params?.updatedUser) {
      setUser(route.params.updatedUser);
      // Limpiar los parámetros para evitar actualizaciones no deseadas
      navigation.setParams({ updatedUser: undefined });
    }
  }, [route.params?.updatedUser, navigation]);

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfo}>
            <Image source={{ uri: user.image }} style={styles.userImage} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.membershipText}>
                Miembro desde {user.membershipDate}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('EditPatientProfile', { userData: user })}
          >
            <Ionicons name="pencil" size={20} color="#007AFF" />
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
                         <View style={styles.infoRow}>
               <Ionicons name="call-outline" size={20} color="#666" />
               <Text style={styles.infoText}>{user.phone}</Text>
             </View>
             <View style={styles.infoRow}>
               <Ionicons name="location-outline" size={20} color="#666" />
               <Text style={styles.infoText}>{user.city}</Text>
             </View>
             <View style={styles.infoRow}>
               <Ionicons name="calendar-outline" size={20} color="#666" />
               <Text style={styles.infoText}>Fecha de nacimiento: {user.birthDate}</Text>
             </View>
             <View style={styles.infoRow}>
               <Ionicons name="person-outline" size={20} color="#666" />
               <Text style={styles.infoText}>Sexo: {user.gender}</Text>
             </View>
             <View style={styles.infoRow}>
               <Ionicons name="resize-outline" size={20} color="#666" />
               <Text style={styles.infoText}>Altura: {user.height} cm</Text>
             </View>
             <View style={styles.infoRow}>
               <Ionicons name="scale-outline" size={20} color="#666" />
               <Text style={styles.infoText}>Peso: {user.weight} kg</Text>
             </View>
             <View style={styles.infoRow}>
               <Ionicons name="calendar-outline" size={20} color="#666" />
               <Text style={styles.infoText}>Miembro desde {user.membershipDate}</Text>
             </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opciones</Text>
          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <View key={item.id}>
                {renderMenuItem(item)}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  membershipText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
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
  subMenuContainer: {
    backgroundColor: '#F8F9FA',
  },
  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  subMenuIcon: {
    marginRight: 12,
  },
  subMenuTitle: {
    fontSize: 14,
    color: '#666',
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

export default PatientProfile; 