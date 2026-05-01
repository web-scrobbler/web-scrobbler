export {};

Connector.playerSelector = 'div.tv3-radio-online-player-controls';

Connector.artistSelector = 'div.js-tv3-radio-online-currently-live-artist';
Connector.trackSelector = 'div.js-tv3-radio-online-currently-live-song';

Connector.isPlaying = () => Util.hasElementClass('i.bi-play-fill', 'invisible');
