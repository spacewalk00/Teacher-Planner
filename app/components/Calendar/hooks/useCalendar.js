import { useState, useMemo, useCallback } from 'react';
import {
    getDaysInMonth,
    getFirstDayOfWeek,
    formatDateToString,
} from '../utils/calendarUtils';
import useHolidays from './useHolidays';

/**
 * 5줄 고정 달력 훅
 * 항상 35개(5주 × 7일)의 날짜 셀을 반환
 */
export const useCalendar = (initialDate = new Date()) => {
    const [currentDate, setCurrentDate] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 공휴일 정보 가져오기
    const { holidays } = useHolidays(year);

    /**
     * 5줄 고정 달력 날짜 배열 생성
     * 이전 달, 현재 달, 다음 달 날짜를 포함하여 35개 셀 반환
     */
    const calendarDays = useMemo(() => {
        const days = [];
        const firstDayOfWeek = getFirstDayOfWeek(year, month);
        const daysInCurrentMonth = getDaysInMonth(year, month);
        const daysInPrevMonth = getDaysInMonth(year, month - 1);

        const TOTAL_CELLS = 35; // 5줄 × 7일

        // 이전 달 날짜 채우기
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const date = new Date(year, month - 1, day);
            const dateKey = formatDateToString(date);
            days.push({
                date,
                day,
                isCurrentMonth: false,
                isPrevMonth: true,
                isNextMonth: false,
                key: dateKey,
                holiday: holidays[dateKey] || null,
            });
        }

        // 현재 달 날짜 채우기
        for (let day = 1; day <= daysInCurrentMonth; day++) {
            const date = new Date(year, month, day);
            const dateKey = formatDateToString(date);
            days.push({
                date,
                day,
                isCurrentMonth: true,
                isPrevMonth: false,
                isNextMonth: false,
                key: dateKey,
                holiday: holidays[dateKey] || null,
            });
        }

        // 다음 달 날짜 채우기 (35개까지)
        const remainingCells = TOTAL_CELLS - days.length;
        for (let day = 1; day <= remainingCells; day++) {
            const date = new Date(year, month + 1, day);
            const dateKey = formatDateToString(date);
            days.push({
                date,
                day,
                isCurrentMonth: false,
                isPrevMonth: false,
                isNextMonth: true,
                key: dateKey,
                holiday: holidays[dateKey] || null,
            });
        }

        return days;
    }, [year, month, holidays]);

    /**
     * 이전 달로 이동
     */
    const goToPrevMonth = useCallback(() => {
        setCurrentDate(new Date(year, month - 1, 1));
    }, [year, month]);

    /**
     * 다음 달로 이동
     */
    const goToNextMonth = useCallback(() => {
        setCurrentDate(new Date(year, month + 1, 1));
    }, [year, month]);

    /**
     * 오늘로 이동
     */
    const goToToday = useCallback(() => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
    }, []);

    /**
     * 특정 연/월로 이동
     */
    const goToMonth = useCallback((targetYear, targetMonth) => {
        setCurrentDate(new Date(targetYear, targetMonth, 1));
    }, []);

    /**
     * 날짜 선택
     */
    const selectDate = useCallback((date) => {
        setSelectedDate(date);
    }, []);

    return {
        // 상태
        currentDate,
        selectedDate,
        year,
        month,
        calendarDays,

        // 액션
        goToPrevMonth,
        goToNextMonth,
        goToToday,
        goToMonth,
        selectDate,
    };
};

export default useCalendar;

