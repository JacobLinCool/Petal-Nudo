import { openai } from "$lib/server/openai";
import type { TranscriptionSegment } from "$lib/types";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
	const segments: TranscriptionSegment[] = await request.json();

	const transcription = segments
		.filter((segment) => segment.empty_prob <= 0.75 || segment.prob > 0.7)
		.map((segment) => segment.text)
		.join(" ");

	const res = await openai.chat.completions.create({
		model: "gpt-3.5-turbo-1106",
		temperature: 0.2,
		messages: [
			{
				role: "system",
				content:
					'You are receiving a transcription. The transcription may be inaccurate due to the quality of the audio and ASR model. Please summarize the transcriptio without losing important information. Respond with JSON object { "summary": "the summary" }.',
			},
			{
				role: "user",
				content: transcription,
			},
		],
		response_format: { type: "json_object" },
	});

	console.log(res);

	const summary = JSON.parse(res.choices[0].message.content || `{}`).summary;
	if (!summary) {
		throw new Error("No summary found");
	}

	return new Response(JSON.stringify({ summary }), {
		headers: {
			"content-type": "application/json",
		},
	});
};
