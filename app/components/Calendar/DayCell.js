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
    const { date, day, isCurrentMonth, holiday } = dayInfo;
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
        // 공휴일이면 빨간색 (일요일과 동일)
        if (holiday || sunday) {
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
                {/* 공휴일 이름 표시 */}
                {holiday && isCurrentMonth && (
                    <Text className="text-[8px] text-error mt-0.5" numberOfLines={1}>
                        {holiday}
                    </Text>
                )}
            </View>
            <View className="flex-1 mt-0.5">
                {children}
            </View>
        </TouchableOpacity>
    );
});

DayCell.displayName = 'DayCell';

export default DayCell;
