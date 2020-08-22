'use strict';

Connector.playerSelector = '#winamp-meta';

Connector.isPlaying = () => Util.hasElementClass('#main-window', 'play');
Connector.getAlbum = () => Util.getTextFromSelectors('#winamp-meta-album', 'unknown');
Connector.getArtist = () => Util.getTextFromSelectors('#winamp-meta-artist', 'unknown');
Connector.getTrack = () => Util.getTextFromSelectors('#winamp-meta-title', 'unknown');
