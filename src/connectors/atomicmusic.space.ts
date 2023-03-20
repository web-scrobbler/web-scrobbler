'use strict';

Connector.playerSelector = '.sound-player';

Connector.artistSelector = '.sound-playlist-content .current-seek .title-info';

Connector.trackSelector = '#title-link';

Connector.trackArtSelector = '.player-img-link > .img';

Connector.currentTimeSelector = '.jp-current-time';

Connector.durationSelector = '.jp-duration';

Connector.isPlaying = () => $('.jp-pause').css('display') === 'block';
