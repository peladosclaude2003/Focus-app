import { StyleSheet, View } from 'react-native';

import { RoutineHeaderCard } from './RoutineHeaderCard';

interface HoyGymTabProps {
  onStartWorkout: () => void;
}

export function HoyGymTab({ onStartWorkout }: HoyGymTabProps) {
  return (
    <View style={styles.container}>
      <RoutineHeaderCard
        routineName="Rutina de Hoy"
        routineType="Día programado"
        estimatedMin={60}
        exerciseCount={5}
        onStartWorkout={onStartWorkout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
