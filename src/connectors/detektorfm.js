'use strict';

Connector.playerSelector = '.playerinfo';

Connector.artistSelector = '.playerinfo__artist';

Connector.trackSelector = '.playerinfo__title';

Connector.isPlaying = () => Util.hasElementClass('.dfm-play', 'is-playing');
