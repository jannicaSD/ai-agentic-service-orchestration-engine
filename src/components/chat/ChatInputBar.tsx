import { Send } from 'lucide-react-native';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import type { ServiceCategoryFilter } from '../../types';
import { GlassCard } from '../GlassCard';
import { CategoryChipBar } from '../ui/CategoryChipBar';

interface ChatInputBarProps {
  inputText: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onCategorySelect: (category: ServiceCategoryFilter) => void;
  selectedCategory: ServiceCategoryFilter;
  providerCountByCategory: Record<ServiceCategoryFilter, number>;
  isSending?: boolean;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  inputText,
  onChangeText,
  onSend,
  onCategorySelect,
  selectedCategory,
  providerCountByCategory,
  isSending = false,
}) => {
  const canSend = inputText.trim().length > 0 && !isSending;

  return (
    <SafeAreaView edges={['bottom']} className="bg-background/95 border-t border-border/30">
      <View className="px-4 pt-3 pb-2">
        <CategoryChipBar
          selectedCategory={selectedCategory}
          providerCountByCategory={providerCountByCategory}
          onSelectCategory={onCategorySelect}
        />
      </View>

      <View className="px-4 pb-3">
        <GlassCard className="px-3 py-2.5 rounded-3xl" intensity={30}>
          <View className="flex-row items-end gap-2">
            <View className="flex-1 bg-card/60 border border-border/40 rounded-2xl px-4 py-3 min-h-11">
              <TextInput
                value={inputText}
                onChangeText={onChangeText}
                placeholder="Tell me what you need..."
                placeholderTextColor={colors.textMuted}
                multiline
                textAlignVertical="top"
                scrollEnabled
                className="text-text text-base leading-5"
                style={{
                  minHeight: 44,
                  maxHeight: 120,
                  paddingTop: 0,
                  paddingBottom: 0,
                }}
                returnKeyType="send"
                onSubmitEditing={onSend}
              />
            </View>

            <TouchableOpacity
              onPress={onSend}
              disabled={!canSend}
              className={`w-11 h-11 rounded-full items-center justify-center ${
                canSend ? 'bg-primary' : 'bg-card border border-border/40'
              }`}
              accessibilityRole="button"
              accessibilityLabel="Send message"
            >
              <Send size={18} color={canSend ? '#fff' : colors.textMuted} />
            </TouchableOpacity>
          </View>
        </GlassCard>
      </View>
    </SafeAreaView>
  );
};
