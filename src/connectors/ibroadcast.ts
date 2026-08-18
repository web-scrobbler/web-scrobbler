export {};

Connector.playerSelector = '.mgr-player';

Connector.trackSelector = '.mgr-player-title';

Connector.artistSelector = '.mgr-player-artist';

Connector.albumSelector = '.mgr-player-album';

Connector.currentTimeSelector = '.mgr-player-current-time';

Connector.durationSelector = '.mgr-player-duration';

Connector.trackArtSelector = '.mgr-player-artwork-image';

Connector.loveButtonSelector = '.mgr-player-controls .icon-thumbs-up';

Connector.unloveButtonSelector = '.mgr-player-controls .icon-thumbs-up-on';

Connector.isPlaying = () =>
	Util.hasElementClass(['.mgr-player-play'], 'icon-player-pause');
