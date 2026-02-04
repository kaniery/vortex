<script lang="ts">
	import { tick } from 'svelte';
	let { messages } = $props<{ messages: any[] }>();
	let scrollContainer = $state<HTMLElement | null>(null);

	// メッセージが増えたら自動スクロール
	$effect(() => {
		messages; // 依存関係として明示
		tick().then(() => {
			scrollContainer?.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
		});
	});
</script>

<div bind:this={scrollContainer} class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
	{#each messages as msg (msg.id)}
		<div class="flex {msg.role === 'user' ? 'justify-start' : 'justify-end'} w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
			<div class="max-w-[80%] flex flex-col {msg.role === 'user' ? 'items-start' : 'items-end'}">
				<div class="relative p-4 rounded-2xl text-sm border {msg.role === 'user' ? 'bg-white/[0.03]' : 'bg-indigo-500/10 text-indigo-100'}">
					{msg.text}
				</div>
			</div>
		</div>
	{/each}
</div>