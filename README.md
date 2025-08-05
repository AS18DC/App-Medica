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