'use strict';

Connector.playerSelector = '#plex';

Connector.artistSelector = '.grandparent-title';

Connector.trackSelector = '.title-container .item-title';

Connector.currentTimeSelector = '.player-position';

Connector.durationSelector = '.player-duration';

Connector.isPlaying = () => $('.player .play-btn').hasClass('hidden');

Connector.getTrackArt = () => $('.player .media-poster').data('imageUrl');

Connector.getAlbum = () => $('.player .media-poster').data('parentTitle');
