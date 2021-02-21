export type ConnectorStateContext = GeneralContext | YouTubeContext;

interface GeneralContext {
	/**
	 * Whether a now playing track is podcast.
	 */
	readonly isPodcast: boolean;
}

interface YouTubeContext {
	/**
	 * Category of now playing YouTube video.
	 */
	readonly videoCategory: string;
}

export function isGeneralContext(
	context: ConnectorStateContext
): context is GeneralContext {
	return 'isPodcast' in context;
}

export function isYouTubeContext(
	context: ConnectorStateContext
): context is YouTubeContext {
	return 'videoCategory' in context;
}
