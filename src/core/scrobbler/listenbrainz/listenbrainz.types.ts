export interface ListenBrainzTrackMeta {
	artist_name: string;
	track_name: string;
	additional_info: {
		submission_client: 'Web Scrobbler';
		submission_client_version: string;
		music_service_name: string;
		music_service?: string; // todo...?

		origin_url?: string;
		release_artist_name?: string;
		duration?: number;

		// mbids
		artist_mbids?: string[];
		release_group_mbid?: string;
		release_mbid?: string;
		recording_mbid?: string;
		track_mbid?: string;
		work_mbids?: string[];

		// listenbrainz listen msid
		recording_msid?: string;

		tracknumber?: string;
		isrc?: string;
		spotify_id?: string;
		tags?: string[];

		// lastfm_mbids
		lastfm_artist_mbid?: string;
		lastfm_release_mbid?: string;
		lastfm_track_mbid?: string;
	};

	release_name?: string;
}

export interface ListenBrainzPayload {
	track_metadata: ListenBrainzTrackMeta;
}
export interface ListenBrainzScrobblePayload {
	listened_at: number;
	track_metadata: ListenBrainzTrackMeta;
}

export type ListenBrainzParams =
	| {
			listen_type: 'playing_now';
			payload: [ListenBrainzPayload];
	  }
	| {
			listen_type: 'single';
			payload: [ListenBrainzScrobblePayload];
	  }
	| {
			listen_type: 'import';
			payload: ListenBrainzScrobblePayload[];
	  }
	| {
			score: -1 | 0 | 1;
			// one of the two must be present
			recording_msid?: string;
			recording_mbid?: string;
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
