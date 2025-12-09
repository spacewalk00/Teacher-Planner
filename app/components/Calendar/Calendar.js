import React from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import useCalendar from './hooks/useCalendar';

/**
 * 달력 메인 컴포넌트
 * 5줄 고정 달력 + 스와이프로 월 이동
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

    // Fling 제스처 (빠른 스와이프) - 월 이동용
    const flingLeft = Gesture.Fling()
        .direction(1) // 왼쪽으로 스와이프 (이전 달)
        .onEnd(() => {
            goToPrevMonth();
        });

    const flingRight = Gesture.Fling()
        .direction(2) // 오른쪽으로 스와이프 (다음 달)
        .onEnd(() => {
            goToNextMonth();
        });

    // 두 제스처를 동시에 감지
    const composedGesture = Gesture.Race(flingLeft, flingRight);

    return (
        <GestureDetector gesture={composedGesture}>
            <View className="flex-1 bg-background rounded-2xl overflow-hidden shadow-lg">
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
        </GestureDetector>
    );
};

export default Calendar;
