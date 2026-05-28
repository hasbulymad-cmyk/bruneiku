import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { getFormById, CATEGORY_LABELS } from '../../constants/forms';
import { Colors } from '../../constants/colors';

export default function FormDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const form = getFormById(id ?? '');

  if (!form) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundEmoji}>❓</Text>
          <Text style={styles.notFoundTitle}>Form not found</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>← Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const cat = CATEGORY_LABELS[form.category];

  return (
    <>
      <Stack.Screen options={{ title: form.name }} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <Text style={styles.heroEmoji}>{cat.icon}</Text>
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroName}>{form.name}</Text>
              <Text style={styles.heroNameMalay}>{form.nameMalay}</Text>
              <Text style={styles.heroDept}>{form.department}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{form.description}</Text>
          <Text style={styles.descriptionMalay}>{form.descriptionMalay}</Text>

          {/* Quick Info */}
          <View style={styles.infoGrid}>
            <InfoCell icon="⏱" label="Processing" value={form.processingTime} />
            <InfoCell icon="💰" label="Fee" value={form.fee.split('/')[0].trim()} />
            <InfoCell icon="🕐" label="Office Hours" value={form.officeHours} />
            <InfoCell icon="📍" label="Location" value={form.location} />
          </View>

          {/* Documents */}
          <SectionHeader emoji="📎" title="Required Documents" subtitle="Dokumen Diperlukan" />
          {form.documents.map((doc, i) => (
            <View key={i} style={styles.listItem}>
              <View style={styles.listBullet}>
                <Text style={styles.listBulletText}>{i + 1}</Text>
              </View>
              <Text style={styles.listText}>{doc}</Text>
            </View>
          ))}

          {/* Steps */}
          <SectionHeader emoji="📋" title="Step-by-Step Process" subtitle="Langkah-langkah" />
          {form.steps.map((step, i) => (
            <View key={i} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepText}>{step}</Text>
                {i < form.steps.length - 1 && <View style={styles.stepLine} />}
              </View>
            </View>
          ))}

          {/* Tips */}
          <SectionHeader emoji="💡" title="Helpful Tips" subtitle="Petua Berguna" />
          {form.tips.map((tip, i) => (
            <View key={i} style={styles.tipItem}>
              <Text style={styles.tipDot}>•</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}

          {/* AI Chat CTA */}
          <TouchableOpacity
            style={styles.chatCta}
            onPress={() => router.push({ pathname: '/chat', params: { formId: form.id } })}
            activeOpacity={0.88}
          >
            <Text style={styles.chatCtaEmoji}>🤖</Text>
            <View>
              <Text style={styles.chatCtaTitle}>Have questions?</Text>
              <Text style={styles.chatCtaSub}>Ask our AI assistant about this form</Text>
            </View>
            <Text style={styles.chatCtaArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              ⚠️ Information is for general guidance only. Fees and requirements may change — always confirm with the relevant department before your visit.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function SectionHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionEmoji}>{emoji}</Text>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

function InfoCell({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoCell}>
      <Text style={styles.infoCellIcon}>{icon}</Text>
      <Text style={styles.infoCellLabel}>{label}</Text>
      <Text style={styles.infoCellValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  body: { padding: 16, paddingBottom: 32 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundEmoji: { fontSize: 48 },
  notFoundTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  backLink: { fontSize: 16, color: Colors.primary },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: Colors.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  heroEmoji: { fontSize: 28 },
  heroText: { flex: 1 },
  heroName: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  heroNameMalay: { fontSize: 13, color: Colors.textMuted, marginBottom: 4 },
  heroDept: { fontSize: 12, color: Colors.primary, fontWeight: '500' },
  description: { fontSize: 15, color: Colors.textPrimary, lineHeight: 22, marginBottom: 4 },
  descriptionMalay: { fontSize: 13, color: Colors.textMuted, lineHeight: 20, marginBottom: 16 },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  infoCell: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  infoCellIcon: { fontSize: 18, marginBottom: 4 },
  infoCellLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 2 },
  infoCellValue: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600', lineHeight: 18 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionEmoji: { fontSize: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  sectionSubtitle: { fontSize: 12, color: Colors.textMuted },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  listBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  listBulletText: { fontSize: 11, fontWeight: '700', color: Colors.white },
  listText: { flex: 1, fontSize: 14, color: Colors.textPrimary, lineHeight: 21 },
  stepItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 0 },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accentLight,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
    marginTop: 2,
  },
  stepNumberText: { fontSize: 12, fontWeight: '700', color: Colors.accent },
  stepContent: { flex: 1, paddingBottom: 16 },
  stepText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 21 },
  stepLine: {
    position: 'absolute',
    left: -22,
    top: 26,
    width: 2,
    height: '100%',
    backgroundColor: Colors.border,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  tipDot: { fontSize: 18, color: Colors.accent, lineHeight: 22, marginTop: -1 },
  tipText: { flex: 1, fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },
  chatCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
    gap: 12,
  },
  chatCtaEmoji: { fontSize: 26 },
  chatCtaTitle: { fontSize: 15, fontWeight: '700', color: Colors.white },
  chatCtaSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  chatCtaArrow: { marginLeft: 'auto', fontSize: 24, color: Colors.white },
  disclaimer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.warningLight,
    borderRadius: 10,
  },
  disclaimerText: { fontSize: 12, color: Colors.warning, lineHeight: 18 },
});
