import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomDatePicker from '../components/CustomDatePicker';
import colors from '../constants/colors';
import CategoryPicker from '../components/CategoryPicker';
import { saveExpense, updateExpense } from '../services/storage';

const AddExpenseScreen = ({ navigation, route }) => {
    const existingExpense = route.params?.expense;
    const isEditing = !!existingExpense;

    const [amount, setAmount] = useState(existingExpense ? existingExpense.amount.toString() : '');
    const [categoryId, setCategoryId] = useState(existingExpense ? existingExpense.categoryId : 'food');
    const [note, setNote] = useState(existingExpense ? existingExpense.note : '');
    const [date, setDate] = useState(existingExpense ? new Date(existingExpense.date) : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: isEditing ? '编辑支出' : '记一笔',
        });
    }, [navigation, isEditing]);

    const handleAmountChange = (text) => {
        // 只允许数字和小数点
        const cleaned = text.replace(/[^0-9.]/g, '');
        // 只允许一个小数点
        const parts = cleaned.split('.');
        if (parts.length > 2) return;
        // 限制小数位数为2
        if (parts[1] && parts[1].length > 2) return;
        setAmount(cleaned);
    };

    const onDateConfirm = (selectedDate) => {
        setDate(selectedDate);
        setShowDatePicker(false);
    };

    const handleSave = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert('提示', '请输入有效金额');
            return;
        }

        setLoading(true);
        try {
            const expenseData = {
                amount: parseFloat(amount),
                categoryId,
                note: note.trim(),
                date: date.toISOString(),
            };

            if (isEditing) {
                await updateExpense({
                    ...expenseData,
                    id: existingExpense.id,
                });
            } else {
                await saveExpense(expenseData);
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('错误', '保存失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.content}>
                {/* 金额输入 */}
                <View style={styles.amountSection}>
                    <Text style={styles.currencySymbol}>¥</Text>
                    <TextInput
                        style={styles.amountInput}
                        value={amount}
                        onChangeText={handleAmountChange}
                        placeholder="0.00"
                        placeholderTextColor={colors.textMuted}
                        keyboardType="decimal-pad"
                        autoFocus={!isEditing}
                    />
                </View>

                {/* 分类选择 */}
                <CategoryPicker selectedId={categoryId} onSelect={setCategoryId} />

                {/* 备注输入 */}
                <View style={styles.noteSection}>
                    <Text style={styles.label}>日期</Text>
                    <TouchableOpacity
                        style={styles.dateSelector}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                        <Text style={styles.dateText}>
                            {date.toLocaleDateString('zh-CN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <CustomDatePicker
                            visible={showDatePicker}
                            initialDate={date}
                            onConfirm={onDateConfirm}
                            onCancel={() => setShowDatePicker(false)}
                        />
                    )}
                </View>

                {/* 备注输入 */}
                <View style={styles.noteSection}>
                    <Text style={styles.label}>备注</Text>
                    <TextInput
                        style={styles.noteInput}
                        value={note}
                        onChangeText={setNote}
                        placeholder="添加备注（可选）"
                        placeholderTextColor={colors.textMuted}
                        maxLength={50}
                    />
                </View>

                {/* 保存按钮 */}
                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Ionicons name="checkmark" size={24} color="#fff" />
                    <Text style={styles.saveButtonText}>
                        {loading ? '保存中...' : '保存'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 20,
        paddingTop: 40,
    },
    amountSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        paddingVertical: 20,
    },
    currencySymbol: {
        color: colors.primary,
        fontSize: 36,
        fontWeight: '300',
        marginRight: 8,
    },
    amountInput: {
        color: colors.textPrimary,
        fontSize: 56,
        fontWeight: '700',
        minWidth: 100,
        textAlign: 'center',
    },
    label: {
        color: colors.textSecondary,
        fontSize: 14,
        marginBottom: 12,
        marginLeft: 4,
    },
    noteSection: {
        marginBottom: 40,
    },
    noteInput: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        color: colors.textPrimary,
        fontSize: 16,
    },
    dateSelector: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        color: colors.textPrimary,
        fontSize: 16,
        marginLeft: 12,
    },
    saveButton: {
        backgroundColor: colors.primary,
        borderRadius: 16,
        padding: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default AddExpenseScreen;
