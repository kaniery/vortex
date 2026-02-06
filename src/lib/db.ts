// src/lib/db.ts
import { supabase } from './supabase';

// 共通で使う型定義もここに置くと便利です
export interface Thread {
    id: string;
    title: string;
    active: boolean;
}

export interface Message {
    id: string;
    role: 'user' | 'ai';
    text: string;
    time: string;
}

export const db = {
    // スレッド一覧を取得
    async getThreads(): Promise<Thread[]> {
        const { data, error } = await supabase
            .from('threads')
            .select('*')
            .order('created_at', { ascending: true });
        
        if (error) {
            console.error('Error loading threads:', error);
            return [];
        }
        return data || [];
    },

    // 新しいスレッドを作成
    async createThread(title: string): Promise<Thread | null> {
        const { data, error } = await supabase
            .from('threads')
            .insert([{ title }])
            .select()
            .single();
        
        if (error) return null;
        return data;
    },

    // 特定のスレッドのメッセージを取得
    async getMessages(threadId: string): Promise<Message[]> {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('thread_id', threadId)
            .order('created_at', { ascending: true });

        if (error) return [];

        return data.map((m: any) => ({
            id: m.id,
            role: m.role,
            text: m.content, // DB側がcontentという名前の場合
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
    },

    // メッセージを送信（保存）
    async sendMessage(threadId: string, text: string, role: 'user' | 'ai' = 'user'): Promise<Message | null> {
        const { data, error } = await supabase
            .from('messages')
            .insert([{ 
                thread_id: threadId, 
                role, 
                content: text,
            }])
            .select()
            .single();

        if (error) {
            console.error('Error sending message:', error);
            return null;
        }

        return {
            id: data.id,
            role: data.role,
            text: data.content,
            time: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
    }
};