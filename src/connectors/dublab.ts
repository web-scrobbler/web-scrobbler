export {};

/**
 * dublab (dublab.com) archive connector.
 *
 * An archive item is a single continuous mix with no per-track timing data, but
 * it does embed a static tracklist (`ARTIST – TRACK` lines) in the page body.
 * We scrobble each tracklist entry by evenly dividing the mix duration across
 * the entries: this is approximate, but a full listen scrobbles the correct set
 * of tracks roughly once each.
 *
 * There is no `<audio>` element in the DOM; playback state is surfaced in the
 * persistent bottom bar `.BarAudio`.
 *
 * Example link to debug and test the connector:
 * https://www.dublab.com/archive/shuta-hasunuma-guest-session-06-18-26
 */

interface TrackEntry {
	artist: string;
	track: string;
}

/**
 * Parse the static tracklist embedded in the page body.
 *
 * The site renders each `ARTIST – TRACK` line as a separate text node with the
 * line breaks realised via layout, so `innerText` yields them newline-separated
 * (whereas `textContent` would concatenate them). The leading "Tracklist:"
 * header and any line without an artist/track separator are skipped.
 *
 * @returns Ordered list of tracklist entries, or an empty array if none.
 */
function getTrackEntries(): TrackEntry[] {
	const list = document.querySelector<HTMLElement>('.tracklist');
	if (!list) {
		return [];
	}

	const entries: TrackEntry[] = [];
	for (const rawLine of list.innerText.split('\n')) {
		const text = rawLine.trim();
		if (!text || /^tracklist:?$/i.test(text)) {
			continue;
		}

		const { artist, track } = Util.splitArtistTrack(text);
		if (artist && track) {
			entries.push({ artist, track });
		}
	}

	return entries;
}

interface PlaybackState {
	entries: TrackEntry[];
	index: number;
	currentTime: number;
	sliceDuration: number;
}

/**
 * Compute the currently playing tracklist entry from the evenly-split mix.
 *
 * Returns null (so nothing is scrobbled) when there is no tracklist, when the
 * duration is unknown, or when the audio playing in `.BarAudio` belongs to a
 * different show than the one currently on screen (the persistent player keeps
 * playing across SPA navigation).
 *
 * @returns Current playback state, or null when nothing should be scrobbled.
 */
function getPlaybackState(): PlaybackState | null {
	const entries = getTrackEntries();
	if (entries.length === 0) {
		return null;
	}

	// Navigation-mismatch guard: only scrobble when the audio playing in the bar
	// belongs to the archive currently displayed. `.BarAudio .title` holds the
	// playing show's title, which is a prefix of the viewed page's document.title.
	const barTitle = document
		.querySelector('.BarAudio .title')
		?.textContent?.trim();
	if (!barTitle || !document.title.includes(barTitle)) {
		return null;
	}

	const timecode =
		document.querySelector('.BarAudio .timecode')?.textContent?.trim() ??
		'';
	const [currentStr, durationStr] = timecode.split('/');
	const currentTime = Util.stringToSeconds(currentStr);
	const totalDuration = Util.stringToSeconds(durationStr);
	if (totalDuration <= 0) {
		return null;
	}

	const sliceDuration = totalDuration / entries.length;
	const index = Math.min(
		entries.length - 1,
		Math.max(0, Math.floor(currentTime / sliceDuration)),
	);

	return { entries, index, currentTime, sliceDuration };
}

/**
 * Capitalise the first letter of each word. The source tracklist is all-caps.
 * Word boundaries include whitespace and common bracketing/separator characters
 * but deliberately not apostrophes (so "that's" stays "That's").
 *
 * @param text - Text to title-case
 * @returns Title-cased text
 */
function titleCase(text: string): string {
	return text
		.toLowerCase()
		.replace(/(^|[\s([/–-])(\p{L})/gu, (_, boundary, letter) => {
			return `${String(boundary)}${String(letter).toUpperCase()}`;
		});
}

const filter = MetadataFilter.createFilter({
	artist: titleCase,
	track: titleCase,
});

Connector.applyFilter(filter);

Connector.playerSelector = '.BarAudio';

Connector.getArtist = () => {
	const state = getPlaybackState();
	return state ? state.entries[state.index].artist : null;
};

Connector.getTrack = () => {
	const state = getPlaybackState();
	return state ? state.entries[state.index].track : null;
};

Connector.getCurrentTime = () => {
	const state = getPlaybackState();
	return state ? state.currentTime - state.index * state.sliceDuration : null;
};

Connector.getDuration = () => {
	const state = getPlaybackState();
	return state ? state.sliceDuration : null;
};

Connector.getUniqueID = () => {
	const state = getPlaybackState();
	if (!state) {
		return null;
	}
	const slug = location.pathname.split('/').filter(Boolean).pop();
	return `${slug ?? ''}-${state.index}`;
};

Connector.isPlaying = () => {
	const playPause = document.querySelector('.BarAudio .play-pause');
	return playPause?.classList.contains('icon-player-pause') ?? false;
};
