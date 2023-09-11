import webextensionPolyfill from '#/mocks/webextension-polyfill';
import Pipeline from '@/core/object/pipeline/pipeline';
import Song from '@/core/object/song';
import { SavedEdit } from '@/core/storage/options';
import regexEdits from '@/core/storage/regex-edits';
import savedEdits from '@/core/storage/saved-edits';
import { State } from '@/core/types';
import {
	RegexEdit,
	getProcessedFields,
	getProcessedFieldsNoRegex,
} from '@/util/regex';
import { getConnectorById } from '@/util/util-connector';
import { randomBytes } from 'crypto';
import { beforeEach, describe, expect, it } from 'vitest';

const pipeline = new Pipeline();

describe('Should edit Regex', () => {
	beforeEach(() => {
		webextensionPolyfill.reset();
		webextensionPolyfill.setUser();
		regexEdits.init();
	});

	it('Should add edits to storage', async () => {
		await regexEdits.saveRegexEdit(epRemover.search, epRemover.replace);
		await regexEdits.saveRegexEdit(
			singleRemover.search,
			singleRemover.replace,
		);
		expect(await regexEdits.getData()).to.deep.equal([
			epRemover,
			singleRemover,
		]);
	});

	it('Should delete edits from storage', async () => {
		await regexEdits.saveRegexEdit(epRemover.search, epRemover.replace);
		await regexEdits.saveRegexEdit(
			singleRemover.search,
			singleRemover.replace,
		);
		await regexEdits.saveRegexEdit(
			fuminnikkiFixer.search,
			fuminnikkiFixer.replace,
		);
		await regexEdits.deleteRegexEdit(1);
		expect(await regexEdits.getData()).to.deep.equal([
			epRemover,
			fuminnikkiFixer,
		]);
	});

	it("Should apply edit to song's artist", async () => {
		await regexEdits.saveRegexEdit(
			fuminnikkiFixer.search,
			fuminnikkiFixer.replace,
		);
		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(
			processedFuminnikkiSongWithEP,
		);
	});

	it("Should apply edit to song's album", async () => {
		await regexEdits.saveRegexEdit(epRemover.search, epRemover.replace);
		const song = new Song(correctFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(processedFuminnikkiSong);
	});

	it("Should apply edit to song's artist and album", async () => {
		await regexEdits.saveRegexEdit(
			fuminnikkiFixer.search,
			fuminnikkiFixer.replace,
		);
		await regexEdits.saveRegexEdit(epRemover.search, epRemover.replace);
		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(getProcessedFields(song)).to.deep.equal(processedFuminnikkiSong);
	});

	it("Should apply only the most recent edit to song's artist only once", async () => {
		await regexEdits.saveRegexEdit(
			artistNumberSuffixer(1).search,
			artistNumberSuffixer(1).replace,
		);
		await regexEdits.saveRegexEdit(
			artistNumberSuffixer(2).search,
			artistNumberSuffixer(2).replace,
		);

		const song = new Song(correctFuminnikkiSong, youtubeConnector);
		await pipeline.process(song, youtubeConnector);
		expect(song.getTrack()).to.equal('Re:start');
		expect(song.getArtist()).to.equal('フミンニッキ2');
		expect(song.getAlbum()).to.equal(null);
		expect(song.getAlbumArtist()).to.equal(null);
	});

	it('Should apply edit to track that does not exist', async () => {
		await regexEdits.saveRegexEdit(
			artistNumberSuffixer(1).search,
			artistNumberSuffixer(1).replace,
		);

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
		await regexEdits.saveRegexEdit(
			fuminnikkiFixer.search,
			fuminnikkiFixer.replace,
		);
		await regexEdits.saveRegexEdit(epRemover.search, epRemover.replace);

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
		await regexEdits.saveRegexEdit(
			artistNumberSuffixer(1).search,
			artistNumberSuffixer(1).replace,
		);

		const song = new Song(wrongFuminnikkiSong, youtubeConnector);
		savedEdits.saveSongInfo(song, processedFuminnikkiSong as SavedEdit);
		await pipeline.process(song, youtubeConnector);

		expect(getProcessedFields(song)).to.deep.equal(processedFuminnikkiSong);
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

const youtubeConnector = getConnectorById('youtube')!;
