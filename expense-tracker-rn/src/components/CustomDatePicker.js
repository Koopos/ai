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

const CustomDatePicker = ({ visible, initialDate, onConfirm, onCancel }) => {
    const [year, setYear] = useState(initialDate.getFullYear());
    const [month, setMonth] = useState(initialDate.getMonth() + 1);
    const [day, setDay] = useState(initialDate.getDate());

    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear; i++) {
        years.push({ label: `${i}年`, value: i });
    }

    const months = [];
    for (let i = 1; i <= 12; i++) {
        months.push({ label: `${i}月`, value: i });
    }

    const getDaysInMonth = (y, m) => {
        return new Date(y, m, 0).getDate();
    };

    const [days, setDays] = useState([]);

    useEffect(() => {
        const daysCount = getDaysInMonth(year, month);
        const newDays = [];
        for (let i = 1; i <= daysCount; i++) {
            newDays.push({ label: `${i}日`, value: i });
        }
        setDays(newDays);
        if (day > daysCount) {
            setDay(daysCount);
        }
    }, [year, month]);

    const handleConfirm = () => {
        const selectedDate = new Date(year, month - 1, day);
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
                                <Text style={styles.title}>选择日期</Text>
                                <TouchableOpacity onPress={handleConfirm}>
                                    <Text style={styles.confirmText}>确定</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.pickerContainer}>
                                <WheelPicker
                                    data={years}
                                    selectedValue={year}
                                    onValueChange={setYear}
                                />
                                <WheelPicker
                                    data={months}
                                    selectedValue={month}
                                    onValueChange={setMonth}
                                />
                                <WheelPicker
                                    data={days}
                                    selectedValue={day}
                                    onValueChange={setDay}
                                />
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
        borderBottomColor: 'rgba(0,0,0,0.1)',
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
        paddingHorizontal: 10,
        marginTop: 20,
    },
});

export default CustomDatePicker;
