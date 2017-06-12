'use strict';

/* global Connector, Util */

Connector.playerSelector = '#bar';

Connector.artistSelector = '.metadata span:nth-child(1)';

Connector.trackSelector = '.metadata span:nth-child(3)';

Connector.currentTimeSelector = '#progressContainer span:first';

Connector.playButtonSelector = '#transport li.pause';

/** @returns {number|null} track length in seconds */
Connector.getDuration = function () {
	return Util.stringToSeconds($(Connector.currentTimeSelector).text()) +
		Util.stringToSeconds($('#progressContainer span:last').text());
};

Connector.trackArtSelector = 'td.art img';

/* At end of song, current time becomes "0:00" for a brief time before changing song info
 * which the controller treats as a rewind and a notification is displayed.
 * To overcome this, don't allow state change if current time is 0:00.
 */
Connector.isStateChangeAllowed = function () {
	return $(Connector.currentTimeSelector).text() !== '0:00';
};
