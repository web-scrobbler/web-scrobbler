import type { Separator } from '@/core/content/util';

export {};

/**
 * Delimiter used by Ampwall to separate multiple artists
 */
const MULTIPLE_ARTIST_DELIMITER = ' &&&& ';

/**
 * Regex to match Various Artistsd
 */
const VARIOUS_ARTISTS_REGEXP = /variou?s\sartists?/i;

/**
 * List of separators used to split ArtistTrack string of VariousArtists albums.
 */
const SEPARATORS: Separator[] = [' - ', ' | '];

Connector.playerSelector = '[data-testid="global-audio-player"]';

Connector.trackArtSelector =
	'[data-testid="global-audio-player"] > div > a > img';

Connector.playButtonSelector = '#audio-player-play-button';

Connector.currentTimeSelector =
	'[data-testid="global-audio-player"]  [id^="player_timeElapsed"]';

Connector.durationSelector =
	'[data-testid="global-audio-player"]  [id^="player_timeTotal"]';

Connector.getAlbum = () =>
	Util.getAttrFromSelectors(
		'#audio-player-track-title',
		'data-audio-player-album-name',
	);

Connector.getArtistTrack = () => {
	let track = Util.getTextFromSelectors('#audio-player-track-title') ?? '';

	const artistData =
		Util.getAttrFromSelectors(
			'#audio-player-track-artists',
			'data-audio-player-track-artists',
		) ?? '';

	let artist = '';
	({ artist, track } = parseArtistTrackData(artistData, track));

	if (isVariousArtists(artist, track)) {
		({ artist, track } = getArtistDetailsFromTrack(artist, track));
	}

	return { artist, track };
};

/**
 * Parses artist and track details as obtained from Ampwall.
 * Ampwall uses a delimiter to separate multiple artists.
 * Splits artists using the delimiter and returns
 * a formatted artist string suitable for use.
 */
function parseArtistTrackData(text: string, track: string) {
	const artists = text.split(MULTIPLE_ARTIST_DELIMITER);

	return { artist: Util.joinArtistStrings(artists), track };
}

/**
 * Returns true if a track is tagged under "Various Artists"
 * and that there is a separator in the track indicating
 * that we can extract the artist/track details from the name.
 */
function isVariousArtists(mainArtist: string, track: string) {
	return (
		VARIOUS_ARTISTS_REGEXP.test(mainArtist ?? '') &&
		Util.findSeparator(track ?? '', SEPARATORS)
	);
}

/**
 * Returns artist, track details that is extracted from the track name itself.
 * If extraction fails, returns the details as-is.
 */
function getArtistDetailsFromTrack(artist: string, track: string) {
	const detailsFromTrack = Util.splitArtistTrack(track);
	if (detailsFromTrack?.artist && detailsFromTrack?.track) {
		return {
			artist: detailsFromTrack.artist,
			track: detailsFromTrack.track,
		};
	}
	return { artist, track };
}
