import { ChevronLeft, Sparkles } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AIChatBubble } from '../components/AIChatBubble';
import { ProviderCard } from '../components/ProviderCard';
import { ChatInputBar } from '../components/chat/ChatInputBar';
import { runWorkflow } from '../services/antigravityClient';
import { useAntiGravityStore } from '../store/useAntiGravityStore';
import { colors } from '../theme/colors';
import type { Provider, ServiceCategoryFilter } from '../types';
import { isTablet, moderateScale } from '../utils/responsive';
import { filterProvidersByCategory, getCategoryDisplayLabel } from '../utils/serviceCategories';

export const AssistantChatScreen = ({ navigation }: any) => {
  const [inputText, setInputText] = useState('');
  const listRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { messages, isTyping, selectedCategory, providerCountByCategory, setSelectedCategory } = useAntiGravityStore();

  const horizontalPadding = isTablet ? 24 : 16;
  const cardWidth = Math.min(width * 0.78, 340);

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages, isTyping, selectedCategory]);

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || isTyping) {
      return;
    }

    setInputText('');
    await runWorkflow('service_orchestrator', {
      userMessage: trimmed,
      context: {
        preferredCategory: selectedCategory === 'all' ? null : selectedCategory,
        uiFilters: { category: selectedCategory },
      },
    });
  };

  const renderRecommendationHeader = () => {
    const categoryLabel = getCategoryDisplayLabel(selectedCategory);
    const count = providerCountByCategory[selectedCategory] ?? 0;
    return (
      <View style={{ paddingHorizontal: horizontalPadding, marginTop: moderateScale(4), marginBottom: moderateScale(8) }}>
        <Text className="text-text text-sm font-semibold">
          Showing: {categoryLabel} • {count} providers available
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <View className="px-4 py-3 flex-row items-center border-b border-border/30">
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            className="w-11 h-11 items-center justify-center mr-2 rounded-full active:bg-card"
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <Sparkles size={14} color={colors.primary} />
            <Text className="ml-2 text-primary font-bold text-sm tracking-wide">AntiGravity</Text>
          </View>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingTop: 16,
            paddingHorizontal: horizontalPadding,
            paddingBottom: 16,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: moderateScale(10) }} />}
          renderItem={({ item }) => {
            const hasRecommendations = item.role === 'assistant' && item.isActionable && item.providers?.length;
            const providers = hasRecommendations ? filterProvidersByCategory((item.providers ?? []) as Provider[], selectedCategory) : [];

            return (
              <View style={{ marginBottom: moderateScale(12) }}>
                <AIChatBubble role={item.role as any} content={item.content} />

                {hasRecommendations ? (
                  <View style={{ marginTop: moderateScale(10) }}>
                    {renderRecommendationHeader()}
                    {providers.length > 0 ? (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 4, gap: 12 }}
                      >
                        {providers.map((provider) => (
                          <View key={provider.id} style={{ width: cardWidth }}>
                            <ProviderCard provider={provider} className="w-full" />
                          </View>
                        ))}
                      </ScrollView>
                    ) : (
                      <View className="px-4 py-4 rounded-2xl bg-card/80 border border-border/50">
                        <Text className="text-textMuted text-sm">
                          No providers in this category. Tap All or try another service category.
                        </Text>
                      </View>
                    )}
                  </View>
                ) : null}
              </View>
            );
          }}
        />

        <ChatInputBar
          inputText={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          onCategorySelect={(category: ServiceCategoryFilter) => setSelectedCategory(category)}
          selectedCategory={selectedCategory}
          providerCountByCategory={providerCountByCategory}
          isSending={isTyping}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
