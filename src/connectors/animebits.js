'use strict';

Connector.playerSelector = '#radio-left';

Connector.artistSelector = '#meta-container .np-artist';

Connector.albumSelector = '#meta-container .np-album';

Connector.trackSelector = '#meta-container .np-song';

Connector.trackArtSelector = 'img.main-cover';

Connector.durationSelector = '#time-container .duration';

Connector.currentTimeSelector = '#time-container .current-time';

Connector.isPlaying = () => Util.hasElementClass('#play-pause', 'playing');
