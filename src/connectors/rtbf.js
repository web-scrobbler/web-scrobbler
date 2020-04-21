'use strict';

Connector.playerSelector = '.player';

Connector.artistSelector = '.program-info .artist-name';

Connector.trackSelector = '.program-info .title-name';

Connector.isPlaying = () => $('.player-controls a').hasClass('paused');
