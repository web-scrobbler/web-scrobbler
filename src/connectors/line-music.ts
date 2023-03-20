'use strict';

Connector.playerSelector = '.player_controller';

Connector.artistSelector = '.info_area .artist';

Connector.trackSelector = '.info_area .song';

Connector.currentTimeSelector = '.playtime .now';

Connector.durationSelector = '.playtime .remain';

Connector.trackArtSelector = '.song_info img';

Connector.isPlaying = () => Util.hasElementClass('.btn_now', 'play');
