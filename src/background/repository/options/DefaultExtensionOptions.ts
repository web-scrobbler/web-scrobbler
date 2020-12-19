import { ExtensionOptionsData } from '@/background/repository/options/ExtensionOptionsData';

export const defaultExtensionOptions: ExtensionOptionsData = {
	forceRecognize: false,
	scrobblePercent: 50,
	scrobblePodcasts: true,
	useNotifications: true,
	useUnrecognizedSongNotifications: false,
};
