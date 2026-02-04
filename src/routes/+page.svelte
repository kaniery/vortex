<script lang="ts">
	import FloatingKeywords from '$lib/components/FloatingKeywords.svelte';
	import ChatStream from '$lib/components/ChatStream.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import ThreadNav from '$lib/components/ThreadNav.svelte';

	// --- 状態管理 ---
	let messages = $state([
		{ id: crypto.randomUUID(), role: 'ai', text: "全コンポーネントの同期が完了しました。", type: "response", time: "14:00" }
	]);

	let pages = $state([
		{ id: '1', title: '思考の源流', icon: '🌊', active: true },
		{ id: '2', title: 'UIデザイン構想', icon: '🎨', active: false },
	]);

	let rawKeywords = ['Chat UI', 'UX', 'Svelte 5', 'Gemini', 'Ferment', 'Stream'];

	// --- ハンドラー ---
	function handleSend(text: string, type: any) {
		const newMessage = { id: crypto.randomUUID(), role: 'user', text, type, time: 'Now' };
		messages = [...messages, newMessage];
		// ここにAIの返信ロジックを追加予定
	}

	function handleSelectPage(id: string) {
		pages = pages.map(p => ({ ...p, active: p.id === id }));
		// ここでメッセージを切り替えるロジックを追加予定
	}

	function handleCreatePage() {
		const newId = crypto.randomUUID();
		pages = [...pages, { id: newId, title: '新しい思考', icon: '🌱', active: false }];
	}
</script>

<div class="flex h-screen w-full bg-[#050507] text-slate-300 antialiased overflow-hidden font-sans">
	<FloatingKeywords keywords={rawKeywords} />
	
	<main class="flex-1 flex flex-col min-w-0 bg-[#050507]">
		<header class="h-16 flex items-center px-8 border-b border-white/5 bg-[#050507]/50 backdrop-blur-md">
			<span class="text-xs font-bold tracking-widest text-slate-500 uppercase">Current Session</span>
		</header>
		
		<ChatStream {messages} />
		<ChatInput onSend={handleSend} />
	</main>

	<ThreadNav 
		{pages} 
		onSelect={handleSelectPage} 
		onCreate={handleCreatePage} 
	/>
</div>