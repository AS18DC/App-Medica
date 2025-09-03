// --Imports de React Native--
// Importa las funcionalidades básicas de React y React Native
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';

// --Imports de iconos--
// Importa iconos de Ionicons para la interfaz de usuario
import { Ionicons } from '@expo/vector-icons';

const NewChatModal = ({ visible, onClose, onSelectDoctor }) => {
  // --Consulta de búsqueda--
  // Almacena el texto de búsqueda para filtrar doctores
  const [searchQuery, setSearchQuery] = useState('');
  
  // --Especialidad seleccionada--
  // Almacena la especialidad médica seleccionada para filtrar
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  // --Doctores disponibles--
  // Lista mock de doctores disponibles para chatear
  const availableDoctors = [
    {
      id: 1,
      name: 'Dr. Sofia Ramirez',
      specialty: 'Cardiología',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      isOnline: true,
      rating: 4.8,
      experience: '15 años',
    },
    {
      id: 2,
      name: 'Dr. Carlos Mendoza',
      specialty: 'Dermatología',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      isOnline: false,
      rating: 4.6,
      experience: '12 años',
    },
    {
      id: 3,
      name: 'Dr. Ana Torres',
      specialty: 'Pediatría',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      isOnline: true,
      rating: 4.9,
      experience: '18 años',
    },
    {
      id: 4,
      name: 'Dr. Miguel Rodriguez',
      specialty: 'Neurología',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
      isOnline: true,
      rating: 4.7,
      experience: '20 años',
    },
  ];

  // --Especialidades--
  // Lista de especialidades médicas disponibles para filtrar
  const specialties = [
    { id: 'all', name: 'Todas las especialidades' },
    { id: 'cardiology', name: 'Cardiología' },
    { id: 'dermatology', name: 'Dermatología' },
    { id: 'pediatrics', name: 'Pediatría' },
    { id: 'neurology', name: 'Neurología' },
  ];

  // --Doctores filtrados--
  // Aplica filtros de búsqueda y especialidad a la lista de doctores
  const filteredDoctors = availableDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || 
                            doctor.specialty.toLowerCase().includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  // --Renderizar doctor--
  // Renderiza cada elemento de la lista de doctores
  const renderDoctor = ({ item }) => (
    <TouchableOpacity
      style={styles.doctorItem}
      onPress={() => onSelectDoctor(item)}
    >
      <View style={styles.doctorImageContainer}>
        <Image source={{ uri: item.image }} style={styles.doctorImage} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
        <View style={styles.doctorDetails}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.experience}>{item.experience}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.chatButton}>
        <Ionicons name="chatbubble-outline" size={20} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // --Renderizar filtro de especialidad--
  // Renderiza cada filtro de especialidad médica
  const renderSpecialtyFilter = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.specialtyFilter,
        selectedSpecialty === item.id && styles.specialtyFilterActive,
      ]}
      onPress={() => setSelectedSpecialty(item.id)}
    >
      <Text
        style={[
          styles.specialtyFilterText,
          selectedSpecialty === item.id && styles.specialtyFilterTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.title}>Nuevo Chat</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar doctores..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Specialty Filters */}
        <View style={styles.filtersContainer}>
          <FlatList
            data={specialties}
            renderItem={renderSpecialtyFilter}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          />
        </View>

        {/* Doctors List */}
        <FlatList
          data={filteredDoctors}
          renderItem={renderDoctor}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.doctorsList}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // --Contenedor principal--
  // Contenedor principal del modal con fondo gris claro
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // --Encabezado del modal--
  // Header con botón de cerrar, título y espacio derecho
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  
  // --Botón de cerrar--
  // Botón para cerrar el modal
  closeButton: {
    padding: 4,
  },
  
  // --Título del modal--
  // Título principal del modal de nuevo chat
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  
  // --Espacio derecho del header--
  // Espacio para mantener el título centrado
  headerRight: {
    width: 32,
  },
  
  // --Contenedor de búsqueda--
  // Contenedor para la barra de búsqueda
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  
  // --Barra de búsqueda--
  // Barra de búsqueda con icono y campo de texto
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  // --Campo de búsqueda--
  // Campo de texto para ingresar la búsqueda
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1A1A1A',
  },
  
  // --Contenedor de filtros--
  // Contenedor para los filtros de especialidad
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
  },
  
  // --Lista de filtros--
  // Lista horizontal de filtros de especialidad
  filtersList: {
    paddingHorizontal: 20,
  },
  
  // --Filtro de especialidad--
  // Botón individual de filtro de especialidad
  specialtyFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  
  // --Filtro de especialidad activo--
  // Estado activo del filtro de especialidad
  specialtyFilterActive: {
    backgroundColor: '#007AFF',
  },
  
  // --Texto del filtro--
  // Estilo para el texto del filtro de especialidad
  specialtyFilterText: {
    fontSize: 14,
    color: '#666',
  },
  
  // --Texto del filtro activo--
  // Estilo para el texto del filtro activo
  specialtyFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  
  // --Lista de doctores--
  // Lista vertical de doctores disponibles
  doctorsList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  
  // --Elemento de doctor--
  // Elemento individual de la lista de doctores
  doctorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // --Contenedor de imagen del doctor--
  // Contenedor para la imagen del doctor con indicador online
  doctorImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  
  // --Imagen del doctor--
  // Imagen circular del doctor
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  
  // --Indicador online--
  // Indicador verde de que el doctor está en línea
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  
  // --Información del doctor--
  // Contenedor para la información del doctor
  doctorInfo: {
    flex: 1,
  },
  
  // --Nombre del doctor--
  // Estilo para el nombre del doctor
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  
  // --Especialidad del doctor--
  // Estilo para la especialidad del doctor
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  
  // --Detalles del doctor--
  // Contenedor para rating y experiencia
  doctorDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // --Contenedor de rating--
  // Contenedor para mostrar el rating del doctor
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  
  // --Rating del doctor--
  // Estilo para mostrar el rating numérico
  rating: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  
  // --Experiencia del doctor--
  // Estilo para mostrar los años de experiencia
  experience: {
    fontSize: 12,
    color: '#666',
  },
  
  // --Botón de chat--
  // Botón para iniciar chat con el doctor
  chatButton: {
    padding: 8,
  },
});

export default NewChatModal;


