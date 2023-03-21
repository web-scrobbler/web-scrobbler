export {};

Connector.playerSelector = '.Player';

Connector.artistTrackSelector = '.Player-title';

Connector.albumSelector = '.Player-album';

Connector.trackArtSelector = '.Player-coverImage';

Connector.isTrackArtDefault = (url) => url?.includes('default') ?? false;

Connector.isPlaying = () =>
	Util.hasElementClass(Connector.playerSelector ?? '', 'Player--playing');
