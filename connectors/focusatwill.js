'use strict';

Connector.playerSelector = '#scroller';

Connector.getArtist = () => $('.artist').text().substring(4);

Connector.trackSelector = '.track';

Connector.isPlaying = () => $('.play.stopped').hasClass('playing');
