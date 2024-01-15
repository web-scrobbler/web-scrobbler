export {};

/*
	Since BiliBili is a video site, accurately scrobbling song information from the title can be challenging.
	However, people often include the artist's name and track title in the video tags.

	Therefore, this connector uses tags to identify artist and track information and determines whether we should scrobble this video.
	The video title is then used to determine which tag is most likely to contain the artist or track name.
*/

/**
 * Quick link to debug and test the connector: https://www.bilibili.com/video/BV1LW4y1g7kN
 *
 * the scrobble info will shown beside the video info, under the video title.
 *
 * special behaviors:
 * if the video has bgm tag(a tag with music symbol in front of it), it'll be recognized as track name
 * if the video has no track or artist related tag, this connector will try grepping it from video title
 */

/**
 * selectors used by this connector
 */
const videoTitleSelector = '.video-title';
const videoSelector = 'video';
const tagPanelSelector = '.tag-panel';
const tagLinkSelector = '.tag-link';
const uploaderSelector = '.up-name';
const bgmTagSelector = '.bgm-tag .tag-link .tag-txt';

/**
 * selectors used by Connector core
 */
const PlayerSelector = '.bpx-player-container';
const currentTimeSelector = '.bpx-player-ctrl-time-current';
const durationSelector = '.bpx-player-ctrl-time-duration';
/**
 * patterns that used to match possible song info
 */
const trackPattern = /[《『「](.*?)[》』」]/g;
const artistPattern = /[【](.*?)[】]/g;
const decorationPattern = /[(（](.*?)[)）]/g;
// do not use lookbehind pattern like this, firefox does not support it
// const coveredByPattern = /(?<=covered by).*/i;
const coveredByPattern = /by\s*(.*)|CV.\s*(.*)/i;

/**
 * symbols that usually used in title to determine artist and track
 */
const artistLeftSeparators = ['-', '—'];
const artistRightSeparators = ['/', '／'];
/**
 * The last track title. Used for detecting new songs.
 */
let lastVideoTitle: string | null = null;

/**
 * Object that holds information about song.
 */
let songInfo: {
	artist: string | null;
	track: string | null;
} | null = null;

/**
 * Object that holds information about current video.
 */
let videoInfo: {
	title: string;
	upLoader: string;
	tags: string[];
	bgmTag: string | null;
} = {
	title: '',
	upLoader: '',
	tags: [],
	bgmTag: null,
};

/*
	only scrobbling if the video is tagged '音乐', which means 'music'
*/
const onlyScrobbleContainsMusicTag = true;

/**
 * don't scrobble a video if a video's tags contains text in tagFilterKeyWords
 */
const useScrobbleTagFilter = true;

/**
 * used when useScrobbleTagFilter is enabled.
 * if a video's tags contains text in this array, it won't be scrobbled
 */
const tagFilterKeyWords = ['教学'];

/**
 * tags that constantly shown in tag but not related to the track info
 */
const filterKeyWords = [
	'4K',
	'MV',
	'音乐',
	'hires',
	'无损',
	'hdr',
	'翻唱',
	'原创',
	'弹唱',
	'cover',
	'live',
	'动画',
	'综合',
	'演唱',
	'Hi-Res',
	'中字',
	'双语',
	'vocaloid',
	'字幕',
	'女声',
	'男声',
	'现场',
	'完整版',
	'开口跪',
	'op',
	'ed',
	'片尾曲',
	'片头曲',
];

/**
 * get current video info
 */
function getVideoInfo() {
	videoInfo.title = Util.getTextFromSelectors(videoTitleSelector) ?? '';
	videoInfo.upLoader = Util.getTextFromSelectors(uploaderSelector) ?? '';

	const tagPanel = document.querySelector(tagPanelSelector);
	if (tagPanel) {
		const tagElements = tagPanel.querySelectorAll(tagLinkSelector);
		const tags = Array.from(tagElements).map(
			(tagElement) => tagElement.textContent || '',
		);
		videoInfo.tags = tags;
	}

	videoInfo.bgmTag =
		Util.getTextFromSelectors(bgmTagSelector)?.replace(
			decorationPattern,
			'',
		) ?? null;
}

Connector.playerSelector = PlayerSelector;

Connector.currentTimeSelector = currentTimeSelector;

Connector.durationSelector = durationSelector;

// scrobble info is shown beside the video info
Connector.scrobbleInfoLocationSelector = '.video-info-detail';
Connector.scrobbleInfoStyle = {
	...Connector.scrobbleInfoStyle,
	fontSize: '13px',
	fontWeight: '400',
	marginLeft: '10px',
};

Connector.isPlaying = () => {
	const video = document.querySelector(videoSelector) as HTMLVideoElement;
	if (!video) {
		return false;
	}
	return video.currentTime > 0 && !video.paused && !video.ended;
};

// using BV number(BiliBili's video unique identifier) as unique ID
Connector.getUniqueID = () => {
	const currentURL = Connector.getOriginUrl();
	const match = currentURL
		? currentURL.match(/\/video\/(BV[0-9A-Za-z]+)/)
		: null;
	if (match) {
		const bvNumber = match[1];
		return bvNumber;
	}
	return null;
};

// href is like this: href="//space.bilibili.com/1459104794"
Connector.getChannelId = () =>
	new URL(
		(document.querySelector(uploaderSelector) as HTMLAnchorElement)?.href ??
			'https://bilibili.com/',
	).pathname
		.split('/')
		.pop();

Connector.channelLabelSelector = '.up-name';

Connector.isScrobblingAllowed = () => {
	const tags = videoInfo.tags;

	if (onlyScrobbleContainsMusicTag) {
		if (!tags.includes('音乐')) {
			return false;
		}
	} else if (useScrobbleTagFilter) {
		if (tags.some((tag) => isIncludeElems(tag, tagFilterKeyWords))) {
			return false;
		}
	}
	return true;
};

Connector.getArtistTrack = () => {
	getSongInfo();
	return songInfo;
};

/*
	helper functions
*/

/**
 * Check if song is changed.
 * @returns true if new song is playing; false otherwise
 */
function isNewSongPlaying() {
	const title = videoInfo.title;

	if (lastVideoTitle !== title) {
		lastVideoTitle = title;
		return true;
	}

	return false;
}

function resetSongInfo() {
	songInfo = null;
}

function resetVideoInfo() {
	videoInfo = {
		title: '',
		upLoader: '',
		tags: [],
		bgmTag: null,
	};
}

/**
 * if the song changed, flash the songInfo object and reset state(useful when change video on the same page)
 */
function getSongInfo() {
	getVideoInfo();
	if (isNewSongPlaying()) {
		try {
			Connector.resetState();
			songInfo = grepSongInfo();
		} catch (err) {
			const error = err as string;
			Util.debugLog(`Error:${error}`, 'error');
			resetSongInfo();
			resetVideoInfo();
		}
	}
}

/**
 * case insensitive filter
 * @param items - tags to be filtered
 * @param filterKeyWords - words that any tag contains word in this array will be removed from output
 * @returns an array of tags does not contain any keywords defined in filterKeyWords
 */
function itemFilter(items: string[], filterKeyWords: string[]) {
	return items.filter(
		(item) =>
			!filterKeyWords.some((keyword) => {
				return item.toLowerCase().includes(keyword.toLowerCase());
			}),
	);
}
/**
 * main function used to get song info.
 * @returns \{artist, track\}
 */
function grepSongInfo() {
	let track: string | null = null;
	let artist: string | null = null;
	const possibleArtist: string[] = [];
	const possibleTrack: string[] = [];

	const filteredTags = itemFilter(videoInfo.tags, filterKeyWords);
	const title = videoInfo.title;

	// possibleArtist array and possibleTrack array is ordered by priority
	let matched: string[] = [];
	// artists
	// if the video title contained 'covered by', the string after it has the biggest chance to be the artist
	matched = getMatchedTextArray(title, coveredByPattern);
	possibleArtist.push(...matched);

	// if the video title contains something warped by 【】 and does not contain filter key words, it has the second biggest chance to be the artist name
	matched = getMatchedTextArray(title, artistPattern);
	possibleArtist.push(...itemFilter(matched, filterKeyWords));

	// the uploader's name has third large chance to be the artist name
	const uploaderName = videoInfo.upLoader;
	possibleArtist.push(uploaderName);

	// tracks
	// if the video title contains something warped by 《》or『』or「」 and does not contain any filter key words in it, it has the largest chance to be the track name
	matched = getMatchedTextArray(title, trackPattern);
	possibleTrack.push(...itemFilter(matched, filterKeyWords));

	// get plain title without any decoration, and analyze it using separator patterns
	const titleWithoutDecoration = title
		.replace(trackPattern, '')
		.replace(artistPattern, '')
		.replace(decorationPattern, '');

	// both
	// the title without any decoration also has a big chance to be track name
	// needs to exclude title that contains separators, otherwise it's repeated
	if (
		!(
			isIncludeElems(title, artistLeftSeparators) ||
			isIncludeElems(title, artistRightSeparators)
		)
	) {
		possibleTrack.push(titleWithoutDecoration);
	}

	artistLeftSeparators.forEach((separator) => {
		const result = extractText(titleWithoutDecoration, separator);
		if (result) {
			const [leftPart, rightPart] = result;
			possibleTrack.push(rightPart);
			possibleArtist.push(leftPart);
		}
	});
	artistRightSeparators.forEach((separator) => {
		const result = extractText(titleWithoutDecoration, separator);
		if (result) {
			const [leftPart, rightPart] = result;
			possibleTrack.push(leftPart);
			possibleArtist.push(rightPart);
		}
	});

	// select
	Util.debugLog(
		`PossibleTrack: ${possibleTrack.toString()}
PossibleArtist: ${possibleArtist.toString()}
FilteredTags: ${filteredTags.toString()}`,
		'log',
	);

	// have tags related to the song, grep info from tag
	if (filteredTags.length !== 0) {
		Util.debugLog(`Filtered tags: ${filteredTags.toString()}`, 'log');

		const matchedArtist = getMatchedTags(possibleArtist, filteredTags);
		artist = getFirstNonNull(matchedArtist);

		const matchedTrack = getMatchedTags(possibleTrack, filteredTags);
		track = getFirstNonNull(matchedTrack);

		Util.debugLog(
			`Matched artist: ${matchedArtist.toString()}
Matched track: ${matchedTrack.toString()}
Filtered tags: ${filteredTags.toString()}`,
		);

		// fallback
		if (!track) {
			// if only have one related tag, it has chance to be the track name
			if (filteredTags.length === 1) {
				track = filteredTags[0];
			}
			// if only have two related tags, it has chance to be the track name and the artist name
			if (filteredTags.length === 2 && artist !== null) {
				const tagWithoutArtist = filteredTags.filter(
					(tag) => tag !== artist,
				);
				track = tagWithoutArtist[0];
			}
		}
		// same as above. if only have two related tags, it has chance to be the track name and the artist name
		if (!artist) {
			if (filteredTags.length === 2 && track !== null) {
				const tagWithoutTrack = filteredTags.filter(
					(tag) => tag !== track,
				);
				artist = tagWithoutTrack[0];
			}
		}
	} else {
		Util.debugLog('have no filtered tag');
	}

	// ensure
	// if the video have a specific bgm tag on it, the tag is the track name for sure
	const bgmTag = videoInfo.bgmTag;
	track = bgmTag ? bgmTag : track;

	// final fallback, if it's hard to find song info from tags, grep it from title
	if (!artist) {
		artist = getFirstNonNull(possibleArtist);
	}
	if (!track) {
		track = getFirstNonNull(possibleTrack);
	}

	return { artist, track };
}

/**
 * extract text using separators
 * @param text - text that needs to be separated
 * @param separator - separator that used to separate the text
 * @returns [left part of the separator, right part of the separator]
 */
function extractText(text: string, separator: string): [string, string] | null {
	const regex = new RegExp(`([^${separator}]+)\\s*${separator}\\s*(.+)`);
	const match = text.match(regex);

	if (match) {
		const leftPart = match[1];
		const rightPart = match[2];
		return [leftPart, rightPart];
	}

	return null;
}

/**
 * get first non-none elem in the array
 * @returns the first non-none in arr
 */
function getFirstNonNull(arr: (string | null)[]): string | null {
	for (const element of arr) {
		if (element) {
			return element;
		}
	}
	return null;
}

/**
 * case insensitive match
 * @returns tags that be contained in any elem in textFragment array
 */
function getMatchedTags(
	textFragment: (string | null)[],
	tags: string[],
): string[] {
	const matchedTags: string[] = [];
	// Traversing as textFragment's order
	if (textFragment) {
		textFragment.forEach((fragment) => {
			tags.forEach((tag) => {
				if (
					fragment &&
					fragment.toLowerCase().includes(tag.toLowerCase()) &&
					!matchedTags.includes(tag)
				) {
					matchedTags.push(tag);
				}
			});
		});
	}
	return matchedTags;
}

/**
 * @returns an array with text matched with regex pattern
 */
function getMatchedTextArray(text: string, pattern: RegExp): string[] {
	let match;
	const matchedArray: string[] = [];

	if (pattern.global) {
		while ((match = pattern.exec(text)) !== null) {
			matchedArray.push(match[1]);
		}
	} else {
		match = text.match(pattern);
		if (match) {
			matchedArray.push(match[1]);
		}
	}

	return matchedArray;
}

/**
 * case insensitive filter
 * @returns bool, true if the item contains an elem in the elemList
 */
function isIncludeElems(item: string, elemList: string[]) {
	return elemList.some((elem) =>
		item.toLowerCase().includes(elem.toLowerCase()),
	);
}
