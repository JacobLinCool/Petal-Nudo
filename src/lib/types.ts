export interface Segment {
	audio: ArrayBuffer;
	player: HTMLAudioElement;
	transcription?: TranscriptionSegment[];
}

export interface Project {
	segments: Segment[];
	post: Record<string, string>;
}

export interface TranscriptionSegment {
	start: number;
	end: number;
	text: string;
	prob: number;
	empty_prob: number;
}
