export {};

const playerBar = '#playerInfo';

Connector.playerSelector = playerBar;

Connector.artistSelector = `${playerBar} > a:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2)`;

Connector.trackSelector = `${playerBar} > a:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1)`;

Connector.trackArtSelector = `${playerBar} > a:nth-of-type(1) > img`;
