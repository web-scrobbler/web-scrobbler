
Connector.playerSelector = '#player';

Connector.artistSelector = '#player .active .fullplayer-info-artist-name a';

Connector.getAlbum = function () {
    'use strict';
    var albumText = $('#player .miniplayer-info-album-title').text().replace(/^from /, '');
    return albumText || null;
};

Connector.trackSelector = '#player .fullplayer-song-wrapper.active .fullplayer-info-track-title';

Connector.isPlaying = function () {
    'use strict';
    return $('#player .miniplayer-control-play-pause .ui-icon-ios7-pause').is(':visible');
};
