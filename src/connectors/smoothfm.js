'use strict';

Connector.playerSelector = '.nowplaying';

Connector.artistSelector = '#playerArtistName';

Connector.trackSelector = '#playerSongName';

Connector.isPlaying = () => $('.player-play').hasClass('hidden');
