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

const artistSelectors = [
	'.key-val-big a span',
	'.item-details-metadata > dl > dd a',
];
const trackSelectors = [
	// https://archive.org/details/AH003_corwin_trails_-_corwin_trails
	'.jwrowV2.playing .ttl',

	// https://archive.org/details/lp_everybody-knows-this-is-nowhere_neil-young-crazy-horse-robin-lane
	'.audio-track-list .selected .track-title',
];
const albumSelector = '.thats-left > h1 [itemprop=name]';
const tracksSelector = '.jwrowV2 .ttl';

const numericTrackRegex = /^\d+\w+/;

const filter = MetadataFilter.createFilter({ track: removeNumericPrefixes });

Connector.applyFilter(filter);

function removeNumericPrefixes(track: string) {
	if (hasAllTracksNumericPrefix()) {
		return track.trim().replace(/^(\d+\w+)/, '');
	}

	return track;
}

Connector.currentTimeSelector = '.jw-text-elapsed';

Connector.durationSelector = '.jw-text-duration';

Connector.isPlaying = () => {
	const videoElement = document.querySelector('video');

	if (videoElement === null) {
		return false;
	}

	return !videoElement.paused;
};

Connector.playerSelector = '#theatre-ia';

Connector.trackArtSelector = [
	// https://archive.org/details/AH013_sarin_sunday_-_the_lonely_hike
	'#theatre-ia center > img',

	// https://archive.org/details/lp_everybody-knows-this-is-nowhere_neil-young-crazy-horse-robin-lane
	'.album-cover img',
];

Connector.getTrackInfo = () => {
	const artist = getArtists(artistSelectors);
	let album = Util.getTextFromSelectors(albumSelector);
	let track = Util.getTextFromSelectors(trackSelectors);

	if (track) {
		// Second item could be an artist name or track duration
		const [firstItem, secondItem] = track
			.split('-')
			.map((item) => item.trim());

		if (artist?.includes(secondItem)) {
			track = firstItem;
		}
	} else {
		track = album;
		album = null;
	}

	return { artist, track, album };
};

function hasAllTracksNumericPrefix() {
	const tracks = document.querySelectorAll(tracksSelector);
	if (tracks.length === 0) {
		return false;
	}

	let hasAllTracksNumericPrefix = true;
	for (const track of tracks) {
		if (!numericTrackRegex.test(track?.textContent?.trim() ?? '')) {
			hasAllTracksNumericPrefix = false;
			break;
		}
	}

	return hasAllTracksNumericPrefix;
}

function getArtists(selectors: string[]) {
	const artistElements = Util.queryElements(selectors);
	return artistElements && Util.joinArtists([...artistElements]);
}
