import { Activity, Server, Terminal, Zap } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../components/GlassCard';
import { useAntiGravityStore } from '../store/useAntiGravityStore';
import { colors } from '../theme/colors';

export const TraceLogsScreen = () => {
  const { traces } = useAntiGravityStore();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'thought': return <Activity size={14} color={colors.accent} />;
      case 'action': return <Zap size={14} color={colors.warning} />;
      case 'result': return <Server size={14} color={colors.success} />;
      default: return <Terminal size={14} color={colors.primary} />;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'thought': return colors.accent;
      case 'action': return colors.warning;
      case 'result': return colors.success;
      default: return colors.primary;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A0F1A]" edges={['top']}>
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-white/5 bg-background/50">
        <View className="flex-row items-center gap-2">
          <Terminal size={20} color={colors.primary} />
          <Text className="text-white font-bold text-lg tracking-widest">ORCHESTRATION_LOGS</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <Text className="text-success text-xs font-mono">LIVE</Text>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-4"
        style={{ backgroundColor: '#050810' }}
      >
        {traces.length === 0 ? (
          <View className="py-10 items-center justify-center">
            <Text className="text-textMuted font-mono text-xs">No active traces. Awaiting query...</Text>
          </View>
        ) : (
          traces.map((trace, index) => {
            const isLast = index === traces.length - 1;
            return (
              <View key={trace.traceId || index.toString()} className="mb-3">
                <GlassCard className="p-3 border border-white/5" intensity={15}>
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-row items-center gap-1.5">
                      {getIconForType(trace.type)}
                      <Text 
                        style={{ color: getColorForType(trace.type) }}
                        className="font-mono text-[10px] uppercase font-bold tracking-wider"
                      >
                        [SYS_{trace.type}]
                      </Text>
                    </View>
                    <Text className="text-white/30 font-mono text-[10px]">
                      {trace.timestamp ? new Date(trace.timestamp).toLocaleTimeString() : 'NOW'}
                    </Text>
                  </View>
                  <Text className="text-white/80 font-mono text-xs leading-5">
                    {`> `}{trace.content}
                  </Text>
                  {trace.metadata && Object.keys(trace.metadata).length > 0 && (
                    <View className="mt-2 p-2 bg-black/40 rounded border border-white/5">
                      <Text className="text-white/50 font-mono text-[10px]">
                        {JSON.stringify(trace.metadata, null, 2)}
                      </Text>
                    </View>
                  )}
                </GlassCard>
                {!isLast && (
                  <View className="w-0.5 h-3 bg-white/10 ml-6 my-0.5" />
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
