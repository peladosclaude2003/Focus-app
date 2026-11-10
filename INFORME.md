# Auditoría del Proyecto: Informe de Errores y Causas Raíz

## 1. Teclado que tapa los inputs
* **Causa Raíz:** Tras realizar una búsqueda exhaustiva en todo el código (`src/`), **no existe ni una sola implementación** de `KeyboardAvoidingView` (o similares como `KeyboardAwareScrollView`). En React Native, especialmente en iOS, el teclado se superpone a la interfaz a menos que se envuelva el formulario para que sea empujado hacia arriba. Esto afecta gravemente al `TaskFormSheet` (Hoy), `ActiveWorkoutSheet` (Gym) y al input inicial de `RachaScreen`.
* **Plan:** Envolver los formularios dentro de los `BottomSheet` y el contenedor de `RachaScreen` con un componente `KeyboardAvoidingView` (usando `behavior="padding"`) ajustado según la plataforma (`Platform.OS === 'ios'`).

## 2. Tareas que se guardan pero no aparecen
* **Causa Raíz:** El problema es doble. 
  1. En `HoyScreen.tsx`, tienes un `FlatList` anidado directamente dentro de un `ScrollView` y con la propiedad `scrollEnabled={false}`. Cuando se añade un nuevo elemento al arreglo de SQLite, el `FlatList` con esta configuración a menudo sufre de un bug visual donde no se redibuja ni expande su altura para mostrar el nuevo nodo.
  2. Las tareas recurrentes (`repeatRule: 'daily'`, etc.) solo se guardan con la fecha del día actual en SQLite. La consulta SQL `getByDate` solo busca coincidencias exactas (`date === selectedDate`), lo que significa que **las tareas recurrentes no aparecerán mañana ni ningún otro día** porque no hay lógica que genere esas copias virtuales o las busque.
* **Plan:** Reemplazar el `FlatList` inerte por un mapeo tradicional (`.map()`) de componentes dentro de un `View` normal (ya que el contenedor principal ya es un `ScrollView`). Para las recurrencias, actualizaré el repositorio SQLite para que la consulta evalúe el `repeatRule` o genere copias invisibles en la consulta.

## 3. El modo entrenamiento muestra días en la gráfica en vez de progreso
* **Causa Raíz:** En `GymScreen.tsx`, el componente `MiniBarChart` de repeticiones de la semana está **100% "hardcodeado"**. Estás inyectando un arreglo fijo de datos: `[{ label: 'S', value: 0 }, { label: 'M', value: 218 } ... ]`. Además, en tu hook `useGym.ts`, estás calculando `totalReps` y `maxWeight` iterando **únicamente sobre `activeSets`** (las series de tu sesión en vivo). Como no hay sesión activa al inicio, la UI evalúa `totalReps > 0` como falso y renderiza cadenas de texto falsas: `"3.1k reps"` y `"379 max kg"`.
* **Plan:** Modificar `useGym` para que obtenga el historial de todas las series de SQLite (usando una consulta de agregación) y poblar dinámicamente las etiquetas y barras del `MiniBarChart` con las sesiones reales, eliminando los datos simulados.

## 4. Cálculos de Fechas y Tiempos
* **Causa Raíz:** Existe una vulnerabilidad gravísima con las zonas horarias.
  1. En `generate30DaysHeatmap` (Racha), estás usando `dateObj.toISOString().slice(0, 10)` para formatear la fecha. En zonas horarias del este (Europa, Asia) o a ciertas horas de la noche, el UTC se desfasa, resultando en un cambio de fecha un día antes del esperado. 
  2. Se están creando fechas combinando cadenas a mano como `new Date(dateStr + 'T00:00')` en los cálculos de asistencia, lo cual JavaScript puede malinterpretar dependiendo del motor.
  3. Al crear tareas, se guarda `createdAt: new Date().toISOString()`, que añade una 'Z' (UTC), rompiendo tu propia convención de usar fechas locales.
* **Plan:** Reemplazar absolutamente todas las llamadas nativas `.toISOString()` y parseos híbridos con las funciones utilitarias seguras `toISODate`, `parseISODate` y `nowISO` que ya tenías muy bien definidas en tu archivo `src/shared/lib/dates.ts`.
