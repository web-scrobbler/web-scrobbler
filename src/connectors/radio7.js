'use strict';

Connector.playerSelector = '#page-wrap';

Connector.artistTrackSelector = '#now';

Connector.isPlaying = () => Util.isElementVisible('#jp_container_1 .jp-pause');
