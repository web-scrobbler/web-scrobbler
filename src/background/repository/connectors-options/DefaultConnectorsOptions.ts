import { ConnectorsOptionsData } from '@/background/repository/connectors-options/ConnectorsOptionsData';

export const defaultConnectorsOptions: Readonly<ConnectorsOptionsData> = {
	tidal: {
		useShortTrackNames: false,
	},
	youtube: {
		scrobbleMusicOnly: true,
		scrobbleEntertainmentOnly: true,
	},
};
