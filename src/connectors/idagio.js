'use strict';

Connector.playerSelector = '[class^="player-PlayerBar__bar-"]';

Connector.trackInfoSelector = `${Connector.playerSelector} [class^="player-PlayerInfo__infoEl-"]`;

Connector.getArtist = () => {
	const container = $(Connector.trackInfoSelector).first();
	return container.children().first().text();
};

Connector.getTrack = () => {
	const container = $(Connector.trackInfoSelector).first();
	const trackParts = container.children().slice(2).toArray();

	return trackParts.map((part) => part.textContent).join('');
};

Connector.albumUrl = null;
Connector.albumName = null;
Connector.albumArt = null;

Connector.getAlbumUrl = () => {
	return $(`${Connector.playerSelector} a[class^="player-PlayerInfo__info-"]`).attr('href');
};

Connector.loadAlbumData = (albumUrl) => {
	$.ajax({
		url: `https://www.idagio.com${albumUrl}`,
		success: (data) => {
			Connector.albumUrl = albumUrl;

			const html = $.parseHTML(data);
			Connector.albumName = $(html).find('h1').text();

			Connector.albumArt = null;
			const albumArtElement = html.find((element) => element.nodeName === 'META' && element.attributes.property && element.attributes.property.nodeValue === 'og:image');
			if (albumArtElement && albumArtElement.attributes.content) {
				Connector.albumArt = albumArtElement.attributes.content.nodeValue;
			}
		},
		failure: () => {
			Connector.albumUrl = albumUrl;
			Connector.albumName = null;
			Connector.albumArt = null;
		}
	});
};

Connector.getAlbum = () => {
	const albumUrl = Connector.getAlbumUrl();

	if (Connector.albumUrl !== albumUrl) {
		Connector.loadAlbumData(albumUrl);
	}

	return Connector.albumName;
};

Connector.getTrackArt = () => {
	const albumUrl = Connector.getAlbumUrl();

	if (Connector.albumUrl !== albumUrl) {
		Connector.loadAlbumData(albumUrl);
	}

	return Connector.albumArt;
};

Connector.currentTimeSelector = '[class^="player-PlayerProgress__time-"]';

Connector.durationSelector = '[class^="player-PlayerProgress__timeTotaltime-"]';

Connector.isPlaying = () => $(`${Connector.playerSelector} span:contains("Pause")`).length > 0;
