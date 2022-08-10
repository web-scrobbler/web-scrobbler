'use strict';

Connector.playerSelector = '#audioplayer';

Connector.artistTrackSelector = '#showtrack';

Connector.currentTimeSelector = '#mejs-currenttime';

Connector.isPlaying = () => Util.hasElementClass('.mejs-playpause-button', 'mejs-pause');
