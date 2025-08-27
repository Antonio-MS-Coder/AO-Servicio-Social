# DOOM MVP - Directorio Obregonense de Oficios Mundialista

## 🚀 Descripción
Plataforma digital que conecta habitantes de Álvaro Obregón con oportunidades laborales derivadas del Mundial 2026 en México.

## 🎯 Características principales del MVP
- ✅ **Autenticación**: Registro y login con email/contraseña
- ✅ **Perfiles duales**: Trabajadores y Empleadores
- ✅ **Gestión de perfiles**: Foto, certificaciones, experiencia
- ✅ **Publicación de empleos**: Sistema completo de vacantes
- ✅ **Búsqueda y filtros**: Por oficio, ubicación, disponibilidad
- ✅ **Dashboard personalizado**: Estadísticas y actividad reciente
- ✅ **Multiidioma**: Español e Inglés
- 🚧 **Sistema de calificaciones**: (En desarrollo)
- 🚧 **Chat interno**: (En desarrollo)

## 🛠️ Stack Tecnológico
- **Frontend**: React 18 con TypeScript
- **UI Framework**: Material-UI (MUI)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Routing**: React Router v6
- **Internacionalización**: i18next
- **State Management**: React Context API

## 📋 Requisitos previos
- Node.js 16+ 
- npm o yarn
- Cuenta de Firebase

## ⚙️ Configuración

### 1. Clonar el repositorio
```bash
cd doom-mvp
```

### 2. Instalar dependencias
```bash
npm install --legacy-peer-deps
```

### 3. Configurar Firebase
1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Authentication (Email/Password)
3. Crear una base de datos Firestore
4. Habilitar Storage
5. Copiar las credenciales del proyecto

### 4. Variables de entorno
Crear un archivo `.env` en la raíz del proyecto:
```env
REACT_APP_FIREBASE_API_KEY=tu-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=tu-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=tu-app-id
```

### 5. Estructura de Firestore
Crear las siguientes colecciones en Firestore:
- `users` - Información básica de usuarios
- `workers` - Perfiles de trabajadores
- `employers` - Perfiles de empleadores
- `jobs` - Publicaciones de empleo
- `applications` - Aplicaciones a empleos
- `ratings` - Calificaciones entre usuarios

## 🚀 Ejecutar el proyecto

### Desarrollo
```bash
npm start
```
Abre [http://localhost:3000](http://localhost:3000)

### Producción
```bash
npm run build
```

## 📱 Flujos principales

### Para Trabajadores
1. Registro con email → Seleccionar rol "Trabajador"
2. Completar perfil (nombre, oficio, experiencia, ubicación)
3. Subir certificaciones (opcional)
4. Buscar empleos disponibles
5. Aplicar a vacantes
6. Recibir calificaciones

### Para Empleadores
1. Registro con email → Seleccionar rol "Empleador"
2. Completar perfil empresarial
3. Publicar vacantes con detalles
4. Revisar aplicaciones
5. Contactar trabajadores
6. Calificar después del servicio

## 🎨 Identidad Visual
- **Color Primario**: Verde México (#007A33)
- **Color Secundario**: Naranja AO (#f7991c)
- **Slogan**: "Tu talento, nuestra sede"

## 📊 KPIs de éxito
- +2,000 trabajadores registrados en 3 meses
- +300 vacantes publicadas en 3 meses
- 70% vacantes cubiertas vía DOOM
- Calificación promedio ≥ 4.2/5

## 🚧 Próximas funcionalidades (Fase 2)
- [ ] Sistema completo de calificaciones y reseñas
- [ ] Chat interno entre usuarios
- [ ] Notificaciones push/email
- [ ] Integración con WhatsApp/Twilio
- [ ] Sistema de pagos (Stripe/Conekta)
- [ ] Geolocalización con Google Maps
- [ ] Insignias y certificaciones verificadas
- [ ] Versión móvil nativa

## 📝 Notas importantes
- El proyecto usa `--legacy-peer-deps` debido a compatibilidad con TypeScript/i18next
- Configurar reglas de seguridad en Firestore antes de producción
- Implementar validación de certificaciones en backend
- Considerar límites de rate limiting para prevenir spam

## 🤝 Contribuir
Este es un proyecto MVP para Álvaro Obregón y el Mundial 2026.

## 📄 Licencia
Proyecto desarrollado para la Alcaldía Álvaro Obregón - Mundial 2026