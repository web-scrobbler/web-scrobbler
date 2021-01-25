import type { AudioScrobblerTrackInfo } from '@/background/scrobbler/audioscrobbler/AudioScrobblerTrackInfo';

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
	track?: AudioScrobblerTrackInfo;
}
