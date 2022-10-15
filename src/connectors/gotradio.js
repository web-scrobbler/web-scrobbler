'use strict';

Connector.isPlaying = () => { return Util.hasElementClass('div#playbtn', 'jp-stopx'); };
Connector.playerSelector = '.player-content';
Connector.trackSelector = 'h1#song';
Connector.artistSelector = 'h2#artist';
