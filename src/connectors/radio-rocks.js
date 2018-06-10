'use strict';

Connector.playerSelector = '#jp_container_1';

Connector.artistSelector = '#singer0';

Connector.trackSelector = '#song0';

Connector.isPlaying = () => $('#jp_container_1').hasClass('jp-state-playing');
