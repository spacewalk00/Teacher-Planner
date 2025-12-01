import React from 'react';
import { View } from 'react-native';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import useCalendar from './hooks/useCalendar';

/**
 * 달력 메인 컴포넌트
 * 5줄 고정 달력
 */
const Calendar = ({
    initialDate,
    onDateSelect,
    renderDayContent,
}) => {
    const {
        year,
        month,
        calendarDays,
        selectedDate,
        goToPrevMonth,
        goToNextMonth,
        goToToday,
        selectDate,
    } = useCalendar(initialDate);

    const handleDateSelect = (date) => {
        selectDate(date);
        onDateSelect?.(date);
    };

    return (
        <View className="bg-background rounded-2xl overflow-hidden shadow-lg">
            <CalendarHeader
                year={year}
                month={month}
                onPrevMonth={goToPrevMonth}
                onNextMonth={goToNextMonth}
                onToday={goToToday}
            />
            <CalendarGrid
                calendarDays={calendarDays}
                selectedDate={selectedDate}
                onSelectDate={handleDateSelect}
                renderDayContent={renderDayContent}
            />
        </View>
    );
};

export default Calendar;
