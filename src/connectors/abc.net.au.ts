export {};

Connector.playerSelector = '[data-component="Container"]';

const trackSelector = '>a>div>div';
const artistSelector = '+h3';
const songInfoSelector = `${Connector.playerSelector} h1:has(${trackSelector}):has(${artistSelector})`;

Connector.artistSelector = `${songInfoSelector}${artistSelector}`;

Connector.trackSelector = `${songInfoSelector}${trackSelector}`;

Connector.trackArtSelector = `${Connector.playerSelector} img:last-child`;

Connector.pauseButtonSelector = `${Connector.playerSelector} button>svg[data-component="Stop"]`;
