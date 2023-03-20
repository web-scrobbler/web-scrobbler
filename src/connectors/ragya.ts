'use strict';

Connector.playerSelector = '.music-box';

Connector.trackSelector = '.raga-name';

Connector.artistSelector = '.artist-name';

Connector.albumSelector = '.album-name';

Connector.currentTimeSelector = '.timer .clr-primary';

Connector.durationSelector = '.timer .clr-white';

Connector.isPlaying = () => document.querySelector('.play-btn-logo').getAttribute('src') === 'assets/images/pause.svg';
