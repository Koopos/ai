import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { ClipboardItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { formatDate, truncateText, getDomainFromUrl } from '../utils/helpers';

interface ClipboardCardProps {
  item: ClipboardItem;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: () => void;
  onPinPress?: () => void;
  onDeletePress?: () => void;
  width?: number;
}

export const ClipboardCard: React.FC<ClipboardCardProps> = ({
  item,
  onPress,
  onLongPress,
  onPinPress,
  onDeletePress,
  width = 280,
}) => {
  const { colors, themeMode } = useTheme();

  const handlePinPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPinPress?.();
  };

  const getIconForType = () => {
    switch (item.type) {
      case 'url':
        return 'link';
      case 'image':
        return 'image';
      default:
        return 'document-text';
    }
  };

  const renderContent = () => {
    if (item.type === 'image') {
      return (
        <View style={[styles.imagePreview, { backgroundColor: colors.surfaceVariant }]}>
          <Ionicons name="image" size={32} color={colors.primary} />
          <Text style={[styles.imageText, { color: colors.textSecondary }]}>
            Image
          </Text>
        </View>
      );
    }

    if (item.type === 'url') {
      return (
        <View>
          <View style={styles.urlHeader}>
            <Ionicons name="link" size={16} color={colors.primary} />
            <Text style={[styles.domain, { color: colors.primary }]} numberOfLines={1}>
              {getDomainFromUrl(item.content)}
            </Text>
          </View>
          <Text style={[styles.urlContent, { color: colors.textSecondary }]} numberOfLines={2}>
            {truncateText(item.content, 60)}
          </Text>
        </View>
      );
    }

    return (
      <Text style={[styles.textContent, { color: colors.text }]} numberOfLines={4}>
        {item.preview || item.content}
      </Text>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={[styles.container, { width, backgroundColor: colors.surface }]}
    >
      <LinearGradient
        colors={
          themeMode === 'dark'
            ? [colors.surface, colors.surfaceVariant]
            : [colors.surface, colors.surfaceVariant]
        }
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconContainer, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name={getIconForType()} size={16} color={colors.primary} />
            </View>
            <Text style={[styles.timestamp, { color: colors.textMuted }]}>
              {formatDate(item.timestamp)}
            </Text>
          </View>

          <View style={styles.headerRight}>
            {onPinPress && (
              <TouchableOpacity
                onPress={handlePinPress}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.iconButton}
              >
                <Ionicons
                  name={item.pinned ? 'push' : 'push-outline'}
                  size={18}
                  color={item.pinned ? colors.primary : colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.content}>{renderContent()}</View>

        {item.pinned && (
          <View style={[styles.pinnedIndicator, { backgroundColor: colors.primary }]}>
            <Ionicons name="push" size={12} color={colors.onPrimary} />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gradient: {
    padding: 16,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  textContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  imagePreview: {
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imageText: {
    fontSize: 14,
    fontWeight: '500',
  },
  urlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  domain: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  urlContent: {
    fontSize: 12,
    lineHeight: 18,
  },
  pinnedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
