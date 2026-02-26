import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Text', value: 'text' },
  { label: 'Images', value: 'image' },
  { label: 'Links', value: 'url' },
  { label: 'Pinned', value: 'pinned' },
];

interface FilterChipsProps {
  selectedFilter: string;
  onSelectFilter: (filter: any) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  selectedFilter,
  onSelectFilter,
}) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((filter) => {
        const isSelected = selectedFilter === filter.value;
        return (
          <TouchableOpacity
            key={filter.value}
            onPress={() => onSelectFilter(filter.value)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.primary : colors.surfaceVariant,
                borderColor: colors.outlineVariant,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: isSelected ? colors.onPrimary : colors.textSecondary,
                },
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
