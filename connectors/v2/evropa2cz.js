/*!
 * Evropa2.cz and Europa2.sk connector for Last.fm Scrobbler
 *
 * version: 1.0.0
 * author: jan.cermak@lagardere.cz
 *
 * (c)2016 Lagardere Active CR
 */
'use strict';

var meta = $('.e2-player-meta-song').text().split(' · ');
/* global Connector */
Connector.playerSelector = '.e2-player';
Connector.playButtonSelector = '.e2-player-control-play';

Connector.isPlaying = function() {
    return !$('.e2-player-control-play').is(':visible');
};

Connector.getArtist = function() {
    return meta[0];
};

Connector.getTrack = function() {
    return meta[1];
};

$(document).ready(function(){
    // Needed because DON is not changed during first song
    setTimeout(function() {
        $(Connector.playerSelector).append('<div class="webscrobbler-connector-loaded" style="display:none;"></div>');
    }, 1000);
});