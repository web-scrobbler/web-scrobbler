'use strict';

Connector.playerSelector = '#player_container';

Connector.artistSelector = '[data-name="artist-name"], [data-name="song-artist"]';

Connector.trackSelector = '[data-name="song-name"]';

Connector.isPlaying = () => $('#player_container').hasClass('jp-state-playing');
