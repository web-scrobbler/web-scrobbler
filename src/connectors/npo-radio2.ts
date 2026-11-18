export {};
// Use a Set for faster, cleaner lookups (Performance/FP)
const DJ_SET = new Set([
	'Annemieke Schollaardt',
	'Bart Arens',
	'Carolien Borgers',
	'Corné Klijn',
	'Daniël Lippens',
	'Desiree van der Heiden',
	'Dolf Jansen',
	'Eddy Keur',
	'Emmely de Wilt',
	'Evelien de Bruijn',
	'Gijs Hakkert',
	'Jan-Willem Roodbeen',
	'Jasper de Vries',
	'Jeroen Kijk in de Vegte',
	'Jeroen van Inkel',
	'Klaas van Kruistum',
	'Leo Blokhuis',
	'Morad El Ouakili',
	'Obi Raaijmaakers',
	'Paul Rabbering',
	'Ruud de Wild',
	'Shay Kreuger',
	'Tannaz Hajeby',
	'Thomas Hekker',
	'Tim Op het Broek',
	'Willemijn Veenhoven',
	'NPO Radio 2',
]);
// State container
let lastValidState: { artist: string | null; track: string | null } = {
	artist: null,
	track: null,
};
// Pure helper function (FP/SRP)
const isDj = (name: string | null) => {
	return name && DJ_SET.has(name);
};
Connector.playerSelector = '#__next';
Connector.trackArtSelector = '.sc-d00cd6bf-2 img';
Connector.getArtistTrack = () => {
	const track = Util.getTextFromSelectors('.sc-425d5a34-7');
	let artist = Util.getTextFromSelectors('p.fPMiJp:not(.sc-425d5a34-7)');
	// Clean up station name
	if (artist) {
		artist = artist.replace(/\s-\sNPO\sRadio\s2/i, '');
	}
	// Logic: If it is a DJ, strictly return the LAST known valid state.
	// We map 'lastValidState' to the keys Web Scrobbler expects.
	if (isDj(artist)) {
		return lastValidState;
	}
	// If we have new valid data (not a DJ), update our state
	if (artist && track) {
		lastValidState = { artist, track };
	}
	// Return the current valid data
	return lastValidState;
};
Connector.isPlaying = () => {
	return Util.hasElementClass(
		'.bmpui-npo-player',
		'bmpui-player-state-playing',
	);
};
