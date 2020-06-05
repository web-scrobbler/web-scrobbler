'use strict';

Connector.playerSelector = '#app-container';

Connector.artistSelector = '.playingNow h3';

Connector.trackSelector = '.playingNow div[class*="songArtist"]';

Connector.albumSelector = '.playingNow div[class*="songRelease"]';

Connector.isPlaying = () => $('#jwplayerDiv').hasClass('jw-state-playing');
