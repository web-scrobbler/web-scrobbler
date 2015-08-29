'use strict';

/* global Connector */

Connector.playerSelector = '#playing';

Connector.artistSelector = '#cc_strinfo_trackartist_asp';

Connector.trackSelector = '#cc_strinfo_tracktitle_asp';

Connector.isPlaying = function () {
	return !$('.jp-play').is(':visible');
};
