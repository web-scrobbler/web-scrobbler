export {};

const selector = '.web-scrobbler-extension';

function getData(name: string): string | null {
	return Util.getDataFromSelectors(selector, name);
}

Connector.playerSelector = selector;
Connector.getArtist = () => getData('artist');
Connector.getTrack = () => getData('track');
Connector.getAlbum = () => getData('album');
Connector.getAlbumArtist = () => getData('album-artist');
Connector.getDuration = () => Number(getData('duration'));
Connector.getCurrentTime = () => Number(getData('current-time'));
Connector.getUniqueID = () => getData('unique-id');
Connector.isPlaying = () => Boolean(getData('playing'));
Connector.getTrackArt = () => getData('track-art');
