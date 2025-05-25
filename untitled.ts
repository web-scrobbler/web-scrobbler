export {};

Connector.playerSelector = 'div.fixed.bottom-0.z-6';

Connector.trackSelector = '.playbar-title';
Connector.artistSelector = 'span.mr-4';
Connector.albumSelector = '.playbar-subtitle';
Connector.trackArtSelector = 'div.h-full.w-full.overflow-hidden img';

Connector.isPlaying = () => {
	const pathD = document
		.querySelector(
			'div.absolute.inset-0.z-1.flex.items-center.justify-center svg path',
		)
		?.getAttribute('d');
	return pathD?.startsWith('M1.30371') ?? false;
};
