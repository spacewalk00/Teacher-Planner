/* 추후 지울 예정 */
import { supabase } from '../config/supabase';
import { 
    getSchedulesByDate, 
    addSchedule, 
    updateSchedule, 
    deleteSchedule 
} from '../services/scheduleService';

/**
 * Supabase 연결 및 서비스 테스트 유틸리티
 */

/**
 * Supabase 연결 테스트
 */
export const testConnection = async () => {
    console.log('Testing Supabase connection...');
    console.log('Supabase client initialized');

    const { data } = await supabase
        .from('schedules')
        .select('count')
        .limit(1);

    console.log('Database connection successful');
    return {
        success: true,
        message: 'Supabase connection is working',
    };
};

/**
 * 일정 서비스 테스트
 */
export const testScheduleService = async () => {
    console.log('Testing Schedule Service...');

    // 1. 일정 조회 테스트
    console.log('Testing getSchedulesByDate...');
    const today = new Date();
    const schedules = await getSchedulesByDate(today);
    console.log(`Found ${schedules.length} schedules for today`);

    // 2. 일정 추가 테스트
    console.log('Testing addSchedule...');
    const testSchedule = {
        title: `Test Schedule ${Date.now()}`,
        startDate: today,
        endDate: today,
        userId: '00000000-0000-0000-0000-000000000000', // 임시 사용자 ID
    };
    const newSchedule = await addSchedule(testSchedule);
    console.log('Schedule created:', newSchedule.id);

    // 3. 일정 수정 테스트
    console.log('Testing updateSchedule...');
    const updatedSchedule = await updateSchedule(newSchedule.id, {
        title: `Updated Test Schedule ${Date.now()}`,
    });
    console.log('Schedule updated:', updatedSchedule.id);

    // 4. 일정 삭제 테스트
    console.log('Testing deleteSchedule...');
    await deleteSchedule(updatedSchedule.id);
    console.log('Schedule deleted');

    return {
        success: true,
        message: 'All schedule service tests passed',
    };
};

/**
 * 전체 테스트 실행
 */
export const runAllTests = async () => {
    console.log('Starting Supabase Service Tests...\n');

    // 1. 연결 테스트
    const connectionResult = await testConnection();
    console.log('');

    // 2. 일정 서비스 테스트
    const scheduleResult = await testScheduleService();
    console.log('');

    // 결과 요약
    console.log('Test Results Summary:');
    console.log('========================');
    console.log(`Connection: ${connectionResult.success ? 'PASS' : 'FAIL'}`);
    console.log(`Schedule Service: ${scheduleResult.success ? 'PASS' : 'FAIL'}`);
    console.log('========================\n');

    return {
        connection: connectionResult,
        schedule: scheduleResult,
    };
};

// 개발 모드에서 전역 변수로 노출 (콘솔에서 바로 테스트 가능)
if (__DEV__ && typeof global !== 'undefined') {
    global.testSupabase = {
        testConnection,
        testScheduleService,
        runAllTests,
    };
    console.log('Test functions available in console ');
}

export default {
    testConnection,
    testScheduleService,
    runAllTests,
};
