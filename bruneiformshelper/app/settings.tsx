import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';

const API_KEY_STORAGE = 'bruneiForms_apiKey';

export default function SettingsScreen() {
  const [keyInput, setKeyInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(API_KEY_STORAGE).then((key) => {
      if (key) {
        setHasKey(true);
        setKeyInput(key);
      }
    });
  }, []);

  async function saveKey() {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      Alert.alert('Error', 'Please enter an API key.');
      return;
    }
    if (!trimmed.startsWith('sk-ant-')) {
      Alert.alert('Invalid Key', 'Anthropic API keys start with sk-ant-');
      return;
    }
    await AsyncStorage.setItem(API_KEY_STORAGE, trimmed);
    setHasKey(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function clearKey() {
    Alert.alert('Remove API Key', 'Are you sure you want to remove your API key?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem(API_KEY_STORAGE);
          setKeyInput('');
          setHasKey(false);
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.body}>
        {/* API Key Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔑 Anthropic API Key</Text>
          <Text style={styles.sectionDesc}>
            Your API key powers the AI assistant. It is stored locally on your device and sent only to Anthropic's servers when you use the chat.
          </Text>

          {hasKey && (
            <View style={styles.keyStatus}>
              <Text style={styles.keyStatusDot}>●</Text>
              <Text style={styles.keyStatusText}>API key is set</Text>
            </View>
          )}

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

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.saveBtn} onPress={saveKey}>
              <Text style={styles.saveBtnText}>{saved ? '✓ Saved!' : 'Save Key'}</Text>
            </TouchableOpacity>
            {hasKey && (
              <TouchableOpacity style={styles.clearBtn} onPress={clearKey}>
                <Text style={styles.clearBtnText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.hint}>
            Get your key at console.anthropic.com → API Keys
          </Text>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ About BruneiForms Helper</Text>
          <Text style={styles.sectionDesc}>
            BruneiForms Helper is an unofficial guide to Brunei Darussalam government forms and processes. Information is sourced from public government resources and is for general guidance only.
          </Text>
          <Text style={styles.sectionDesc}>
            Always verify fees, requirements, and office hours directly with the relevant department before your visit.
          </Text>
          <Text style={[styles.sectionDesc, { marginTop: 8 }]}>
            Version 1.0.0 • Made with ❤️ for Brunei
          </Text>
        </View>

        {/* Departments Reference */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 Key Departments</Text>
          {DEPARTMENTS.map((d, i) => (
            <View key={i} style={styles.deptRow}>
              <Text style={styles.deptName}>{d.name}</Text>
              <Text style={styles.deptShort}>{d.short}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const DEPARTMENTS = [
  { short: 'JPIN', name: 'Immigration & National Registration' },
  { short: 'JPD', name: 'Land Transport Department' },
  { short: 'JPAS', name: 'Department of Labour' },
  { short: 'ROCBN', name: 'Registry of Companies & Business Names' },
  { short: 'MOH', name: 'Ministry of Health' },
  { short: 'BAFRA', name: 'Brunei Agri-Food & Veterinary Authority' },
  { short: 'JKAM', name: 'Islamic Religious Affairs (Muslim marriages)' },
];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  body: { padding: 16 },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  sectionDesc: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },
  keyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    marginTop: 4,
  },
  keyStatusDot: { color: Colors.success, fontSize: 10 },
  keyStatusText: { fontSize: 13, color: Colors.success, fontWeight: '600' },
  keyInput: {
    backgroundColor: Colors.bgLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginTop: 6,
    marginBottom: 12,
  },
  btnRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  saveBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  clearBtn: {
    backgroundColor: Colors.errorLight,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  clearBtnText: { color: Colors.error, fontWeight: '600', fontSize: 15 },
  hint: { fontSize: 12, color: Colors.textMuted },
  deptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  deptShort: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    width: 52,
    backgroundColor: Colors.bgLight,
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
    textAlign: 'center',
  },
  deptName: { fontSize: 13, color: Colors.textPrimary, flex: 1 },
});
