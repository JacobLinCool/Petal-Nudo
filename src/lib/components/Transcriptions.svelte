<script lang="ts">
	import type { Segment } from "$lib/types";
	import { t } from "svelte-i18n";
	import Icon from "@iconify/svelte";

	export let segments: Segment[] = [];
</script>

<div class="flex h-full flex-col items-center justify-center gap-2">
	{#if segments.length === 0}
		<p class="text-center text-xl opacity-70">
			{$t("recorder.start-recording-first")}
		</p>
	{/if}
	{#each segments as segment}
		<div class="flex w-full max-w-prose flex-row items-center gap-4 p-2">
			<button
				class="btn btn-outline btn-secondary"
				on:click={() =>
					segment.player.paused ? segment.player.play() : segment.player.pause()}
			>
				<Icon icon="mdi:waveform" />
			</button>

			<div class="prose flex-1">
				{#if segment.transcription}
					<p>
						{#each segment.transcription as seg}
							<span
								class:text-warning={seg.prob > 0.3 && seg.prob < 0.7}
								class:text-error={seg.prob <= 0.3}
								class:opacity-30={seg.empty_prob > 0.6}>{seg.text}</span
							>{" "}
						{/each}
					</p>
				{:else}
					<p class="animate-pulse">
						{$t("recorder.transcribing")}
					</p>
				{/if}
			</div>
		</div>
	{/each}
</div>
