'use strict';

Connector.playerSelector = '#player';

Connector.artistSelector = '#playerArtistName a';

Connector.trackSelector = '#playerTrackName a';

Connector.isPlaying = () => $('#playerPauseButton').is(':visible');
