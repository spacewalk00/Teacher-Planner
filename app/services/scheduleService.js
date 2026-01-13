import { supabase } from '../config/supabase';
import { formatDateToString } from '../components/Calendar/utils/calendarUtils';

/**
 * 일정 서비스
 * Supabase Postgres를 사용하여 일정 데이터 관리
 */

/**
 * 일정 데이터 구조
 * {
 *   id: UUID,
 *   user_id: UUID,
 *   title: string,
 *   start_date: Date (YYYY-MM-DD),
 *   end_date: Date (YYYY-MM-DD),
 *   category: string | null,
 *   description: string | null,
 *   created_at: timestamp,
 *   updated_at: timestamp,
 * }
 */

/**
 * 특정 날짜의 일정 목록 조회
 * @param {Date} date - 조회할 날짜
 * @returns {Promise<Array>} 해당 날짜의 일정 목록
 */
export const getSchedulesByDate = async (date) => {
    try {
        const dateString = formatDateToString(date);
        
        const { data, error } = await supabase
            .from('schedules')
            .select('*')
            .lte('start_date', dateString)
            .gte('end_date', dateString)
            .order('start_date', { ascending: true })
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching schedules:', error);
            throw error;
        }

        // Date 객체로 변환
        return data.map(schedule => ({
            ...schedule,
            startDate: new Date(schedule.start_date),
            endDate: new Date(schedule.end_date),
            createdAt: new Date(schedule.created_at),
            updatedAt: new Date(schedule.updated_at),
        }));
    } catch (error) {
        console.error('Failed to fetch schedules by date:', error);
        throw error;
    }
};

/**
 * 특정 날짜 범위의 일정 목록 조회
 * @param {Date} startDate - 시작 날짜
 * @param {Date} endDate - 종료 날짜
 * @returns {Promise<Array>} 해당 날짜 범위의 일정 목록
 */
export const getSchedulesByDateRange = async (startDate, endDate) => {
    try {
        const startDateString = formatDateToString(startDate);
        const endDateString = formatDateToString(endDate);

        const { data, error } = await supabase
            .from('schedules')
            .select('*')
            .lte('start_date', endDateString)
            .gte('end_date', startDateString)
            .order('start_date', { ascending: true });

        if (error) {
            console.error('Error fetching schedules:', error);
            throw error;
        }

        return data.map(schedule => ({
            ...schedule,
            startDate: new Date(schedule.start_date),
            endDate: new Date(schedule.end_date),
            createdAt: new Date(schedule.created_at),
            updatedAt: new Date(schedule.updated_at),
        }));
    } catch (error) {
        console.error('Failed to fetch schedules by date range:', error);
        throw error;
    }
};

/**
 * 일정 추가
 * @param {Object} schedule - 추가할 일정 데이터
 * @returns {Promise<Object>} 생성된 일정
 */
export const addSchedule = async (schedule) => {
    try {
        const { title, startDate, endDate, userId } = schedule;

        // 날짜 검증
        if (new Date(startDate) > new Date(endDate)) {
            throw new Error('endDate must be greater than or equal to startDate');
        }

        // 임시 사용자 ID (인증 구현 전까지)
        const finalUserId = userId || '00000000-0000-0000-0000-000000000000';

        const scheduleData = {
            user_id: finalUserId,
            title,
            start_date: formatDateToString(startDate),
            end_date: formatDateToString(endDate),
        };

        const { data, error } = await supabase
            .from('schedules')
            .insert([scheduleData])
            .select()
            .single();

        if (error) {
            console.error('Error creating schedule:', error);
            throw error;
        }

        return {
            ...data,
            startDate: new Date(data.start_date),
            endDate: new Date(data.end_date),
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
        };
    } catch (error) {
        console.error('Failed to add schedule:', error);
        throw error;
    }
};

/**
 * 일정 수정
 * @param {string} id - 일정 ID
 * @param {Object} updates - 수정할 데이터
 * @returns {Promise<Object>} 수정된 일정
 */
export const updateSchedule = async (id, updates) => {
    try {
        const updateData = {};

        if (updates.title !== undefined) updateData.title = updates.title;
        if (updates.startDate !== undefined) updateData.start_date = formatDateToString(updates.startDate);
        if (updates.endDate !== undefined) updateData.end_date = formatDateToString(updates.endDate);

        const { data, error } = await supabase
            .from('schedules')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating schedule:', error);
            throw error;
        }

        return {
            ...data,
            startDate: new Date(data.start_date),
            endDate: new Date(data.end_date),
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
        };
    } catch (error) {
        console.error('Failed to update schedule:', error);
        throw error;
    }
};

/**
 * 일정 삭제
 * @param {string} id - 일정 ID
 * @returns {Promise<void>}
 */
export const deleteSchedule = async (id) => {
    try {
        const { error } = await supabase
            .from('schedules')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting schedule:', error);
            throw error;
        }
    } catch (error) {
        console.error('Failed to delete schedule:', error);
        throw error;
    }
};

/**
 * 특정 일정 조회
 * @param {string} id - 일정 ID
 * @returns {Promise<Object>} 일정 데이터
 */
export const getScheduleById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('schedules')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching schedule:', error);
            throw error;
        }

        if (!data) {
            throw new Error('Schedule not found');
        }

        return {
            ...data,
            startDate: new Date(data.start_date),
            endDate: new Date(data.end_date),
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
        };
    } catch (error) {
        console.error('Failed to fetch schedule by id:', error);
        throw error;
    }
};

export default {
    getSchedulesByDate,
    getSchedulesByDateRange,
    getScheduleById,
    addSchedule,
    updateSchedule,
    deleteSchedule,
};
