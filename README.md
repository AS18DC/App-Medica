# Medic App - Aplicación Médica

Una aplicación móvil completa para gestión de citas médicas, desarrollada con React Native y Expo.

## 🚀 Características

### 👥 Roles de Usuario
- **Pacientes**: Buscar doctores, agendar citas, ver historial médico
- **Doctores**: Gestionar citas, recetas, calendario de disponibilidad
- **Clínicas**: Administrar doctores y servicios

### 📱 Funcionalidades Principales

#### Para Pacientes:
- 🔍 Búsqueda de doctores y clínicas
- 📅 Agendamiento de citas
- 💬 Chat con doctores
- 📋 Historial de citas
- ⭐ Sistema de reseñas

#### Para Doctores:
- 📊 Dashboard con estadísticas
- 📅 Calendario de disponibilidad
- 💊 Gestión de recetas
- 👥 Lista de pacientes
- 💬 Chat con pacientes

#### Para Clínicas:
- 🏥 Gestión de doctores
- 📋 Directorio de servicios
- 📅 Calendario institucional

## 🛠️ Tecnologías Utilizadas

- **React Native** - Framework principal
- **Expo** - Plataforma de desarrollo
- **React Navigation** - Navegación entre pantallas
- **Context API** - Gestión de estado global
- **Ionicons** - Iconografía

## 📦 Instalación

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn
- Expo CLI

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/medic-app.git
cd medic-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el proyecto**
```bash
npm start
```

4. **Ejecutar en dispositivo**
- Escanea el código QR con Expo Go (Android/iOS)
- Presiona `w` para abrir en navegador web
- Presiona `a` para abrir en emulador Android
- Presiona `i` para abrir en simulador iOS

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── context/            # Context API para estado global
├── navigation/         # Configuración de navegación
├── screens/           # Pantallas de la aplicación
│   ├── patient/       # Pantallas para pacientes
│   ├── doctor/        # Pantallas para doctores
│   └── clinic/        # Pantallas para clínicas
├── styles/            # Estilos globales
└── utils/             # Utilidades y helpers
```

## 🎨 Características de Diseño

- **Responsive Design**: Adaptable a diferentes tamaños de pantalla
- **Web Support**: Funciona tanto en móvil como en web
- **UI/UX Moderna**: Diseño limpio y intuitivo
- **Accesibilidad**: Interfaz accesible para todos los usuarios

## 🔧 Configuración

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
EXPO_PUBLIC_API_URL=tu_url_api
```

### Configuración de Expo
El proyecto está configurado para funcionar con Expo. Asegúrate de tener Expo CLI instalado:

```bash
npm install -g @expo/cli
```

## 📱 Plataformas Soportadas

- ✅ iOS (nativo y web)
- ✅ Android (nativo y web)
- ✅ Web (React Native Web)

## 🚀 Despliegue

### Para Web
```bash
npm run build:web
```

### Para Móvil
```bash
expo build:android
expo build:ios
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Expo por la plataforma de desarrollo
- React Native por el framework
- La comunidad de desarrolladores móviles

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en GitHub.

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub! 



export default EditPatientProfile;
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { isWeb, webStyles } from "../../utils/responsive";
import { usePatientProfile } from "../../context/PatientProfileContext";
import { formatDateForDisplay } from "../../utils/dateUtils";


const EditPatientProfile = ({ navigation, route }) => {
  // Obtener los datos del usuario desde el contexto
  const { patientProfile, updateProfileField } = usePatientProfile();


  // Separar el teléfono en código de área y número
  const parsePhoneNumber = (phoneString) => {
    const match = phoneString.match(/^\+(\d+)\s*(.+)$/);
    if (match) {
      return {
        areaCode: `+${match[1]}`,
        phoneNumber: match[2].replace(/\s/g, ""),
      };
    }
    return { areaCode: "+58", phoneNumber: "" }; // Venezuela por defecto
  };

  // Ciudades de Venezuela
  const venezuelanCities = [
    'Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay',
    'Ciudad Guayana', 'Maturín', 'Barcelona', 'San Cristóbal', 'Cumana',
    'Mérida', 'Barinas', 'Puerto La Cruz', 'Acarigua', 'Los Teques',
    'Punto Fijo', 'Guanare', 'Trujillo', 'La Guaira', 'El Tigre',
    'Ocumare del Tuy', 'Carúpano', 'Coro', 'La Victoria', 'Tinaquillo',
    'San Fernando de Apure', 'San Carlos', 'San Felipe', 'La Asunción',
    'Porlamar', 'Puerto Ayacucho', 'San Juan de los Morros', 'Tucupita'
  ];

  // Estado para los datos en edición - usar datos del contexto
  const [editingUser, setEditingUser] = useState({
    ...patientProfile,
    ...parsePhoneNumber(patientProfile.phone)
  });

  // Sincronizar el estado local cuando cambie el contexto
  useEffect(() => {
    setEditingUser({
      ...patientProfile,
      ...parsePhoneNumber(patientProfile.phone)
    });
  }, [patientProfile]);

  // Función para manejar la edición de un campo
  const handleEditField = (field) => {
    // Navegar a la pantalla de edición correspondiente
    const fieldConfig = getFieldConfig(field);
    
    if (fieldConfig.type === 'phone') {
      navigation.navigate('EditPhoneScreen', {
        field,
        label: fieldConfig.label,
        currentValue: editingUser[field],
        validationRules: fieldConfig.validationRules,
        onSave: handleFieldSave
      });
    } else if (fieldConfig.type === 'date') {
      navigation.navigate('EditDateScreen', {
        field,
        label: fieldConfig.label,
        currentValue: editingUser[field],
        validationRules: fieldConfig.validationRules,
        onSave: handleFieldSave
      });
    } else if (fieldConfig.type === 'selection') {
      navigation.navigate('EditSelectionScreen', {
        field,
        label: fieldConfig.label,
        currentValue: editingUser[field],
        options: fieldConfig.options,
        validationRules: fieldConfig.validationRules,
        allowOther: fieldConfig.allowOther || false,
        onSave: handleFieldSave
      });
    } else if (fieldConfig.type === 'multiSelection') {
      navigation.navigate('EditMultiSelectionScreen', {
        field,
        label: fieldConfig.label,
        currentValue: editingUser[field],
        options: fieldConfig.options,
        validationRules: fieldConfig.validationRules,
        allowOther: fieldConfig.allowOther || false,
        maxSelections: fieldConfig.maxSelections || null,
        uniqueOptions: fieldConfig.uniqueOptions || [],
        onSave: handleFieldSave
      });
    } else {
      navigation.navigate('EditFieldScreen', {
        field,
        label: fieldConfig.label,
        currentValue: editingUser[field],
        placeholder: fieldConfig.placeholder,
        keyboardType: fieldConfig.keyboardType,
        maxLength: fieldConfig.maxLength,
        minLength: fieldConfig.minLength,
        validationRules: fieldConfig.validationRules,
        onSave: handleFieldSave
      });
    }
  };

  // Función para guardar cambios de un campo individual
  const handleFieldSave = (field, value) => {
    // Actualizar el estado local
    setEditingUser(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Actualizar el contexto global
    updateProfileField(field, value);
  };

  // Configuración de campos
  const getFieldConfig = (field) => {
    const configs = {
      name: {
        type: 'input',
        label: 'Nombre completo',
        placeholder: 'Ingresa tu nombre completo',
        keyboardType: 'default',
        maxLength: 50,
        minLength: 2,
        validationRules: {
          required: true,
          minLength: 2,
          maxLength: 50,
          pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
          errorMessage: 'El nombre solo puede contener letras y espacios',
          info: 'Ingresa tus nombres y apellidos. Solo se permiten letras y espacios.'
        }
      },
      email: {
        type: 'input',
        label: 'Email',
        placeholder: 'Ingresa tu email',
        keyboardType: 'email-address',
        maxLength: 100,
        minLength: 5,
        validationRules: {
          required: true,
          minLength: 5,
          maxLength: 100,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          errorMessage: 'Ingresa un email válido',
          info: 'El email debe tener un formato válido (ejemplo@dominio.com). Este será usado para comunicaciones importantes.'
        }
      },
      phone: {
        type: 'phone',
        label: 'Teléfono',
        validationRules: {
          required: true
        }
      },
      city: {
        type: 'selection',
        label: 'Ciudad',
        options: venezuelanCities.map(city => ({
          value: city,
          label: city
        })),
        validationRules: {
          required: true,
          info: 'Selecciona la ciudad donde resides actualmente. Esta información es importante para coordinar citas y servicios médicos.'
        },
        allowOther: true
      },
      birthDate: {
        type: 'date',
        label: 'Fecha de nacimiento',
        validationRules: {
          required: true,
          info: 'Selecciona tu fecha de nacimiento. Esta información es necesaria para calcular tu edad y proporcionar atención médica apropiada.'
        }
      },
      gender: {
        type: 'selection',
        label: 'Sexo',
        options: [
          { value: 'Masculino', label: 'Masculino' },
          { value: 'Femenino', label: 'Femenino' }
        ],
        validationRules: {
          required: true,
          info: 'Selecciona tu identidad de género. Esta información es importante para proporcionar atención médica personalizada y respetuosa.'
        },
        allowOther: false
      },
      height: {
        type: 'input',
        label: 'Altura (cm)',
        placeholder: 'Ej: 170',
        keyboardType: 'numeric',
        maxLength: 3,
        minLength: 2,
        validationRules: {
          required: true,
          minLength: 2,
          maxLength: 3,
          range: { min: 50, max: 250 },
          info: 'La altura es la medida desde la base de los pies hasta la parte superior de la cabeza. Debe estar entre 50 y 250 centímetros para ser válida.'
        }
      },
      weight: {
        type: 'input',
        label: 'Peso (kg)',
        placeholder: 'Ej: 70.5',
        keyboardType: 'numeric',
        maxLength: 5,
        minLength: 2,
        validationRules: {
          required: true,
          minLength: 2,
          maxLength: 5,
          range: { min: 20, max: 300 },
          info: 'El peso corporal se mide en kilogramos. Debe estar entre 20 y 300 kg para ser considerado válido.'
        }
      },
      bloodType: {
        type: 'selection',
        label: 'Grupo sanguíneo',
        options: [
          { value: 'A+', label: 'A+' },
          { value: 'A-', label: 'A-' },
          { value: 'B+', label: 'B+' },
          { value: 'B-', label: 'B-' },
          { value: 'AB+', label: 'AB+' },
          { value: 'AB-', label: 'AB-' },
          { value: 'O+', label: 'O+' },
          { value: 'O-', label: 'O-' }
        ],
        validationRules: {
          required: true,
          info: 'Tu grupo sanguíneo es importante en caso de emergencias médicas o transfusiones.'
        },
        allowOther: false
      },
      allergies: {
        type: 'multiSelection',
        label: 'Alergias',
        options: [
          { value: 'Ninguna', label: 'Ninguna' },
          { value: 'Penicilina', label: 'Penicilina' },
          { value: 'Aspirina', label: 'Aspirina' },
          { value: 'Ibuprofeno', label: 'Ibuprofeno' },
          { value: 'Látex', label: 'Látex' },
          { value: 'Polen', label: 'Polen' },
          { value: 'Ácaros', label: 'Ácaros' },
          { value: 'Mariscos', label: 'Mariscos' },
          { value: 'Frutos secos', label: 'Frutos secos' },
          { value: 'Huevos', label: 'Huevos' },
          { value: 'Leche', label: 'Leche' },
          { value: 'Gluten', label: 'Gluten' }
        ],
        validationRules: {
          required: true,
          minSelections: 1,
          maxSelections: 15,
          info: 'Informa sobre cualquier alergia que tengas para evitar reacciones adversas durante tratamientos médicos.'
        },
        allowOther: true,
        maxSelections: 15,
        uniqueOptions: ['Ninguna'] // 'Ninguna' es exclusiva
      },
      disability: {
        type: 'multiSelection',
        label: 'Discapacidad',
        options: [
          { value: 'Ninguna', label: 'Ninguna' },
          { value: 'Visual', label: 'Visual' },
          { value: 'Auditiva', label: 'Auditiva' },
          { value: 'Motora', label: 'Motora' },
          { value: 'Intelectual', label: 'Intelectual' },
          { value: 'Psicosocial', label: 'Psicosocial' },
          { value: 'Múltiple', label: 'Múltiple' }
        ],
        validationRules: {
          required: true,
          minSelections: 1,
          maxSelections: 10,
          info: 'Esta información ayuda a adaptar la atención médica y garantizar accesibilidad en nuestros servicios.'
        },
        allowOther: true,
        maxSelections: 10,
        uniqueOptions: ['Ninguna'] // 'Ninguna' es exclusiva
      }
    };

    return configs[field] || { type: 'input', label: field };
  };

  // Función para renderizar un item del menú
  const renderMenuItem = (field, label, icon) => (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={() => handleEditField(field)}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <Ionicons name={icon} size={20} color="#666" />
        </View>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemLabel}>{label}</Text>
          <Text style={styles.menuItemValue}>
            {field === 'phone' 
              ? `${editingUser.areaCode} ${editingUser.phoneNumber}` 
              : field === 'birthDate' && editingUser[field]
              ? formatDateForDisplay(editingUser[field], 'long')
              : field === 'allergies' || field === 'disability'
              ? Array.isArray(editingUser[field]) && editingUser[field].length > 0
                ? editingUser[field].length === 1 
                  ? editingUser[field][0]
                  : editingUser[field].length <= 3
                  ? editingUser[field].join(', ')
                  : `${editingUser[field].length} seleccionadas`
                : "No especificado"
              : editingUser[field] 
              ? String(editingUser[field])
              : "No especificado"
            }
          </Text>
        </View>
      </View>
      <View style={styles.menuItemRight}>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Menú de edición */}
      <ScrollView 
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuContentContainer}
      >
        {/* User Image Section - Ahora dentro del scroll */}
        <View style={styles.imageSection}>
          <Image source={{ uri: editingUser.image }} style={styles.userImage} />
          <TouchableOpacity style={styles.changeImageButton}>
            <Ionicons name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.changeImageText}>Cambiar foto</Text>
          </TouchableOpacity>
        </View>

        {/* Línea superior sutil */}
        <View style={styles.sectionDivider} />
        {/* Sección: Datos de Perfil */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Datos de Perfil</Text>
          
          {renderMenuItem('name', 'Nombre completo', 'person-outline')}
          {renderMenuItem('email', 'Email', 'mail-outline')}
          {renderMenuItem('phone', 'Teléfono', 'call-outline')}
          {renderMenuItem('city', 'Ciudad', 'location-outline')}
        </View>

        {/* Línea divisoria entre secciones */}
        <View style={styles.sectionDivider} />

        {/* Sección: Datos Médicos */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Datos Médicos</Text>
          
          {renderMenuItem('birthDate', 'Fecha de nacimiento', 'calendar-outline')}
          {renderMenuItem('gender', 'Sexo', 'person-outline')}
          {renderMenuItem('height', 'Altura (cm)', 'resize-outline')}
          {renderMenuItem('weight', 'Peso (kg)', 'scale-outline')}
          {renderMenuItem('bloodType', 'Grupo sanguíneo', 'water-outline')}
          {renderMenuItem('allergies', 'Alergias', 'warning-outline')}
          {renderMenuItem('disability', 'Discapacidad', 'accessibility-outline')}
        </View>
      </ScrollView>

      {/* Línea inferior sutil */}
      <View style={styles.sectionDivider} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    ...(isWeb && webStyles.container),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  placeholder: {
    width: 40,
  },
  imageSection: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  changeImageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  changeImageText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 6,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 20,
    marginVertical: 8,
  },
  menuContainer: {
    flex: 1,
    ...(isWeb && {
      maxWidth: 800,
      margin: '0 auto',
    }),
  },
  menuContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    ...(isWeb && webStyles.menuItem),
  },
  menuItemLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F8FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  menuItemValue: {
    fontSize: 14,
    color: "#666",
  },
  menuItemRight: {
    marginLeft: 16,
  },
});

export default EditPatientProfile;

