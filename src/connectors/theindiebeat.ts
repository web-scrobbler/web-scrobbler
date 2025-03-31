export {};

Connector.playerSelector = '.audio-player-container';

Connector.artistSelector = '#artist a';

Connector.trackSelector = '#title';

Connector.albumSelector = '#album';

const filter = MetadataFilter.createFilter({
    track: cleanupDuration,
    currentTime: cleanupCurrentTime
});

Connector.durationSelector = '#playtime';
Connector.applyFilter(filter);

function cleanupDuration(text: string) {
    return text.split(' / ')?.[1];
}

Connector.currentTimeSelector = '#playtime';


function cleanupCurrentTime(text: string) {
    return text.split(' / ')?.[0];
}

Connector.trackArtSelector = '#art';

Connector.isPlaying = () => !document.querySelector('audio')?.paused;
