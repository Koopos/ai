import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import colors, { gradients } from '../constants/colors';
import { getExpenses, deleteExpense, getStats } from '../services/storage';
import { formatAmount, getMonthStart, getMonthEnd } from '../utils/helpers';
import ExpenseItem from '../components/ExpenseItem';

const HomeScreen = ({ navigation }) => {
    const [expenses, setExpenses] = useState([]);
    const [monthTotal, setMonthTotal] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        const allExpenses = await getExpenses();
        setExpenses(allExpenses.slice(0, 10)); // 只显示最近10条

        const stats = await getStats(getMonthStart(), getMonthEnd());
        setMonthTotal(stats.total);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleDelete = async (id) => {
        await deleteExpense(id);
        loadData();
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.balanceCard}
            >
                <Text style={styles.balanceLabel}>本月支出</Text>
                <Text style={styles.balanceAmount}>{formatAmount(monthTotal)}</Text>
                <View style={styles.balanceFooter}>
                    <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.balanceDate}>
                        {new Date().getFullYear()}年{new Date().getMonth() + 1}月
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>最近记录</Text>
                <TouchableOpacity onPress={() => navigation.navigate('History')}>
                    <Text style={styles.seeAll}>查看全部</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.empty}>
            <Ionicons name="wallet-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>暂无支出记录</Text>
            <Text style={styles.emptySubtext}>点击下方按钮添加第一笔支出</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={expenses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ExpenseItem
                        expense={item}
                        onDelete={handleDelete}
                        onPress={() => navigation.navigate('Add', { expense: item })}
                    />
                )}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    list: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        marginBottom: 20,
    },
    balanceCard: {
        borderRadius: 24,
        padding: 28,
        marginBottom: 28,
    },
    balanceLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        marginBottom: 8,
    },
    balanceAmount: {
        color: '#fff',
        fontSize: 42,
        fontWeight: '700',
        letterSpacing: -1,
    },
    balanceFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    balanceDate: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        marginLeft: 6,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: '700',
    },
    seeAll: {
        color: colors.primary,
        fontSize: 14,
    },
    empty: {
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: 16,
        marginTop: 16,
    },
    emptySubtext: {
        color: colors.textMuted,
        fontSize: 13,
        marginTop: 4,
    },
});

export default HomeScreen;
