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
 * persistent bottom bar `.BarAudio`, which survives SPA navigation while the mix
 * keeps playing. While viewing an archive page we cache its parsed tracklist and
 * slug keyed by the bar title; after navigating away we resolve from that cache
 * so scrobbling continues against the playing show.
 *
 * Example link to debug and test the connector:
 * https://www.dublab.com/archive/shuta-hasunuma-guest-session-06-18-26
 */

interface TrackEntry {
	artist: string;
	track: string;
}

/**
 * Separators the tracklist actually uses, in priority order: spaced en-dash
 * (the site's default), then spaced em-dash and spaced hyphen as fallbacks.
 *
 * We deliberately restrict `splitArtistTrack` to these instead of its default
 * separator set: the defaults include `:`, `|`, `/` and `~`, which would both
 * mis-split real titles (e.g. an artist containing a colon) and turn incidental
 * annotation lines like "Recorded at: dublab" into bogus artist/track entries.
 */
const TRACKLIST_SEPARATORS = [' \u2013 ', ' \u2014 ', ' - '];

/**
 * Parsed entries are cached per `.tracklist` element: the tracklist never
 * changes for a given page, so we only re-parse when the element itself is
 * swapped (SPA navigation), instead of on every getter call every poll.
 */
let entriesCache: { list: HTMLElement; entries: TrackEntry[] } | null = null;

/**
 * Parsed tracklist + archive slug keyed by the normalised `.BarAudio .title`
 * string. Populated only while viewing the playing show's archive page; cleared
 * on full page reload (which also stops playback).
 */
const showCache = new Map<string, { entries: TrackEntry[]; slug: string }>();

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
		entriesCache = null;
		return [];
	}
	if (entriesCache?.list === list) {
		return entriesCache.entries;
	}

	const entries: TrackEntry[] = [];
	for (const rawLine of list.innerText.split('\n')) {
		const text = rawLine.trim();
		if (!text || /^tracklist:?$/i.test(text)) {
			continue;
		}

		const { artist, track } = Util.splitArtistTrack(
			text,
			TRACKLIST_SEPARATORS,
		);
		if (artist && track) {
			entries.push({ artist, track });
		}
	}

	entriesCache = { list, entries };
	return entries;
}

interface PlaybackState {
	entries: TrackEntry[];
	slug: string;
	index: number;
	currentTime: number;
	sliceDuration: number;
}

interface ShowSource {
	entries: TrackEntry[];
	slug: string;
}

/**
 * Normalise a title for tolerant comparison: lower-case and collapse runs of
 * whitespace to single spaces.
 *
 * @param text - Raw title text (may be null/undefined)
 * @returns Normalised title, or an empty string when there is nothing to compare
 */
function normalizeTitle(text: string | null | undefined): string {
	return (text ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Resolve the tracklist and archive slug for the show currently playing in
 * `.BarAudio`.
 *
 * Live path: while viewing the playing show's archive page, parse the on-screen
 * `.tracklist`, confirm the bar title appears in `document.title`, cache the
 * result, and return it.
 *
 * Cache path: after SPA navigation away from that page, return the cached entry
 * keyed by the bar title. The cache is only ever written on the live path, so a
 * mismatched page can never poison it with the wrong tracklist.
 *
 * @returns Parsed tracklist and slug, or null when nothing should be scrobbled.
 */
function resolveSource(): ShowSource | null {
	const barTitle = normalizeTitle(
		document.querySelector('.BarAudio .title')?.textContent,
	);
	if (!barTitle) {
		return null;
	}

	const liveEntries = getTrackEntries();
	if (
		liveEntries.length > 0 &&
		normalizeTitle(document.title).includes(barTitle)
	) {
		const slug = location.pathname.split('/').filter(Boolean).pop() ?? '';
		const source = { entries: liveEntries, slug };
		showCache.set(barTitle, source);
		return source;
	}

	return showCache.get(barTitle) ?? null;
}

/**
 * Compute the currently playing tracklist entry from the evenly-split mix.
 *
 * Returns null (so nothing is scrobbled) when no tracklist can be resolved, or
 * when the mix duration is unknown.
 *
 * @returns Current playback state, or null when nothing should be scrobbled.
 */
function getPlaybackState(): PlaybackState | null {
	const source = resolveSource();
	if (!source) {
		return null;
	}

	const { entries, slug } = source;

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

	return { entries, slug, index, currentTime, sliceDuration };
}

/**
 * Title-case a single whitespace-delimited word. Within a word, boundaries are
 * the start and common bracketing/separator characters (but not apostrophes, so
 * "THAT'S" → "That's"). The first letter after each boundary is upper-cased and
 * the rest lower-cased.
 *
 * @param word - Word to title-case (no internal whitespace)
 * @returns Title-cased word
 */
function titleCaseWord(word: string): string {
	return word
		.toLowerCase()
		.replace(/(^|[([/–-])(\p{L})/gu, (_, boundary, letter) => {
			return `${String(boundary)}${String(letter).toUpperCase()}`;
		});
}

/**
 * Title-case text whose source is predominantly all-caps.
 *
 * Only fully upper-cased words are re-cased; any word that already contains a
 * lower-case letter is left untouched, so entries that arrive already correctly
 * cased (e.g. "Aphex Twin") are preserved rather than flattened. All-caps
 * acronyms ("DJ", "MF DOOM", "V.A.") are indistinguishable from ordinary words
 * in an all-caps source and are unavoidably title-cased ("Dj", "Mf Doom",
 * "V.a.") — an accepted limitation of casing all-caps input.
 *
 * @param text - Text to title-case
 * @returns Title-cased text
 */
function titleCase(text: string): string {
	return text.replace(/\S+/g, (word) => {
		if (/\p{Ll}/u.test(word)) {
			return word;
		}
		return titleCaseWord(word);
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
	return `${state.slug}-${state.index}`;
};

Connector.isPlaying = () => {
	const playPause = document.querySelector('.BarAudio .play-pause');
	return playPause?.classList.contains('icon-player-pause') ?? false;
};
