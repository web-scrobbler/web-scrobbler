export {};

Connector.playerSelector = '#player';

Connector.artistTrackSelector = '#pr_title';

Connector.timeInfoSelector = '#pr_time';

Connector.isPlaying = () => Util.hasElementClass('#pr_play', 'playing');
