'use strict';

Connector.playerSelector = '#player-controller';

Connector.trackArtSelector = '.imgEl > img';

Connector.artistTrackSelector = '.currentSong';

Connector.isPlaying = () => $('.progressBg').width() > 0;
