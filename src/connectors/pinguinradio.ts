export {};

Connector.playerSelector = 'app-audiofooter';

const trackInfoSelector = `${Connector.playerSelector} :has(>a>span)`;

Connector.trackSelector = `${trackInfoSelector} :not(a)>span`;

Connector.artistSelector = `${trackInfoSelector}>a>span`;

Connector.useTabAudibleApi();
