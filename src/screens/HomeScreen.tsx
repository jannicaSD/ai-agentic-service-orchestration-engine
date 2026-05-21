import { Bell, Calendar, ChevronRight, MapPin, Search } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../components/GlassCard';
import { ProviderCard } from '../components/ProviderCard';
import { ProviderMap } from '../components/ProviderMap';
import { ServiceChip } from '../components/ServiceChip';
import { mockProviders } from '../services/mockData';
import { useBookingStore } from '../store/useBookingStore';
import { colors } from '../theme/colors';
import type { ServiceCategoryFilter } from '../types';
import { filterProvidersByCategory } from '../utils/serviceCategories';

const SERVICE_CATEGORIES: Array<{ label: string; key: ServiceCategoryFilter }> = [
  { label: 'Plumbing', key: 'plumber' },
  { label: 'Electrical', key: 'electrician' },
  { label: 'HVAC', key: 'ac_technician' },
  { label: 'Cleaning', key: 'cleaner' },
  { label: 'Handyman', key: 'painter_handyman' },
  { label: 'Painting', key: 'painter_handyman' },
];

export const HomeScreen = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryFilter>('all');
  const { bookings, activeBookingId } = useBookingStore();
  
  const activeBooking = bookings.find(b => b.id === activeBookingId) || bookings[0];
  const filteredProviders = useMemo(
    () => filterProvidersByCategory(mockProviders, selectedCategory),
    [selectedCategory]
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      
      {/* Map Section taking top space */}
      <View className="h-[40%] relative w-full border-b border-border/30">
        <ProviderMap providers={mockProviders} />
        
        {/* Floating Header over Map */}
        <View className="absolute top-4 w-full px-6 flex-row justify-between items-center z-10">
          <GlassCard className="px-4 py-2 rounded-full" intensity={40}>
            <Text className="text-textMuted text-xs font-medium">Good Morning</Text>
            <Text className="text-text text-sm font-bold">Alex</Text>
          </GlassCard>
          <GlassCard className="w-10 h-10 rounded-full items-center justify-center" intensity={40}>
            <Bell size={20} color={colors.text} />
          </GlassCard>
        </View>

        {/* Floating AI Search over Map Bottom */}
        <View className="absolute -bottom-6 w-full px-6 z-20">
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => navigation?.navigate('Chat')}
            className="w-full shadow-lg shadow-black/50"
          >
            <GlassCard className="flex-row items-center px-4 py-4 rounded-xl border border-primary/40 bg-card/90" intensity={60}>
              <Search size={22} color={colors.primary} />
              <View className="ml-3 flex-1">
                <Text className="text-text font-medium text-base">Ask AntiGravity...</Text>
                <Text className="text-textMuted text-xs mt-0.5">e.g. "My sink is leaking, need someone"</Text>
              </View>
              <View className="bg-primary/20 p-2 rounded-full">
                <ChevronRight size={18} color={colors.primary} />
              </View>
            </GlassCard>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 mt-10" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Categories */}
        <View className="mt-2 mb-6">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
          >
            {SERVICE_CATEGORIES.map((category) => (
              <ServiceChip 
                key={category.label} 
                label={category.label} 
                isActive={selectedCategory === category.key}
                onPress={() => setSelectedCategory(category.key)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Active Booking Section */}
        {activeBooking && (
          <View className="px-6 mb-8">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-text text-lg font-bold">Active Service</Text>
            </View>
            <GlassCard className="p-4" intensity={20}>
              <View className="flex-row justify-between items-center mb-4">
                <View className="bg-warning/20 px-3 py-1 rounded-full">
                  <Text className="text-warning text-xs font-bold uppercase tracking-wider">
                    {activeBooking.status.replace('_', ' ')}
                  </Text>
                </View>
                <Text className="text-text font-bold">PKR {activeBooking.estimatedCost}</Text>
              </View>
              
              <Text className="text-text text-base font-medium mb-3">
                {activeBooking.serviceDetails}
              </Text>
              
              <View className="flex-row items-center gap-4 border-t border-border/50 pt-3">
                <View className="flex-row items-center gap-1.5 flex-1">
                  <Calendar size={14} color={colors.textMuted} />
                  <Text className="text-textMuted text-xs" numberOfLines={1}>
                    {new Date(activeBooking.scheduledTime).toLocaleDateString()}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5 flex-1">
                  <MapPin size={14} color={colors.textMuted} />
                  <Text className="text-textMuted text-xs" numberOfLines={1}>
                    {activeBooking.location.address}
                  </Text>
                </View>
              </View>
            </GlassCard>
          </View>
        )}

        {/* Nearby Providers */}
        <View className="mb-6">
          <View className="px-6 flex-row justify-between items-center mb-4">
            <Text className="text-text text-lg font-bold">Nearby & Available</Text>
            <TouchableOpacity>
              <Text className="text-primary text-sm font-medium">See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
          >
            {filteredProviders.map((provider) => (
              <ProviderCard 
                key={provider.id} 
                provider={provider} 
                className="w-72" 
              />
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};
