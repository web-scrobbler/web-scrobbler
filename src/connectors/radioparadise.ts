export {};

Connector.playerSelector = '#global-player';

// this will not be updated because the playerSelector doesn't encompass it
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
