export {};

Connector.playerSelector = '[class^="Controls__wrapper___"]';

Connector.trackSelector = `${Connector.playerSelector} [class^="Controls__brainState___"]`;

Connector.pauseButtonSelector = `${Connector.playerSelector} svg[class^=PlayControl__pause___]`;

Connector.getArtist = () => 'Brain.fm';
