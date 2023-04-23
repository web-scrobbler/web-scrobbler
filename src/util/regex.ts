import Song, { BaseSong } from '@/core/object/song';
import * as BrowserStorage from '@/core/storage/browser-storage';

/**
 * Editable fields.
 */
export type FieldType = 'Track' | 'Artist' | 'Album' | 'AlbumArtist';

/**
 * Edit fields with nullability; used for storage. Null indicates the field should be ignored.
 */
export type RegexFields = {
	[field in FieldType]: string | null;
};

/**
 * Edit fields without nullability; used for previews.
 */
export type EditedFields = {
	[field in FieldType]: string;
};

/**
 * Regex edit object.
 */
export type RegexEdit = {
	search: RegexFields;
	replace: RegexFields;
};

/**
 * Checks a set of search fields for a regex edit and sees if the edit should be applied to the song.
 *
 * @param search - Search fields to check
 * @param song - Song to check
 * @returns True if the edit should be applied; false otherwise
 */
export function shouldApplyEdit(search: RegexFields, song: Song): boolean {
	for (const [_key, field] of Object.entries(search)) {
		const key = _key as FieldType;
		const songField = getSongField(song, key);
		if (!searchMatches(field, songField)) {
			return false;
		}
	}
	return true;
}

/**
 * Checks a single search field from a regex edit and sees if the edit should be applied to a specific text.
 *
 * @param search - Search regex to check
 * @param text - Text to check
 * @returns True if the edit should be applied; false otherwise
 */
export function searchMatches(search: string | null, text: string): boolean {
	if (search === null) {
		return true;
	}
	try {
		const regex = new RegExp(`^${search}$`);
		return regex.test(text);
	} catch (err) {
		return false;
	}
}

/**
 * Replaces a single field based on a regex edit.
 *
 * @param search - Search regex
 * @param replace - Replace regex
 * @param text - Text to replace
 * @returns Text with regex applied
 */
function replaceField(
	search: string | null,
	replace: string | null,
	text: string
): string {
	if (search === null || replace === null) {
		return text;
	}
	try {
		const regex = new RegExp(`^${search}$`);
		return text.replace(regex, replace);
	} catch (err) {
		return text;
	}
}

/**
 * Apply regex edit to all fields of a song.
 *
 * @param search - Search regex fields
 * @param replace - Replace regex fields
 * @param song - Song to apply regex to
 * @returns Edited fields
 */
export function replaceFields(
	search: RegexFields,
	replace: RegexFields,
	song: BaseSong
): EditedFields {
	const fields: EditedFields = {
		Track: getSongField(song, 'Track'),
		Artist: getSongField(song, 'Artist'),
		Album: getSongField(song, 'Album'),
		AlbumArtist: getSongField(song, 'AlbumArtist'),
	};
	for (const _field of Object.keys(fields)) {
		const field = _field as FieldType;
		if (!searchMatches(search[field], fields[field])) {
			return fields;
		}
	}
	for (const _field of Object.keys(fields)) {
		const field = _field as FieldType;
		fields[field] = replaceField(
			search[field],
			replace[field],
			fields[field]
		);
	}
	return fields;
}

/**
 * Applies a regex edit to a song.
 *
 * @param edit - Regex edit to apply
 * @param song - Song to apply regex to
 */
export function editSong(edit: RegexEdit, song: Song) {
	const fields = replaceFields(edit.search, edit.replace, song);
	song.processed = {
		...song.processed,
		track: fields.Track,
		artist: fields.Artist,
		album: fields.Album,
		albumArtist: fields.AlbumArtist,
	};
}

/**
 * Gets a field from a song.
 *
 * @param clonedSong - Song to get field from
 * @param type - Field to get
 * @returns Content of field from song
 */
export function getSongField(clonedSong: BaseSong, type: FieldType) {
	return clonedSong[`get${type}`]() ?? '';
}

/**
 * Default regexes to be applied on first load
 */
const DEFAULT_REGEXES = [
	{
		search: {
			Track: null,
			Artist: null,
			Album: '(.*) - Single',
			AlbumArtist: null,
		},
		replace: {
			Track: null,
			Artist: null,
			Album: '$1',
			AlbumArtist: null,
		},
	},
	{
		search: {
			Track: null,
			Artist: null,
			Album: '(.*) - EP',
			AlbumArtist: null,
		},
		replace: {
			Track: null,
			Artist: null,
			Album: '$1',
			AlbumArtist: null,
		},
	},
];

/**
 * Sets default regexes if none exist.
 */
export async function setRegexDefaults() {
	const regexEdits = BrowserStorage.getStorage(BrowserStorage.REGEX_EDITS);
	const regexes = await regexEdits.get();
	if (!regexes) {
		regexEdits.set(DEFAULT_REGEXES);
	}
}
