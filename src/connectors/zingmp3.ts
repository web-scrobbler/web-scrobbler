/**
 * Connector for Zing MP3 - https://zingmp3.vn
 */

export {};

const playerBar = '.player-controls__container'

const artistSelector = `${playerBar} .is-one-line.is-truncate.subtitle`;

const tractSelector = `${playerBar} .song-title-item`;

Connector.useMediaSessionApi();

Connector.playerSelector = playerBar;

Connector.artistSelector = artistSelector;

Connector.trackSelector = tractSelector;

Connector.trackArtSelector = '.thumbnail-wrapper .thumbnail .image';

Connector.currentTimeSelector = `${playerBar} .time.left`;

Connector.durationSelector = `${playerBar} .time.right`;

Connector.pauseButtonSelector = `${playerBar} .ic-pause-circle-outline`;

Connector.getUniqueID = () => getUniqueID();

Connector.getOriginUrl = () => getOriginUrl();


function getUniqueID() : string {
	const songTitleElement = document.querySelector(
		'.song-title-item a',
	);

	if (songTitleElement) {
		const url = songTitleElement.getAttribute('href');
		if (url) {
			const match = url.match(/\/bai-hat\/(.*)\/[0-9]{8}\.html/);
			if (match) {
				return match[1];
			}
		}
	}

	return '';
}

function getOriginUrl() :string {
	const songTitleElement = document.querySelector(
		'.song-title-item a',
	);

	if (songTitleElement) {
		return songTitleElement.getAttribute('href') || '';
	}

	return '';
}
