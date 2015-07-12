'use strict';

/* global Connector */

Connector.playerSelector = '#bar';

Connector.artistSelector = '.item.current [data-bind="text: artistName"]';

Connector.trackSelector = '.item.current [data-bind="text: name"]';

Connector.currentTimeSelector = '#progressContainer span:first';

Connector.playButtonSelector = '#transport li.pause';

/** @returns {number|null} track length in seconds */
Connector.getDuration = function () {
	return Connector.stringToSeconds($(Connector.currentTimeSelector).text() || '') +
		Connector.stringToSeconds($('#progressContainer span:last').text() || '');
};

Connector.trackArtImageSelector = 'td.art img';

/* At end of song, current time becomes "0:00" for a brief time before changing song info
 * which the controller treats as a rewind and a notification is displayed.
 * To overcome this, don't allow state change if current time is 0:00.
 */
Connector.isStateChangeAllowed = function () {
	return $(Connector.currentTimeSelector).text() !== '0:00';
};
