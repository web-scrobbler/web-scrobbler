'use strict';


Connector.playerSelector = '.app-content';

Connector.trackSelector = '.meta .track-name';

Connector.artistSelector = '.meta .artist-name';

Connector.currentTimeSelector = '.elapsed-time';

Connector.durationSelector = '.track-length';

Connector.trackArtSelector = '.current-track img';

Connector.isPlaying = () => Util.hasElementClass('button.play-track', 'hidden');
