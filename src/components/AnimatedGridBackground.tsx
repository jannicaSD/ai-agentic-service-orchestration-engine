import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Defs, Pattern, Circle, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
// Pattern size
const GRID_SIZE = 40;
// We add extra space to ensure we can translate infinitely without revealing edges
const EXTRA_SPACE = GRID_SIZE * 2;

export const AnimatedGridBackground = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Smooth infinite floating animation
    translateX.value = withRepeat(
      withTiming(-GRID_SIZE, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
    translateY.value = withRepeat(
      withTiming(-GRID_SIZE, { duration: 5000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <View style={StyleSheet.absoluteFillObject} className="bg-[#05070d]">
      <Animated.View
        style={[
          {
            width: width + EXTRA_SPACE,
            height: height + EXTRA_SPACE,
            position: 'absolute',
            top: 0,
            left: 0,
          },
          animatedStyle,
        ]}
      >
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern
              id="grid"
              width={GRID_SIZE}
              height={GRID_SIZE}
              patternUnits="userSpaceOnUse"
            >
              <Circle
                cx={GRID_SIZE / 2}
                cy={GRID_SIZE / 2}
                r={1.5}
                fill="#2b6cff"
                opacity={0.3}
              />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grid)" />
        </Svg>
      </Animated.View>
      
      {/* Soft blue gradient glow overlays */}
      <LinearGradient
        colors={['rgba(43,108,255,0.2)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['transparent', 'rgba(43,108,255,0.05)']}
        start={{ x: 0.5, y: 0.6 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
    </View>
  );
};
