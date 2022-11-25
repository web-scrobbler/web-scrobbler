'use strict';

// If I understood correctly, these are all just backups in case the Media
// Session API isn't supported.
Connector.useMediaSessionApi();

// There shouldn't be any other images ever.
Connector.trackArtSelector = ".text-center > img";
Connector.trackSelector = "img ~ div > div:nth-child(1)";
Connector.artistSelector = "img ~ div > div:nth-child(2)";
Connector.playerSelector = "img ~ div";

const filter = MetadataFilter.createFilter({
	artist: (text) => text.replace("by ", ""),
});

Connector.applyFilter(filter);
