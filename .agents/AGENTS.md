# Mi día — Reglas del proyecto

Rol: ingeniero móvil senior. App personal **offline-first en español**, solo **Android** por ahora.
Pilares: organizador del día (Hoy), contador de racha sin un hábito negativo (Racha), métricas de gym (asistencia, peso corporal, entrenamientos).

## Stack

- Expo (SDK actual) + React Native + TypeScript estricto
- Expo Router (rutas en `src/app`)
- expo-sqlite + Drizzle ORM
- Zustand
- React Native Reanimated + Gesture Handler
- @shopify/react-native-skia (gráficas)
- expo-notifications, expo-haptics
- Gestor de paquetes: **npm**. Instalar deps nativas siempre con `npx expo install`.
- Pruebas en dispositivo con development build (`expo-dev-client`).

## Reglas

- Arquitectura por features: `src/features/{hoy,racha,gym,ajustes}` (components, hooks, repository, store, types).
- Componentes pequeños y tipados.
- **Cero lógica de negocio en pantallas**: va en hooks y repositorios.
- Todas las fechas en **ISO local** (`YYYY-MM-DD`, `YYYY-MM-DDTHH:mm`), usar `src/shared/lib/dates.ts`.
- Todos los textos en español en `src/shared/i18n`.
- Accesibilidad: labels, contraste AA, Dynamic Type, respetar "reducir movimiento".
- Antes de cada tarea: mostrar un plan corto.
- Al terminar cada tarea: `npm run lint` y `npm run typecheck`.
