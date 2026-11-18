export {};

const trackSelector = '[class*="player-PlayerInfo__infoEl--"]';
const symphonySelector = `${trackSelector} span:nth-child(3) span:first-child`;
const commonNameSelector = `${trackSelector} span:nth-child(3) span:nth-child(2)`;
const directorSelector =
	'[class*="player-PlayerInfo__recordingInfo--"]>span:first-child span';

/*
 * When playing a "Mood" (https://app.idagio.com/moods), the player bar
 * has no track info: it is shown in the center of the page instead.
 */
const moodInfoSelector = '[class*="mood-MoodTrackInfo__info--"]';
const moodComposerSelector = `${moodInfoSelector} [class*="mood-MoodTrackInfo__composer--"]`;
const moodTitleSelector = `${moodInfoSelector} [class*="mood-MoodTrackInfo__title--"] span[title]`;
const moodDirectorSelector = `${moodInfoSelector} [class*="mood-MoodTrackInfo__interpreter--"] a`;

Connector.playerSelector = '[class*="player-PlayerBar__bar--"]';

Connector.getArtist = () =>
	isMoodPlayer()
		? Util.getTextFromSelectors(moodComposerSelector)
		: Util.getTextFromSelectors(`${trackSelector} span:first-child`);

Connector.getTrack = () =>
	isMoodPlayer() ? getMoodTrack() : getCurrentTrack();

Connector.getAlbum = () =>
	isMoodPlayer() ? getMoodSymphony() : getCurrentSymphony();

Connector.currentTimeSelector =
	'[class*="player-PlayerProgress__progress--"]>span';

Connector.durationSelector =
	'[class*="player-PlayerProgress__timeTotal--"] span';

Connector.pauseButtonSelector =
	'[class*="player-PlayerControls__btn--"][data-test="player-controls.pause-btn"]';

/*
 * Sponsor messages are shown in the player bar also when playing a mood,
 * so this check covers both modes.
 */
Connector.scrobblingDisallowedReason = () =>
	Util.getTextFromSelectors(
		'[class*="player-PlayerInfo__recordingInfo--"]',
	) === 'Sponsor message'
		? 'IsAd'
		: null;

/**
 * Check if a mood is playing: the player bar has no track info,
 * and the mood track info is displayed in the page.
 */
function isMoodPlayer() {
	return (
		!document.querySelector(trackSelector) &&
		Boolean(document.querySelector(moodInfoSelector))
	);
}

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
	// The dash is surrounded by non-breaking spaces (&nbsp;), not regular spaces.
	let track = Util.getTextFromSelectors(trackSelector)
		?.split('\u00A0–\u00A0')
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
	const symphonyShort = getSymphonyShort(
		Util.getTextFromSelectors(symphonySelector),
	);
	const commonName = Util.getTextFromSelectors(commonNameSelector) || '';
	const director = removeParenthesis(
		Util.getTextFromSelectors(directorSelector),
	);
	return `${symphonyShort}${commonName} (${director})`;
}

/**
 * Get the work and movement titles of the mood track.
 * The work is the first title and the movement the second one.
 * @returns Array of non-empty titles
 */
function getMoodTitles() {
	return Array.from(
		document.querySelectorAll(moodTitleSelector),
		(element) => element.getAttribute('title')?.trim() ?? '',
	).filter(Boolean);
}

function getMoodTrack() {
	/*
	 * Join work and movement as "Work: Movement", like in the player bar.
	 * If the movement name is already part of the work name, use only the work.
	 * Example:
	 * ["O Lord, In Thee Is All My Trust (Arr. for Saxophone and Vocal Ensemble)", "O Lord, In Thee Is All My Trust"]
	 * -> "O Lord, In Thee Is All My Trust (Arr. for Saxophone and Vocal Ensemble)"
	 */
	const [work, movement] = getMoodTitles();
	if (!work) {
		return null;
	}
	if (!movement || work.toLowerCase().includes(movement.toLowerCase())) {
		return work;
	}
	return `${work}: ${movement}`;
}

function getMoodSymphony() {
	const [work] = getMoodTitles();
	if (!work) {
		return null;
	}
	const director = removeParenthesis(
		Util.getTextFromSelectors(moodDirectorSelector),
	);
	return director
		? `${getSymphonyShort(work)} (${director})`
		: getSymphonyShort(work);
}

function getSymphonyShort(symphony: string | null) {
	return symphony?.split(/ in [A-G]| op. [0-9]| KV [0-9]/)[0];
}

function removeParenthesis(text: string | null) {
	return text?.replace(/\s*\(.*?\)\s*/g, '');
}
