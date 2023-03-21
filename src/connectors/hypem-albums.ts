export {};

Connector.playerSelector = '.hype-player';

Connector.artistSelector = '#album-header-artist';

Connector.albumSelector = '#album-header-title';

Connector.trackSelector = 'li.active .title';

Connector.trackArtSelector = 'img#album-big';

Connector.isPlaying = () => Util.hasElementClass('.hype-player', 'playing');

Connector.currentTimeSelector = '.current_pos';

Connector.durationSelector = 'li.active .duration';
