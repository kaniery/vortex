<script lang="ts">
	// Svelte 5 の $props で親からデータと関数を受け取る
	let { pages, onSelect, onCreate } = $props<{
		pages: { id: string, title: string, active: boolean }[],
		onSelect: (id: string) => void,
		onCreate: () => void
	}>();
</script>

<nav class="w-72 border-l border-white/5 p-6 flex flex-col gap-6 bg-[#050507] z-20">
	<div class="flex items-center justify-between">
		<h2 class="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Threads</h2>
		<button 
			onclick={onCreate}
			class="text-xs p-1 hover:bg-white/10 rounded transition-colors text-slate-500 hover:text-white"
		>
			+
		</button>
	</div>

	<div class="space-y-2 overflow-y-auto flex-1 custom-scrollbar">
		{#each pages as page (page.id)}
			<button 
				onclick={() => onSelect(page.id)}
				class="w-full group relative p-4 rounded-xl text-left transition-all duration-300 border 
				{page.active 
					? 'bg-indigo-500/10 border-indigo-500/30' 
					: 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/10'}"
			>
				<div class="flex items-center gap-3">
					<span class="text-lg">{page.icon}</span>
					<div class="flex flex-col">
						<span class="text-xs font-bold {page.active ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-200'} transition-colors">
							{page.title}
						</span>
						<span class="text-[9px] text-slate-600 font-medium uppercase mt-0.5 tracking-tighter">
							Modified Recently
						</span>
					</div>
				</div>

				{#if page.active}
					<div class="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]"></div>
				{/if}
			</button>
		{/each}
	</div>
</nav>

<style>
	/* 必要に応じてスクロールバーのスタイルをここにも記述（またはグローバルCSSへ） */
</style>