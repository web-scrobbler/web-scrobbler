'use strict';

Connector.playerSelector = '.hero-player';

Connector.artistSelector = '.rk_widget_currenttrack_table > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3)';

Connector.trackSelector = '.rk_widget_recenttracks_title';

Connector.trackArtSelector = '.rk_widget_currenttrack_table img';

Connector.isPlaying = () => Util.hasElementClass('.ci-soundplayer', 'playing');
