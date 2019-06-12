'use strict';

Connector.playerSelector = '.radio-main';

Connector.artistSelector = '.sc-c-track__artist';

Connector.trackSelector = '.sc-c-track__title';

// TODO: remove these functions

Connector.getArtist = () => $(Connector.artistSelector).first().text();

Connector.getTrack = () => $(Connector.trackSelector).first().text();
