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
