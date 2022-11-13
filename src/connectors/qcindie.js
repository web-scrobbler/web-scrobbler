'use strict';

Connector.playerSelector = '#content';
Connector.artistSelector = '.p3-artistInfo';
Connector.trackSelector = '.p3-title';
Connector.isPlaying = () => { return Util.hasElementClass('#ppBtn', 'playing'); };
