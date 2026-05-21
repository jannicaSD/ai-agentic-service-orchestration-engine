import React from 'react';
import { View, Text } from 'react-native';
import { GlassCard } from './GlassCard';

interface AIChatBubbleProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isTyping?: boolean;
}

export const AIChatBubble: React.FC<AIChatBubbleProps> = ({ role, content, isTyping }) => {
  if (role === 'user') {
    return (
      <View className="flex-row justify-end mb-4 px-4 w-full">
        <View className="bg-primary/90 px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%]">
          <Text className="text-white text-base">{content}</Text>
        </View>
      </View>
    );
  }

  // Assistant bubble uses GlassCard for a premium feel
  return (
    <View className="flex-row justify-start mb-4 px-4 w-full">
      <GlassCard className="px-5 py-4 rounded-2xl rounded-tl-sm max-w-[85%]" intensity={40}>
        {isTyping ? (
          <View className="flex-row gap-1 items-center h-6">
            <View className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <View className="w-2 h-2 rounded-full bg-accent animate-pulse delay-75" />
            <View className="w-2 h-2 rounded-full bg-accent animate-pulse delay-150" />
          </View>
        ) : (
          <Text className="text-text text-base leading-relaxed">{content}</Text>
        )}
      </GlassCard>
    </View>
  );
};
