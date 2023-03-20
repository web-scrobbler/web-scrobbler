'use strict';

Connector.playerSelector = '#embed';

Connector.artistSelector = '.track.active > .title > span:nth-child(2)';

Connector.trackSelector = '.track.active > .title > span:nth-child(1)';

Connector.isPlaying = () => $('#btnPlay > svg').hasClass('fa-pause');
