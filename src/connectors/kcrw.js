'use strict';

Connector.playerSelector = '#player';

Connector.artistSelector = '.episode-name';

Connector.trackSelector = '.song-name';

Connector.isPlaying = () => Util.hasElementClass('.play', 'active');
