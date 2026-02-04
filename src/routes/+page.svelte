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
		type: 'response' | 'anticipation' | 'inspiration';
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
			{ id: 'm1', role: 'ai', text: "ここは「源流」です。最初のアイデアを書いてください。", type: "response", time: "10:00" }
		],
		'2': [
			{ id: 'm2', role: 'ai', text: "デザインについて語りましょう。", type: "inspiration", time: "11:00" }
		]
	});

	let rawKeywords = ['Chat UI', 'UX', 'Svelte 5', 'Gemini', 'Ferment', 'Stream'];

	// 現在アクティブなスレッドのメッセージを抽出（派生状態）
	let activeThreadId = $derived(pages.find(p => p.active)?.id || '1');
	let currentMessages = $derived(allMessages[activeThreadId] || []);

	// --- ハンドラー ---

	function handleSend(text: string, type: Message['type']) {
		// ここで : Message と型を指定するのがポイントです
		const newMessage: Message = { 
			id: crypto.randomUUID(), 
			role: 'user', // これで TypeScript は「Message型のrole」だと確信します
			text, 
			type, 
			time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
		};
		
		// スレッドが存在しない場合の安全策を含めた更新
		const currentMessages = allMessages[activeThreadId] || [];
		allMessages[activeThreadId] = [...currentMessages, newMessage];
	}

	function handleSelectPage(id: string) {
		pages = pages.map(p => ({ ...p, active: p.id === id }));
	}

	function handleCreatePage() {
		const newId = crypto.randomUUID();
		pages = [...pages.map(p => ({ ...p, active: false })), { id: newId, title: '新しい思考', icon: '🌱', active: true }];
		allMessages[newId] = [{ id: crypto.randomUUID(), role: 'ai', text: "新しいスレッドが立ち上がりました。", type: "response", time: "Now" }];
	}
</script>

<div class="flex h-screen w-full bg-[#050507] text-slate-300 antialiased overflow-hidden font-sans">
	<FloatingKeywords keywords={rawKeywords} />
	
	<main class="flex-1 flex flex-col min-w-0 bg-[#050507]">
		<header class="h-16 flex items-center px-8 border-b border-white/5 bg-[#050507]/50 backdrop-blur-md">
			<span class="text-xs font-bold tracking-widest text-slate-500 uppercase">
				{pages.find(p => p.active)?.title}
			</span>
		</header>
		
		<ChatStream messages={currentMessages} />
		<ChatInput onSend={handleSend} />
	</main>

	<ThreadNav 
		{pages} 
		onSelect={handleSelectPage} 
		onCreate={handleCreatePage} 
	/>
</div>