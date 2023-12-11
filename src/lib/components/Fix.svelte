<script lang="ts">
	import type { Segment } from "$lib/types";
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";

	export let segments: Segment[] = [];
	let fixed: string | null = null;

	async function fix() {
		if (segments.length < 3) {
			return;
		}

		try {
			const res = await fetch("/api/fix", {
				method: "POST",
				body: JSON.stringify(segments),
			});
			const data: { fixed: string } = await res.json();
			console.log(data);
			fixed = data.fixed;
		} catch (e) {
			console.error(e);
		}
	}

	onMount(() => {
		fix();
	});
</script>

<div class="flex h-full flex-col items-center justify-center gap-2">
	{#if segments.length < 3}
		<p class="text-center text-xl opacity-70">
			{$t("fix.please-record-at-least-3-segments")}
		</p>
	{:else if fixed}
		{fixed}
	{:else}
		{$t("fix.fixing")}
	{/if}
</div>
