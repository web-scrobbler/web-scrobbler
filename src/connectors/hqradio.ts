'use strict';

Connector.playerSelector = '#player';

Connector.artistTrackSelector = '#track .title';

Connector.trackArtSelector = '#disc .cover';

Connector.isPlaying = () => $('body').hasClass('_playing');
