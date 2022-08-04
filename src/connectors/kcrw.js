'use strict';

Connector.playerSelector = '.play';

Connector.artistSelector = '.episode-name';

Connector.trackSelector = '.song-name';

Connector.isPlaying = () => $('.play').hasClass('.active');
