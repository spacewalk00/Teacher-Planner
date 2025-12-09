import { PUBLIC_DATA_API_KEY, PUBLIC_DATA_API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseString } from 'react-native-xml2js';
import { formatDateToString } from './calendarUtils';

/**
 * locdate (YYYYMMDD)를 Date 객체로 변환한 후 YYYY-MM-DD 형식으로 변환
 */
const formatLocdate = (locdate) => {
    if (typeof locdate === 'number') {
        locdate = String(locdate);
    }
    if (locdate.length === 8) {
        const year = parseInt(locdate.substring(0, 4), 10);
        const month = parseInt(locdate.substring(4, 6), 10) - 1; // 월은 0부터 시작
        const day = parseInt(locdate.substring(6, 8), 10);
        const date = new Date(year, month, day);
        return formatDateToString(date);
    }
    return locdate;
};

/**
 * XML 응답을 파싱하여 공휴일 데이터 추출
 */
const parseHolidayXML = (xmlText) => {
    return new Promise((resolve, reject) => {
        parseString(xmlText, (err, result) => {
            if (err) {
                console.error('XML parsing error:', err);
                reject(err);
                return;
            }

            const holidayMap = {};
            
            try {
                const response = result.response;
                const body = response?.body?.[0];
                const items = body?.items?.[0]?.item || [];
                
                // items가 배열이 아닌 경우 처리
                const itemArray = Array.isArray(items) ? items : [items];
                
                itemArray.forEach((item) => {
                    const isHoliday = item.isHoliday?.[0];
                    const locdate = item.locdate?.[0];
                    const dateName = item.dateName?.[0];
                    
                    if (isHoliday === 'Y' && locdate && dateName) {
                        const dateStr = formatLocdate(locdate);
                        holidayMap[dateStr] = dateName.trim();
                    }
                });
                
                resolve(holidayMap);
            } catch (error) {
                console.error('Error processing XML data:', error);
                reject(error);
            }
        });
    });
};

/**
 * 공공데이터 API에서 공휴일 정보 가져오기
 * @param {number} year - 연도
 * @param {number|null} month - 월 (선택사항, null이면 전체 연도)
 * @returns {Promise<Object>} 공휴일 맵 { 'YYYY-MM-DD': '공휴일명' }
 */
export const fetchPublicHolidays = async (year, month = null) => {
    // API 키 확인
    if (!PUBLIC_DATA_API_KEY || PUBLIC_DATA_API_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error('공공데이터 API 키가 설정되지 않았습니다. PUBLIC_DATA_API_KEY를 확인하세요.');
    }

    // API URL 확인
    if (!PUBLIC_DATA_API_URL) {
        throw new Error('공공데이터 API URL이 설정되지 않았습니다. PUBLIC_DATA_API_URL을 확인하세요.');
    }

    try {
        const params = new URLSearchParams({
            serviceKey: decodeURIComponent(PUBLIC_DATA_API_KEY),
            solYear: year.toString(),
            numOfRows: '100',
            pageNo: '1',
        });

        if (month !== null) {
            params.append('solMonth', String(month).padStart(2, '0'));
        }

        const url = `${PUBLIC_DATA_API_URL}?${params.toString()}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API 요청 실패: ${response.status}`);
        }

        const xmlText = await response.text();
        
        // XML 에러 응답 확인
        if (xmlText.includes('<resultCode>') && !xmlText.includes('<resultCode>00</resultCode>')) {
            const errorMatch = xmlText.match(/<resultMsg>([^<]+)<\/resultMsg>/);
            const errorMsg = errorMatch ? errorMatch[1] : '알 수 없는 오류';
            throw new Error(`API 오류: ${errorMsg}`);
        }

        // XML 파싱
        const holidayMap = await parseHolidayXML(xmlText);
        console.log('holidayMap:: ', holidayMap);
        
        return holidayMap;
    } catch (error) {
        console.error('Failed to fetch public holidays:', error);
        throw error;
    }
};

/**
 * 캐시 키 생성
 */
const getCacheKey = (year) => `holidays_${year}`;

/**
 * 공휴일 데이터를 캐시에 저장
 */
export const cacheHolidays = async (year, holidays) => {
    try {
        const cacheData = {
            holidays,
            cachedAt: new Date().toISOString(),
            year,
        };
        await AsyncStorage.setItem(getCacheKey(year), JSON.stringify(cacheData));
    } catch (error) {
        console.warn('Failed to cache holidays:', error);
    }
};

/**
 * 연도별 캐시 유효기간 계산
 * - 과거 연도: 1년 (변경 불가능)
 * - 현재 연도: 30일 (정부 발표 가능)
 * - 미래 연도: 7일 (변경 가능성 높음)
 */
const getCacheExpiryDays = (year) => {
    const currentYear = new Date().getFullYear();
    
    if (year < currentYear) {
        // 과거 연도: 변경 불가능하므로 1년 캐시
        return 365;
    } else if (year === currentYear) {
        // 현재 연도: 정부 발표 가능하므로 30일 캐시
        return 30;
    } else {
        // 미래 연도: 변경 가능성이 높으므로 7일 캐시
        return 7;
    }
};

/**
 * 캐시에서 공휴일 데이터 가져오기
 */
export const getCachedHolidays = async (year) => {
    try {
        const cached = await AsyncStorage.getItem(getCacheKey(year));
        if (!cached) return null;

        const cacheData = JSON.parse(cached);
        const cachedAt = new Date(cacheData.cachedAt);
        const now = new Date();
        const daysDiff = (now - cachedAt) / (1000 * 60 * 60 * 24);

        // 연도별 캐시 유효기간 확인
        const expiryDays = getCacheExpiryDays(year);
        if (daysDiff < expiryDays) {
            return cacheData.holidays;
        }

        return null;
    } catch (error) {
        console.warn('Failed to get cached holidays:', error);
        return null;
    }
};

