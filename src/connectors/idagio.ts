export {};

const symphonySelector =
	'.player-PlayerInfo__infoEl--2jhHY span:nth-child(3) span:first-child';
const commonNameSelector =
	'.player-PlayerInfo__infoEl--2jhHY span:nth-child(3) span:nth-child(2)';
const directorSelector =
	'.player-PlayerInfo__recordingInfo--15VMv>span:first-child span';
const trackSelector = '.player-PlayerInfo__infoEl--2jhHY';
const pauseButtonSelector =
	'.player-PlayerControls__btn--1r-vy:nth-child(3) .util-IconLabel__component--3Uitr span';

Connector.playerSelector = '.player-PlayerBar__bar--2yos_';

Connector.artistSelector = '.player-PlayerInfo__infoEl--2jhHY span:first-child';

Connector.getTrack = getCurrentTrack;

Connector.getAlbum = getCurrentSymphony;

Connector.currentTimeSelector = '.player-PlayerProgress__progress--2F0qB>span';

Connector.durationSelector = '.player-PlayerProgress__timeTotal--3aHlj span';

Connector.isPlaying = () =>
	Util.getTextFromSelectors(pauseButtonSelector) === 'Pause';

Connector.isScrobblingAllowed = () =>
	Util.getTextFromSelectors('.player-PlayerInfo__recordingInfo--15VMv') !==
	'Sponsor message';

function getCurrentTrack() {
	/*
	 * Idagio puts composer and piece all in the same div element, so we have to undo this.
	 * First split the tag by dashes. Include spaces to avoid issues with names containing dashes.
	 * The first part is the composer name. We want to exclude this, so we slice it off.
	 * Then, replace the dashes with colons, this makes the tag more in line with what is expected.
	 * Finally, trim as a "just in case" in preparation for the next step. Unnecessary in the cases I've seen, but extremely simple and might prevent something down the line.
	 * Example from https://app.idagio.com/albums/saint-saens-violin-sonata-no-1-cello-sonata-no-1-and-piano-trio-no-2:
	 * "Camille Saint-Saëns – Sonata for Violin and Piano No. 1 in D minor op. 75 R 123 – I. Allegro agitato –"
	 * -> ["Camille Saint-Saëns", "Sonata for Violin and Piano No. 1 in D minor op. 75 R 123", "I. Allegro agitato –"]
	 * -> ["Sonata for Violin and Piano No. 1 in D minor op. 75 R 123", "I. Allegro agitato –"]
	 * -> "Sonata for Violin and Piano No. 1 in D minor op. 75 R 123: I. Allegro agitato –"
	 */
	let track = Util.getTextFromSelectors(trackSelector)
		?.split(' – ')
		.slice(1)
		.join(': ')
		.trim();
	/*
	 * Now remove trailing dash if exists.
	 * Example: "Sonata for Violin and Piano No. 1 in D minor op. 75 R 123: I. Allegro agitato –"
	 * -> "Sonata for Violin and Piano No. 1 in D minor op. 75 R 123: I. Allegro agitato " (the space is trimmed later in core)
	 */
	if (track?.at(-1) === '–') {
		track = track.slice(0, -1);
	}
	return track;
}

function getCurrentSymphony() {
	const symphonyShort = Util.getTextFromSelectors(symphonySelector)?.split(
		/ in [A-G]| op. [0-9]| KV [0-9]/
	)[0];
	const commonName = Util.getTextFromSelectors(commonNameSelector) || '';
	const director = removeParenthesis(
		Util.getTextFromSelectors(directorSelector)
	);
	return `${symphonyShort}${commonName} (${director})`;
}

function removeParenthesis(text: string | null) {
	return text?.replace(/\s*\(.*?\)\s*/g, '');
}
