'use strict';

Connector.playerSelector = '.p3-wrapper';
Connector.artistSelector = '.p3-artistInfo';
Connector.trackSelector = '.p3-title';
Connector.isPlaying = () => Util.hasElementClass('#ppBtn', 'playing');
