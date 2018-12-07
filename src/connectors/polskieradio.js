'use strict';

Connector.playerSelector = '#cM';

Connector.getArtist = () => $('.present .artist').first().text();

Connector.getTrack = () => $('.present .title').first().text();

Connector.isPlaying = () => $('#jwPlay').hasClass('pause');
