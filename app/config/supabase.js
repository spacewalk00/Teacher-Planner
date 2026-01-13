import { createClient } from '@supabase/supabase-js';

/**
 * Supabase 클라이언트 설정
 * Postgres 데이터베이스와 직접 연동
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;


/**
 * Supabase 클라이언트 인스턴스
 * Postgres 데이터베이스와 직접 통신
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    db: {
        schema: 'public',
    },
});

export default supabase;
