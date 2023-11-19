export {};

Connector.playerSelector = '.pure-u-1';

Connector.artistSelector = `${Connector.playerSelector} h3`;

Connector.trackSelector = `${Connector.playerSelector} h2`;

Connector.trackArtSelector = `${Connector.playerSelector} .fullart`;

Connector.playButtonSelector = '#playpausebutton_playicon';

Connector.currentTimeSelector = '#timeelapsed';

Connector.remainingTimeSelector = '#timeremaining';

Connector.isPodcast = () => true;
