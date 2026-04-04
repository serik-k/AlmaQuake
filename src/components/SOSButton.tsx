import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  onPress: () => void;
}

const SIZE = 180;

export function SOSButton({ onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [scale]);

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.glow,
          { transform: [{ scale }] },
        ]}
      />
      <TouchableOpacity
        onPress={onPress}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.label}>112</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: SIZE * 1.5,
    height: SIZE * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: '#D32F2F',
    opacity: 0.15,
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: '#C62828',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C62828',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: 2,
  },
});


