'use strict';

Connector.playerSelector = '.lecteur';

Connector.artistSelector = '.artiste .inside_call';

Connector.trackSelector = '.info-text .name';

Connector.isPlaying = () => $('.playing').length > 0;
