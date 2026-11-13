export {};

Connector.playerSelector = '.player';

// Title and artist are rendered twice inside a marquee; aria-label holds a clean copy
Connector.getTrack = () =>
	Util.getAttrFromSelectors('.player-title', 'aria-label');

Connector.getArtist = () =>
	Util.getAttrFromSelectors('.player-artist', 'aria-label');

Connector.isPlaying = () => Util.hasElementClass('#kast-play', 'kast-playing');

Connector.trackArtSelector = '.player-playlist-item.onair img';

Connector.isTrackArtDefault = (url) => url?.includes('default');
