export {};

// Connector for the WDR radio stations (1Live, WDR2, WDR3, WDR4, WDR5, COSMO, etc.)

const filter = MetadataFilter.createFilter({ artist: cleanupArtist });

Connector.applyFilter(filter);

Connector.playerSelector = '.wdrrCurrentChannels';

Connector.artistTrackSelector = '.wdrrCurrentShowTitleTitle';

Connector.pauseButtonSelector = '#playCtrl.playing';

Connector.scrobblingDisallowedReason = () => {
	const artistTrack = Util.getTextFromSelectors(
		Connector.artistTrackSelector,
	);
	const disallowedStrings = [
		'1Live',
		'WDR 2',
		'WDR 3',
		'WDR 4',
		'WDR 5',
		'COSMO',
	];

	// Check if the artistTrack includes any of the disallowed strings
	const containsDisallowedString =
		artistTrack !== null &&
		disallowedStrings.some((disallowedString) =>
			artistTrack.includes(disallowedString),
		);

	// Scrobble only if none of the disallowed strings are included
	return containsDisallowedString ? 'FilteredTag' : null;
};

function cleanupArtist(artist: string) {
	// Define patterns to find additional artists or features.
	const patterns = [/ & .*/, / x .*/, / feat\..*/];

	let cleanedArtist = artist;

	patterns.forEach((pattern) => {
		cleanedArtist = cleanedArtist.replace(pattern, '');
	});

	return cleanedArtist.trim();
}
