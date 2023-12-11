<script lang="ts">
	import type { Segment } from "$lib/types";
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";

	export let segments: Segment[] = [];
	let summary: string | null = null;

	async function summarize() {
		if (segments.length < 3) {
			return;
		}

		try {
			const res = await fetch("/api/summary", {
				method: "POST",
				body: JSON.stringify(segments),
			});
			const data: { summary: string } = await res.json();
			console.log(data);
			summary = data.summary;
		} catch (e) {
			console.error(e);
		}
	}

	onMount(() => {
		summarize();
	});
</script>

<div class="flex h-full flex-col items-center justify-center gap-2">
	{#if segments.length < 3}
		<p class="text-center text-xl opacity-70">
			{$t("fix.please-record-at-least-3-segments")}
		</p>
	{:else if summary}
		{summary}
	{:else}
		{$t("summary.summarizing")}
	{/if}
</div>
