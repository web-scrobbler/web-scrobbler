export {};

Connector.playerSelector = '#audio-player';

Connector.trackSelector = '#player-track-title';

Connector.artistSelector = '#player-track-artist';

Connector.playButtonSelector = '#play-button';

Connector.isPlaying = () => {
    const playButton = document.querySelector('#play-button');
    return playButton?.querySelector('path')?.getAttribute('d') === 'M6 6h12v12H6z';
};

Connector.artistTrackSeparator = '•';

Connector.applyFilter(MetadataFilter.createFilter({
    artist: [{ source: /\s*•.*$/, target: '' }],
}));
