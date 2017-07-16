'use strict';

Connector.playerSelector = '.container';

Connector.artistTrackSelector = '.line1._navigateNowPlaying';

Connector.trackArtSelector = '.album.logo';

Connector.isPlaying = () => $('#tuner').hasClass('playing');
