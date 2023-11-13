export {};

const PAUSE_ICON = 59802;

const ARTIST_SELECTORS = [
	// Version A
	'.AudioPlayer-content .subtitle',
	// Version K
	'.pinned-audio-subtitle',
];

const TRACK_SELECTORS = [
	// Version A
	'.AudioPlayer-content .title',
	// Version K
	'.pinned-audio-title',
];

Connector.trackSelector = '.AudioPlayer-content > .title, .pinned-audio-title';

Connector.getArtistTrack = () => {
	const artist = Util.getTextFromSelectors(ARTIST_SELECTORS);
	const track = Util.getTextFromSelectors(TRACK_SELECTORS);
	if (artist === null || artist.startsWith('Unknown')) {
		return Util.splitArtistTrack(track);
	}
	return { artist, track };
};

Connector.isStateChangeAllowed = () =>
	!Util.isElementVisible(
		'.playback-button-inner, .pinned-audio-wrapper-utils button:nth-child(2) span',
	);

const filter = MetadataFilter.createFilter({
	track: trimTrackSuffix,
});

Connector.applyFilter(filter);

function trimTrackSuffix(track: string): string {
	const index = track.lastIndexOf('.');
	if (index === -1) return track;
	return track.substring(0, index);
}
