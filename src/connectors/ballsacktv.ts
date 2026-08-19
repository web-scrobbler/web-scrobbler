export {};

Connector.id = 'ballsacktv';
Connector.label = 'Ballsack TV';

Connector.matches = ['*://ballsack.tv/*'];

Connector.playerSelector = '#nptrack';

function getTrack(): string | null {
    return document.querySelector('#nptrack')?.textContent?.trim() || null;
}

function getArtist(): string | null {
    return document.querySelector('#npartist')?.textContent?.trim() || null;
}

Connector.getTrack = getTrack;
Connector.getArtist = getArtist;

Connector.getUniqueID = () => {
    const artist = getArtist();
    const track = getTrack();

    if (!track) {
        return location.href;
    }

    return `${artist ?? 'unknown'}::${track}`;
};
