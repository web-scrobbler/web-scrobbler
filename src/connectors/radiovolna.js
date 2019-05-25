'use strict';

Connector.playerSelector = '#player_container';

// FIXME: Convert selectors after multiselector is merged
Connector.artistSelector = '.player-title [data-name="artist-name"], [data-name="song-artist"]';

Connector.trackSelector = '[data-name="song-name"]';

Connector.isPlaying = () => $('#player_container').hasClass('jp-state-playing');
