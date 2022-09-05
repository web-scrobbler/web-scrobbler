'use strict';

// Need to select also .station to cover popup where #top_player_track is outside of .player.
Connector.playerSelector = ['.player', 'body > .station'];

Connector.artistTrackSelector = '#top_player_track';

Connector.playButtonSelector = '.player .b-play';
