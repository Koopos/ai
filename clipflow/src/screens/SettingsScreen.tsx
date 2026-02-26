import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import * as Haptics from 'expo-haptics';

export const SettingsScreen: React.FC = () => {
  const { themeMode, colors, toggleTheme } = useTheme();
  const [hapticFeedback, setHapticFeedback] = React.useState(true);
  const [autoPinUrls, setAutoPinUrls] = React.useState(false);

  const handleToggleTheme = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  const SettingItem: React.FC<{
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
    onPress?: () => void;
  }> = ({ icon, title, subtitle, rightElement, onPress }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.outlineVariant }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.surfaceVariant }]}>
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.outlineVariant }]}>
        <View style={styles.headerLeft}>
          <Ionicons name="settings" size={28} color={colors.primary} />
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Customize your experience
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Appearance
        </Text>

        <SettingItem
          icon={themeMode === 'dark' ? 'moon' : 'sunny'}
          title="Dark Mode"
          subtitle={themeMode === 'dark' ? 'Currently enabled' : 'Currently disabled'}
          rightElement={
            <Switch
              value={themeMode === 'dark'}
              onValueChange={handleToggleTheme}
              trackColor={{ false: colors.outlineVariant, true: colors.primary }}
              thumbColor={themeMode === 'dark' ? colors.onPrimary : colors.textSecondary}
            />
          }
        />

        {/* Preferences Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Preferences
        </Text>

        <SettingItem
          icon="hand-left"
          title="Haptic Feedback"
          subtitle="Vibrate on interactions"
          rightElement={
            <Switch
              value={hapticFeedback}
              onValueChange={(value) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setHapticFeedback(value);
              }}
              trackColor={{ false: colors.outlineVariant, true: colors.primary }}
              thumbColor={hapticFeedback ? colors.onPrimary : colors.textSecondary}
            />
          }
        />

        <SettingItem
          icon="link"
          title="Auto-pin URLs"
          subtitle="Automatically pin copied links"
          rightElement={
            <Switch
              value={autoPinUrls}
              onValueChange={(value) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setAutoPinUrls(value);
              }}
              trackColor={{ false: colors.outlineVariant, true: colors.primary }}
              thumbColor={autoPinUrls ? colors.onPrimary : colors.textSecondary}
            />
          }
        />

        {/* Data Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Data</Text>

        <SettingItem
          icon="trash-outline"
          title="Clear Clipboard History"
          subtitle="Remove all non-pinned items"
          onPress={() => {}}
          rightElement={<Ionicons name="chevron-forward" size={20} color={colors.textMuted} />}
        />

        <SettingItem
          icon="warning-outline"
          title="Clear All Data"
          subtitle="Delete everything including pinned items"
          onPress={() => {}}
          rightElement={<Ionicons name="chevron-forward" size={20} color={colors.textMuted} />}
        />

        {/* About Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>About</Text>

        <SettingItem
          icon="information-circle"
          title="Version"
          subtitle="ClipFlow 1.0.0"
        />

        <SettingItem
          icon="code-working"
          title="Built with"
          subtitle="Expo SDK 54 + React Native"
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Made with love for Android
          </Text>
        </View>
      </ScrollView>
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
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
  },
});
