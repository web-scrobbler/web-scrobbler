'use strict';

Connector.playerSelector = '.mgr-player';

Connector.trackSelector = '.mgr-player-nowplaying .mgr-player-title';

Connector.artistSelector = '.mgr-player-nowplaying .mgr-player-artist';

Connector.albumSelector = '.mgr-player-nowplaying .mgr-player-album';

Connector.currentTimeSelector = '.mgr-player-top .jp-current-time';

Connector.durationSelector = '.mgr-player-top .jp-duration';

Connector.trackArtSelector = '.mgr-player-nowplaying .mgr-player-artwork';

Connector.isPlaying = () => Util.getAttrFromSelectors('.mgr-player-top .mgr-player-play', 'src') === '/svg/btn-pause.svg';
