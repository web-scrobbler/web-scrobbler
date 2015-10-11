'use strict';

/* global Connector */

Connector.playerSelector = '#player';

Connector.artistSelector = '#player > :nth-child(3) .primaryMetadata >';

Connector.trackSelector = '#player > :nth-child(3) .secondaryMetadata > :first-child';

Connector.isPlaying = function () {
	return $('.iconPlayerPause').length;
};
