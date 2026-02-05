<script lang="ts">
    // activeId を追加で受け取り、pages 内の active は参照しない
    let { pages, activeId, onSelect, onCreate } = $props<{
        pages: { id: string, title: string, icon: string }[],
        activeId: string, 
        onSelect: (id: string) => void,
        onCreate: () => void
    }>();
</script>

<nav class="w-72 border-l border-blue-900/30 p-6 flex flex-col gap-6 bg-[#0a1120] z-20">
    <div class="flex items-center justify-between">
        <h2 class="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400/50">Threads</h2>
        <button 
            onclick={onCreate}
            class="text-xs p-1 hover:bg-cyan-500/10 rounded transition-colors text-slate-500 hover:text-cyan-400"
        >
            +
        </button>
    </div>

    <div class="space-y-2 overflow-y-auto flex-1 custom-scrollbar">
        {#each pages as page (page.id)}
            {@const isActive = page.id === activeId} <button 
                onclick={() => onSelect(page.id)}
                class="w-full group relative p-4 rounded-xl text-left transition-all duration-300 border 
                {isActive 
                    ? 'bg-cyan-500/10 border-cyan-500/30' 
                    : 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/5'}"
            >
                <div class="flex items-center gap-3">
                    <span class="text-lg filter saturate-50">{page.icon}</span>
                    <div class="flex flex-col">
                        <span class="text-xs font-bold {isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-slate-200'} transition-colors">
                            {page.title}
                        </span>
                        <span class="text-[9px] text-blue-900/60 font-medium uppercase mt-0.5 tracking-tighter">
                            Modified Recently
                        </span>
                    </div>
                </div>

                {#if isActive}
                    <div class="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                {/if}
            </button>
        {/each}
    </div>

    <div class="mt-auto pt-6 border-t border-blue-900/30 space-y-2">
        <button class="w-full p-2 text-[10px] text-blue-800 hover:text-cyan-400/60 text-left transition-colors uppercase tracking-widest">Settings</button>
        <button class="w-full p-2 text-[10px] text-blue-800 hover:text-cyan-400/60 text-left transition-colors uppercase tracking-widest">Archive</button>
    </div>
</nav>