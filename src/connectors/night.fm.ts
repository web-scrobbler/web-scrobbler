export {};

Connector.trackArtSelector = '.coverArt';

Connector.artistSelector = '.trackInfo > span:nth-child(2) > a';

Connector.trackSelector = '.trackInfo > span:nth-child(1) > a > strong';

Connector.playerSelector = '.playerControlContainer';

Connector.playButtonSelector = '.playButton';

Connector.isPlaying = () => Util.hasElementClass('.playButton > i', 'fa-pause');

Connector.getDuration = () => document.querySelector('audio')?.duration;

Connector.getCurrentTime = () => document.querySelector('audio')?.currentTime;
