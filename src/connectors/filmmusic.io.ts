export {};

Connector.playerSelector = '.audioplayer-wrapper';
Connector.artistSelector = '.isplaying .fm-song-top-info a';
Connector.trackSelector = '.isplaying .fm-song-top-info h5';
Connector.trackArtSelector = '.isplaying .fm-song-left img';

Connector.isPlaying = () => Util.hasElementClass('.start', 'hidden');
