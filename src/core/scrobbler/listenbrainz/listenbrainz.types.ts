/* eslint-disable camelcase */
export interface ListenBrainzTrackMeta {
	artist_name: string;
	track_name: string;
	additional_info: {
		submission_client: 'Web Scrobbler';
		submission_client_version: string;
		music_service_name: string;

		origin_url?: string;
		release_artist_name?: string;
		spotify_id?: string;
		duration?: number;
	};

	release_name?: string;
}

export type ListenBrainzParams =
	| {
			listen_type: 'playing_now';
			payload: [
				{
					track_metadata: ListenBrainzTrackMeta;
				},
			];
	  }
	| {
			listen_type: 'single' | 'import';
			payload: [
				{
					listened_at: number;
					track_metadata: ListenBrainzTrackMeta;
				},
			];
	  }
	| {
			recording_mbid: string;
			score: number;
	  };

export type MetadataLookup = {
	recording_mbid?: string;
};

export interface ListenBrainzHTMLReactProps {
	current_user: {
		name: string;
		auth_token: string;
	};
}
/* eslint-enable camelcase */
