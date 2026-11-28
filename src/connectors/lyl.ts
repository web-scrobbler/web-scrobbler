import type { Separator } from '@/core/content/util';

export {};

/**
 * LYL Radio (lyl.live) archived-episode connector.
 *
 * An episode page renders a static tracklist (`ARTIST - TRACK` lines) but has no
 * player of its own: playback is delegated to a Mixcloud widget in a
 * cross-origin iframe. The tracklist therefore lives on `lyl.live` while the
 * playback clock lives inside the Mixcloud widget, so we bridge the two.
 *
 * Timing comes from the Mixcloud widget's `postMessage` API: the widget posts
 * `progress` events (`args: [position, duration]`) plus `play`/`pause` events,
 * which we cache and use to drive scrobbling. Mixcloud exposes no per-track
 * timing, so — like the dublab connector — we approximate by evenly dividing the
 * episode duration across the tracklist entries: a full listen scrobbles the
 * correct set of tracks roughly once each.
 *
 * The site is a single-page app with a persistent player: the iframe survives
 * navigation and keeps playing while the user browses other pages, at which
 * point the on-screen `.tracklist` no longer matches the playing show. The
 * playing show is identified by the `feed` query param of the persistent
 * iframe's `src` (readable cross-origin as an attribute); we cache each
 * episode's parsed tracklist keyed by that feed at the moment it starts playing
 * (when the visible tracklist provably belongs to it) and always scrobble the
 * playing feed's cached tracklist, even after navigating away.
 *
 * Example link to debug and test the connector:
 * https://lyl.live/episode/horny-music-for-ambient-people-2026-07-16
 */

interface TrackEntry {
	artist: string;
	track: string;
}

/**
 * Separators the tracklist actually uses, in priority order: spaced hyphen (the
 * site's default), then spaced en-dash and em-dash as fallbacks.
 *
 * We deliberately restrict `splitArtistTrack` to these instead of its default
 * separator set: the defaults include `:`, `|`, `/` and `~`, which would both
 * mis-split real titles (e.g. an artist containing a colon) and turn incidental
 * annotation lines into bogus artist/track entries.
 */
const TRACKLIST_SEPARATORS: Separator[] = [' - ', ' – ', ' — '];

/**
 * Latest playback state as reported by the Mixcloud widget's `postMessage` API.
 * `seen` guards against scrobbling before any `progress` event has arrived (when
 * `duration` is still unknown).
 */
const widgetState = {
	position: 0,
	duration: 0,
	isPlaying: false,
	seen: false,
};

/**
 * Parsed entries are cached per `.tracklist` element: the tracklist never
 * changes for a given page, so we only re-parse when the element itself is
 * swapped (SPA navigation), instead of on every getter call every poll.
 */
let entriesCache: { list: HTMLElement; entries: TrackEntry[] } | null = null;

/**
 * Parsed tracklist keyed by the Mixcloud `feed` slug of the show it belongs to.
 * Populated only when a feed starts playing while its own tracklist is on
 * screen, so a mismatched page can never poison it with the wrong tracklist.
 */
const showCache = new Map<string, TrackEntry[]>();

/**
 * The feed slug we last observed playing. Used to detect the moment a new show
 * starts, which is the only time we (re)populate {@link showCache}.
 */
let lastPlayingFeed: string | null = null;

/**
 * Narrow an unknown value to a plain object so its properties can be read.
 *
 * @param value - Value to test
 * @returns True when `value` is a non-null object
 */
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

/**
 * Handle a `postMessage` from the embedded Mixcloud widget, updating
 * {@link widgetState} and pushing the change to web-scrobbler.
 *
 * The widget posts JSON (as a string) shaped like
 * `{ type: 'event', data: { eventName, args }, mixcloud: 'playerWidget' }`.
 * `progress` carries `[position, duration]` in seconds; `play`/`pause`/`ended`
 * toggle the playing flag. Other events (e.g. `buffering`) are ignored.
 *
 * @param event - The window message event
 */
function handleWidgetMessage(event: MessageEvent): void {
	if (!event.origin.endsWith('.mixcloud.com')) {
		return;
	}

	let payload: unknown = event.data;
	if (typeof payload === 'string') {
		try {
			payload = JSON.parse(payload);
		} catch {
			return;
		}
	}
	if (
		!isRecord(payload) ||
		payload.mixcloud !== 'playerWidget' ||
		payload.type !== 'event' ||
		!isRecord(payload.data)
	) {
		return;
	}

	const { eventName, args } = payload.data;
	switch (eventName) {
		case 'progress':
			if (
				Array.isArray(args) &&
				typeof args[0] === 'number' &&
				typeof args[1] === 'number'
			) {
				widgetState.position = args[0];
				widgetState.duration = args[1];
				widgetState.seen = true;
			}
			break;
		case 'play':
			widgetState.isPlaying = true;
			break;
		case 'pause':
		case 'ended':
			widgetState.isPlaying = false;
			break;
		default:
			return;
	}

	Connector.onStateChanged();
}

/**
 * Parse the static tracklist embedded in the current episode page.
 *
 * Each `ARTIST - TRACK` line is rendered as a separate text node with line
 * breaks realised via layout, so `innerText` yields them newline-separated
 * (whereas `textContent` would concatenate them). The leading "Tracklist:"
 * header and any line without an artist/track separator are skipped.
 *
 * @returns Ordered list of tracklist entries, or an empty array if none.
 */
function getVisibleTrackEntries(): TrackEntry[] {
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

/**
 * Resolve the Mixcloud `feed` slug currently loaded in the persistent player
 * iframe. This identifies the playing show and survives SPA navigation.
 *
 * @returns Feed slug with surrounding slashes stripped, or null when no player
 * iframe is present.
 */
function getPlayingFeed(): string | null {
	const iframe = document.querySelector<HTMLIFrameElement>(
		'iframe[src*="mixcloud.com"]',
	);
	if (!iframe) {
		return null;
	}

	let feed: string | null;
	try {
		feed = new URL(iframe.src, location.href).searchParams.get('feed');
	} catch {
		return null;
	}
	if (!feed) {
		return null;
	}

	return feed.replace(/^\/+|\/+$/g, '');
}

/**
 * Cache the on-screen tracklist for a feed the first time we see it playing.
 *
 * Caching only on the play transition (a change of playing feed) means merely
 * navigating to another episode page while a show keeps playing never overwrites
 * that show's cached tracklist with the newly-visible one.
 *
 * @param feed - The feed slug now playing, or null
 */
function cachePlayingFeed(feed: string | null): void {
	if (!feed || feed === lastPlayingFeed) {
		return;
	}
	lastPlayingFeed = feed;

	const entries = getVisibleTrackEntries();
	if (entries.length > 0) {
		showCache.set(feed, entries);
	}
}

interface PlaybackState {
	entries: TrackEntry[];
	feedSlug: string;
	index: number;
	currentTime: number;
	sliceDuration: number;
}

/**
 * Compute the currently playing tracklist entry from the evenly-split episode.
 *
 * Returns null (so nothing is scrobbled) when no feed is playing, when we have
 * no cached tracklist for it, or when the duration is not yet known.
 *
 * @returns Current playback state, or null when nothing should be scrobbled.
 */
function getPlaybackState(): PlaybackState | null {
	const feed = getPlayingFeed();
	cachePlayingFeed(feed);
	if (!feed) {
		return null;
	}

	const entries = showCache.get(feed);
	if (!entries || entries.length === 0) {
		return null;
	}
	if (!widgetState.seen || widgetState.duration <= 0) {
		return null;
	}

	const sliceDuration = widgetState.duration / entries.length;
	const index = Math.min(
		entries.length - 1,
		Math.max(0, Math.floor(widgetState.position / sliceDuration)),
	);

	return {
		entries,
		feedSlug: feed,
		index,
		currentTime: widgetState.position,
		sliceDuration,
	};
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

window.addEventListener('message', handleWidgetMessage);

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
	return state ? `${state.feedSlug}-${state.index}` : null;
};

Connector.isPlaying = () => widgetState.isPlaying;
