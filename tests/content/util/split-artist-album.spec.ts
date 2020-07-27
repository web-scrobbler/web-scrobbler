import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

import Util from '@/content/util';

const functionTestData: FunctionTestData<typeof Util.splitArtistAlbum>[] = [
	{
		description: 'should return empty result for empty input',
		funcParameters: ['', null],
		expectedValue: { artist: null, album: null },
	},
	{
		description: 'should return empty result for null input',
		funcParameters: [null, null],
		expectedValue: { artist: null, album: null },
	},
	{
		description: 'should split artist and album w/o swap and separators',
		funcParameters: ['Artist - Album'],
		expectedValue: { artist: 'Artist', album: 'Album' },
	},
	{
		description: 'should split artist and album',
		funcParameters: ['Artist - Album', null],
		expectedValue: { artist: 'Artist', album: 'Album' },
	},
	{
		description: 'should split artist and album by custom separator',
		funcParameters: ['Artist * Album', [' * ']],
		expectedValue: { artist: 'Artist', album: 'Album' },
	},
	{
		description: 'should not split malformed string',
		funcParameters: ['Artist & Album', null],
		expectedValue: { artist: null, album: null },
	},
	{
		description: 'should split artist and album, and swap them',
		// @ts-ignore
		funcParameters: ['Album - Artist', null, { swap: true }],
		expectedValue: { artist: 'Artist', album: 'Album' },
	},
];

describeAndTestFunction(Util.splitArtistAlbum.bind(Util), functionTestData);
