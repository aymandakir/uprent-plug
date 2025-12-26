import { View, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
}

function Skeleton({ width = '100%', height = 20, borderRadius = 4 }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, opacity },
      ]}
    />
  );
}

export function PropertyCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width="100%" height={240} borderRadius={16} />
      <View style={styles.content}>
        <Skeleton width="60%" height={24} />
        <View style={styles.row}>
          <Skeleton width="40%" height={20} />
          <Skeleton width="30%" height={20} />
        </View>
        <Skeleton width="80%" height={16} />
      </View>
    </View>
  );
}

export function PropertyGridSkeleton() {
  return (
    <View style={styles.grid}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.gridItem}>
          <Skeleton width="100%" height={160} borderRadius={12} />
          <View style={styles.gridContent}>
            <Skeleton width="70%" height={18} />
            <Skeleton width="50%" height={14} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#1a1a1a',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 24,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 24,
    gap: 12,
  },
  gridItem: {
    width: '47%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    paddingBottom: 12,
  },
  gridContent: {
    padding: 12,
    gap: 6,
  },
});

