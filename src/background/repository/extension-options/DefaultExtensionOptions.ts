import { ExtensionOptionsData } from '@/background/repository/extension-options/ExtensionOptionsData';

export const defaultExtensionOptions: ExtensionOptionsData = {
	forceRecognize: false,
	scrobblePercent: 50,
	scrobblePodcasts: true,
	useNotifications: true,
	useUnrecognizedSongNotifications: false,
};
