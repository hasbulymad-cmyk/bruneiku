import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { askClaude, type ChatMessage } from '../lib/claude';
import { getFormById } from '../constants/forms';
import { ChatBubble } from '../components/ChatBubble';
import { Colors } from '../constants/colors';

const API_KEY_STORAGE = 'bruneiForms_apiKey';

const SUGGESTED_QUESTIONS = [
  'What documents do I need for IC replacement?',
  'Berapa lama proses pasport?',
  'How do I register a business in Brunei?',
  'What is the fee for a driving licence?',
];

export default function ChatScreen() {
  const { formId, q } = useLocalSearchParams<{ formId?: string; q?: string }>();
  const form = formId ? getFormById(formId) : undefined;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(q ?? '');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    AsyncStorage.getItem(API_KEY_STORAGE).then((key) => {
      if (key) setApiKey(key);
      else setShowKeyInput(true);
    });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  useEffect(() => {
    if (form && messages.length === 0) {
      const greeting: ChatMessage = {
        role: 'assistant',
        content: `Assalamualaikum! I'm here to help you with the **${form.name}** (${form.nameMalay}) process.\n\nWhat would you like to know? You can ask in English or Bahasa Melayu.`,
      };
      setMessages([greeting]);
    } else if (!form && messages.length === 0) {
      const greeting: ChatMessage = {
        role: 'assistant',
        content: `Assalamualaikum! I'm BruneiForms Helper 🇧🇳\n\nI can help you understand any Brunei government form or process — IC, passport, driving licence, business registration, and more.\n\nWhat do you need help with? You can ask in English or Bahasa Melayu.`,
      };
      setMessages([greeting]);
    }
  }, [form]);

  async function saveKey() {
    const trimmed = keyInput.trim();
    if (!trimmed.startsWith('sk-ant-')) {
      setError('Please enter a valid Anthropic API key (starts with sk-ant-)');
      return;
    }
    await AsyncStorage.setItem(API_KEY_STORAGE, trimmed);
    setApiKey(trimmed);
    setShowKeyInput(false);
    setError('');
  }

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }

    const userMsg: ChatMessage = { role: 'user', content: msg };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const reply = await askClaude(next, apiKey, form);
      setMessages([...next, { role: 'assistant', content: reply }]);
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : 'Unknown error';
      setError(errMsg);
      if (errMsg.includes('401') || errMsg.includes('invalid')) {
        setShowKeyInput(true);
      }
    } finally {
      setLoading(false);
    }
  }

  if (showKeyInput) {
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ title: 'Setup API Key' }} />
        <View style={styles.keySetup}>
          <Text style={styles.keyEmoji}>🔑</Text>
          <Text style={styles.keyTitle}>Enter your Anthropic API Key</Text>
          <Text style={styles.keySub}>
            Your key is stored locally on your device only. It is never sent anywhere except directly to Anthropic.
          </Text>
          <TextInput
            style={styles.keyInput}
            placeholder="sk-ant-api03-..."
            placeholderTextColor={Colors.textMuted}
            value={keyInput}
            onChangeText={setKeyInput}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
          {error ? <Text style={styles.keyError}>{error}</Text> : null}
          <TouchableOpacity style={styles.keyBtn} onPress={saveKey}>
            <Text style={styles.keyBtnText}>Save & Continue</Text>
          </TouchableOpacity>
          <Text style={styles.keyHint}>
            Get your API key at console.anthropic.com
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: form ? `Ask about: ${form.name}` : 'Ask AI',
          headerRight: () => (
            <TouchableOpacity onPress={() => setShowKeyInput(true)} style={{ marginRight: 4 }}>
              <Text style={{ color: Colors.white, fontSize: 13 }}>🔑 Key</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={90}
        >
          {/* Form context banner */}
          {form && (
            <View style={styles.contextBanner}>
              <Text style={styles.contextBannerText}>
                {CATEGORY_LABELS_INLINE[form.category]} Asking about: <Text style={styles.contextBannerBold}>{form.name}</Text>
              </Text>
            </View>
          )}

          {/* Messages */}
          <ScrollView
            ref={scrollRef}
            style={styles.messages}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((m, i) => (
              <ChatBubble key={i} message={m} />
            ))}

            {loading && (
              <View style={styles.loadingRow}>
                <View style={styles.loadingBubble}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text style={styles.loadingText}>Thinking...</Text>
                </View>
              </View>
            )}

            {error && !showKeyInput && (
              <View style={styles.errorBubble}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}

            {/* Suggestions when no messages yet (after greeting) */}
            {messages.length <= 1 && !loading && (
              <View style={styles.suggestions}>
                <Text style={styles.suggestionsLabel}>Try asking:</Text>
                {(form ? [] : SUGGESTED_QUESTIONS).map((q, i) => (
                  <TouchableOpacity key={i} style={styles.suggestionChip} onPress={() => send(q)}>
                    <Text style={styles.suggestionText}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ask anything... / Tanya apa saja..."
              placeholderTextColor={Colors.textMuted}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
              onSubmitEditing={() => send()}
            />
            <TouchableOpacity
              style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
              onPress={() => send()}
              disabled={!input.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.sendBtnText}>↑</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const CATEGORY_LABELS_INLINE: Record<string, string> = {
  identity: '🪪',
  immigration: '✈️',
  vehicle: '🚗',
  business: '🏢',
  health: '🏥',
  education: '📚',
  tax: '📋',
  property: '🏠',
  other: '📄',
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  contextBanner: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  contextBannerText: { fontSize: 12, color: Colors.warning },
  contextBannerBold: { fontWeight: '700' },
  messages: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  loadingRow: { flexDirection: 'row', marginBottom: 12 },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  loadingText: { fontSize: 14, color: Colors.textMuted },
  errorBubble: {
    backgroundColor: Colors.errorLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: { fontSize: 13, color: Colors.error },
  suggestions: { marginTop: 8 },
  suggestionsLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  suggestionChip: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionText: { fontSize: 14, color: Colors.primary },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.bgLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.textPrimary,
    maxHeight: 120,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.border },
  sendBtnText: { fontSize: 20, color: Colors.white, fontWeight: '700', marginTop: -2 },
  keySetup: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyEmoji: { fontSize: 48, marginBottom: 16 },
  keyTitle: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10, textAlign: 'center' },
  keySub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 21, marginBottom: 24 },
  keyInput: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  keyError: { fontSize: 13, color: Colors.error, marginBottom: 12, textAlign: 'center' },
  keyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  keyBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  keyHint: { fontSize: 12, color: Colors.textMuted, textAlign: 'center' },
});
