Connector.playerSelector = '.player-info-wrapper';

Connector.artistSelector = '.player-info-wrapper > .info > .title > span';

Connector.getTrack = function() {
  return $('.player-info-wrapper > .info > .title').contents().get(0).nodeValue;
}

Connector.isPlaying = function() {
  return ($('.control.play').css('display') == 'none');

};
