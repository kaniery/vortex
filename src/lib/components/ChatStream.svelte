<script lang="ts">
	import { tick } from 'svelte';
	import { scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let { messages } = $props<{ messages: any[] }>();
	let scrollContainer = $state<HTMLElement | null>(null);

	$effect(() => {
		messages;
		tick().then(() => {
			scrollContainer?.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
		});
	});
</script>

<div bind:this={scrollContainer} class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-[#050507]">
	{#each messages as msg (msg.id)}
		<div class="flex {msg.role === 'user' ? 'justify-start' : 'justify-end'} w-full">
			<div 
				class="max-w-[80%] flex flex-col {msg.role === 'user' ? 'items-start' : 'items-end'}"
				in:scale={{ duration: 400, start: 0.9, easing: cubicOut }}
			>
				<span class="text-[9px] font-bold uppercase tracking-tighter mb-2 opacity-30 mx-2">
					{msg.role === 'user' ? 'You' : 'Gemini'} • {msg.time}
				</span>

				<div class="ferment-bubble relative p-4 rounded-2xl text-sm leading-relaxed border transition-all duration-700
					{msg.role === 'user' 
						? 'bg-white/[0.03] border-white/10 rounded-tl-none text-slate-200' 
						: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-100 rounded-tr-none shadow-[0_0_20px_rgba(99,102,241,0.05)]'}">
					
					<div class="absolute {msg.role === 'user' ? '-left-1 bg-blue-500 shadow-[0_0_10px_#3b82f6]' : '-right-1 bg-emerald-500 shadow-[0_0_10px_#10b981]'} top-4 w-2 h-2 rounded-full ferment-glow"></div>
					{msg.text}
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	/* ... スタイルは以前と同じ ... */
	.ferment-bubble {
		animation: bubble-float 4s infinite ease-in-out;
	}
	@keyframes bubble-float {
		0%, 100% { transform: translateY(0px) rotate(0deg); }
		50% { transform: translateY(-2px) rotate(0.5deg); }
	}
	.ferment-glow {
		animation: glow-pulse 3s infinite ease-in-out;
	}
	@keyframes glow-pulse {
		0%, 100% { opacity: 0.8; transform: scale(1); filter: brightness(1); }
		50% { opacity: 1; transform: scale(1.2); filter: brightness(1.3); }
	}
	.custom-scrollbar::-webkit-scrollbar { width: 4px; }
	.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
</style>