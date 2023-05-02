export {};

const DEFAULT_TRACK_ART = 'empty-cover.svg';

Connector.playerSelector = '.l-music__player';

Connector.artistSelector = '.l-music__player__song__author';

Connector.trackSelector = '.l-music__player__song__name';

Connector.currentTimeSelector = '.l-music__player__song__time.current';

Connector.durationSelector = '.l-music__player__song__time.duration';

Connector.trackArtSelector = '.l-music__player__song__cover';

Connector.isTrackArtDefault = (url) => url?.endsWith(DEFAULT_TRACK_ART);

Connector.isPlaying = () => Util.hasElementClass('.l-music__player', 'playing');
