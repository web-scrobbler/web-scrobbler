export {};

Connector.playerSelector = '#player';

Connector.artistSelector = '#songdetails .artist';

Connector.trackSelector = '#songdetails .song';

Connector.albumSelector = '#songdetails .album';

Connector.playButtonSelector = '#player .PlayTrack';

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors('#coverart img');
	// Remove size flag from track art URL
	return trackArtUrl && trackArtUrl.replace(/&size=\d+/, '');
};

Connector.currentTimeSelector = '#played';

Connector.durationSelector = '#duration';

Connector.isScrobblingAllowed = () => {
	return Connector.getDuration() !== 0;
};
