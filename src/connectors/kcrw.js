'use strict';

Connector.playerSelector = '.play';

Connector.artistSelector = '.episode-name';

Connector.trackSelector = '.song-name';

Connector.isPlaying = () => Util.hasElementClass('.play', 'active');
