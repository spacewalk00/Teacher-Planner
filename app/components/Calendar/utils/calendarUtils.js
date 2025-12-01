/**
 * 달력 관련 유틸리티 함수들
 */

/**
 * 해당 월의 첫 번째 날 반환
 */
export const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1);
};

/**
 * 해당 월의 마지막 날 반환
 */
export const getLastDayOfMonth = (year, month) => {
    return new Date(year, month + 1, 0);
};

/**
 * 해당 월의 총 일수 반환
 */
export const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

/**
 * 해당 월 1일의 요일 반환 (0: 일요일 ~ 6: 토요일)
 */
export const getFirstDayOfWeek = (year, month) => {
    return new Date(year, month, 1).getDay();
};

/**
 * 두 날짜가 같은 날인지 확인
 */
export const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

/**
 * 오늘 날짜인지 확인
 */
export const isToday = (date) => {
    return isSameDay(date, new Date());
};

/**
 * 주말인지 확인 (토요일 또는 일요일)
 */
export const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
};

/**
 * 일요일인지 확인
 */
export const isSunday = (date) => {
    return date.getDay() === 0;
};

/**
 * 토요일인지 확인
 */
export const isSaturday = (date) => {
    return date.getDay() === 6;
};

/**
 * 날짜를 YYYY-MM-DD 형식의 문자열로 변환
 */
export const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * 월 이름 반환 (한국어)
 */
export const getMonthName = (month) => {
    const monthNames = [
        '1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'
    ];
    return monthNames[month];
};

/**
 * 요일 이름 배열 (한국어, 일요일 시작)
 */
export const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 요일 이름 배열 (한국어, 월요일 시작)
 */
export const WEEKDAY_NAMES_MON_START = ['월', '화', '수', '목', '금', '토', '일'];

