import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { isToday, isSunday, isSaturday } from './utils/calendarUtils';

/**
 * 날짜 셀 컴포넌트
 */
const DayCell = memo(({ 
    dayInfo, 
    isSelected, 
    onPress,
    children,
}) => {
    const { date, day, isCurrentMonth } = dayInfo;
    const today = isToday(date);
    const sunday = isSunday(date);
    const saturday = isSaturday(date);

    // 셀 배경 클래스
    const getCellClassName = () => {
        const base = 'flex-1 min-h-[60px] p-1 rounded-lg m-0.5';
        
        if (isSelected) {
            return `${base} bg-primary-100 border-2 border-primary`;
        }
        if (today) {
            return `${base} bg-secondary-light`;
        }
        return `${base} ${isCurrentMonth ? 'bg-background' : 'bg-neutral-100'}`;
    };

    // 텍스트 색상 클래스
    const getTextClassName = () => {
        const base = today ? 'text-sm font-bold' : 'text-sm font-medium';
        
        if (today) {
            return `${base} text-primary-dark`;
        }
        if (!isCurrentMonth) {
            return `${base} text-neutral-300`;
        }
        if (sunday) {
            return `${base} text-error`;
        }
        if (saturday) {
            return `${base} text-primary`;
        }
        return `${base} text-neutral-800`;
    };

    return (
        <TouchableOpacity
            className={getCellClassName()}
            onPress={() => onPress?.(date)}
            activeOpacity={0.7}
        >
            <View className="items-start">
                <Text className={getTextClassName()}>
                    {day}
                </Text>
            </View>
            <View className="flex-1 mt-0.5">
                {children}
            </View>
        </TouchableOpacity>
    );
});

DayCell.displayName = 'DayCell';

export default DayCell;
