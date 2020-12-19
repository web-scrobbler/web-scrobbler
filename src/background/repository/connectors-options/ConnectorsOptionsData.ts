export interface ConnectorsOptionsData {
	youtube: {
		scrobbleMusicOnly: boolean;
		scrobbleEntertainmentOnly: boolean;
	};
	tidal: {
		useShortTrackNames: boolean;
	};
}

export type ConnectorIdKey = keyof ConnectorsOptionsData;
