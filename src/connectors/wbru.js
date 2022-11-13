'use strict';

Connector.playerSelector = '.radioco-player';
Connector.trackSelector = '.player-meta .track-name';
Connector.artistSelector = '.player-meta .track-artist';
Connector.trackArtSelector = 'img.current-artwork';
Connector.isPlaying = () => Util.hasElementClass('button.play-button', 'icon-playerstop');
