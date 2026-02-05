<script lang="ts">
    import { onMount } from 'svelte';
    import FloatingKeywords from '$lib/components/FloatingKeywords.svelte';
    import ChatStream from '$lib/components/ChatStream.svelte';
    import ChatInput from '$lib/components/ChatInput.svelte';
    import ThreadNav from '$lib/components/ThreadNav.svelte';
    
    // 作成したDBコンポーネントをインポート
    import { db, type Message, type Thread } from '$lib/db';

    // --- 状態管理 (Svelte 5) ---
    let pages = $state<Thread[]>([]);
    let currentMessages = $state<Message[]>([]); 
    let inputText = $state("");
    
    let rawKeywords = ['Chat UI', 'UX', 'Svelte 5', 'Gemini', 'Ferment', 'Stream'];

    let activeThreadId = $derived(pages.find(p => p.active)?.id);

    // --- 初期化 ---
    onMount(async () => {
        const threads = await db.getThreads();
        if (threads.length > 0) {
            pages = threads.map((p, i) => ({ ...p, active: i === 0 }));
            if (pages[0].id) {
                currentMessages = await db.getMessages(pages[0].id);
            }
        } else {
            await handleCreatePage();
        }
    });

    // --- ハンドラー ---

    function handleKeywordSelect(word: string) {
        if (inputText) {
            inputText += ` #${word} `;
        } else {
            inputText = `#${word} `;
        }
    }

    async function handleSend(text: string) {
        if (!activeThreadId) return;

        // 1. 楽観的更新（DB保存を待たずに画面に表示する演出）
        const optimisticMsg: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            text: text,
            time: 'sending...'
        };
        currentMessages = [...currentMessages, optimisticMsg];
        
        // 2. DBへ保存
        const savedMsg = await db.sendMessage(activeThreadId, text);

        // 3. 完了したらIDや時間を正式なものに更新
        if (savedMsg) {
            currentMessages = currentMessages.map(m => 
                m.id === optimisticMsg.id ? savedMsg : m
            );
        }
    }

    async function handleSelectPage(id: string) {
        // UIのアクティブ切り替え
        pages = pages.map(p => ({ ...p, active: p.id === id }));
        
        // メッセージをDBから再取得して入れ替え
        currentMessages = await db.getMessages(id);
    }

    async function handleCreatePage() {
        // DBで作成
        const newThread = await db.createThread('新しい思考');
        
        if (newThread) {
            // ページリストを更新してアクティブにする
            pages = pages.map(p => ({ ...p, active: false }));
            pages.push({ ...newThread, active: true });
            
            // メッセージ欄をクリア
            currentMessages = [];
            
            // システムメッセージなどをDBに入れるならここで db.sendMessage を呼ぶ
        }
    }
</script>

<div class="flex h-screen w-full bg-[#020617] text-slate-300 antialiased overflow-hidden font-sans">
    <div class="fixed inset-0 bg-gradient-to-b from-[#020617] via-[#020817] to-[#010b13] pointer-events-none"></div>

    <FloatingKeywords keywords={rawKeywords} onSelect={handleKeywordSelect} />
    
    <main class="relative z-10 flex-1 flex flex-col min-w-0 bg-[#020617]/40 backdrop-blur-sm">
        <header class="h-16 flex items-center px-8 border-b border-blue-500/10 bg-[#020617]/60 backdrop-blur-xl">
            <span class="text-xs font-bold tracking-widest text-blue-400/80 uppercase">
                {pages.find(p => p.active)?.title || 'Loading...'}
            </span>
        </header>
        
        <div class="flex-1 overflow-y-auto">
            <ChatStream messages={currentMessages} />
        </div>

        <div class="p-4 bg-gradient-to-t from-[#020617] to-transparent">
            <ChatInput onSend={handleSend} bind:text={inputText} />
        </div>
    </main>

    <ThreadNav 
        {pages} 
        onSelect={handleSelectPage} 
        onCreate={handleCreatePage} 
    />
</div>