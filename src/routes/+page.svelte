<script lang="ts">
	import { tick, onMount } from 'svelte';

	// =========================================
	// 1. State Management (Runes)
	// =========================================
	let inputText = $state("");
	let scrollContainer = $state<HTMLElement | null>(null);

	// メインのチャットデータ
	let messages = $state([
		{ id: crypto.randomUUID(), role: 'ai', text: "準備完了です。左側のキーワードが、あなたの思考の海を漂い始めました。", type: "response", time: "14:00" }
	]);

	// 右側：ページ管理データ
	let pages = $state([
		{ id: '1', title: '思考の源流', icon: '🌊', active: true },
		{ id: '2', title: 'UIデザイン構想', icon: '🎨', active: false },
		{ id: '3', title: 'Gemini連携メモ', icon: '🤖', active: false },
	]);

	// 左側：浮遊キーワードデータ（初期化時にランダム設定を生成）
	const rawKeywords = ['Chat UI', 'UX', 'Svelte 5', 'Gemini', 'Ferment', 'Stream', 'Tailwind', 'Supabase'];
	let floatingKeywords = $state<{ text: string, style: string }[]>([]);

	onMount(() => {
		// クライアントサイドでのみランダム配置を計算
		floatingKeywords = rawKeywords.map(word => {
			// 画面内に収まるようにランダムな位置(%)を計算
			const top = Math.random() * 80 + 5; // 5%〜85%
			const left = Math.random() * 80 + 5;
			// アニメーションの開始時間と長さをランダムにして自然なバラツキを出す
			const delay = Math.random() * -20; // マイナスにすることで開始直後から動いているように見せる
			const duration = Math.random() * 10 + 15; // 15秒〜25秒かけてゆっくり動く
			const scale = Math.random() * 0.3 + 0.8; // 0.8〜1.1倍の大きさ

			return {
				text: word,
				style: `top: ${top}%; left: ${left}%; animation-delay: ${delay}s; animation-duration: ${duration}s; transform: scale(${scale});`
			};
		});
	});

	// =========================================
	// 2. Logic Functions
	// =========================================
	async function sendMessage(type: 'response' | 'anticipation' | 'inspiration' = 'response') {
		if (!inputText.trim()) return;
		const now = new Date();
		const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
		
		messages = [...messages, {
			id: crypto.randomUUID(),
			role: 'user',
			text: inputText,
			type: type,
			time: timeStr
		}];
		inputText = "";
		await scrollToBottom();
		simulateAiResponse();
	}

	async function simulateAiResponse() {
		setTimeout(async () => {
			messages = [...messages, {
				id: crypto.randomUUID(),
				role: 'ai',
				text: "なるほど。そのキーワードは、水面下で他のどの概念と繋がっていますか？",
				type: "response",
				time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			}];
			await scrollToBottom();
		}, 1000);
	}

	async function scrollToBottom() {
		await tick();
		scrollContainer?.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage('response');
		}
	}

	function selectPage(id: string) {
		pages = pages.map(p => ({ ...p, active: p.id === id }));
	}
</script>

<div class="flex h-screen w-full bg-[#050507] text-slate-300 antialiased font-sans overflow-hidden">
	
	<aside class="w-72 border-r border-white/5 relative overflow-hidden hidden lg:block bg-[#050507]">
		<div class="absolute inset-0 bg-gradient-to-b from-indigo-900/[0.05] to-transparent pointer-events-none"></div>
		<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/[0.02] via-transparent to-transparent pointer-events-none animate-pulse-slow"></div>

		<h2 class="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 p-6 relative z-10">Keywords</h2>
		
		<div class="absolute inset-0 p-4 z-0">
			{#each floatingKeywords as kw}
				<span 
					class="absolute inline-flex items-center text-[10px] px-3 py-1.5 rounded-full bg-indigo-500/[0.08] text-indigo-300/80 border border-indigo-500/10 backdrop-blur-[2px] animate-float shadow-sm hover:bg-indigo-500/20 hover:text-indigo-200 transition-colors cursor-grab active:cursor-grabbing"
					style={kw.style}
				>
					<span class="opacity-50 mr-1">#</span>{kw.text}
				</span>
			{/each}
		</div>
	</aside>

	<main class="flex-1 flex flex-col min-w-0 relative z-10 bg-[#050507]">
		<header class="h-16 flex items-center px-8 border-b border-white/5 bg-[#050507]/80 backdrop-blur-md">
			<span class="text-xs font-bold tracking-widest text-slate-500">CONVERSATION STREAM</span>
		</header>

		<div bind:this={scrollContainer} class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
			{#each messages as msg (msg.id)}
				<div class="flex {msg.role === 'user' ? 'justify-start' : 'justify-end'} w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
					<div class="max-w-[80%] flex flex-col {msg.role === 'user' ? 'items-start' : 'items-end'}">
						<span class="text-[9px] font-bold uppercase tracking-tighter mb-2 opacity-30 mx-2">
							{msg.role === 'user' ? 'You' : 'Gemini'} • {msg.time}
						</span>
						<div class="relative p-4 rounded-2xl text-sm leading-relaxed border 
							{msg.role === 'user' ? 'bg-white/[0.03] border-white/10 rounded-tl-none' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-100 rounded-tr-none'}">
							<div class="absolute {msg.role === 'user' ? '-left-1' : '-right-1'} top-4 w-2 h-2 rounded-full 
								{msg.type === 'response' ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : ''}
								{msg.type === 'anticipation' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : ''}
								{msg.type === 'inspiration' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : ''}">
							</div>
							{msg.text}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="p-6 bg-gradient-to-t from-[#050507] to-transparent">
			<div class="max-w-4xl mx-auto">
				<div class="relative flex items-center bg-white/[0.05] border border-white/10 rounded-2xl p-2 focus-within:border-indigo-500/50 transition-all shadow-2xl">
					<input bind:value={inputText} onkeydown={handleKeydown} type="text" placeholder="思考を投下..." class="flex-1 bg-transparent border-none px-4 py-2 text-sm focus:ring-0 outline-none" />
					<div class="flex gap-1 pr-1">
						<button onclick={() => sendMessage('response')} class="p-2 hover:bg-blue-500/20 rounded-lg text-blue-400 text-[10px] font-bold transition-all hover:scale-105">RESP</button>
						<button onclick={() => sendMessage('anticipation')} class="p-2 hover:bg-emerald-500/20 rounded-lg text-emerald-400 text-[10px] font-bold transition-all hover:scale-105">ANTIC</button>
						<button onclick={() => sendMessage('inspiration')} class="p-2 hover:bg-rose-500/20 rounded-lg text-rose-400 text-[10px] font-bold transition-all hover:scale-105">INSP</button>
					</div>
				</div>
			</div>
		</div>
	</main>

	<nav class="w-72 border-l border-white/5 p-6 flex flex-col gap-6 bg-[#050507] z-20">
		<div class="flex items-center justify-between">
			<h2 class="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Threads</h2>
			<button class="text-xs p-1 hover:bg-white/10 rounded transition-colors text-slate-500">+</button>
		</div>
		<div class="space-y-2">
			{#each pages as page (page.id)}
				<button onclick={() => selectPage(page.id)} class="w-full group relative p-4 rounded-xl text-left transition-all duration-300 border {page.active ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/10'}">
					<div class="flex items-center gap-3">
						<span class="text-lg">{page.icon}</span>
						<div class="flex flex-col">
							<span class="text-xs font-bold {page.active ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-200'} transition-colors">{page.title}</span>
							<span class="text-[9px] text-slate-600 font-medium uppercase mt-0.5 tracking-tighter">Modified 2h ago</span>
						</div>
					</div>
					{#if page.active}<div class="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]"></div>{/if}
				</button>
			{/each}
		</div>
		<div class="mt-auto pt-6 border-t border-white/5 space-y-2">
			<button class="w-full p-2 text-[10px] text-slate-600 hover:text-slate-400 text-left transition-colors uppercase tracking-widest">Settings</button>
		</div>
	</nav>
</div>

<style>
	/* 浮遊アニメーションの定義 */
	@keyframes float {
		0% { transform: translate(0, 0) rotate(0deg); }
		33% { transform: translate(15px, -20px) rotate(2deg); }
		66% { transform: translate(-10px, 15px) rotate(-2deg); }
		100% { transform: translate(0, 0) rotate(0deg); }
	}

	/* ゆっくりとした背景の明滅 */
	@keyframes pulse-slow {
		0%, 100% { opacity: 0.02; }
		50% { opacity: 0.05; }
	}

	/* Tailwindのクラスで適用するためのユーティリティ作成 */
	.animate-float {
		animation: float infinite ease-in-out;
		/* duration と delay はインラインスタイルで個別に上書きされる */
	}
	.animate-pulse-slow {
		animation: pulse-slow 8s infinite ease-in-out;
	}

	.custom-scrollbar::-webkit-scrollbar { width: 4px; }
	.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
	.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
</style>