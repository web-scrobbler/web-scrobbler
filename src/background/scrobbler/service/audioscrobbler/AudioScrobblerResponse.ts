import { AudioScrobblerImage } from './AudioScrobblerImage';

export interface AudioScrobblerResponse {
	session?: {
		key: string;
		name: string;
	};
	token?: string;
	error?: boolean; // TODO fix
	scrobbles?: {
		'@attr': {
			accepted: string;
		};
	};
	track?: {
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
	};
}
