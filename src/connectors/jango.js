'use strict';

Connector.playerSelector = '#masthead';

Connector.artistSelector = '#player_current_artist a';

Connector.trackSelector = '#current-song';

Connector.isPlaying = () => $('#btn-playpause').hasClass('pause');
