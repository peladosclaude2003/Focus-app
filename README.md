# Mi día - Offline-First App (React Native + Expo)

¡Bienvenido a "Mi día"! Esta es una aplicación de enfoque y seguimiento personal desarrollada nativamente para Android usando Expo SDK 57.

## Características 🌟
- **Hoy**: Lista de tareas diarias, recordatorios y gestos con hápticos.
- **Racha**: Seguimiento de hábitos negativos con registro de recaídas.
- **Gym**: Seguimiento de rutinas, temporizador de descanso, registro de peso corporal y PRs automáticos.
- **Ajustes**: Tema, configuración global, bloqueo por biometría y respaldos locales.
- **Bento Dashboard**: Un inicio increíblemente visual con estadísticas en tiempo real y componentes interactivos.

## Diseño y Arquitectura 🏛️
- **Design System**: Estética oscura (fondo casi negro `#0A0A0B`, tarjetas `#141416`), tipografía geométrica (Anton/Archivo), y acentos en Azul Eléctrico (`#3B82F6`).
- **Offline-First**: Todo se guarda localmente en SQLite usando `drizzle-orm` y `expo-sqlite`. No hay latencia ni necesidad de internet.
- **Estado Global**: `zustand` para manejo reactivo de los datos en toda la aplicación de manera instantánea.
- **Feature-based Structure**: El código está aislado por características en `src/features/`.

---

## 🛠️ Entorno de Desarrollo Local

### 1. Requisitos Previos
- [Node.js](https://nodejs.org/es) v18+
- [EAS CLI](https://docs.expo.dev/build/setup/) (`npm install -g eas-cli`)

### 2. Instalación
1. Clona el repositorio e instala las dependencias:
   ```bash
   npm install
   ```

2. Ejecutar generador de base de datos (Si hay cambios en los schemas):
   ```bash
   npm run db:generate
   ```

3. Iniciar entorno de desarrollo:
   ```bash
   npm start
   ```

### 3. Pruebas y Linteo
```bash
# Ejecutar tests (Jest + React Native Testing Library)
npm run test

# Verificar tipos (TypeScript estricto)
npm run typecheck

# Verificar calidad del código y formato
npm run lint
```

---

## 🏗️ Empaquetado (EAS Build)

La aplicación está lista para ser construida usando **Expo Application Services (EAS)**. Hemos incluido un archivo `eas.json` con perfiles configurados.

Para generar tu APK (Android):

1. **Inicia sesión en Expo (Si no lo has hecho)**:
   ```bash
   eas login
   ```

2. **Configura el proyecto en EAS**:
   ```bash
   eas project:init
   ```

3. **Construye el APK de desarrollo interno**:
   ```bash
   eas build --profile development --platform android
   ```
   *(Esto te dará un enlace para descargar un `.apk` e instalarlo en tu teléfono localmente).*

4. **Construye para Producción (AAB)**:
   ```bash
   eas build --profile production --platform android
   ```

---

## 📋 Checklist Final & Tareas Pendientes
- [x] Arquitectura de carpetas y navegación (`expo-router`).
- [x] Migraciones y esquemas con SQLite (`drizzle-orm`).
- [x] Design System personalizado (Colors, BottomSheets, StatTiles, Sparklines).
- [x] Pantalla *Inicio* interactiva estilo Bento Grid.
- [x] Pantalla *Hoy* (Listas virtualizadas, memoización, swipe-to-delete).
- [x] Pantalla *Racha* (Con animaciones y confirmaciones sutiles).
- [x] Pantalla *Gym* (Temporizadores, PRs, gráficas, media móvil).
- [x] Pantalla *Ajustes* (Preferencias, biometría, import/export backup, wipes).
- [x] Configuración de EAS Build (`eas.json`).
- [x] Auditoría de Performance (Memoización y FlatLists implementadas).
- [x] Setup inicial de Pruebas con React Native Testing Library (Jest).
- [x] Carga de `icon.png` y `splash.png` en la carpeta `/assets` y configuración de design system.

---
**¡Felicidades, la aplicación ya es de calidad de producción! 🎉**
