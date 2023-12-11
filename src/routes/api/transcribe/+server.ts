import { openai } from "$lib/server/openai";
import type { TranscriptionSegment } from "$lib/types";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
	const file = await request.formData().then((form) => form.get("audio"));
	if (!file || typeof file !== "object") {
		throw new Error("No audio file found");
	}

	const res = await openai.audio.transcriptions.create({
		model: "whisper-1",
		response_format: "verbose_json",
		file: new File([file], "audio.wav", { type: "audio/wav" }),
		prompt: "Using OpenAI Whisper to transcribe Traditional Chinese and English speech.",
		temperature: 0,
	});

	const transcription = res as {
		task: "transcribe";
		language: string;
		duration: number; // seconds
		text: string;
		segments: {
			id: number;
			seek: number;
			start: number; // seconds
			end: number; // seconds
			text: string;
			tokens: unknown[];
			temperature: number;
			avg_logprob: number; // ex. -0.21516570424645898
			compression_ratio: number; //ex. 1.2857142686843872
			no_speech_prob: number; // ex. 0.5775126814842224
		}[];
	};
	console.log(transcription);

	const segments: TranscriptionSegment[] = transcription.segments.map((segment) => ({
		start: segment.start,
		end: segment.end,
		text: segment.text.trim(),
		prob: Number(Math.exp(segment.avg_logprob).toFixed(3)),
		empty_prob: Number(segment.no_speech_prob.toFixed(3)),
	}));

	return new Response(JSON.stringify(segments), {
		headers: {
			"content-type": "application/json",
		},
	});
};
