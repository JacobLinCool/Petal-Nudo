export interface Segment {
	audio: ArrayBuffer;
	player: HTMLAudioElement;
	transcript?: string;
}

export interface Project {
	segments: Segment[];
	summaries: Record<string, string>;
}
