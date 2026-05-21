import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Cpu, Database, Network } from 'lucide-react-native';

import { AnimatedGridBackground } from '../components/AnimatedGridBackground';
import { GlassCard } from '../components/GlassCard';

export const FuturisticDashboardScreen = () => {
  return (
    <View className="flex-1 bg-[#05070d]">
      <AnimatedGridBackground />
      
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <ScrollView 
          className="flex-1 px-5" 
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="mb-8 mt-4 flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-semibold uppercase tracking-widest text-[#2b6cff]">
                System Active
              </Text>
              <Text className="text-3xl font-bold text-white shadow-[#2b6cff] shadow-sm">
                Nexus Core
              </Text>
            </View>
            <View className="h-12 w-12 items-center justify-center rounded-full border border-[#2b6cff]/50 bg-[#2b6cff]/10">
              <Cpu size={24} color="#2b6cff" />
            </View>
          </View>

          {/* Top Metrics Row */}
          <View className="mb-6 flex-row gap-4">
            <GlassCard className="flex-1 p-4 border border-[#2b6cff]/20">
              <View className="mb-2 flex-row items-center">
                <Network size={16} color="#2b6cff" />
                <Text className="ml-2 text-xs font-medium text-slate-400">NETWORK</Text>
              </View>
              <Text className="text-2xl font-bold text-white">99.8%</Text>
              <Text className="mt-1 text-xs text-[#2b6cff]">Uplink Stable</Text>
            </GlassCard>

            <GlassCard className="flex-1 p-4 border border-[#2b6cff]/20">
              <View className="mb-2 flex-row items-center">
                <Database size={16} color="#2b6cff" />
                <Text className="ml-2 text-xs font-medium text-slate-400">STORAGE</Text>
              </View>
              <Text className="text-2xl font-bold text-white">84 TB</Text>
              <Text className="mt-1 text-xs text-[#2b6cff]">Capacity Good</Text>
            </GlassCard>
          </View>

          {/* Main AI Feed */}
          <GlassCard className="mb-6 border border-[#2b6cff]/20 p-5">
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Activity size={18} color="#2b6cff" />
                <Text className="ml-2 text-sm font-semibold uppercase tracking-wider text-white">
                  Live Analytics
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="h-2 w-2 rounded-full bg-[#2b6cff] animate-pulse" />
                <Text className="ml-2 text-xs text-[#2b6cff]">SYNCING</Text>
              </View>
            </View>

            <View className="h-32 justify-end gap-2 border-b border-[#2b6cff]/20 pb-4">
              {/* Dummy graph bars */}
              <View className="flex-row items-end justify-between px-2">
                {[40, 70, 45, 90, 65, 80, 55].map((val, idx) => (
                  <View 
                    key={idx} 
                    className="w-8 rounded-t-sm bg-[#2b6cff]/40" 
                    style={{ height: `${val}%` }} 
                  />
                ))}
              </View>
            </View>
            
            <View className="mt-4 flex-row justify-between">
              <View>
                <Text className="text-xs text-slate-400">Processing Rate</Text>
                <Text className="text-lg font-bold text-white">4,291 req/s</Text>
              </View>
              <View>
                <Text className="text-xs text-slate-400 text-right">Latency</Text>
                <Text className="text-lg font-bold text-[#2b6cff]">12ms</Text>
              </View>
            </View>
          </GlassCard>

          {/* Process List */}
          <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Active Subroutines
          </Text>
          
          <View className="gap-3">
            {[
              { name: 'Neural Pathway Mapping', status: 'Optimal', color: '#2b6cff' },
              { name: 'Quantum Cryptography', status: 'Compiling', color: '#94a3b8' },
              { name: 'Visual Cortex Sync', status: 'Active', color: '#2b6cff' },
            ].map((process, idx) => (
              <GlassCard key={idx} className="flex-row items-center justify-between border border-white/5 p-4">
                <View>
                  <Text className="text-sm font-medium text-white">{process.name}</Text>
                  <Text className="text-xs mt-1" style={{ color: process.color }}>{process.status}</Text>
                </View>
                <View className="h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <Activity size={14} color={process.color} />
                </View>
              </GlassCard>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
