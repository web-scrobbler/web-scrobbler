'use strict';

/* global Connector, Util */

Connector.playerSelector = '#html5player';

Connector.getArtistTrack = function() {
	let artistTrack = $('#staticHeader h3').contents()[0].textContent;
	return Util.splitArtistTrack(artistTrack);
};

Connector.currentTimeSelector = '#progress';

Connector.durationSelector = '#duration';

Connector.trackArtImageSelector = '#artwork img';

Connector.isPlaying = function() {
	return $('.playtoggle').hasClass('pause');
};
