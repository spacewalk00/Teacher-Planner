import { useState, useEffect, useCallback } from 'react';
import { fetchPublicHolidays, getCachedHolidays, cacheHolidays } from '../utils/publicHolidayApi';
import { formatDateToString } from '../utils/calendarUtils';

/**
 * 공휴일 정보를 가져오는 훅
 * 항상 공공데이터 포털 API를 사용하여 공휴일 정보를 가져옵니다.
 * @param {number} year - 연도
 * @returns {Object} { holidays: 공휴일 맵, isHoliday: 공휴일 확인 함수, loading: 로딩 상태, error: 에러 정보 }
 */
export const useHolidays = (year) => {
    const [holidays, setHolidays] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 컴포넌트 언마운트 후 비동기 작업 완료 시 상태 업데이트 방지
        let isMounted = true;

        const loadHolidays = async () => {
            setLoading(true);
            setError(null);

            try {
                // 1. 캐시에서 먼저 확인
                const cachedHolidays = await getCachedHolidays(year);
                if (cachedHolidays && isMounted) {
                    // 캐시가 있으면 그대로 사용
                    setHolidays(cachedHolidays);
                    setLoading(false);
                    return;
                }

                // 2. 공공데이터 API로 최신 정보 가져오기
                const apiHolidays = await fetchPublicHolidays(year);
                
                if (isMounted) {
                    // 캐시에 저장
                    await cacheHolidays(year, apiHolidays);
                    setHolidays(apiHolidays);
                    setLoading(false);
                }
            } catch (err) {
                console.error('공공데이터 API 로드 실패:', err);
                if (isMounted) {
                    setError(err.message || '공휴일 정보를 불러오는데 실패했습니다.');
                    setHolidays({});
                    setLoading(false);
                }
            }
        };

        loadHolidays();

        return () => {
            // cleanup: 컴포넌트 언마운트 시 플래그 설정
            isMounted = false;
        };
    }, [year]);

    /**
     * 특정 날짜가 공휴일인지 확인
     * @param {Date} date - 확인할 날짜
     * @returns {string|null} 공휴일명 또는 null
     */
    const isHoliday = useCallback((date) => {
        const dateStr = formatDateToString(date);
        return holidays[dateStr] || null;
    }, [holidays]);

    return { holidays, isHoliday, loading, error };
};

export default useHolidays;

