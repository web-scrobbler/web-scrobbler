export {};

/**
 * Example links to debug and test the connector:
 *
 * https://archive.org/details/AH013_sarin_sunday_-_the_lonely_hike
 * Full album
 *
 * https://archive.org/details/AH003_corwin_trails_-_corwin_trails
 * Full album with numeric prefixes
 *
 * https://archive.org/details/lp_everybody-knows-this-is-nowhere_neil-young-crazy-horse-robin-lane
 * Full album with artist suffixed in track names
 *
 * https://archive.org/details/dont-lie-beets-produce-ny-mix
 * Single track
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
	const tracks = getTracksElementShadowDom();
	if (tracks === null) {
		return false;
	}

	const trackTitles = tracks.querySelectorAll('.track .track-title');

	if (trackTitles.length === 0) {
		return false;
	}
	let hasAllTracksNumericPrefix = true;
	for (const trackTitle of trackTitles) {
		if (!numericTrackRegex.test(trackTitle?.textContent?.trim() ?? '')) {
			hasAllTracksNumericPrefix = false;
			break;
		}
	}

	return hasAllTracksNumericPrefix;
}

function getTracksElementShadowDom() {
	const tracksElement = document.querySelector('play-av');

	if (tracksElement === null) {
		return null;
	}

	return tracksElement.shadowRoot;
}

Connector.applyFilter(filter);

Connector.artistSelector = '.item-details-metadata > dl > dd a';

Connector.albumSelector = '.item-title';

Connector.currentTimeSelector = '.jw-text-elapsed';

Connector.durationSelector = '.jw-text-duration';

Connector.isPlaying = () => {
	const videoElement = document.querySelector('video');

	if (videoElement === null) {
		return false;
	}

	return !videoElement.paused;
};

Connector.getTrack = () => {
	const tracksElement = document.querySelector('play-av');

	if (tracksElement === null) {
		return null;
	}

	const trackElements = tracksElement.shadowRoot
		? tracksElement.shadowRoot.querySelector('.track.selected .track-title')
		: null;

	return trackElements ? trackElements.textContent.trim() : null;
};

Connector.getTrackArt = () => {
	const theaterElement = document.querySelector('ia-music-theater');

	if (theaterElement === null) {
		return null;
	}

	return theaterElement.querySelector('img')?.getAttribute('src');
};

Connector.playerSelector = '#theatre-ia';
