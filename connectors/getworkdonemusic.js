'use strict';

Connector.playerSelector = '.container';

Connector.trackArtSelector = '.playing .active img';

Connector.artistTrackSelector = '.playing .sc-title';

Connector.isPlaying = () => $('.sc-remote-link').hasClass('playing');
