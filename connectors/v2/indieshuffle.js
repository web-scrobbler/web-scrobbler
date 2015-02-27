
Connector.playerSelector = '#currentSong';

Connector.artistSelector = '#currentSong .artist_name';

Connector.trackSelector = '#currentSong .song-details';

var timeRegex = /(\d+:\d+)\s\/\s(\d+:\d+)/;

/**
 * Helper method to parse time elapsed (currentTime) and total duration
 *
 * @returns {{currentTime, duration}} both in seconds
 */
var parseTime = function() {
	'use strict';
	var result = timeRegex.exec($('#currentSong .display-track-time').text()),
		currentTime = null, duration = null;
	if (result) {
		currentTime = Connector.stringToSeconds(result[1]);
		duration = Connector.stringToSeconds(result[2]);
	}
	return {currentTime: currentTime, duration: duration};
};

Connector.getDuration = function () {
	'use strict';
	return parseTime().duration;
};

Connector.getCurrentTime = function () {
	'use strict';
	return parseTime().currentTime;
};

Connector.getUniqueID = function () {
	'use strict';
	return $('#currentSong .commontrack').attr('data-track-id') || null;
};

Connector.isPlaying = function () {
	'use strict';
	return $('#currentSong .commontrack').hasClass('active');
};
