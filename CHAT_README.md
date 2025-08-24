# Funcionalidad de Chat para Pacientes

## Descripción General

Se ha implementado una funcionalidad completa de chat para los pacientes en la aplicación médica, permitiendo la comunicación en tiempo real entre pacientes y doctores.

## Características Implementadas

### 1. Contexto de Chat (`ChatContext.js`)
- **Gestión de Estado Global**: Manejo centralizado de conversaciones, mensajes y notificaciones
- **Estado de Mensajes**: Control de estados (enviando, enviado, entregado, leído)
- **Contador de No Leídos**: Seguimiento automático de mensajes no leídos
- **Indicador de Escritura**: Simulación de "está escribiendo..."

### 2. Pantalla Principal de Chats (`PatientChat.js`)
- **Lista de Conversaciones**: Muestra todas las conversaciones activas
- **Indicadores Visuales**: 
  - Badge de mensajes no leídos
  - Indicador de doctor online/offline
  - Información de citas relacionadas
- **Pull to Refresh**: Actualización manual de conversaciones
- **Botón de Nuevo Chat**: Acceso rápido para iniciar nuevas conversaciones

### 3. Pantalla de Chat Individual (`ChatScreen.js`)
- **Interfaz de Mensajería**: Diseño similar a aplicaciones populares de chat
- **Estados de Mensaje**: Indicadores visuales del estado de envío
- **Archivos Adjuntos**: Soporte para imágenes y documentos
- **Indicador de Escritura**: Muestra cuando el doctor está escribiendo
- **Auto-scroll**: Navegación automática a nuevos mensajes
- **Marcado como Leído**: Actualización automática al abrir conversación

### 4. Componentes Reutilizables

#### `MessageStatus.js`
- Muestra el estado de los mensajes (enviando, enviado, entregado, leído)
- Iconos intuitivos para cada estado

#### `TypingIndicator.js`
- Animación de puntos para indicar que alguien está escribiendo
- Diseño consistente con la interfaz

#### `ChatAttachment.js`
- Soporte para diferentes tipos de archivos (imágenes, PDFs, documentos)
- Vista previa de imágenes
- Iconos específicos por tipo de archivo

#### `ChatNotification.js`
- Notificaciones push animadas
- Auto-dismiss después de 5 segundos
- Diferentes tipos de notificación (mensaje, cita, receta)

#### `UnreadBadge.js`
- Badge numérico para mensajes no leídos
- Límite de visualización (99+)
- Posicionamiento automático

#### `NewChatModal.js`
- Modal para iniciar nuevos chats
- Búsqueda de doctores por nombre o especialidad
- Filtros por especialidad médica
- Información detallada de doctores (rating, experiencia)

### 5. Navegación Mejorada (`PatientNavigator.js`)
- **Badge en Tab**: Contador total de mensajes no leídos en el tab de Chat
- **Navegación Intuitiva**: Flujo natural entre pantallas

## Estructura de Datos

### Conversación
```javascript
{
  id: number,
  doctor: {
    id: number,
    name: string,
    specialty: string,
    image: string,
    isOnline: boolean
  },
  lastMessage: string,
  timestamp: string,
  unreadCount: number,
  appointmentDate: string,
  appointmentTime: string,
  messages: Message[]
}
```

### Mensaje
```javascript
{
  id: number,
  text: string,
  sender: 'patient' | 'doctor',
  timestamp: string,
  status: 'sending' | 'sent' | 'delivered' | 'read',
  attachment?: Attachment
}
```

### Archivo Adjunto
```javascript
{
  type: 'image' | 'pdf' | 'doc' | 'video' | 'audio',
  url: string,
  name: string,
  size: string
}
```

## Funcionalidades Avanzadas

### 1. Gestión de Estado
- **useReducer**: Manejo eficiente del estado complejo
- **Context API**: Compartir estado entre componentes
- **Optimizaciones**: Re-renders mínimos

### 2. Experiencia de Usuario
- **Animaciones**: Transiciones suaves y feedback visual
- **Responsive Design**: Adaptación a diferentes tamaños de pantalla
- **Accesibilidad**: Navegación por teclado y lectores de pantalla

### 3. Simulación de Tiempo Real
- **Estados de Mensaje**: Simulación de envío y entrega
- **Indicador de Escritura**: Simulación de actividad del doctor
- **Notificaciones**: Simulación de mensajes entrantes

## Instalación y Configuración

### 1. Dependencias
Todas las dependencias necesarias ya están incluidas en `package.json`:
- React Navigation
- Expo Vector Icons
- React Native Elements

### 2. Configuración del Contexto
El `ChatProvider` ya está configurado en `App.js` y envuelve toda la aplicación.

### 3. Navegación
Las rutas de chat están configuradas en `PatientNavigator.js`:
- `PatientChatMain`: Lista de conversaciones
- `ChatScreen`: Chat individual

## Uso

### Para Pacientes
1. **Acceder a Chats**: Navegar al tab "Chat" en la barra inferior
2. **Ver Conversaciones**: Lista de todos los chats activos
3. **Iniciar Nuevo Chat**: Tocar el botón "+" en la esquina superior derecha
4. **Enviar Mensajes**: Escribir y enviar mensajes en tiempo real
5. **Adjuntar Archivos**: Usar el botón de adjuntar para compartir archivos

### Para Desarrolladores
1. **Extender Funcionalidad**: Agregar nuevos tipos de archivos en `ChatAttachment.js`
2. **Personalizar Estados**: Modificar estados de mensaje en `MessageStatus.js`
3. **Integrar Backend**: Reemplazar datos mock con llamadas API reales
4. **Agregar Notificaciones**: Implementar push notifications reales

## Próximas Mejoras

### 1. Integración Backend
- [ ] WebSocket para mensajes en tiempo real
- [ ] API REST para gestión de conversaciones
- [ ] Autenticación y autorización

### 2. Funcionalidades Avanzadas
- [ ] Videollamadas integradas
- [ ] Compartir ubicación
- [ ] Mensajes de voz
- [ ] Emojis y stickers

### 3. Optimizaciones
- [ ] Paginación de mensajes
- [ ] Cache local de conversaciones
- [ ] Compresión de imágenes
- [ ] Sincronización offline

## Notas Técnicas

- **Performance**: Uso de `useCallback` y `useMemo` para optimizaciones
- **Memoria**: Limpieza automática de listeners y timers
- **Responsive**: Adaptación automática a diferentes dispositivos
- **Accesibilidad**: Soporte para lectores de pantalla y navegación por teclado

## Contribución

Para contribuir a la funcionalidad de chat:

1. Crear una rama feature: `git checkout -b feature/chat-improvement`
2. Implementar cambios siguiendo las convenciones existentes
3. Probar en diferentes dispositivos y tamaños de pantalla
4. Documentar cambios en este README
5. Crear pull request con descripción detallada

## Soporte

Para reportar bugs o solicitar nuevas funcionalidades:
1. Crear issue en el repositorio
2. Incluir pasos para reproducir el problema
3. Especificar dispositivo y versión de la app
4. Adjuntar capturas de pantalla si es necesario


