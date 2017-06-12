'use strict';
/* global Connector */
Connector.playerSelector = 'div#root>div#player';

Connector.artistSelector = '#artist';
Connector.trackSelector = '#title';
Connector.trackArtSelector = 'div#cover>img';

Connector.isPlaying = function() {
	return $('#playtoggle').hasClass('stop');
};
