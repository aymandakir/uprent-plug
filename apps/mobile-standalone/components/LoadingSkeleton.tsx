import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

interface SkeletonPulseProps {
  width?: number | string;
  height?: number;
  style?: Record<string, unknown>;
}

const SkeletonPulse = ({ width = '100%', height = 20, style }: SkeletonPulseProps) => {
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
        {
          width,
          height,
          backgroundColor: '#2A2A2A',
          borderRadius: 8,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const PropertyCardSkeleton = () => (
  <View style={styles.card}>
    <SkeletonPulse width="100%" height={200} style={{ marginBottom: 12 }} />
    <SkeletonPulse width="80%" height={20} style={{ marginBottom: 8 }} />
    <SkeletonPulse width="60%" height={16} />
  </View>
);

export const PropertyGridSkeleton = () => (
  <View style={styles.grid}>
    {[1, 2, 3, 4].map((i) => (
      <View key={i} style={styles.gridItem}>
        <SkeletonPulse width="100%" height={160} style={{ marginBottom: 8 }} />
        <SkeletonPulse width="70%" height={18} style={{ marginBottom: 4 }} />
        <SkeletonPulse width="50%" height={14} />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  gridItem: {
    width: '47%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
});

export const LoadingSkeleton = {
  PropertyCardSkeleton,
  PropertyGridSkeleton,
};

export default LoadingSkeleton;

