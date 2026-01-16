import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import colors from '../constants/colors';
import WheelPicker from './WheelPicker';

const MonthYearPicker = ({ visible, initialDate, mode = 'month', onConfirm, onCancel }) => {
    const [year, setYear] = useState(initialDate.getFullYear());
    const [month, setMonth] = useState(initialDate.getMonth() + 1);

    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear; i++) {
        years.push({ label: `${i}年`, value: i });
    }

    const months = [];
    for (let i = 1; i <= 12; i++) {
        months.push({ label: `${i}月`, value: i });
    }

    const handleConfirm = () => {
        const selectedDate = new Date(year, month - 1, 1);
        onConfirm(selectedDate);
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalContent}>
                            <View style={styles.header}>
                                <TouchableOpacity onPress={onCancel}>
                                    <Text style={styles.cancelText}>取消</Text>
                                </TouchableOpacity>
                                <Text style={styles.title}>
                                    {mode === 'month' ? '选择月份' : '选择年份'}
                                </Text>
                                <TouchableOpacity onPress={handleConfirm}>
                                    <Text style={styles.confirmText}>确定</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={[
                                styles.pickerContainer,
                                mode === 'year' && { justifyContent: 'center' }
                            ]}>
                                <WheelPicker
                                    data={years}
                                    selectedValue={year}
                                    onValueChange={setYear}
                                />
                                {mode === 'month' && (
                                    <WheelPicker
                                        data={months}
                                        selectedValue={month}
                                        onValueChange={setMonth}
                                    />
                                )}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.backgroundSecondary,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    cancelText: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    confirmText: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '600',
    },
    pickerContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 20,
    },
});

export default MonthYearPicker;
