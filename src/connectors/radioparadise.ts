export {};

// The album lives in the info panel, outside of `#global-player`, and is
// updated about 500 ms after the title. Observe a common ancestor so that
// the album change triggers a state update, instead of keeping the album of
// the previous track.
Connector.playerSelector = ['#fuse-main-content', '#global-player'];

Connector.albumSelector = '.now_playing .now-album a[href]';

Connector.artistSelector = '.playing-info-section .player-artist';
Connector.trackSelector = '.playing-info-section .player-title';

Connector.pauseButtonSelector = '#global-player #pause-button';
Connector.playButtonSelector = '#global-player #play-button';

Connector.trackArtSelector = '.playing-info-section img.player-cover';
Connector.getTrackArt = () => {
	const link = Util.extractImageUrlFromSelectors(Connector.trackArtSelector);
	return link?.replace(/\/covers\/[sm]\//, '/covers/l/');
};

Connector.scrobblingDisallowedReason = () => {
	return Connector.getTrack()?.includes('Listener-supported') ||
		Connector.getArtist()?.startsWith('Commercial-Free')
		? 'FilteredTag'
		: null;
};
