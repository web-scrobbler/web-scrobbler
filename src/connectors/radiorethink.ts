export {};

const trackArtSelector = '#currentTracklookupImage';

Connector.playerSelector = 'body';

Connector.pauseButtonSelector = '.bottom-bar .pause';

Connector.artistSelector = '#currentTrackArtist';

Connector.trackSelector = '#currentTrackTrack';

Connector.albumSelector = '#currentTrackAlbum';

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(trackArtSelector);
	/*
	 * Remove Amazon "resize" parameter from the track art URL,
	 * e.g. https://m.media-amazon.com/images/I/41opxuAS4EL._SL160_.jpg
	 */
	return trackArtUrl && trackArtUrl.replace(/\._SL\d+_/, '');
};

Connector.isTrackArtDefault = (url) => url?.includes('placeHolderCovers');
