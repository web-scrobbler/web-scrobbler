'use strict';

/* global Connector */

Connector.playerSelector = '.container-fluid';

Connector.artistSelector = '#cc_recenttracks_asp > .cctrack:first-child .ccartist';

Connector.trackSelector = '#cc_recenttracks_asp > .cctrack:first-child .cctitle';

Connector.albumSelector = '#cc_recenttracks_asp > .cctrack:first-child .ccalbum';

Connector.isPlaying = function () {
	return $('#jp_container_1').hasClass('jp-state-playing');
};
