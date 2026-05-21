import { ChevronLeft, Phone, Send } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Linking,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockProviders } from '../services/mockData';
import { useProviderChatStore } from '../store/useProviderChatStore';
import { colors } from '../theme/colors';

export const ProviderChatScreen = ({ route, navigation }: any) => {
  const { providerId } = route.params || {};
  const provider = mockProviders.find(p => p.id === providerId);
  const [inputText, setInputText] = useState('');

  const safeProviderId = providerId ?? '';
  const threadFromStore = useProviderChatStore(state => state.threads[safeProviderId]);
  const isTyping = useProviderChatStore(state => state.threads[safeProviderId]?.isTyping ?? false);
  const emptyThread = useMemo(() => ({ providerId: safeProviderId, messages: [] }), [safeProviderId]);
  const thread = threadFromStore ?? emptyThread;
  const sendMessage = useProviderChatStore(state => state.sendMessage);
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll to latest message
  const scrollToEnd = useCallback(() => {
    if (flatListRef.current && thread.messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [thread.messages.length]);

  useEffect(() => {
    scrollToEnd();
  }, [thread.messages.length, scrollToEnd]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(providerId, inputText.trim());
    setInputText('');
  };

  const handleCall = () => {
    if (!provider?.phone) {
      Alert.alert('Unavailable', 'This provider has not provided a phone number.');
      return;
    }
    if (Platform.OS === 'web') {
      Alert.alert('Notice', 'Calling is available on mobile.');
    } else {
      Linking.openURL(`tel:${provider.phone}`);
    }
  };

  if (!provider || !safeProviderId) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <Text className="text-white">Provider not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-3 flex-row items-center justify-between border-b border-border/30">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity 
            onPress={() => navigation?.goBack()}
            className="w-10 h-10 items-center justify-center mr-2 rounded-full active:bg-card"
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-text font-bold text-lg">{provider.name}</Text>
            <View className="flex-row items-center gap-1.5">
              <View className={`w-2 h-2 rounded-full ${isTyping ? 'bg-warning' : 'bg-success'}`} />
              <Text className={`${isTyping ? 'text-warning' : 'text-success'} text-xs font-medium`}>
                {isTyping ? 'Typing...' : 'Online'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Call Button */}
        <TouchableOpacity 
          onPress={handleCall}
          className={`w-10 h-10 items-center justify-center rounded-full ${provider.phone ? 'bg-primary/10' : 'bg-card opacity-50'}`}
          disabled={!provider.phone}
        >
          <Phone size={20} color={provider.phone ? colors.primary : colors.textMuted} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={thread.messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ 
            padding: 16, 
            gap: 12, 
            paddingBottom: 24,
            flexGrow: 1,
            justifyContent: 'flex-end'
          }}
          scrollEnabled
          removeClippedSubviews={Platform.OS === 'android'}
          maxToRenderPerBatch={20}
          updateCellsBatchingPeriod={50}
          renderItem={({ item }) => {
            const isUser = item.role === 'user';
            const formattedTime = new Date(item.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
            
            return (
              <View className={`flex-row ${isUser ? 'justify-end' : 'justify-start'} mb-1`}>
                <View 
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    isUser 
                      ? 'bg-primary rounded-tr-sm' 
                      : 'bg-card border border-border/50 rounded-tl-sm'
                  }`}
                >
                  <Text className="text-white text-[15px] leading-relaxed">
                    {item.text}
                  </Text>
                  <Text className={`text-xs mt-1.5 ${isUser ? 'text-primary-foreground/70' : 'text-textMuted'}`}>
                    {formattedTime}
                  </Text>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            isTyping ? (
              <View className="flex-row items-center gap-2 mb-2">
                <View className="bg-card border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 flex-row gap-1">
                  <View className="w-2 h-2 rounded-full bg-textMuted animate-pulse" />
                  <View className="w-2 h-2 rounded-full bg-textMuted animate-pulse" />
                  <View className="w-2 h-2 rounded-full bg-textMuted animate-pulse" />
                </View>
              </View>
            ) : null
          }
        />

        {/* Input Area */}
        <View className="p-4 border-t border-border/30 bg-background/80">
          <View className="flex-row items-end gap-2 bg-card rounded-full pl-4 pr-1.5 py-1.5 border border-border/50">
            <TextInput
              className="flex-1 text-white text-[15px]"
              placeholder="Type a message..."
              placeholderTextColor={colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={512}
              returnKeyType="send"
              onSubmitEditing={handleSend}
              editable={!isTyping}
              style={{
                maxHeight: 100,
                paddingVertical: 0,
              }}
            />
            <TouchableOpacity 
              onPress={handleSend}
              disabled={!inputText.trim()}
              className={`w-10 h-10 items-center justify-center rounded-full ${
                inputText.trim() ? 'bg-primary' : 'bg-card border border-border/50'
              }`}
            >
              <Send size={18} color={inputText.trim() ? "white" : colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
