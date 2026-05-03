export {};

Connector.playerSelector = 'div.fixed.bottom-0.z-6';

Connector.getTrack = () => navigator.mediaSession?.metadata?.title;
Connector.getArtist = () => navigator.mediaSession?.metadata?.artist;
Connector.getAlbum = () => navigator.mediaSession?.metadata?.album;

Connector.getTrackArt = () => {
	const trackArtElement = document.querySelector<HTMLImageElement>(
		'img.absolute.inset-0.z-0.h-full.w-full.object-cover',
	);

	return trackArtElement?.src || null;
};

Connector.isPlaying = () => {
	const pathD = document
		.querySelector(
			'div.absolute.inset-0.z-1.flex.items-center.justify-center svg path',
		)
		?.getAttribute('d');
	return pathD?.startsWith('M1.30371');
};
