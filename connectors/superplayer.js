'use strict';

Connector.playerSelector = '#content';

Connector.artistSelector = '[data-value=artist]';

Connector.trackSelector = '[data-value=name]';

Connector.isPlaying = () => !$('[data-action="pause"]').hasClass('active');
