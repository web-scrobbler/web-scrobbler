export {};

const playerBar = '.audio-player';

Connector.playerSelector = playerBar;

Connector.trackSelector = `${playerBar} .title .text:last-child`;

Connector.artistSelector = `${playerBar} .artist .text:last-child`;

Connector.albumSelector = `${playerBar} .album .text:last-child`;

Connector.trackArtSelector = `${playerBar} .cover img`;

Connector.pauseButtonSelector = `${playerBar} button.play.pause`;

Connector.currentTimeSelector = `${playerBar} .time .current`;

Connector.durationSelector = `${playerBar} .time .duration`;
