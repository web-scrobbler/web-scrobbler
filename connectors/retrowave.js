'use strict';

Connector.playerSelector = '#player';

Connector.artistTrackSelector = '#display-title';

Connector.durationSelector = '#display-time-total';

Connector.trackArtSelector = '#player-cover';

Connector.isPlaying = () => !$('#player').hasClass('player_paused');
