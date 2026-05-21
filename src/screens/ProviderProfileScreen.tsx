import { CheckCircle2, ChevronLeft, Clock, Languages, MapPin, Shield, Star } from 'lucide-react-native';
import React from 'react';
import { Alert, Linking, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { mockProviders } from '../services/mockData';
import { useBookingStore } from '../store/useBookingStore';
import { colors } from '../theme/colors';

export const ProviderProfileScreen = ({ route, navigation }: any) => {
  const { providerId } = route.params || {};
  const provider = mockProviders.find(p => p.id === providerId) || mockProviders[0];
  const { addBooking, setActiveBooking } = useBookingStore();

  const handleBookNow = () => {
    const newBooking = {
      id: `b-${Date.now()}`,
      providerId: provider.id,
      userId: 'u-1',
      status: 'pending' as const,
      scheduledTime: new Date().toISOString(),
      estimatedCost: provider.hourlyRate * 2,
      serviceDetails: `Standard ${provider.serviceCategory} Service`,
      location: {
        latitude: 40.7150,
        longitude: -74.0050,
        address: '123 Main St, Apt 4B',
      },
    };
    addBooking(newBooking);
    setActiveBooking(newBooking.id);
    navigation.navigate('MainTabs', { screen: 'Bookings' });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 py-3 flex-row items-center border-b border-border/30">
          <TouchableOpacity 
            onPress={() => navigation?.goBack()}
            className="w-10 h-10 items-center justify-center mr-2 rounded-full active:bg-card"
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-text font-bold text-lg">Provider Profile</Text>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Main Info */}
          <View className="px-6 py-6 pb-2">
            <View className="flex-row items-start justify-between mb-4">
              <View>
                <Text className="text-t text-2xl font-bold text-white mb-1">{provider.name}</Text>
                <View className="flex-row items-center gap-1.5">
                  <CheckCircle2 size={16} color={colors.primary} />
                  <Text className="text-primary font-medium">{provider.serviceCategory} Expert</Text>
                </View>
              </View>
              <View className="items-end bg-card px-3 py-2 rounded-xl border border-border/50">
                <Text className="text-white text-xl font-bold">PKR {provider.hourlyRate}</Text>
                <Text className="text-textMuted text-xs">per hour</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4 mb-6">
              <View className="flex-row items-center gap-1.5 bg-warning/10 px-3 py-1.5 rounded-full border border-warning/20">
                <Star size={16} color={colors.warning} fill={colors.warning} />
                <Text className="text-warning font-bold">{provider.rating.toFixed(1)}</Text>
              </View>
              <View className="flex-row items-center gap-1.5 bg-card px-3 py-1.5 rounded-full border border-border/50">
                <Shield size={16} color={colors.success} />
                <Text className="text-text font-medium">{provider.jobsCompleted} Jobs</Text>
              </View>
            </View>
          </View>

          {/* Map Preview Fallback */}
          <View className="px-6 mb-6">
            <Text className="text-white font-bold text-lg mb-3">Live Location</Text>
            <GlassCard className="h-40 items-center justify-center rounded-2xl border border-border/50 overflow-hidden relative" intensity={20}>
              <View className="absolute inset-0 bg-primary/5 opacity-50" />
              <MapPin size={40} color={colors.primary} className="mb-2" />
              <Text className="text-white font-bold text-lg mb-1">{provider.distance ?? 2.5} miles away</Text>
              <Text className="text-textMuted text-sm">ETA: ~{Math.ceil((provider.distance ?? 2.5) * 4)} mins driving</Text>
            </GlassCard>
          </View>

          {/* Highlights & Details */}
          <View className="px-6 mb-6">
            <Text className="text-white font-bold text-lg mb-3">Highlights</Text>
            <View className="flex-row flex-wrap gap-3">
              <GlassCard className="flex-row items-center gap-2 px-4 py-3 rounded-xl w-[48%]" intensity={10}>
                <Clock size={18} color={colors.accent} />
                <View>
                  <Text className="text-textMuted text-xs mb-0.5">Response Time</Text>
                  <Text className="text-white font-bold text-sm">Under 5 mins</Text>
                </View>
              </GlassCard>
              <GlassCard className="flex-row items-center gap-2 px-4 py-3 rounded-xl w-[48%]" intensity={10}>
                <Languages size={18} color={colors.accent} />
                <View>
                  <Text className="text-textMuted text-xs mb-0.5">Languages</Text>
                  <Text className="text-white font-bold text-sm">EN, ES</Text>
                </View>
              </GlassCard>
            </View>
          </View>
          
          {/* Reviews Preview (Mock) */}
          <View className="px-6">
            <Text className="text-white font-bold text-lg mb-3">Recent Reviews</Text>
            <GlassCard className="p-4 rounded-xl border border-border/50 mb-3" intensity={15}>
              <View className="flex-row items-center gap-2 mb-2">
                <View className="flex-row">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={14} color={colors.warning} fill={colors.warning} />
                  ))}
                </View>
                <Text className="text-textMuted text-xs">• 2 days ago</Text>
              </View>
              <Text className="text-white text-sm leading-relaxed">
                "Fantastic service! Arrived early and solved the issue within 20 minutes. Highly recommended for any emergencies."
              </Text>
            </GlassCard>
          </View>

        </ScrollView>
      </View>

      {/* Floating Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 p-6 pt-4 bg-background/80" style={{ paddingBottom: 30 }}>
        <View className="flex-row gap-3 mb-3">
          <View className="flex-1">
            <GradientButton 
              title="Chat"
              onPress={() => navigation.navigate('ProviderChat', { providerId: provider.id })}
            />
          </View>
          <View className="flex-1">
            <GradientButton 
              title="Call Provider"
              onPress={() => {
                if (provider.phone) {
                  if (Platform.OS === 'web') {
                    Alert.alert('Notice', 'Calling is available on mobile.');
                  } else {
                    Linking.openURL(`tel:${provider.phone}`);
                  }
                } else {
                  Alert.alert('Unavailable', 'This provider has not provided a phone number.');
                }
              }}
            />
          </View>
        </View>
        <GradientButton 
          title={`Book ${provider.name.split(' ')[0]} Now`}
          onPress={handleBookNow}
        />
      </View>
    </SafeAreaView>
  );
};
