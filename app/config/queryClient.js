import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
            gcTime: 1000 * 60 * 10, // 10분간 가비지 컬렉션 방지 (이전 cacheTime)
            retry: 1, // 실패 시 1번만 재시도
            refetchOnWindowFocus: false, // 포커스 시 자동 새로고침 비활성화
        },
        mutations: {
            retry: 1,
        },
    },
});
