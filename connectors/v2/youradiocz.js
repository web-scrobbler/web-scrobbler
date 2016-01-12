/*!
 * Youradio.cz connector for Last.fm Scrobbler
 *
 * version: 1.0.0
 * author: jan.cermak@lagardere.cz
 *
 * (c)2016 Lagardere Active CR
 */
'use strict';
/* global Connector */
Connector.playerSelector = 'body';
Connector.playButtonSelector = '.yr2-navbar-play';

Connector.artistSelector = '.yr2-navbar-player-metadata-info-artist';
Connector.trackSelector = '.yr2-navbar-player-metadata-info-song';
Connector.trackArtImageSelector = '.yr2-navbar-player-metadata-cover';
