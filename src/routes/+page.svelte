<script lang="ts">
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";
	import Recorder from "$lib/components/Recorder.svelte";
	import type { Segment } from "$lib/types";
	import Icon from "@iconify/svelte";

	let error = "";
	let stream: MediaStream | null = null;
	let segments: Segment[] = [];
	let transcripts: string[] = [];

	onMount(setup);

	async function setup() {
		if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
			error = $t("error.no-device");
			return;
		}

		stream = await navigator.mediaDevices.getUserMedia({
			audio: {
				channelCount: 1,
				echoCancellation: true,
				autoGainControl: true,
				noiseSuppression: true,
			},
		});
	}
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	{#if error}
		<div class="alert">
			{error}
		</div>
	{/if}

	<div class="flex w-full flex-1 flex-col items-center justify-center gap-2 overflow-auto">
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

	<div class="flex h-32 w-full justify-center pt-2">
		{#if stream}
			<Recorder {stream} bind:segments />
		{/if}
	</div>
</div>
