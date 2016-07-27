'use strict';
// Author: Oğuzhan TÜRK

/* global Connector */

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

Connector.playerSelector = '.jwplayer';

Connector.getArtist = function() {
  return toTitleCase($('#besa_mp3_play_area')[0].getElementsByTagName('table')[0].getElementsByTagName('td')[3].innerHTML.trim());
}

Connector.getTrack = function() {
  return toTitleCase($('#besa_mp3_play_area')[0].getElementsByTagName('table')[0].getElementsByTagName('td')[5].innerHTML.trim());
}

Connector.playButtonSelector = '.jwplay';

Connector.isPlaying = function () {
	return $('.jwplay.jwtoggle').length == 1;
};
