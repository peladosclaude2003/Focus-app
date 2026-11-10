import { Canvas, LinearGradient, Path, Skia, vec } from '@shopify/react-native-skia';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';

import { AppText } from './AppText';
import { Card } from './Card';

export interface AreaSparklineProps {
  title?: string;
  subtitle?: string;
  value?: string;
  data: number[];
  height?: number;
}

export function AreaSparkline({
  title = 'Volume',
  subtitle = '8-week trend',
  value = '363.2k lbs',
  data = [10, 15, 8, 22, 18, 35, 28, 42],
  height = 90,
}: AreaSparklineProps) {
  const { colors } = useTheme();
  const width = 280;

  const buildPaths = () => {
    if (data.length < 2) return { linePath: '', areaPath: '' };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 20) - 10;
      return { x, y };
    });

    const path = Skia.Path.Make();
    const firstPoint = points[0];
    if (firstPoint) {
      path.moveTo(firstPoint.x, firstPoint.y);
    }

    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      if (curr && next) {
        const cx = (curr.x + next.x) / 2;
        path.quadTo(curr.x, curr.y, cx, (curr.y + next.y) / 2);
      }
    }
    const lastPoint = points[points.length - 1];
    if (lastPoint) {
      path.lineTo(lastPoint.x, lastPoint.y);
    }

    const areaPath = path.copy();
    areaPath.lineTo(width, height);
    areaPath.lineTo(0, height);
    areaPath.close();

    return { linePath: path, areaPath };
  };

  const { linePath, areaPath } = buildPaths();

  return (
    <Card style={styles.card}>
      <AppText variant="caption" color="mute">
        {title}
      </AppText>
      <AppText variant="caption" color="mute" style={styles.subtitle}>
        {subtitle}
      </AppText>

      <AppText variant="title" style={styles.valueText}>
        {value}
      </AppText>

      <View style={{ height, width: '100%', marginTop: 8 }}>
        <Canvas style={{ width: '100%', height }}>
          {areaPath ? (
            <Path path={areaPath}>
              <LinearGradient
                start={vec(0, 0)}
                end={vec(0, height)}
                colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.0)']}
              />
            </Path>
          ) : null}
          {linePath ? (
            <Path
              path={linePath}
              color={colors.ink}
              style="stroke"
              strokeWidth={2.5}
              strokeCap="round"
            />
          ) : null}
        </Canvas>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingBottom: 0,
    overflow: 'hidden',
  },
  subtitle: {
    marginTop: 2,
  },
  valueText: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 6,
  },
});
