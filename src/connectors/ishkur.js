'use strict';

Connector.playerSelector = '#musicbox';

Connector.artistTrackSelector = '#showtrack';

Connector.currentTimeSelector = '#mejs-currenttime';

Connector.isPlaying = () => Util.hasElementClass('.mejs-playpause-button', 'mejs-pause');
