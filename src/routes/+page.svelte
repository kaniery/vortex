<script lang="ts">
	import FloatingKeywords from '$lib/components/FloatingKeywords.svelte';
	import ChatStream from '$lib/components/ChatStream.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import ThreadNav from '$lib/components/ThreadNav.svelte';

	// 1. メッセージの型を定義
	interface Message {
		id: string;
		role: 'user' | 'ai';
		text: string;
		time: string;
	}
	// --- 状態管理 (Svelte 5) ---
	
	// スレッド一覧
	let pages = $state([
		{ id: '1', title: '思考の源流', icon: '🌊', active: true },
		{ id: '2', title: 'UIデザイン構想', icon: '🎨', active: false },
	]);

	// スレッドごとのメッセージ（IDをキーにしたオブジェクト）
	let allMessages = $state<Record<string, Message[]>>({
		'1': [
			{ id: 'm1', role: 'ai', text: "ここは「源流」です。最初のアイデアを書いてください。" , time: "10:00" }
		],
		'2': [
			{ id: 'm2', role: 'ai', text: "デザインについて語りましょう。" , time: "11:00" }
		]
	});

	let rawKeywords = ['Chat UI', 'UX', 'Svelte 5', 'Gemini', 'Ferment', 'Stream'];

	// 現在アクティブなスレッドのメッセージを抽出（派生状態）
	let activeThreadId = $derived(pages.find(p => p.active)?.id || '1');
	let currentMessages = $derived(allMessages[activeThreadId] || []);
	let inputText = $state(""); // 入力文字列を親で持つ

	// --- ハンドラー ---

	function handleKeywordSelect(word: string) {
		// すでに入力がある場合はスペースを空けて追記
		if (inputText) {
			inputText += ` #${word} `;
		} else {
			inputText = `#${word} `;
		}
	}

	function handleSend(text: string) {
		const newMessage: Message = { 
			id: crypto.randomUUID(), 
			role: 'user', 
			text, 
			time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
		};
		
		allMessages[activeThreadId] = [...(allMessages[activeThreadId] || []), newMessage];
		// 送信後の inputText = "" は ChatInput 側で行われるのでここでは不要
	}

	function handleSelectPage(id: string) {
		pages = pages.map(p => ({ ...p, active: p.id === id }));
	}

	function handleCreatePage() {
		const newId = crypto.randomUUID();
		pages = [...pages.map(p => ({ ...p, active: false })), { id: newId, title: '新しい思考', icon: '🌱', active: true }];
		allMessages[newId] = [{ id: crypto.randomUUID(), role: 'ai', text: "新しいスレッドが立ち上がりました。", time: "Now" }];
	}
</script>

<div class="flex h-screen w-full bg-[#020617] text-slate-300 antialiased overflow-hidden font-sans">
    
    <div class="fixed inset-0 bg-gradient-to-b from-[#020617] via-[#020817] to-[#010b13] pointer-events-none"></div>

    <FloatingKeywords keywords={rawKeywords} onSelect={handleKeywordSelect} />
    
    <main class="relative z-10 flex-1 flex flex-col min-w-0 bg-[#020617]/40 backdrop-blur-sm">
        
        <header class="h-16 flex items-center px-8 border-b border-blue-500/10 bg-[#020617]/60 backdrop-blur-xl">
            <span class="text-xs font-bold tracking-widest text-blue-400/80 uppercase">
                {pages.find(p => p.active)?.title}
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