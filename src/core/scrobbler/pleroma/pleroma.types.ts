export interface PleromaTrackMetadata {
	artist: string;
	title: string;
	url: string;
	length?: number | null;

	key?: string;
	album?: string;
	albumartists?: string[];
}

export interface PleromaUser {
	id: string;
	fqn: string;
}
