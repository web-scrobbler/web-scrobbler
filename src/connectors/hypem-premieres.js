'use strict';

Connector.playerSelector = '.hype-player';

Connector.artistSelector = '#album-header-artist';

Connector.trackSelector = 'li.active .title';

Connector.trackArtSelector = 'img#album-big';

Connector.isPlaying = () => $('.hype-player').hasClass('playing');
