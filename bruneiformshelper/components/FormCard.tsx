import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { BruneiForm } from '../constants/forms';
import { CATEGORY_LABELS } from '../constants/forms';
import { Colors } from '../constants/colors';

interface Props {
  form: BruneiForm;
  onPress: () => void;
}

export function FormCard({ form, onPress }: Props) {
  const cat = CATEGORY_LABELS[form.category];
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconBadge}>
        <Text style={styles.icon}>{cat.icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{form.name}</Text>
        <Text style={styles.nameMalay}>{form.nameMalay}</Text>
        <Text style={styles.dept} numberOfLines={1}>
          {form.department}
        </Text>
        <View style={styles.meta}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{form.processingTime}</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{form.fee.split('/')[0].trim()}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: { fontSize: 22 },
  content: { flex: 1 },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 1,
  },
  nameMalay: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  dept: {
    fontSize: 11,
    color: Colors.primary,
    marginBottom: 6,
  },
  meta: { flexDirection: 'row', gap: 6 },
  pill: {
    backgroundColor: Colors.bgLight,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pillText: { fontSize: 10, color: Colors.textSecondary, fontWeight: '500' },
  arrow: { fontSize: 22, color: Colors.textMuted, marginLeft: 4 },
});
