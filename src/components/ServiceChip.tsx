import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface ServiceChipProps {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

export const ServiceChip: React.FC<ServiceChipProps> = ({ label, isActive = false, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2 rounded-full border ${
        isActive 
          ? 'bg-primary/20 border-primary' 
          : 'bg-card border-border/50'
      }`}
    >
      <Text className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-textMuted'}`}>
        {label}
      </Text>
    </Pressable>
  );
};
