import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import colors from '../constants/colors';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;

const WheelPicker = ({ data, selectedValue, onValueChange }) => {
    const scrollViewRef = useRef(null);
    const isInternalUpdate = useRef(false);
    const [activeIndex, setActiveIndex] = React.useState(
        data.findIndex(item => item.value === selectedValue)
    );

    useEffect(() => {
        const index = data.findIndex(item => item.value === selectedValue);
        if (index !== -1 && index !== activeIndex) {
            setActiveIndex(index);
            // Only scroll if this was an external update
            if (!isInternalUpdate.current) {
                const timer = setTimeout(() => {
                    scrollViewRef.current?.scrollTo({
                        y: index * ITEM_HEIGHT,
                        animated: true,
                    });
                }, 50);
                return () => clearTimeout(timer);
            }
        }
    }, [selectedValue, data]);

    const handleValueChange = (index) => {
        if (index >= 0 && index < data.length) {
            setActiveIndex(index);
            isInternalUpdate.current = true;
            onValueChange(data[index].value);
            // Reset after a short delay so external changes can still trigger scrollTo
            setTimeout(() => {
                isInternalUpdate.current = false;
            }, 100);
        }
    };

    const onMomentumScrollEnd = (event) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / ITEM_HEIGHT);
        // Force alignment to exactly match ITEM_HEIGHT multiples
        scrollViewRef.current?.scrollTo({
            y: index * ITEM_HEIGHT,
            animated: true,
        });
        handleValueChange(index);
    };

    const handleScroll = (event) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / ITEM_HEIGHT);
        if (index >= 0 && index < data.length && index !== activeIndex) {
            setActiveIndex(index);
            // We only update parent state on scroll if we want ultra-responsive UI,
            // but it's safer to do it on momentum end or just keep local state for highlighting
            // and sync on momentum end. However, user wants "dynamic" and "confirm uses latest".
            // Let's sync parent state in handleScroll too.
            isInternalUpdate.current = true;
            onValueChange(data[index].value);
            setTimeout(() => {
                isInternalUpdate.current = false;
            }, 100);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.highlightOverlay} />
            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                snapToAlignment="start"
                decelerationRate="fast"
                onMomentumScrollEnd={onMomentumScrollEnd}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                nestedScrollEnabled={true}
                contentContainerStyle={{
                    paddingVertical: ITEM_HEIGHT * 2,
                }}
            >
                {data.map((item, index) => {
                    const isSelected = index === activeIndex;
                    return (
                        <View key={item.value} style={styles.item}>
                            <Text style={[
                                styles.itemText,
                                isSelected && styles.selectedItemText
                            ]}>
                                {item.label}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        width: '33%',
    },
    highlightOverlay: {
        position: 'absolute',
        top: ITEM_HEIGHT * 2,
        left: 0,
        right: 0,
        height: ITEM_HEIGHT,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 8,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    item: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        // Ensure no extra padding interferes with centering
        padding: 0,
        margin: 0,
    },
    itemText: {
        fontSize: 18,
        color: colors.textSecondary,
        textAlign: 'center',
        textAlignVertical: 'center',
        includeFontPadding: false,
    },
    selectedItemText: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.primary,
        textAlign: 'center',
        textAlignVertical: 'center',
        includeFontPadding: false,
    },
});

export default WheelPicker;
