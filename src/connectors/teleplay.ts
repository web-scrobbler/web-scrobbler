/**
 * Web Scrobbler connector for Telegram Audio Player
 *
 * This connector enables Last.fm scrobbling for the Telegram Audio Player
 * (Telegram Audio Player) application.
 *
 * Production URL: https://teleplay.rv7.nl/
 *
 * @see https://github.com/web-scrobbler/web-scrobbler/wiki/Connectors-development
 */

export {};

/**
 * Main player selector
 * The player element contains all the necessary metadata and controls
 */
Connector.playerSelector = '#player';

/**
 * Track title selector
 * The currently playing track title
 */
Connector.trackSelector = '#now-playing-title';

/**
 * Artist/performer selector
 * The artist or performer of the currently playing track
 */
Connector.artistSelector = '#now-playing-artist';

/**
 * Play button selector
 * When visible, the player is paused
 */
Connector.playButtonSelector = '#play-icon';

/**
 * Current time selector
 * Returns the current playback position in MM:SS format
 */
Connector.currentTimeSelector = '#current-time';

/**
 * Duration selector
 * Returns the total track duration in MM:SS format
 */
Connector.durationSelector = '#total-time';

/**
 * Track art selector
 * The album art/thumbnail for the currently playing track
 */
Connector.trackArtSelector = '#now-playing-thumb img';

/**
 * Check if the player is currently playing
 * @returns {boolean} True if playing, false otherwise
 */
Connector.isPlaying = () => {
	const audioPlayer = document.querySelector(
		'#audio-player',
	) as HTMLAudioElement;
	return audioPlayer ? !audioPlayer.paused : false;
};

/**
 * Get the current playback time in seconds
 * @returns {number} Current time in seconds
 */
Connector.getCurrentTime = () => {
	const audioPlayer = document.querySelector(
		'#audio-player',
	) as HTMLAudioElement;
	return audioPlayer ? Math.floor(audioPlayer.currentTime) : 0;
};

/**
 * Get the track duration in seconds
 * @returns {number} Duration in seconds
 */
Connector.getDuration = () => {
	const audioPlayer = document.querySelector(
		'#audio-player',
	) as HTMLAudioElement;
	return audioPlayer ? Math.floor(audioPlayer.duration) : 0;
};

/**
 * Get unique track ID
 * Uses a combination of track metadata to create a unique identifier
 * @returns {string} Unique track identifier
 */
Connector.getUniqueID = () => {
	const title = document.querySelector('#now-playing-title')?.textContent;
	const artist = document.querySelector('#now-playing-artist')?.textContent;
	const audioPlayer = document.querySelector(
		'#audio-player',
	) as HTMLAudioElement;
	const src = audioPlayer?.src || '';

	// Extract file ID from the blob URL or stream URL
	// Format: blob:http://localhost:3040/uuid or /api/stream/fileId
	const fileIdMatch = src.match(/\/stream\/([^/?]+)/);
	const fileId = fileIdMatch ? fileIdMatch[1] : src;

	// Combine artist, title, and file ID for uniqueness
	return `${artist || 'unknown'}-${title || 'unknown'}-${fileId}`
		.toLowerCase()
		.replace(/\s+/g, '-');
};

/**
 * Apply metadata filters to clean up track information
 * This helps remove common artifacts from track titles
 */
const filter = MetadataFilter.createFilter({
	// Remove common file extensions and quality indicators
	track: (text: string) => {
		return text
			.replace(/\.(mp3|m4a|flac|ogg|wav)$/i, '')
			.replace(/\s*\[.*?\]\s*/g, '') // Remove [brackets]
			.replace(/\s*\(.*?kbps\)/gi, '') // Remove bitrate info
			.trim();
	},
	// Clean up artist names
	artist: (text: string) => {
		return text.replace(/\s*\[.*?\]\s*/g, '').trim();
	},
});

Connector.applyFilter(filter);
