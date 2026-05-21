import { CheckCircle2, ChevronLeft, Clock, CreditCard, Hammer, Truck } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../components/GlassCard';
import { mockProviders } from '../services/mockData';
import { useBookingStore } from '../store/useBookingStore';
import { colors } from '../theme/colors';

const STATUS_STEPS = [
  { id: 'pending', label: 'Booking Request Sent', icon: Clock },
  { id: 'confirmed', label: 'Provider Confirmed', icon: CheckCircle2 },
  { id: 'en_route', label: 'Provider En Route', icon: Truck },
  { id: 'in_progress', label: 'Service In Progress', icon: Hammer },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
];

export const BookingTimelineScreen = ({ navigation }: any) => {
  const { bookings, activeBookingId } = useBookingStore();
  const booking = bookings.find(b => b.id === activeBookingId) || bookings[0];
  const provider = mockProviders.find(p => p.id === booking?.providerId) || mockProviders[0];

  if (!booking) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <Text className="text-textMuted">No active booking found.</Text>
      </SafeAreaView>
    );
  }

  // Determine current step index
  const currentStepIndex = STATUS_STEPS.findIndex(s => s.id === booking.status);
  const activeStep = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-4 py-3 flex-row items-center border-b border-border/30 mb-2">
        <TouchableOpacity 
          onPress={() => navigation?.goBack()}
          className="w-10 h-10 items-center justify-center mr-2 rounded-full active:bg-card"
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text className="text-text font-bold text-lg">Booking #{booking.id.split('-')[1]}</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        {/* Provider Snapshot */}
        <GlassCard className="p-4 rounded-2xl mb-8 border border-primary/20" intensity={15}>
          <Text className="text-textMuted text-xs font-semibold uppercase tracking-wider mb-2">Assigned Pro</Text>
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white font-bold text-lg">{provider.name}</Text>
              <Text className="text-primary text-sm">{provider.serviceCategory}</Text>
            </View>
              <View className="items-end">
              <Text className="text-textMuted text-xs mb-1">Estimated Cost</Text>
              <Text className="text-white font-bold text-lg">PKR {booking.estimatedCost}</Text>
            </View>
          </View>
        </GlassCard>

        <Text className="text-white font-bold text-lg mb-4">Live Timeline</Text>
        
        {/* Vertical Stepper */}
        <View className="mb-8 p-2">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index <= activeStep;
            const isCurrent = index === activeStep;
            const Icon = step.icon;
            
            return (
              <View key={step.id} className="flex-row">
                <View className="items-center mr-4">
                  <View 
                    className={`w-10 h-10 rounded-full items-center justify-center border-2 ${
                      isCompleted ? 'bg-primary/20 border-primary' : 'bg-card border-border/50'
                    }`}
                  >
                    <Icon size={18} color={isCompleted ? colors.primary : colors.textMuted} />
                  </View>
                  {index < STATUS_STEPS.length - 1 && (
                    <View 
                      className={`w-0.5 h-12 ${
                        index < activeStep ? 'bg-primary' : 'bg-border/50'
                      }`} 
                    />
                  )}
                </View>

                <View className="justify-center h-10 flex-1">
                  <Text 
                    className={`font-semibold text-base ${
                      isCompleted ? 'text-white' : 'text-textMuted'
                    }`}
                  >
                    {step.label}
                  </Text>
                  {isCurrent && (
                    <Text className="text-primary text-xs mt-0.5">Currently happening...</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Pricing Breakdown */}
        <Text className="text-white font-bold text-lg mb-4">Payment Summary</Text>
        <GlassCard className="p-5 rounded-2xl mb-8" intensity={10}>
          <View className="flex-row justify-between mb-3 border-b border-border/30 pb-3">
            <Text className="text-textMuted text-sm">Hourly Rate</Text>
            <Text className="text-white text-sm">PKR {provider.hourlyRate}/hr</Text>
          </View>
          <View className="flex-row justify-between mb-3 border-b border-border/30 pb-3">
            <Text className="text-textMuted text-sm">Estimated Duration</Text>
            <Text className="text-white text-sm">2 hours</Text>
          </View>
          <View className="flex-row justify-between mb-3 border-b border-border/30 pb-3">
            <Text className="text-textMuted text-sm">Service Fee</Text>
            <Text className="text-white text-sm">PKR 10.00</Text>
          </View>
          <View className="flex-row justify-between items-center mt-2">
            <View className="flex-row items-center gap-2">
              <CreditCard size={18} color={colors.textMuted} />
              <Text className="text-white font-bold text-base">Total Est.</Text>
            </View>
            <Text className="text-primary font-bold text-xl">PKR {booking.estimatedCost + 10}</Text>
          </View>
        </GlassCard>

      </ScrollView>
    </SafeAreaView>
  );
};
