'use strict';

Connector.playerSelector = '#player-core';

Connector.artistSelector = '#artist';

Connector.trackSelector = '#title';

Connector.getTrackArt = () => $('#player-current-song').attr('rel');
