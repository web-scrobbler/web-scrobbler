export interface ConnectorState {
	artist: string;
	track: string;
	album?: string;
	albumArtist?: string;
	currentTime?: number;
	isPlaying?: boolean;
	isPodcast?: boolean;
	originUrl?: string;
	trackArt?: string;
	uniqueID?: string;
	duration?: number;
}

export type ConnectorProp = keyof ConnectorState;
export type ConnectorPropValue = ConnectorState[ConnectorProp];

export function createDefaultConnectorState(): ConnectorState {
	return {
		track: null,
		artist: null,
		album: null,
		albumArtist: null,
		uniqueID: null,
		duration: null,
		currentTime: null,
		isPlaying: true,
		trackArt: null,
		isPodcast: false,
		originUrl: null,
	};
}
