<script lang="ts">
	import { onMount } from 'svelte';
	let { keywords } = $props<{ keywords: string[] }>();
	let floatingKeywords = $state<{ text: string, style: string }[]>([]);

	onMount(() => {
		floatingKeywords = keywords.map((word: string) => ({
			text: word,
			// インラインスタイルには「座標」と「時間」のプロパティだけを渡す
			style: `
				top: ${Math.random() * 80 + 5}%; 
				left: ${Math.random() * 80 + 5}%;
				animation-delay: ${Math.random() * -20}s;
				animation-duration: ${Math.random() * 10 + 15}s;
				z-index: ${Math.floor(Math.random() * 10)};
			`
		}));
	});
</script>

<aside class="w-72 border-r border-white/5 relative overflow-hidden hidden lg:block bg-[#050507]">
	<h2 class="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 p-6 relative z-10">Keywords</h2>
	<div class="absolute inset-0 p-4">
		{#each floatingKeywords as kw}
			<span 
				class="absolute inline-flex items-center text-[10px] px-3 py-1.5 rounded-full bg-indigo-500/[0.08] text-indigo-300/80 border border-indigo-500/10 backdrop-blur-[2px] animate-float" 
				style={kw.style}
			>
				<span class="opacity-50 mr-1">#</span>{kw.text}
			</span>
		{/each}
	</div>
</aside>

<style>
	/* アニメーションの定義はここに書く */
	@keyframes float {
		0%, 100% { transform: translate(0, 0); }
		33% { transform: translate(10px, -15px); }
		66% { transform: translate(-10px, 10px); }
	}

	.animate-float {
		animation: float linear infinite;
	}
</style>