import type { AudioScrobblerImage } from '@/background/scrobbler/audioscrobbler/AudioScrobblerImage';

export interface AudioScrobblerTrackInfo {
	name: string;
	url?: string;
	duration?: string;
	userplaycount: string;
	artist: {
		name: string;
		url?: string;
	};
	album?: {
		title: string;
		image?: AudioScrobblerImage[];
		mbid?: string;
		url?: string;
	};
	userloved?: '0' | '1';
}
