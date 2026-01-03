export {};
Connector.isPlaying = () => {
const playPauseButton = document.querySelector(
'[class*="livestream_playPauseButton"]',
);

return playPauseButton?.className.includes('livestream_playing') ?? false;
};

Connector.playerSelector = 'body';

Connector.trackSelector = '[class*="nowPlaying_songTitle"]';

Connector.artistSelector = '[class*="nowPlaying_songArtist"]';
