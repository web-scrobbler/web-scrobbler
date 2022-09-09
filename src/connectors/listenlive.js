'use strict';

Connector.playerSelector = '#nowPlaying';

Connector.artistSelector = '.nowPlayingCard .song .artist';

Connector.trackSelector = '.nowPlayingCard .song .title';

Connector.isPlaying = () => Util.hasElementClass('#nowPlaying', 'hasSong');
