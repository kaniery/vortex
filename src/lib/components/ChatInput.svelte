<script lang="ts">
	// text を双方向バインド可能にする
	let { onSend, text = $bindable() } = $props<{ 
		onSend: (text: string, type: 'response' | 'anticipation' | 'inspiration') => void,
		text: string 
	}>();

	function handleSend(type: 'response' | 'anticipation' | 'inspiration') {
		if (!text.trim()) return;
		onSend(text, type);
		text = ""; // 送信後クリア
	}
</script>

<div class="p-6 bg-gradient-to-t from-[#050507] to-transparent">
	<div class="max-w-4xl mx-auto">
		<div class="relative flex items-center bg-white/[0.05] border border-white/10 rounded-2xl p-2 focus-within:border-indigo-500/50">
			<input 
				bind:value={text} 
				onkeydown={(e) => e.key === 'Enter' && handleSend('response')} 
				placeholder="思考を投下..." 
				class="flex-1 bg-transparent border-none px-4 py-2 text-sm outline-none" 
			/>
			<div class="flex gap-1 pr-1">
				<button onclick={() => handleSend('response')} class="p-2 text-blue-400 text-[10px] font-bold">RESP</button>
				<button onclick={() => handleSend('anticipation')} class="p-2 text-emerald-400 text-[10px] font-bold">ANTIC</button>
				<button onclick={() => handleSend('inspiration')} class="p-2 text-rose-400 text-[10px] font-bold">INSP</button>
			</div>
		</div>
	</div>
</div>