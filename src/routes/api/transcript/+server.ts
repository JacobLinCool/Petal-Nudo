import { openai } from "$lib/server/openai";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
	const file = await request.formData().then((form) => form.get("audio"));
	if (!file || typeof file !== "object") {
		throw new Error("No audio file found");
	}

	const transcription = await openai.audio.transcriptions.create({
		model: "whisper-1",
		response_format: "json",
		file: new File([file], "audio.wav", { type: "audio/wav" }),
		prompt: "Using OpenAI Whisper to transcribe Traditional Chinese and English speech.",
	});

	return new Response(JSON.stringify(transcription), {
		headers: {
			"content-type": "application/json",
		},
	});
};
