import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMonthName } from './utils/calendarUtils';
import { colors } from '../../constants/colors';

/**
 * 달력 헤더 컴포넌트
 */
const CalendarHeader = memo(({
    year,
    month,
    onPrevMonth,
    onNextMonth,
    onToday,
}) => {
    return (
        <View className="flex-row items-center justify-between py-4 px-2 bg-background">
            <TouchableOpacity
                className="w-11 h-11 rounded-full bg-primary-50 items-center justify-center"
                onPress={onPrevMonth}
                activeOpacity={0.7}
            >
                <Ionicons 
                    name="chevron-back" 
                    size={24} 
                    color={colors.primary.DEFAULT} 
                />
            </TouchableOpacity>

            <TouchableOpacity 
                className="items-center px-5 py-2 rounded-xl"
                onPress={onToday}
                activeOpacity={0.7}
            >
                <Text className="text-sm text-neutral font-medium">{year}년</Text>
                <Text className="text-2xl font-bold text-primary-dark mt-0.5">
                    {getMonthName(month)}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="w-11 h-11 rounded-full bg-primary-50 items-center justify-center"
                onPress={onNextMonth}
                activeOpacity={0.7}
            >
                <Ionicons 
                    name="chevron-forward" 
                    size={24} 
                    color={colors.primary.DEFAULT} 
                />
            </TouchableOpacity>
        </View>
    );
});

CalendarHeader.displayName = 'CalendarHeader';

export default CalendarHeader;
