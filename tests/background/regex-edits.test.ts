/* eslint-disable @typescript-eslint/no-unused-expressions */

import webextensionPolyfill from '#/mocks/webextension-polyfill';
import fetchPolyfill from '#/mocks/fetch';
import Pipeline from '@/core/object/pipeline/pipeline';
import Song from '@/core/object/song';
import type { SavedEdit } from '@/core/storage/options';
import regexEdits from '@/core/storage/regex-edits';
import savedEdits from '@/core/storage/saved-edits';
import type { State } from '@/core/types';
import type { RegexEdit } from '@/util/regex';
import { getProcessedFields, getProcessedFieldsNoRegex } from '@/util/regex';
import { getConnectorById } from '@/util/util-connector';
import { randomBytes } from 'crypto';
import { beforeEach, describe, expect, it } from 'vitest';

// ensure polyfill is loaded;
fetchPolyfill;
const pipeline = new Pipeline();

describe('Should edit Regex', () => {
	beforeEach(() => {
		webextensionPolyfill.reset();
		webextensionPolyfill.setUser();
		regexEdits.init();
	});

	it('Should add edits to storage', async () => {
		await regexEdits.saveRegexEdit({
			search: epRemover.search,
			replace: epRemover.replace,
		});
		await regexEdits.saveRegexEdit({
			search: singleRemover.search,
			replace: singleRemover.replace,
		});
		expect(await regexEdits.getData()).to.deep.equal([
			epRemover,
			singleRemover,
		]);
	});

	it('Should delete edits from storage', async () => {
		await regexEdits.saveRegexEdit({
			search: epRemover.search,
			replace: epRemover.replace,
		});
		await regexEdits.saveRegexEdit({
			search: singleRemover.search,
			replace: singleRemover.replace,
		});
		await regexEdits.saveRegexEdit({
			search: fuminnikkiFixer.search,
			replace: fuminnikkiFixer.replace,
		});
		await regexEdits.deleteRegexEdit(1);
		expect(await regexEdits.getData()).to.deep.equal([
			epRemover,
			fuminnikkiFixer,
		]);
	});

	it("Should apply edit to song's artist", async () => {
		await regexEdits.saveRegexEdit({
			search: fuminnikkiFixer.search,
			replace: fuminnikkiFixer.replace,
		});
		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(
			processedFuminnikkiSongWithEP,
		);
	});

	it("Should apply edit to song's album", async () => {
		await regexEdits.saveRegexEdit({
			search: epRemover.search,
			replace: epRemover.replace,
		});
		const song = new Song(correctFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(processedFuminnikkiSong);
	});

	it("Should apply edit to song's artist and album", async () => {
		await regexEdits.saveRegexEdit({
			search: fuminnikkiFixer.search,
			replace: fuminnikkiFixer.replace,
		});
		await regexEdits.saveRegexEdit({
			search: epRemover.search,
			replace: epRemover.replace,
		});
		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(processedFuminnikkiSong);
	});

	it("Should apply only the most recent edit to song's artist only once", async () => {
		await regexEdits.saveRegexEdit({
			search: artistNumberSuffixer(1).search,
			replace: artistNumberSuffixer(1).replace,
		});
		await regexEdits.saveRegexEdit({
			search: artistNumberSuffixer(2).search,
			replace: artistNumberSuffixer(2).replace,
		});

		const song = new Song(correctFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(song.getTrack()).to.equal('Re:start');
		expect(song.getArtist()).to.equal('フミンニッキ2');
		expect(song.getAlbum()).to.equal(null);
		expect(song.getAlbumArtist()).to.equal(null);
	});

	it('Should apply edit to track that does not exist', async () => {
		await regexEdits.saveRegexEdit({
			search: artistNumberSuffixer(1).search,
			replace: artistNumberSuffixer(1).replace,
		});

		const artist = randomBytes(32).toString('hex');
		const track = randomBytes(32).toString('hex');
		const song = new Song({ artist, track }, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(song.getTrack()).to.equal(track);
		expect(song.getArtist()).to.equal(`${artist}1`);
		expect(song.getAlbum()).to.equal(null);
		expect(song.getAlbumArtist()).to.equal(null);
	});

	it('Should have non-regex edits saved for preview', async () => {
		await regexEdits.saveRegexEdit({
			search: fuminnikkiFixer.search,
			replace: fuminnikkiFixer.replace,
		});
		await regexEdits.saveRegexEdit({
			search: epRemover.search,
			replace: epRemover.replace,
		});

		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(processedFuminnikkiSong);
		expect(getProcessedFieldsNoRegex(song)).to.deep.equal({
			track: 'Re:start',
			artist: 'Fuminnikki',
			album: 'Re:start - EP',
			albumArtist: '',
		});
	});

	it('Should not apply regex edit if there is a song edit', async () => {
		await regexEdits.saveRegexEdit({
			search: artistNumberSuffixer(1).search,
			replace: artistNumberSuffixer(1).replace,
		});

		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		savedEdits.saveSongInfo(song, processedFuminnikkiSong as SavedEdit);
		await pipeline.process(song, youtubeConnector);

		expect(getProcessedFields(song)).to.deep.equal(processedFuminnikkiSong);
	});
});

describe('Should handle bulk edit flags', () => {
	beforeEach(() => {
		webextensionPolyfill.reset();
		webextensionPolyfill.setUser();
		regexEdits.init();
	});

	it('Should not apply regex edit with wrong casing if edit is not case insensitive', async () => {
		await regexEdits.saveRegexEdit({
			search: fuminnikkiFixerInsensitive.search,
			replace: fuminnikkiFixerInsensitive.replace,
		});

		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(
			wrongProcessedFuminnikkiSong,
		);
	});

	it('Should apply regex edit with wrong casing if edit is case insensitive', async () => {
		await regexEdits.saveRegexEdit({
			search: fuminnikkiFixerInsensitive.search,
			replace: fuminnikkiFixerInsensitive.replace,
			isCaseInsensitive: true,
		});

		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(
			processedFuminnikkiSongWithEP,
		);
	});

	it('Should not apply non-regex edit with wrong casing if edit is not case insensitive', async () => {
		await regexEdits.saveRegexEdit({
			search: fuminnikkiFixerInsensitive.search,
			replace: fuminnikkiFixerInsensitive.replace,
			isRegexDisabled: true,
		});

		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(
			wrongProcessedFuminnikkiSong,
		);
	});

	it('Should apply non-regex edit with wrong casing if edit is case insensitive', async () => {
		await regexEdits.saveRegexEdit({
			search: fuminnikkiFixerInsensitive.search,
			replace: fuminnikkiFixerInsensitive.replace,
			isCaseInsensitive: true,
			isRegexDisabled: true,
		});

		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(
			processedFuminnikkiSongWithEP,
		);
	});

	it('Should apply global regex edit when it covers entire string', async () => {
		await regexEdits.saveRegexEdit({
			search: fuminnikkiFixer.search,
			replace: fuminnikkiFixer.replace,
			isGlobal: true,
		});

		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(
			processedFuminnikkiSongWithEP,
		);
	});

	it('Should apply global non-regex edit when it covers entire string', async () => {
		await regexEdits.saveRegexEdit({
			search: fuminnikkiFixer.search,
			replace: fuminnikkiFixer.replace,
			isGlobal: true,
			isRegexDisabled: true,
		});

		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(
			processedFuminnikkiSongWithEP,
		);
	});

	it('Should not apply global-reliant regex edit when global is not enabled', async () => {
		await regexEdits.saveRegexEdit({
			search: fuminGlobal.search,
			replace: fuminGlobal.replace,
		});

		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(
			wrongProcessedFuminnikkiSong,
		);
	});

	it('Should not apply global-reliant non-regex edit when global is not enabled', async () => {
		await regexEdits.saveRegexEdit({
			search: fuminGlobal.search,
			replace: fuminGlobal.replace,
			isRegexDisabled: true,
		});

		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(
			wrongProcessedFuminnikkiSong,
		);
	});

	it('Should apply global-reliant regex edit when global is enabled', async () => {
		await regexEdits.saveRegexEdit({
			search: fuminGlobal.search,
			replace: fuminGlobal.replace,
			isGlobal: true,
		});

		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(
			processedPartialFuminnikkiSong,
		);
	});

	it('Should apply global-reliant non-regex edit when global is enabled', async () => {
		await regexEdits.saveRegexEdit({
			search: fuminGlobal.search,
			replace: fuminGlobal.replace,
			isGlobal: true,
			isRegexDisabled: true,
		});

		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(
			processedPartialFuminnikkiSong,
		);
	});

	it('Should not apply global regex edit with wrong casing if case insensitive is off', async () => {
		await regexEdits.saveRegexEdit({
			search: fuminGlobalInsensitive.search,
			replace: fuminGlobalInsensitive.replace,
			isGlobal: true,
		});

		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(
			wrongProcessedFuminnikkiSong,
		);
	});

	it('Should not apply global non-regex edit with wrong casing if case insensitive is off', async () => {
		await regexEdits.saveRegexEdit({
			search: fuminGlobalInsensitive.search,
			replace: fuminGlobalInsensitive.replace,
			isGlobal: true,
			isRegexDisabled: true,
		});

		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(
			wrongProcessedFuminnikkiSong,
		);
	});

	it('Should apply global regex edit with wrong casing if case insensitive is on', async () => {
		await regexEdits.saveRegexEdit({
			search: fuminGlobalInsensitive.search,
			replace: fuminGlobalInsensitive.replace,
			isGlobal: true,
			isCaseInsensitive: true,
		});

		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(
			processedPartialFuminnikkiSong,
		);
	});

	it('Should apply global non-regex edit with wrong casing if case insensitive is on', async () => {
		await regexEdits.saveRegexEdit({
			search: fuminGlobalInsensitive.search,
			replace: fuminGlobalInsensitive.replace,
			isGlobal: true,
			isCaseInsensitive: true,
			isRegexDisabled: true,
		});

		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(
			processedPartialFuminnikkiSong,
		);
	});

	it('Should not apply regex if regex is disabled', async () => {
		await regexEdits.saveRegexEdit({
			search: epRemover.search,
			replace: epRemover.replace,
			isRegexDisabled: true,
		});
		const song = new Song(correctFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(
			processedFuminnikkiSongWithEP,
		);
	});
});

const epRemover: RegexEdit = {
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
};

const singleRemover: RegexEdit = {
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
};

const fuminnikkiFixer: RegexEdit = {
	search: {
		track: null,
		artist: 'Fuminnikki',
		album: null,
		albumArtist: null,
	},
	replace: {
		track: null,
		artist: 'フミンニッキ',
		album: null,
		albumArtist: null,
	},
};

const fuminnikkiFixerInsensitive: RegexEdit = {
	search: {
		track: null,
		artist: 'fUmInnIkkI',
		album: null,
		albumArtist: null,
	},
	replace: {
		track: null,
		artist: 'フミンニッキ',
		album: null,
		albumArtist: null,
	},
};

const fuminGlobal: RegexEdit = {
	search: {
		track: null,
		artist: 'Fumin',
		album: null,
		albumArtist: null,
	},
	replace: {
		track: null,
		artist: 'フミン',
		album: null,
		albumArtist: null,
	},
};

const fuminGlobalInsensitive: RegexEdit = {
	search: {
		track: null,
		artist: 'fUmIn',
		album: null,
		albumArtist: null,
	},
	replace: {
		track: null,
		artist: 'フミン',
		album: null,
		albumArtist: null,
	},
};

const artistNumberSuffixer = (suffix: number): RegexEdit => ({
	search: {
		track: null,
		artist: '(.*)',
		album: null,
		albumArtist: null,
	},
	replace: {
		track: null,
		artist: `$1${suffix}`,
		album: null,
		albumArtist: null,
	},
});

const wrongFuminnikkiSong: State = {
	track: 'Re:start',
	artist: 'Fuminnikki',
};

const correctFuminnikkiSong: State = {
	track: 'Re:start',
	artist: 'フミンニッキ',
};

const processedFuminnikkiSong: State = {
	track: 'Re:start',
	artist: 'フミンニッキ',
	album: 'Re:start',
	albumArtist: '',
};

const processedFuminnikkiSongWithEP: State = {
	...processedFuminnikkiSong,
	album: 'Re:start - EP',
};

const wrongProcessedFuminnikkiSong: State = {
	track: 'Re:start',
	artist: 'Fuminnikki',
	album: '',
	albumArtist: '',
};

const processedPartialFuminnikkiSong: State = {
	track: 'Re:start',
	artist: 'フミンnikki',
	album: '',
	albumArtist: '',
};

const youtubeConnector = getConnectorById('youtube')!;
