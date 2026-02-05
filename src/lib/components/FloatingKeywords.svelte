<script lang="ts">
	import { onMount } from 'svelte';
	// onSelect 関数を受け取るように定義
	let { keywords, onSelect } = $props<{ 
		keywords: string[], 
		onSelect: (word: string) => void 
	}>();

	let floatingKeywords = $state<{ text: string, style: string }[]>([]);

	onMount(() => {
		floatingKeywords = keywords.map((word: string) => {
			const top = Math.random() * 80 + 10;
			const left = Math.random() * 80 + 10;
			const duration = Math.random() * 15 + 20; // 少しゆっくりに
			const delay = Math.random() * -20;
			
			// CSS変数としてランダム値を渡す
			return {
				text: word,
				style: `
					top: ${top}%; 
					left: ${left}%; 
					--float-duration: ${duration}s;
					--float-delay: ${delay}s;
					--tx: ${Math.random() * 20 - 10}px;
					--ty: ${Math.random() * 40 - 20}px;
					--rot: ${Math.random() * 10 - 5}deg;
				`
			};
		});
	});
</script>

<aside class="w-72 border-r border-blue-900/30 relative overflow-hidden hidden lg:block bg-[#0a1120]">
    <h2 class="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400/50 p-6 relative z-10">Keywords</h2>
    <div class="absolute inset-0 p-4">
        {#each floatingKeywords as kw}
            <button 
                onclick={() => onSelect(kw.text)}
                class="absolute inline-flex items-center text-[10px] px-3 py-1.5 rounded-full 
                        bg-cyan-500/10 text-cyan-200/80 border border-cyan-500/20 
                        backdrop-blur-sm animate-float 
                        hover:bg-cyan-400/20 hover:text-white hover:border-cyan-400/50 
                        hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] transition-all active:scale-95"
                style={kw.style}
            >
                <span class="opacity-40 mr-1 text-cyan-400">#</span>{kw.text}
            </button>
        {/each}
    </div>
</aside>

<style>
    .animate-float {
        /* CSS変数を使用して個別に制御 */
        animation: float-refined var(--float-duration) ease-in-out var(--float-delay) infinite alternate;
    }

    @keyframes float-refined {
        0% {
            transform: translate(0, 0) rotate(0deg);
        }
        50% {
            /* スクリプトから渡されたランダムな移動量と回転を使用 */
            transform: translate(var(--tx), var(--ty)) rotate(var(--rot));
        }
        100% {
            transform: translate(calc(var(--tx) * -0.5), calc(var(--ty) * 1.2)) rotate(calc(var(--rot) * -1));
        }
    }

    /* ホバー時はアニメーションを一時停止 or スローダウンさせるとクリックしやすい */
    button:hover {
        animation-play-state: paused;
        z-index: 50;
    }
</style>