import React from 'react';
import { Text, Pressable, PressableProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { colors } from '../theme/colors';

interface GradientButtonProps extends PressableProps {
  title: string;
  onPress: () => void;
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const GradientButton: React.FC<GradientButtonProps> = ({ 
  title, 
  onPress, 
  className = '', 
  ...props 
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={`rounded-2xl overflow-hidden shadow-lg shadow-primary/30 ${className}`}
      {...props}
    >
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 py-4 items-center justify-center"
      >
        <Text className="text-white font-semibold text-lg tracking-wide">
          {title}
        </Text>
      </LinearGradient>
    </AnimatedPressable>
  );
};
