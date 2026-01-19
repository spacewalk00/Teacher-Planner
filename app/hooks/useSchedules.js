import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getSchedulesByDate,
    addSchedule,
    updateSchedule,
    deleteSchedule,
} from '../services/scheduleService';

/**
 * 특정 날짜의 일정 목록 조회
 */
export const useSchedulesByDate = (date) => {
    return useQuery({
        queryKey: ['schedules', 'date', date],
        queryFn: () => getSchedulesByDate(date),
        enabled: !!date, // date가 있을 때만 쿼리 실행
    });
};

/**
 * 일정 추가 Mutation
 */
export const useAddSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addSchedule,
        onSuccess: () => {
            // 일정 추가 후 관련 쿼리 무효화하여 자동 새로고침
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
        },
    });
};

/**
 * 일정 수정 Mutation
 */
export const useUpdateSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }) => updateSchedule(id, updates),
        onSuccess: () => {
            // 일정 수정 후 관련 쿼리 무효화하여 자동 새로고침
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
        },
    });
};

/**
 * 일정 삭제 Mutation
 */
export const useDeleteSchedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSchedule,
        onSuccess: () => {
            // 일정 삭제 후 관련 쿼리 무효화하여 자동 새로고침
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
        },
    });
};
