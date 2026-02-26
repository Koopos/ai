import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ClipboardItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { formatFullDate } from '../utils/date';

interface DetailModalProps {
  visible: boolean;
  item: ClipboardItem | null;
  onClose: () => void;
  onCopy: (content: string) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, content: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  visible,
  item,
  onClose,
  onCopy,
  onPin,
  onDelete,
  onUpdate,
}) => {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  React.useEffect(() => {
    if (item) {
      setEditedContent(item.content);
    }
  }, [item]);

  if (!item) return null;

  const handleCopy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onCopy(item.content);
    onClose();
  };

  const handlePin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPin(item.id);
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          onDelete(item.id);
          onClose();
        },
      },
    ]);
  };

  const handleEdit = () => {
    setIsEditing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSaveEdit = () => {
    if (onUpdate) {
      onUpdate(item.id, editedContent);
      setIsEditing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(item.content);
    setIsEditing(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.outlineVariant }]}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            {isEditing ? (
              <>
                <TouchableOpacity onPress={handleCancelEdit} style={styles.headerButton}>
                  <Text style={[styles.headerButtonText, { color: colors.textSecondary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveEdit} style={styles.headerButton}>
                  <Text style={[styles.headerButtonText, { color: colors.primary }]}>
                    Save
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={handlePin} style={styles.headerButton}>
                  <Ionicons
                    name={item.pinned ? 'push' : 'push-outline'}
                    size={24}
                    color={item.pinned ? colors.primary : colors.text}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
                  <Ionicons name="trash-outline" size={24} color={colors.error} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <ScrollView style={styles.content}>
          {/* Type Badge */}
          <View style={[styles.badge, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              {item.type.toUpperCase()}
            </Text>
          </View>

          {/* Timestamp */}
          <Text style={[styles.timestamp, { color: colors.textMuted }]}>
            {formatFullDate(item.timestamp)}
          </Text>

          {/* Content */}
          {isEditing ? (
            <TextInput
              style={[styles.contentInput, { color: colors.text, borderColor: colors.outlineVariant }]}
              value={editedContent}
              onChangeText={setEditedContent}
              multiline
              autoFocus
              selectTextOnFocus
            />
          ) : (
            <>
              {item.type === 'image' ? (
                <View style={[styles.imageContainer, { backgroundColor: colors.surfaceVariant }]}>
                  <Ionicons name="image" size={64} color={colors.primary} />
                  <Text style={[styles.imageText, { color: colors.textSecondary }]}>
                    Base64 Image
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onLongPress={handleEdit}
                  activeOpacity={0.7}
                  style={styles.contentContainer}
                >
                  <Text style={[styles.contentText, { color: colors.text }]}>
                    {item.content}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {!isEditing && onUpdate && (
            <TouchableOpacity
              onPress={handleEdit}
              style={[styles.editButton, { backgroundColor: colors.surfaceVariant }]}
            >
              <Ionicons name="pencil" size={18} color={colors.primary} />
              <Text style={[styles.editButtonText, { color: colors.primary }]}>
                Edit Content
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Footer Action */}
        <View style={[styles.footer, { borderTopColor: colors.outlineVariant }]}>
          <TouchableOpacity
            style={[styles.copyButton, { backgroundColor: colors.primary }]}
            onPress={handleCopy}
          >
            <Ionicons name="copy" size={24} color={colors.onPrimary} />
            <Text style={[styles.copyButtonText, { color: colors.onPrimary }]}>
              Copy to Clipboard
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  timestamp: {
    fontSize: 14,
    marginBottom: 24,
  },
  contentContainer: {
    minHeight: 100,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  imageContainer: {
    height: 200,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  imageText: {
    fontSize: 16,
    fontWeight: '500',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 16,
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
