import { useNavigation } from '@react-navigation/native';
import { CheckCircle2, MapPin, MessageCircle, Star } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { Provider } from '../types';
import { GlassCard } from './GlassCard';

interface ProviderCardProps {
  provider: Provider;
  className?: string;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, className = '' }) => {
  let navigation: any = null;
  try {
    // useNavigation will throw if no NavigationContainer is present; guard against that
    // so voice/demo flows that render this component outside navigation won't crash the app.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigation = useNavigation<any>();
  } catch (err) {
    navigation = null;
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={() => navigation?.navigate?.('ProviderProfile', { providerId: provider.id })}
    >
      <GlassCard className={`p-4 ${className}`} intensity={20}>
        <View className="flex-row justify-between items-start mb-3 gap-3">
        <View className="flex-1 min-w-0">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-bold text-text flex-1" numberOfLines={1}>{provider.name}</Text>
            {provider.isAvailable && (
              <CheckCircle2 size={16} color={colors.success} />
            )}
          </View>
          <Text className="text-accent text-sm font-medium mt-1" numberOfLines={1}>
            {provider.serviceCategory}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-text font-bold text-lg text-right">PKR {provider.hourlyRate}<Text className="text-textMuted text-xs font-normal">/hr</Text></Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between border-t border-border/50 pt-3 gap-3">
        <View className="flex-row items-center gap-4 flex-1 min-w-0">
          <View className="flex-row items-center gap-1">
            <Star size={14} color={colors.warning} fill={colors.warning} />
            <Text className="text-textMuted text-sm">{provider.rating.toFixed(1)}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <MapPin size={14} color={colors.primary} />
            <Text className="text-textMuted text-sm" numberOfLines={1}>{provider.distance} mi away</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-3">
          <Text className="text-textMuted text-xs" numberOfLines={1}>{provider.jobsCompleted} jobs</Text>
          <TouchableOpacity 
              onPress={(e) => {
              e.stopPropagation();
              navigation?.navigate?.('ProviderChat', { providerId: provider.id });
            }}
            className="bg-primary/20 p-1.5 rounded-full"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MessageCircle size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </GlassCard>
    </TouchableOpacity>
  );
};
