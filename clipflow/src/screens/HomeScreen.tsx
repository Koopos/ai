import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ClipboardItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useClipboard } from '../hooks/useClipboard';
import { useDebounce } from '../hooks/useDebounce';
import { ClipboardCard } from '../components/ClipboardCard';
import { SearchBar } from '../components/SearchBar';
import { FilterChips } from '../components/FilterChips';
import { EmptyState } from '../components/EmptyState';
import { DetailModal } from '../components/DetailModal';
import * as Haptics from 'expo-haptics';

export const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const { history, loading, copyToClipboard, pinItem, deleteItem, updateItem } =
    useClipboard();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'text' | 'image' | 'url' | 'pinned'>('all');
  const [selectedItem, setSelectedItem] = useState<ClipboardItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredHistory = useMemo(() => {
    let items = history;

    // Apply filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'pinned') {
        items = items.filter((item) => item.pinned);
      } else {
        items = items.filter((item) => item.type === selectedFilter);
      }
    }

    // Apply search
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      items = items.filter(
        (item) =>
          item.content.toLowerCase().includes(query) ||
          item.preview?.toLowerCase().includes(query)
      );
    }

    return items;
  }, [history, selectedFilter, debouncedSearch]);

  const handleCardPress = (item: ClipboardItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCardLongPress = (item: ClipboardItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    copyToClipboard(item.content);
  };

  const handlePin = async (id: string) => {
    await pinItem(id);
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
  };

  const handleUpdate = async (id: string, content: string) => {
    await updateItem(id, content);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderCard = ({ item, index }: { item: ClipboardItem; index: number }) => (
    <ClipboardCard
      item={item}
      onPress={() => handleCardPress(item)}
      onLongPress={() => handleCardLongPress(item)}
      onPinPress={() => handlePin(item.id)}
      width={340}
    />
  );

  const renderEmptyState = () => {
    if (loading) {
      return null;
    }

    if (debouncedSearch) {
      return <EmptyState title="No Results" message="No items match your search" />;
    }

    if (selectedFilter !== 'all') {
      return (
        <EmptyState
          title={`No ${selectedFilter} items`}
          message={`You haven't copied any ${selectedFilter} yet`}
        />
      );
    }

    return (
      <EmptyState
        title="Clipboard is Empty"
        message="Copy something to get started"
        icon="clipboard-outline"
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.outlineVariant }]}>
        <View style={styles.headerLeft}>
          <Ionicons name="clipboard" size={28} color={colors.primary} />
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.text }]}>ClipFlow</Text>
            </View>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              {filteredHistory.length} {filteredHistory.length === 1 ? 'item' : 'items'}
            </Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Filter Chips */}
      <FilterChips selectedFilter={selectedFilter} onSelectFilter={setSelectedFilter} />

      {/* Clipboard Cards */}
      {filteredHistory.length > 0 ? (
        <FlatList
          data={filteredHistory}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>{renderEmptyState()}</View>
      )}

      {/* Detail Modal */}
      <DetailModal
        visible={modalVisible}
        item={selectedItem}
        onClose={() => {
          setModalVisible(false);
          setSelectedItem(null);
        }}
        onCopy={copyToClipboard}
        onPin={handlePin}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
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
  titleContainer: {
    flexDirection: 'column',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
  },
});
