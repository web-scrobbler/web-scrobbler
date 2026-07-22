export {};

/**
 * Example links to debug and test the connector:
 *
 * https://archive.org/details/dystopiaq029
 * Full album
 *
 * https://archive.org/details/AH003_corwin_trails_-_corwin_trails
 * Full album with numeric prefixes
 *
 * https://archive.org/details/gd77-05-08.sbd.hicks.4982.sbeok.shnf
 * Etree
 */

const numericTrackRegex = /^\d+\w+/;

const filter = MetadataFilter.createFilter({ track: removeNumericPrefixes });

function removeNumericPrefixes(track: string) {
	if (hasAllTracksNumericPrefix()) {
		return track.trim().replace(/^(\d+\w+)/, '');
	}

	return track;
}

function hasAllTracksNumericPrefix() {
	const playlist = state?.getPlaylist;

	let hasAllTracksNumericPrefix = true;
	for (const track of playlist) {
		if (!numericTrackRegex.test(track.trim() ?? '')) {
			hasAllTracksNumericPrefix = false;
			break;
		}
	}

	return hasAllTracksNumericPrefix;
}

Connector.applyFilter(filter);

Connector.albumArtistSelector = '[itemprop="creator"]';

Connector.albumSelector = '[itemprop="name"]';

Connector.getTrackArt = () => {
	const theaterElement = document.querySelector('ia-music-theater');

	if (theaterElement === null) {
		return null;
	}

	return theaterElement.querySelector('img')?.getAttribute('src');
};

Connector.injectScript('connectors/archive-dom-inject.js');

let state = null;
Connector.onScriptEvent = (event) => {
	state = event.data.state;
	Connector.onStateChanged();
};

Connector.isPlaying = () => state?.isPlaying;

Connector.getDuration = () => state?.getDuration;

Connector.getTrack = () => state?.getTrack;

Connector.getArtist = () => state?.getArtist || Connector.getAlbumArtist();
