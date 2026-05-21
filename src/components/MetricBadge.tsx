import React from 'react';
import { View, Text } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { colors } from '../theme/colors';

interface MetricBadgeProps {
  label: string;
  icon?: React.ReactNode;
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({ 
  label, 
  icon = <ShieldCheck size={12} color={colors.success} /> 
}) => {
  return (
    <View className="flex-row items-center bg-success/10 border border-success/20 px-2.5 py-1 rounded-full self-start gap-1">
      {icon}
      <Text className="text-success text-xs font-bold">{label}</Text>
    </View>
  );
};
