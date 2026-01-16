import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { getStats } from '../services/storage';
import MonthYearPicker from '../components/MonthYearPicker';
import { getCategoryById, categories } from '../constants/categories';
import {
    formatAmount,
    getMonthStart,
    getMonthEnd,
    getYearStart,
    getYearEnd
} from '../utils/helpers';

const { width } = Dimensions.get('window');

const StatsScreen = () => {
    const [stats, setStats] = useState({ total: 0, byCategory: {}, count: 0 });
    const [viewType, setViewType] = useState('month'); // 'month' | 'year'
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        const start = viewType === 'month' ? getMonthStart(selectedDate) : getYearStart(selectedDate);
        const end = viewType === 'month' ? getMonthEnd(selectedDate) : getYearEnd(selectedDate);
        const data = await getStats(start, end);
        setStats(data);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [viewType, selectedDate])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    // 获取排序后的分类统计
    const sortedCategories = Object.entries(stats.byCategory)
        .map(([id, amount]) => ({
            ...getCategoryById(id),
            amount,
            percentage: stats.total > 0 ? (amount / stats.total) * 100 : 0,
        }))
        .sort((a, b) => b.amount - a.amount);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={colors.primary}
                />
            }
        >
            {/* 统计周期切换 */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, viewType === 'month' && styles.toggleButtonActive]}
                    onPress={() => {
                        setViewType('month');
                        setSelectedDate(new Date());
                    }}
                >
                    <Text style={[styles.toggleText, viewType === 'month' && styles.toggleTextActive]}>
                        按月统计
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, viewType === 'year' && styles.toggleButtonActive]}
                    onPress={() => {
                        setViewType('year');
                        setSelectedDate(new Date());
                    }}
                >
                    <Text style={[styles.toggleText, viewType === 'year' && styles.toggleTextActive]}>
                        按年统计
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 总览卡片 */}
            <TouchableOpacity
                style={styles.summaryCard}
                onPress={() => setShowPicker(true)}
                activeOpacity={0.7}
            >
                <View style={[styles.periodBadge, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={styles.periodText}>
                        {viewType === 'month'
                            ? `${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月`
                            : `${selectedDate.getFullYear()}年`
                        }
                    </Text>
                    <Ionicons name="chevron-down" size={14} color={colors.primary} style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.summaryLabel}>
                    {viewType === 'month' ? '月度总支出' : '年度总支出'}
                </Text>
                <Text style={styles.summaryAmount}>{formatAmount(stats.total)}</Text>
                <Text style={styles.summaryCount}>共 {stats.count} 笔支出</Text>
            </TouchableOpacity>

            <MonthYearPicker
                visible={showPicker}
                initialDate={selectedDate}
                mode={viewType}
                onConfirm={(date) => {
                    setSelectedDate(date);
                    setShowPicker(false);
                }}
                onCancel={() => setShowPicker(false)}
            />

            {/* 分类统计 */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>分类明细</Text>

                {sortedCategories.length === 0 ? (
                    <View style={styles.empty}>
                        <Ionicons name="pie-chart-outline" size={48} color={colors.textMuted} />
                        <Text style={styles.emptyText}>暂无统计数据</Text>
                    </View>
                ) : (
                    sortedCategories.map((cat) => (
                        <View key={cat.id} style={styles.categoryItem}>
                            <View style={styles.categoryLeft}>
                                <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                                    <Ionicons name={cat.icon} size={20} color={cat.color} />
                                </View>
                                <View style={styles.categoryInfo}>
                                    <Text style={styles.categoryName}>{cat.name}</Text>
                                    <Text style={styles.categoryPercentage}>
                                        {cat.percentage.toFixed(1)}%
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.categoryAmount}>{formatAmount(cat.amount)}</Text>
                        </View>
                    ))
                )}

                {/* 简单柱形图 */}
                {sortedCategories.length > 0 && (
                    <View style={styles.barChart}>
                        {sortedCategories.slice(0, 5).map((cat) => (
                            <View key={cat.id} style={styles.barItem}>
                                <View style={styles.barContainer}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: `${Math.max(cat.percentage, 5)}%`,
                                                backgroundColor: cat.color,
                                            },
                                        ]}
                                    />
                                </View>
                                <View style={[styles.barIcon, { backgroundColor: cat.color + '20' }]}>
                                    <Ionicons name={cat.icon} size={16} color={cat.color} />
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    summaryCard: {
        backgroundColor: colors.card,
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
        marginBottom: 28,
    },
    summaryLabel: {
        color: colors.textSecondary,
        fontSize: 14,
        marginBottom: 8,
    },
    summaryAmount: {
        color: colors.textPrimary,
        fontSize: 42,
        fontWeight: '700',
        letterSpacing: -1,
    },
    summaryCount: {
        color: colors.textMuted,
        fontSize: 13,
        marginTop: 12,
    },
    section: {
        backgroundColor: colors.card,
        borderRadius: 20,
        padding: 20,
    },
    sectionTitle: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
    },
    empty: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        color: colors.textMuted,
        fontSize: 14,
        marginTop: 12,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    categoryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryInfo: {
        marginLeft: 12,
    },
    categoryName: {
        color: colors.textPrimary,
        fontSize: 15,
        fontWeight: '500',
    },
    categoryPercentage: {
        color: colors.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
    categoryAmount: {
        color: colors.textPrimary,
        fontSize: 15,
        fontWeight: '600',
    },
    barChart: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 120,
        marginTop: 24,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    barItem: {
        alignItems: 'center',
        width: (width - 80) / 5,
    },
    barContainer: {
        width: 24,
        height: 80,
        justifyContent: 'flex-end',
        marginBottom: 8,
    },
    bar: {
        width: '100%',
        borderRadius: 6,
        minHeight: 4,
    },
    barIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 16,
        padding: 4,
        marginBottom: 24,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    toggleButtonActive: {
        backgroundColor: colors.primary,
    },
    toggleText: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
    },
    toggleTextActive: {
        color: '#fff',
    },
    periodBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 12,
    },
    periodText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '700',
    },
});

export default StatsScreen;
