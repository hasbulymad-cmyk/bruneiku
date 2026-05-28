import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FORMS, CATEGORY_LABELS, getAllCategories, getFormsByCategory } from '../constants/forms';
import type { FormCategory } from '../constants/forms';
import { FormCard } from '../components/FormCard';
import { Colors } from '../constants/colors';

export default function HomeScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FormCategory | null>(null);

  const categories = getAllCategories();

  const filtered = FORMS.filter((f) => {
    const matchesQuery =
      query.trim() === '' ||
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.nameMalay.toLowerCase().includes(query.toLowerCase()) ||
      f.department.toLowerCase().includes(query.toLowerCase());
    const matchesCat = activeCategory === null || f.category === activeCategory;
    return matchesQuery && matchesCat;
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <LinearGradient colors={[Colors.primary, Colors.primaryLight]} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>BruneiForms</Text>
            <Text style={styles.headerSubtitle}>Panduan Borang Kerajaan Brunei</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => router.push('/settings')}
            accessibilityLabel="Settings"
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search forms... / Cari borang..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* AI Chat CTA */}
        <TouchableOpacity
          style={styles.chatCta}
          onPress={() => router.push('/chat')}
          activeOpacity={0.88}
        >
          <Text style={styles.chatCtaEmoji}>🤖</Text>
          <View style={styles.chatCtaText}>
            <Text style={styles.chatCtaTitle}>Ask AI anything</Text>
            <Text style={styles.chatCtaSub}>
              &quot;What do I need to renew my IC?&quot; • &quot;Berapa bayaran pasport?&quot;
            </Text>
          </View>
          <Text style={styles.chatCtaArrow}>›</Text>
        </TouchableOpacity>

        {/* Category Filter */}
        {query.trim() === '' && (
          <>
            <Text style={styles.sectionLabel}>Browse by Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.catRow}
            >
              <TouchableOpacity
                style={[styles.catChip, activeCategory === null && styles.catChipActive]}
                onPress={() => setActiveCategory(null)}
              >
                <Text style={[styles.catChipText, activeCategory === null && styles.catChipTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              {categories.map((cat) => {
                const label = CATEGORY_LABELS[cat];
                const isActive = activeCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catChip, isActive && styles.catChipActive]}
                    onPress={() => setActiveCategory(isActive ? null : cat)}
                  >
                    <Text style={styles.catChipEmoji}>{label.icon}</Text>
                    <Text style={[styles.catChipText, isActive && styles.catChipTextActive]}>
                      {label.en}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        )}

        {/* Forms List */}
        <Text style={styles.sectionLabel}>
          {query.trim() !== ''
            ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
            : activeCategory
            ? `${CATEGORY_LABELS[activeCategory].en} (${filtered.length})`
            : `All Forms (${filtered.length})`}
        </Text>

        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>No forms found</Text>
            <Text style={styles.emptySubtitle}>
              Try asking our AI assistant — it can help with any Brunei government process.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push({ pathname: '/chat', params: { q: query } })}
            >
              <Text style={styles.emptyBtnText}>Ask AI about this →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((form) => (
            <FormCard
              key={form.id}
              form={form}
              onPress={() => router.push({ pathname: '/form/[id]', params: { id: form.id } })}
            />
          ))
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Information is for general guidance only.{'\n'}Always verify with the relevant department.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  settingsBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: { fontSize: 22 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  clearBtn: { fontSize: 14, color: Colors.textMuted, padding: 4 },
  body: { padding: 16, paddingTop: 12 },
  chatCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    shadowColor: Colors.accent,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  chatCtaEmoji: { fontSize: 28, marginRight: 12 },
  chatCtaText: { flex: 1 },
  chatCtaTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 2 },
  chatCtaSub: { fontSize: 11, color: 'rgba(27,58,107,0.65)', lineHeight: 15 },
  chatCtaArrow: { fontSize: 24, color: Colors.primary, fontWeight: '700' },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  catRow: { paddingBottom: 12, gap: 8 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.white,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catChipEmoji: { fontSize: 14 },
  catChipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  catChipTextActive: { color: Colors.white },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 16, lineHeight: 20 },
  emptyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  emptyBtnText: { color: Colors.white, fontWeight: '600', fontSize: 14 },
  footer: { marginTop: 20, marginBottom: 8, alignItems: 'center' },
  footerText: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', lineHeight: 16 },
});
