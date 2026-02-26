import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { EmptyState } from '../components/EmptyState';

export const CollectionsScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.outlineVariant }]}>
        <View style={styles.headerLeft}>
          <Ionicons name="folder" size={28} color={colors.primary} />
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Collections</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Organize your clips
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <EmptyState
          title="No Collections Yet"
          message="Create collections to organize your clipboard items"
          icon="folder-open-outline"
        />

        {/* Create Collection Button */}
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.surfaceVariant }]}
        >
          <Ionicons name="add-circle" size={24} color={colors.primary} />
          <Text style={[styles.createButtonText, { color: colors.primary }]}>
            Create Collection
          </Text>
        </TouchableOpacity>

        {/* Info Text */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.textMuted} />
          <Text style={[styles.infoText, { color: colors.textMuted }]}>
            Collections feature coming soon! Pin items to keep them accessible.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
