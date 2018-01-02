'use strict';

Connector.playerSelector = '#header';

Connector.artistTrackSelector = '#nowplaying_title > b';

Connector.trackArtSelector = '#nowplaying_title > img';

Connector.isPlaying = () => $('#play_button').hasClass('button_active');
