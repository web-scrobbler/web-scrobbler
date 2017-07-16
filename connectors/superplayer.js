'use strict';

Connector.playerSelector = '#content';

Connector.artistSelector = '[data-value=artist]';

Connector.trackSelector = '[data-value=name]';

Connector.isPlaying = function () {
	return !$('[data-action="pause"]').hasClass('active');
};
