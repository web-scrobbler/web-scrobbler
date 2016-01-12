/*!
 * Danceradio.cz and Radiobonton.cz connector for Last.fm Scrobbler
 *
 * version: 1.0.0
 * author: jan.cermak@lagardere.cz
 *
 * (c)2016 Lagardere Active CR
 */
'use strict';

Connector.playerSelector = 'div#root>div#player';

Connector.artistSelector = '#artist';
Connector.trackSelector = '#title';
Connector.trackArtImageSelector = 'div#cover>img';

Connector.isPlaying = function() {
    return $('#playtoggle').hasClass('stop');
};