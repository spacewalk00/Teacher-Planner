import React, { memo } from 'react';
import { View, Text } from 'react-native';
import DayCell from './DayCell';
import { WEEKDAY_NAMES, isSameDay } from './utils/calendarUtils';

/**
 * 달력 그리드 컴포넌트
 */
const CalendarGrid = memo(({
    calendarDays,
    selectedDate,
    onSelectDate,
    renderDayContent,
}) => {
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
        weeks.push(calendarDays.slice(i, i + 7));
    }

    return (
        <View className="flex-1 bg-background">
            {/* 요일 헤더 */}
            <View className="flex-row py-3 border-b border-neutral-200 mx-1">
                {WEEKDAY_NAMES.map((name, index) => (
                    <View key={name} className="flex-1 items-center">
                        <Text className={`text-sm font-semibold ${
                            index === 0 ? 'text-error' : 
                            index === 6 ? 'text-primary' : 
                            'text-neutral'
                        }`}>
                            {name}
                        </Text>
                    </View>
                ))}
            </View>

            {/* 날짜 그리드 */}
            <View className="flex-1 px-1 py-1">
                {weeks.map((week, weekIndex) => (
                    <View key={weekIndex} className="flex-1 flex-row">
                        {week.map((dayInfo) => (
                            <DayCell
                                key={dayInfo.key}
                                dayInfo={dayInfo}
                                isSelected={selectedDate && isSameDay(dayInfo.date, selectedDate)}
                                onPress={onSelectDate}
                            >
                                {renderDayContent?.(dayInfo)}
                            </DayCell>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
});

CalendarGrid.displayName = 'CalendarGrid';

export default CalendarGrid;
