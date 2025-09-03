// --Imports de React--
// Importa las funcionalidades básicas de React y hooks de estado y efectos
import React, { useState, useEffect } from 'react';

// --Imports de React Native--
// Importa componentes básicos de React Native para la interfaz
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  FlatList,
  Image,
  Alert,
  Modal,
} from 'react-native';

// --Imports de iconos--
// Importa iconos de Ionicons para la interfaz de usuario
import { Ionicons } from '@expo/vector-icons';

// --Imports de utilidades responsivas--
// Importa funciones para hacer la interfaz responsiva en diferentes dispositivos
import { isWeb, webStyles, getResponsiveSpacing, getResponsiveFontSize, getResponsivePadding } from '../../utils/responsive';

// --Imports de contexto--
// Importa el contexto del doctor para acceder a pacientes y funciones relacionadas
import { useDoctor } from '../../context/DoctorContext';

const DoctorPatients = ({ navigation }) => {
  // --Estado de búsqueda--
  // Texto de búsqueda para filtrar pacientes
  const [searchQuery, setSearchQuery] = useState('');
  
  // --Estado de filtro seleccionado--
  // Filtro activo para categorizar pacientes
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // --Estado de modal de paciente--
  // Controla la visibilidad del modal de detalles del paciente
  const [showPatientModal, setShowPatientModal] = useState(false);
  
  // --Estado de paciente seleccionado--
  // Paciente actualmente seleccionado para mostrar en el modal
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // --Estado de modal de eliminación--
  // Controla la visibilidad del modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // --Estado de paciente a eliminar--
  // Paciente que será eliminado después de confirmación
  const [patientToDelete, setPatientToDelete] = useState(null);
  
  // --Contexto del doctor--
  // Obtiene la lista de pacientes y funciones del contexto del doctor
  const { patients, removePatient } = useDoctor();

  // --Filtros disponibles--
  // Lista de filtros para categorizar pacientes
  const filters = [
    { id: 'all', label: 'Todos', icon: 'people' },
    { id: 'active', label: 'Activos', icon: 'checkmark-circle' },
    { id: 'inactive', label: 'Inactivos', icon: 'close-circle' },
    { id: 'recent', label: 'Recientes', icon: 'time' },
  ];

  // --Pacientes filtrados--
  // Lista de pacientes filtrada según la búsqueda y filtro seleccionado
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.phone.includes(searchQuery);
    
    let matchesFilter = true;
    switch (selectedFilter) {
      case 'active':
        matchesFilter = patient.status === 'active';
        break;
      case 'inactive':
        matchesFilter = patient.status === 'inactive';
        break;
      case 'recent':
        // Pacientes agregados en los últimos 30 días
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        matchesFilter = new Date(patient.addedDate) >= thirtyDaysAgo;
        break;
    }
    
    return matchesSearch && matchesFilter;
  });

  // --Función de selección de filtro--
  // Cambia el filtro activo para la lista de pacientes
  const handleFilterSelect = (filterId) => {
    setSelectedFilter(filterId);
  };

  // --Función de búsqueda--
  // Actualiza el texto de búsqueda para filtrar pacientes
  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  // --Función de selección de paciente--
  // Abre el modal con los detalles del paciente seleccionado
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  // --Función de cierre de modal--
  // Cierra el modal de detalles del paciente
  const handleCloseModal = () => {
    setShowPatientModal(false);
    setSelectedPatient(null);
  };

  // --Función de chat con paciente--
  // Navega al chat con el paciente seleccionado
  const handleChatWithPatient = (patient) => {
    handleCloseModal();
    navigation.navigate('DoctorChat', {
      patient: patient,
      appointment: null
    });
  };

  // --Función de editar paciente--
  // Navega a la pantalla de edición del paciente
  const handleEditPatient = (patient) => {
    handleCloseModal();
    // Aquí podrías navegar a una pantalla de edición
    Alert.alert('Editar paciente', 'Funcionalidad de edición próximamente disponible');
  };

  // --Función de eliminar paciente--
  // Abre el modal de confirmación para eliminar un paciente
  const handleDeletePatient = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
    handleCloseModal();
  };

  // --Función de confirmar eliminación--
  // Confirma y ejecuta la eliminación del paciente
  const handleConfirmDelete = () => {
    if (patientToDelete) {
      removePatient(patientToDelete.id);
      setShowDeleteModal(false);
      setPatientToDelete(null);
      Alert.alert('Paciente eliminado', 'El paciente ha sido eliminado exitosamente');
    }
  };

  // --Función de cancelar eliminación--
  // Cancela el proceso de eliminación del paciente
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPatientToDelete(null);
  };

  // --Función de renderizado de filtro--
  // Renderiza cada filtro individual en la barra de filtros
  const renderFilter = (filter) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterButton,
        selectedFilter === filter.id && styles.filterButtonActive
      ]}
      onPress={() => handleFilterSelect(filter.id)}
    >
      <Ionicons
        name={filter.icon}
        size={getResponsiveFontSize(16, 18, 20)}
        color={selectedFilter === filter.id ? '#FFFFFF' : '#666'}
      />
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter.id && styles.filterButtonTextActive,
        { fontSize: getResponsiveFontSize(12, 13, 14) }
      ]}>
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  // --Función de renderizado de paciente--
  // Renderiza cada paciente individual en la lista
  const renderPatient = ({ item: patient }) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() => handlePatientSelect(patient)}
    >
      <View style={styles.patientCardHeader}>
        <View style={styles.patientInfo}>
          <Image
            source={{ uri: patient.avatar }}
            style={styles.patientAvatar}
            defaultSource={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' }}
          />
          <View style={styles.patientDetails}>
            <Text style={[styles.patientName, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
              {patient.name}
            </Text>
            <Text style={[styles.patientEmail, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
              {patient.email}
            </Text>
            <Text style={[styles.patientPhone, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
              {patient.phone}
            </Text>
          </View>
        </View>
        
        <View style={styles.patientStatus}>
          <View style={[
            styles.statusIndicator,
            patient.status === 'active' ? styles.statusActive : styles.statusInactive
          ]} />
          <Text style={[styles.statusText, { fontSize: getResponsiveFontSize(10, 11, 12) }]}>
            {patient.status === 'active' ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>
      
      <View style={styles.patientCardFooter}>
        <View style={styles.patientStats}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
              {patient.appointmentsCount || 0}
            </Text>
            <Text style={[styles.statLabel, { fontSize: getResponsiveFontSize(10, 11, 12) }]}>
              Citas
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
              {patient.prescriptionsCount || 0}
            </Text>
            <Text style={[styles.statLabel, { fontSize: getResponsiveFontSize(10, 11, 12) }]}>
              Recetas
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
              {patient.lastVisit ? 'Sí' : 'No'}
            </Text>
            <Text style={[styles.statLabel, { fontSize: getResponsiveFontSize(10, 11, 12) }]}>
              Última visita
            </Text>
          </View>
        </View>
        
        <View style={styles.patientActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleChatWithPatient(patient)}
          >
            <Ionicons name="chatbubble" size={getResponsiveFontSize(16, 18, 20)} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditPatient(patient)}
          >
            <Ionicons name="create" size={getResponsiveFontSize(16, 18, 20)} color="#FF9500" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // --Función de renderizado de modal de paciente--
  // Renderiza el modal con los detalles completos del paciente
  const renderPatientModal = () => (
    <Modal
      visible={showPatientModal}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, isWeb && webStyles.modalContent]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
              Detalles del paciente
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Ionicons name="close" size={getResponsiveFontSize(24, 26, 28)} color="#666" />
            </TouchableOpacity>
          </View>
          
          {selectedPatient && (
            <ScrollView style={styles.modalBody}>
              <View style={styles.modalPatientInfo}>
                <Image
                  source={{ uri: selectedPatient.avatar }}
                  style={styles.modalPatientAvatar}
                  defaultSource={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' }}
                />
                <Text style={[styles.modalPatientName, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                  {selectedPatient.name}
                </Text>
                <Text style={[styles.modalPatientEmail, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  {selectedPatient.email}
                </Text>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={[styles.modalSectionTitle, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
                  Información de contacto
                </Text>
                <View style={styles.modalInfoRow}>
                  <Ionicons name="call" size={getResponsiveFontSize(16, 18, 20)} color="#666" />
                  <Text style={[styles.modalInfoText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                    {selectedPatient.phone}
                  </Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Ionicons name="mail" size={getResponsiveFontSize(16, 18, 20)} color="#666" />
                  <Text style={[styles.modalInfoText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                    {selectedPatient.email}
                  </Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Ionicons name="location" size={getResponsiveFontSize(16, 18, 20)} color="#666" />
                  <Text style={[styles.modalInfoText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                    {selectedPatient.address || 'No especificada'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={[styles.modalSectionTitle, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
                  Información médica
                </Text>
                <View style={styles.modalInfoRow}>
                  <Ionicons name="calendar" size={getResponsiveFontSize(16, 18, 20)} color="#666" />
                  <Text style={[styles.modalInfoText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                    Fecha de nacimiento: {selectedPatient.birthDate || 'No especificada'}
                  </Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Ionicons name="medical" size={getResponsiveFontSize(16, 18, 20)} color="#666" />
                  <Text style={[styles.modalInfoText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                    Grupo sanguíneo: {selectedPatient.bloodType || 'No especificado'}
                  </Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Ionicons name="alert-circle" size={getResponsiveFontSize(16, 18, 20)} color="#666" />
                  <Text style={[styles.modalInfoText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                    Alergias: {selectedPatient.allergies || 'Ninguna conocida'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={[styles.modalSectionTitle, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
                  Estadísticas
                </Text>
                <View style={styles.modalStats}>
                  <View style={styles.modalStat}>
                    <Text style={[styles.modalStatNumber, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
                      {selectedPatient.appointmentsCount || 0}
                    </Text>
                    <Text style={[styles.modalStatLabel, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                      Citas totales
                    </Text>
                  </View>
                  <View style={styles.modalStat}>
                    <Text style={[styles.modalStatNumber, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
                      {selectedPatient.prescriptionsCount || 0}
                    </Text>
                    <Text style={[styles.modalStatLabel, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                      Recetas emitidas
                    </Text>
                  </View>
                  <View style={styles.modalStat}>
                    <Text style={[styles.modalStatNumber, { fontSize: getResponsiveFontSize(20, 22, 24) }]}>
                      {selectedPatient.lastVisit ? 'Sí' : 'No'}
                    </Text>
                    <Text style={[styles.modalStatLabel, { fontSize: getResponsiveFontSize(12, 13, 14) }]}>
                      Última visita
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
          
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={handleCloseModal}
            >
              <Text style={[styles.modalButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                Cerrar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={() => handleChatWithPatient(selectedPatient)}
            >
              <Text style={[styles.modalButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                Chat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonDanger]}
              onPress={() => handleDeletePatient(selectedPatient)}
            >
              <Text style={[styles.modalButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                Eliminar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // --Función de renderizado de modal de eliminación--
  // Renderiza el modal de confirmación para eliminar un paciente
  const renderDeleteModal = () => (
    <Modal
      visible={showDeleteModal}
      animationType="fade"
      transparent={true}
      onRequestClose={handleCancelDelete}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.deleteModalContent, isWeb && webStyles.modalContent]}>
          <View style={styles.deleteModalHeader}>
            <Ionicons name="warning" size={getResponsiveFontSize(48, 52, 56)} color="#FF3B30" />
            <Text style={[styles.deleteModalTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
              Eliminar paciente
            </Text>
          </View>
          
          <Text style={[styles.deleteModalMessage, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
            ¿Estás seguro de que quieres eliminar a {patientToDelete?.name}? Esta acción no se puede deshacer.
          </Text>
          
          <View style={styles.deleteModalActions}>
            <TouchableOpacity
              style={[styles.deleteModalButton, styles.deleteModalButtonCancel]}
              onPress={handleCancelDelete}
            >
              <Text style={[styles.deleteModalButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteModalButton, styles.deleteModalButtonConfirm]}
              onPress={handleConfirmDelete}
            >
              <Text style={[styles.deleteModalButtonText, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                Eliminar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, isWeb && webStyles.container]}>
        {/* Header */}
        <View style={[styles.header, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
          <View style={styles.headerTop}>
            <View style={styles.headerInfo}>
              <Text style={[styles.title, { fontSize: getResponsiveFontSize(28, 30, 32) }]}>
                Mis pacientes
              </Text>
              <Text style={[styles.subtitle, { fontSize: getResponsiveFontSize(16, 17, 18) }]}>
                {filteredPatients.length} paciente{filteredPatients.length !== 1 ? 's' : ''} encontrado{filteredPatients.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search and Filters */}
          <View style={[styles.searchFiltersContainer, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={getResponsiveFontSize(20, 22, 24)} color="#666" />
              <TextInput
                style={[styles.searchInput, { fontSize: getResponsiveFontSize(14, 15, 16) }]}
                placeholder="Buscar pacientes..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={handleSearch}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearSearchButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Ionicons name="close-circle" size={getResponsiveFontSize(20, 22, 24)} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            {/* Filters */}
            <View style={styles.filtersContainer}>
              {filters.map(renderFilter)}
            </View>
          </View>

          {/* Patients List */}
          <View style={[styles.patientsContainer, { paddingHorizontal: getResponsivePadding(20, 40, 60) }]}>
            {filteredPatients.length > 0 ? (
              <FlatList
                data={filteredPatients}
                renderItem={renderPatient}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="people" size={getResponsiveFontSize(64, 68, 72)} color="#CCC" />
                <Text style={[styles.emptyStateTitle, { fontSize: getResponsiveFontSize(18, 20, 22) }]}>
                  No se encontraron pacientes
                </Text>
                <Text style={[styles.emptyStateMessage, { fontSize: getResponsiveFontSize(14, 15, 16) }]}>
                  {searchQuery || selectedFilter !== 'all' 
                    ? 'Intenta ajustar tu búsqueda o filtros'
                    : 'Aún no tienes pacientes registrados'
                  }
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Patient Modal */}
      {renderPatientModal()}

      {/* Delete Confirmation Modal */}
      {renderDeleteModal()}
    </SafeAreaView>
  );
};

// --Estilos del componente--
// Define todos los estilos visuales de la pantalla de pacientes del doctor
const styles = StyleSheet.create({
  // --Contenedor principal--
  // Estilo del contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // --Contenido--
  // Estilo del contenido principal de la pantalla
  content: {
    flex: 1,
  },
  
  // --Encabezado--
  // Estilo del encabezado de la pantalla
  header: {
    paddingTop: getResponsiveSpacing(20, 30, 40),
    paddingBottom: getResponsiveSpacing(16, 20, 24),
  },
  
  // --Parte superior del encabezado--
  // Estilo de la parte superior del encabezado
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // --Información del encabezado--
  // Estilo del contenedor de información del encabezado
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  
  // --Título principal--
  // Estilo del título principal de la pantalla
  title: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  
  // --Subtítulo--
  // Estilo del subtítulo que muestra el número de pacientes
  subtitle: {
    color: '#666',
  },
  
  // --Vista de desplazamiento--
  // Estilo de la vista de desplazamiento principal
  scrollView: {
    flex: 1,
  },
  
  // --Contenido del desplazamiento--
  // Estilo del contenido dentro de la vista de desplazamiento
  scrollContent: {
    paddingBottom: getResponsiveSpacing(20, 30, 40),
  },
  
  // --Contenedor de búsqueda y filtros--
  // Estilo del contenedor que incluye la barra de búsqueda y filtros
  searchFiltersContainer: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  
  // --Contenedor de búsqueda--
  // Estilo del contenedor de la barra de búsqueda
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // --Entrada de búsqueda--
  // Estilo del campo de texto para la búsqueda
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#1A1A1A',
  },
  
  // --Botón de limpiar búsqueda--
  // Estilo del botón para limpiar el texto de búsqueda
  clearSearchButton: {
    padding: 4,
  },
  
  // --Contenedor de filtros--
  // Estilo del contenedor que organiza todos los filtros
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  
  // --Botón de filtro--
  // Estilo de cada botón de filtro individual
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E5E9',
    gap: 8,
  },
  
  // --Botón de filtro activo--
  // Estilo del botón de filtro cuando está seleccionado
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  
  // --Texto del botón de filtro--
  // Estilo del texto en los botones de filtro
  filterButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  
  // --Texto del botón de filtro activo--
  // Estilo del texto cuando el filtro está activo
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  
  // --Contenedor de pacientes--
  // Estilo del contenedor que muestra la lista de pacientes
  patientsContainer: {
    marginBottom: getResponsiveSpacing(24, 32, 40),
  },
  
  // --Tarjeta de paciente--
  // Estilo de cada tarjeta individual de paciente
  patientCard: {
    backgroundColor: '#FFFFFF',
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
  
  // --Encabezado de tarjeta de paciente--
  // Estilo del encabezado de cada tarjeta de paciente
  patientCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  
  // --Información del paciente--
  // Estilo del contenedor de información básica del paciente
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  // --Avatar del paciente--
  // Estilo de la imagen de perfil del paciente
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  
  // --Detalles del paciente--
  // Estilo del contenedor de detalles del paciente
  patientDetails: {
    flex: 1,
  },
  
  // --Nombre del paciente--
  // Estilo del nombre del paciente en la tarjeta
  patientName: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  
  // --Email del paciente--
  // Estilo del email del paciente en la tarjeta
  patientEmail: {
    color: '#666',
    marginBottom: 2,
  },
  
  // --Teléfono del paciente--
  // Estilo del teléfono del paciente en la tarjeta
  patientPhone: {
    color: '#666',
  },
  
  // --Estado del paciente--
  // Estilo del contenedor que muestra el estado del paciente
  patientStatus: {
    alignItems: 'center',
  },
  
  // --Indicador de estado--
  // Estilo del indicador visual del estado del paciente
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  
  // --Estado activo--
  // Estilo del indicador cuando el paciente está activo
  statusActive: {
    backgroundColor: '#34C759',
  },
  
  // --Estado inactivo--
  // Estilo del indicador cuando el paciente está inactivo
  statusInactive: {
    backgroundColor: '#FF3B30',
  },
  
  // --Texto de estado--
  // Estilo del texto que describe el estado del paciente
  statusText: {
    color: '#666',
    fontWeight: '500',
  },
  
  // --Pie de tarjeta de paciente--
  // Estilo del pie de cada tarjeta de paciente
  patientCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // --Estadísticas del paciente--
  // Estilo del contenedor de estadísticas del paciente
  patientStats: {
    flexDirection: 'row',
    gap: 16,
  },
  
  // --Elemento de estadística--
  // Estilo de cada estadística individual del paciente
  statItem: {
    alignItems: 'center',
  },
  
  // --Número de estadística--
  // Estilo del número principal en cada estadística
  statNumber: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  
  // --Etiqueta de estadística--
  // Estilo de la etiqueta descriptiva en cada estadística
  statLabel: {
    color: '#666',
    textAlign: 'center',
  },
  
  // --Acciones del paciente--
  // Estilo del contenedor de botones de acción para el paciente
  patientActions: {
    flexDirection: 'row',
    gap: 8,
  },
  
  // --Botón de acción--
  // Estilo de cada botón de acción individual
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  
  // --Separador--
  // Estilo del separador entre tarjetas de pacientes
  separator: {
    height: 12,
  },
  
  // --Estado vacío--
  // Estilo del contenedor cuando no hay pacientes para mostrar
  emptyState: {
    alignItems: 'center',
    paddingVertical: getResponsiveSpacing(40, 60, 80),
  },
  
  // --Título del estado vacío--
  // Estilo del título cuando no hay pacientes
  emptyStateTitle: {
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  
  // --Mensaje del estado vacío--
  // Estilo del mensaje explicativo cuando no hay pacientes
  emptyStateMessage: {
    color: '#999',
    textAlign: 'center',
    maxWidth: 300,
  },
  
  // --Modal--
  // Estilos para todos los modales de la pantalla
  
  // --Superposición del modal--
  // Estilo de la superposición oscura detrás del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // --Contenido del modal--
  // Estilo del contenedor principal del modal
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  
  // --Encabezado del modal--
  // Estilo del encabezado del modal
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E5E9',
  },
  
  // --Título del modal--
  // Estilo del título principal del modal
  modalTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  
  // --Botón de cerrar--
  // Estilo del botón para cerrar el modal
  closeButton: {
    padding: 4,
  },
  
  // --Cuerpo del modal--
  // Estilo del cuerpo principal del modal
  modalBody: {
    padding: 20,
  },
  
  // --Información del paciente en modal--
  // Estilo del contenedor de información del paciente en el modal
  modalPatientInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  
  // --Avatar del paciente en modal--
  // Estilo del avatar del paciente en el modal
  modalPatientAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  
  // --Nombre del paciente en modal--
  // Estilo del nombre del paciente en el modal
  modalPatientName: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  
  // --Email del paciente en modal--
  // Estilo del email del paciente en el modal
  modalPatientEmail: {
    color: '#666',
  },
  
  // --Sección del modal--
  // Estilo de cada sección de información en el modal
  modalSection: {
    marginBottom: 24,
  },
  
  // --Título de sección del modal--
  // Estilo del título de cada sección en el modal
  modalSectionTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  
  // --Fila de información del modal--
  // Estilo de cada fila de información en el modal
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  
  // --Texto de información del modal--
  // Estilo del texto de información en el modal
  modalInfoText: {
    color: '#666',
    flex: 1,
  },
  
  // --Estadísticas del modal--
  // Estilo del contenedor de estadísticas en el modal
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  // --Estadística del modal--
  // Estilo de cada estadística individual en el modal
  modalStat: {
    alignItems: 'center',
  },
  
  // --Número de estadística del modal--
  // Estilo del número principal en cada estadística del modal
  modalStatNumber: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  
  // --Etiqueta de estadística del modal--
  // Estilo de la etiqueta descriptiva en cada estadística del modal
  modalStatLabel: {
    color: '#666',
    textAlign: 'center',
  },
  
  // --Pie del modal--
  // Estilo del pie del modal con botones de acción
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E1E5E9',
    gap: 12,
  },
  
  // --Botón del modal--
  // Estilo base para todos los botones del modal
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  // --Botón secundario del modal--
  // Estilo del botón secundario (cerrar) del modal
  modalButtonSecondary: {
    backgroundColor: '#F8F9FA',
  },
  
  // --Botón primario del modal--
  // Estilo del botón primario (chat) del modal
  modalButtonPrimary: {
    backgroundColor: '#007AFF',
  },
  
  // --Botón de peligro del modal--
  // Estilo del botón de peligro (eliminar) del modal
  modalButtonDanger: {
    backgroundColor: '#FF3B30',
  },
  
  // --Texto del botón del modal--
  // Estilo del texto en todos los botones del modal
  modalButtonText: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // --Modal de eliminación--
  // Estilos específicos para el modal de confirmación de eliminación
  
  // --Contenido del modal de eliminación--
  // Estilo del contenedor principal del modal de eliminación
  deleteModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    padding: 24,
  },
  
  // --Encabezado del modal de eliminación--
  // Estilo del encabezado del modal de eliminación
  deleteModalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  
  // --Título del modal de eliminación--
  // Estilo del título del modal de eliminación
  deleteModalTitle: {
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 16,
  },
  
  // --Mensaje del modal de eliminación--
  // Estilo del mensaje explicativo del modal de eliminación
  deleteModalMessage: {
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  
  // --Acciones del modal de eliminación--
  // Estilo del contenedor de botones del modal de eliminación
  deleteModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  
  // --Botón del modal de eliminación--
  // Estilo base para todos los botones del modal de eliminación
  deleteModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  // --Botón de cancelar eliminación--
  // Estilo del botón para cancelar la eliminación
  deleteModalButtonCancel: {
    backgroundColor: '#F8F9FA',
  },
  
  // --Botón de confirmar eliminación--
  // Estilo del botón para confirmar la eliminación
  deleteModalButtonConfirm: {
    backgroundColor: '#FF3B30',
  },
  
  // --Texto del botón del modal de eliminación--
  // Estilo del texto en todos los botones del modal de eliminación
  deleteModalButtonText: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
});

export default DoctorPatients; 