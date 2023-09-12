import Song, { BaseSong } from '@/core/object/song';
import * as BrowserStorage from '@/core/storage/browser-storage';

/**
 * Editable fields.
 */
export type FieldType = 'track' | 'artist' | 'album' | 'albumArtist';

/**
 * Editable fields with pascal case for function calls and i18n
 */
export type PascalCaseFieldType = 'Track' | 'Artist' | 'Album' | 'AlbumArtist';

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
 * Checks if a regex edit has already been applied to any of the fields this edit would apply to.
 * This is used to prevent multiple edits from being applied to the same field.
 *
 * @param replace - Replace regex fields
 * @param song - Song to check
 * @returns True if an edit has already been applied to the fields this edit would apply to; false otherwise
 */
function alreadyApplied(replace: RegexFields, song: Song) {
	for (const [_key, field] of Object.entries(replace)) {
		const key = _key as FieldType;
		if (field === null) {
			continue;
		}
		if (song.flags.isRegexEditedByUser[key]) {
			return true;
		}
	}
	return false;
}

/**
 * Checks a set of search fields for a regex edit and sees if the edit should be applied to the song.
 *
 * @param search - Search fields to check
 * @param song - Song to check
 * @returns True if the edit should be applied; false otherwise
 */
export function shouldApplyEdit(edit: RegexEdit, song: Song): boolean {
	if (alreadyApplied(edit.replace, song)) {
		return false;
	}

	for (const [_key, field] of Object.entries(edit.search)) {
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
	text: string,
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
 * @param fields - Fields to apply regex to
 * @returns Edited fields
 */
export function replaceFields(
	search: RegexFields,
	replace: RegexFields,
	fields: EditedFields,
): EditedFields {
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
			fields[field],
		);
	}
	return fields;
}

/**
 * Gets processed fields from song.
 *
 * @param song - Song to get processed fields from
 * @returns Processed fields
 */
export function getProcessedFields(song: BaseSong): EditedFields {
	return {
		track: getSongField(song, 'track'),
		artist: getSongField(song, 'artist'),
		album: getSongField(song, 'album'),
		albumArtist: getSongField(song, 'albumArtist'),
	};
}

/**
 * Gets non-regex processed fields from song.
 * This is used for previews.
 *
 * @param song - Song to get processed fields from
 * @returns Processed fields without regex
 */
export function getProcessedFieldsNoRegex(song: BaseSong): EditedFields {
	return {
		track: getSongFieldNoRegex(song, 'track'),
		artist: getSongFieldNoRegex(song, 'artist'),
		album: getSongFieldNoRegex(song, 'album'),
		albumArtist: getSongFieldNoRegex(song, 'albumArtist'),
	};
}

/**
 * Applies a regex edit to a song.
 *
 * @param edit - Regex edit to apply
 * @param song - Song to apply regex to
 */
export function editSong(edit: RegexEdit, song: Song) {
	const fields = replaceFields(
		edit.search,
		edit.replace,
		getProcessedFields(song),
	);

	for (const [_key, field] of Object.entries(fields)) {
		const key = _key as FieldType;
		if (edit.search[key] && edit.replace[key]) {
			song.flags.isRegexEditedByUser[key] = true;
			song.processed[key] = field;
		}
	}
}

/**
 * Converts a field to pascal case.
 *
 * @param text - Field to convert
 * @returns Field in pascal case
 */
export function pascalCaseField(text: FieldType): PascalCaseFieldType {
	return (text.charAt(0).toUpperCase() +
		text.slice(1)) as PascalCaseFieldType;
}

/**
 * Gets a field from a song.
 *
 * @param clonedSong - Song to get field from
 * @param type - Field to get
 * @returns Content of field from song
 */
export function getSongField(clonedSong: BaseSong, type: FieldType): string {
	return clonedSong[`get${pascalCaseField(type)}`]() ?? '';
}

/**
 * Gets a field from a song ignoring regex edits.
 *
 * @param clonedSong - Song to get field from
 * @param type - Field to get
 * @returns Content of field from song ignoring regex edits
 */
export function getSongFieldNoRegex(
	clonedSong: BaseSong,
	type: FieldType,
): string {
	return (clonedSong.noRegex[type] || clonedSong.parsed[type]) ?? '';
}

/**
 * Default regexes to be applied on first load
 */
const DEFAULT_REGEXES = [
	{
		search: {
			track: null,
			artist: null,
			album: '(.*) - Single',
			albumArtist: null,
		},
		replace: {
			track: null,
			artist: null,
			album: '$1',
			albumArtist: null,
		},
	},
	{
		search: {
			track: null,
			artist: null,
			album: '(.*) - EP',
			albumArtist: null,
		},
		replace: {
			track: null,
			artist: null,
			album: '$1',
			albumArtist: null,
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
