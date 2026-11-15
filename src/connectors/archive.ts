export {};

import type { State } from './jwplayer-dom-inject';

/**
 * Example links to debug and test the connector:
 *
 * https://archive.org/details/dystopiaq029
 * Full album - JW Player artist is present and must be kept ('mix-toor')
 *
 * https://archive.org/details/AH003_corwin_trails_-_corwin_trails
 * Full album with numeric prefixes - artist falls back to creator ('Corwin Trails')
 *
 * https://archive.org/details/gd77-05-08.sbd.hicks.4982.sbeok.shnf
 * Etree
 *
 * https://archive.org/details/gd77-05-08.sbd.hicks.4982.sbeok.shnf/gd77-05-08eaton-d1t03.shn
 * Etree track without artist metadata - artist must fall back to the item creator ('Grateful Dead')
 *
 * All linked examples are regression cases and must keep passing.
 */

const numericTrackRegex = /^\d+\w+/;

const ARTIST_SELECTOR = '[itemprop="creator"]';

const filter = MetadataFilter.createFilter({ track: removeNumericPrefixes });

function removeNumericPrefixes(track: string) {
	if (hasAllTracksNumericPrefix()) {
		return track.trim().replace(/^(\d+\w+)/, '');
	}

	return track;
}

function hasAllTracksNumericPrefix() {
	const playlist = state?.getPlaylist ?? [];

	let hasAllTracksNumericPrefix = true;
	for (const track of playlist) {
		if (!numericTrackRegex.test(track.trim() ?? '')) {
			hasAllTracksNumericPrefix = false;
			break;
		}
	}

	return hasAllTracksNumericPrefix;
}

/**
 * Resolve artist and track for the current JW Player item. Playlist items
 * rarely carry an artist; fall back to an 'Artist - Title' split of the
 * track name, then to the item-level creator.
 */
function resolveArtistTrack() {
	const jwArtist = state.getArtist;
	const rawTrack = state.getTrack;
	if (!rawTrack) {
		return { artist: jwArtist, track: rawTrack };
	}

	// Only ' - ' is a safe separator here: '->' and '/' appear in song titles.
	const { artist, track } = Util.splitArtistTrack(
		rawTrack.replace(/^\d+\W*/, ''),
		[' - '],
	);

	return {
		artist:
			jwArtist || artist || Util.getTextFromSelectors(ARTIST_SELECTOR),
		track: artist && track ? track : rawTrack,
	};
}

Connector.applyFilter(filter);

Connector.albumArtistSelector = ARTIST_SELECTOR;

Connector.albumSelector = '[itemprop="name"]';

Connector.getTrackArt = () => {
	const theaterElement = document.querySelector('ia-music-theater');

	if (theaterElement === null) {
		return null;
	}

	return theaterElement.querySelector('img')?.getAttribute('src');
};

Connector.injectScript('connectors/jwplayer-dom-inject.js');

let state: Partial<State> = {};

Connector.onScriptEvent = (event) => {
	state = event.data.state as State;
	Connector.onStateChanged();
};

Connector.isPlaying = () => state?.isPlaying;

Connector.getDuration = () => state?.getDuration;

Connector.getTrack = () => resolveArtistTrack().track;

Connector.getArtist = () => resolveArtistTrack().artist;
