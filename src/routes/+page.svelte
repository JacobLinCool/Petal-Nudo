<script lang="ts">
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";
	import Recorder from "$lib/components/Recorder.svelte";
	import type { Segment } from "$lib/types";
	import Transcriptions from "$lib/components/Transcriptions.svelte";
	import Fix from "$lib/components/Fix.svelte";
	import Summary from "$lib/components/Summary.svelte";

	let error = "";
	let stream: MediaStream | null = null;
	let segments: Segment[] = [];
	let page: "transcription" | "fix" | "summary" = "transcription";

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
		<div class="alert fixed left-0 top-0 w-full">
			{error}
		</div>
	{/if}

	<div role="tablist" class="tabs tabs-bordered pt-2">
		<button
			role="tab"
			class="tab"
			class:tab-active={page === "transcription"}
			on:click={() => (page = "transcription")}>{$t("page.transcription")}</button
		>
		<button
			role="tab"
			class="tab"
			class:tab-active={page === "fix"}
			on:click={() => (page = "fix")}>{$t("page.fix")}</button
		>
		<button
			role="tab"
			class="tab"
			class:tab-active={page === "summary"}
			on:click={() => (page = "summary")}>{$t("page.summary")}</button
		>
	</div>

	<div class="w-full flex-1 overflow-auto">
		{#if page === "transcription"}
			<Transcriptions bind:segments />
		{:else if page === "fix"}
			<Fix {segments} />
		{:else if page === "summary"}
			<Summary {segments} />
		{/if}
	</div>

	<div class="flex h-32 w-full justify-center pt-2">
		{#if stream}
			<Recorder {stream} bind:segments />
		{/if}
	</div>
</div>
