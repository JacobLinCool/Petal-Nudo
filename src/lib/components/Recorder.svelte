<script lang="ts">
	import { t } from "svelte-i18n";
	import { MicVAD, utils } from "@ricky0123/vad-web";
	import { onDestroy, onMount } from "svelte";
	import worklet from "@ricky0123/vad-web/dist/vad.worklet.bundle.min.js?url";
	import silero from "@ricky0123/vad-web/dist/silero_vad.onnx?url";
	import type { Segment, TranscriptionSegment } from "$lib/types";

	export let segments: Segment[];

	let recording = false;
	let active = false;
	let prepared = Promise.resolve(false);
	let vad: MicVAD;

	onMount(init);

	onDestroy(() => {
		vad?.destroy();
	});

	async function init() {
		if (!(await prepared)) {
			prepared = MicVAD.new({
				additionalAudioConstraints: {},
				onSpeechEnd(audio) {
					const wav = utils.encodeWAV(audio);
					const segment = {
						audio: wav,
						player: new Audio(
							URL.createObjectURL(new Blob([wav], { type: "audio/wav" })),
						),
					};
					transcript(segment);
					segments.push(segment);
					segments = segments;
					active = false;
					console.log("speech end");
				},
				onSpeechStart() {
					active = true;
					console.log("speech start");
				},
				onVADMisfire() {
					active = false;
					console.log("misfire");
				},
				workletURL: worklet,
				async modelFetcher(path) {
					if (path === "silero_vad.onnx") {
						return fetch(silero).then((res) => res.arrayBuffer());
					}
					console.log(path);
					throw new Error("Unknown model");
				},
			})
				.then((v) => (vad = v))
				.then(() => true);
		}
	}

	async function start() {
		await init();
		vad.start();
		recording = true;
	}

	async function stop() {
		vad.pause();
		recording = false;
		active = false;
	}

	async function transcript(segment: Segment) {
		try {
			const form = new FormData();
			form.append("audio", new Blob([segment.audio], { type: "audio/wav" }));
			const res = await fetch("/api/transcribe", {
				method: "POST",
				body: form,
			});
			const data: TranscriptionSegment[] = await res.json();
			console.log(data);
			segment.transcription = data;
			segments = segments;
		} catch (e) {
			console.error(e);
		}
	}
</script>

<button
	class="btn btn-primary h-60 w-60 cursor-pointer items-start rounded-full text-xl transition-all"
	class:btn-error={active}
	class:animate-pulse={recording}
	class:ring-8={recording}
	class:ring-error={recording}
	class:hover:scale-110={!recording}
	on:click={() => {
		if (recording) {
			stop();
		} else {
			start();
		}
	}}
>
	<div class="p-12">
		{#if recording}
			{$t("recorder.stop")}
		{:else}
			{$t("recorder.start")}
		{/if}
	</div>
</button>
