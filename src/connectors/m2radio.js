'use strict';

Connector.playerSelector = '#onair_block';

Connector.artistSelector = '#nowplaying [id^=artiste_]';

Connector.trackSelector = '#nowplaying [id^=titre_]';

Connector.isPlaying = () => $('.jp-pause').is(':visible');
