'use strict';

Connector.playerSelector = '#player';

Connector.artistSelector = '#now-playing-title > div.song-details > h2 > a';

Connector.trackSelector = '#now-playing-title > div.song-details > h1';

Connector.timeInfoSelector = '#current-time';

Connector.isPlaying = () => !$('#playPause-large').hasClass('paused');
