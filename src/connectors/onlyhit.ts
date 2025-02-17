export {};

Connector.playerSelector = '#audio-player';
Connector.trackSelector = '#player-track-title';

Connector.getArtist = () => {
    const artistText = document.querySelector('#player-track-artist')?.textContent ?? '';
    return artistText.includes(' • ') ? artistText.split(' • ')[0] : artistText;
};

Connector.isPlaying = () => {
    const playButton = document.querySelector('#play-button');
    return playButton?.querySelector('path')?.getAttribute('d') === 'M6 6h12v12H6z';
};
