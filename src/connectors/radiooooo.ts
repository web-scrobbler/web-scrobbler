export {};

const playerBar = '.audio-player';

Connector.playerSelector = playerBar;

Connector.trackSelector = `${playerBar} .title .text:last-child`;

Connector.artistSelector = `${playerBar} .artist .text:last-child`;

Connector.albumSelector = `${playerBar} .album .text:last-child`;

Connector.trackArtSelector = `${playerBar} .cover .image`;

Connector.playButtonSelector = `${playerBar} .play-control .play`;

Connector.currentTimeSelector = `${playerBar} .time .current`;

Connector.durationSelector = `${playerBar} .time .duration`;
