import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

import Util from '@/content/util';

const functionTestData: FunctionTestData<typeof Util.getMediaSessionInfo>[] = [
	{
		description: 'should return null for null input',
		funcParameters: [null],
		expectedValue: null,
	},
	{
		description: 'should return null if MediaMetadata is missing',
		funcParameters: [{ mediaMetadata: null }],
		expectedValue: null,
	},
	{
		description: 'should return track info if MediaMetadata available',
		funcParameters: [
			{
				metadata: {
					artist: 'Artist',
					title: 'Track',
					album: 'Album',
					artwork: [
						{
							sizes: '32x32',
							type: 'image/png',
							src: 'url1',
						},
						{
							sizes: '64x64',
							type: 'image/png',
							src: 'url2',
						},
					],
				},
			},
		],
		expectedValue: {
			artist: 'Artist',
			track: 'Track',
			album: 'Album',
			trackArt: 'url2',
		},
	},
	{
		description: 'should return track info if artwork is missing',
		funcParameters: [
			{
				metadata: {
					artist: 'Artist',
					title: 'Track',
					album: 'Album',
				},
			},
		],
		expectedValue: {
			artist: 'Artist',
			track: 'Track',
			album: 'Album',
			trackArt: null,
		},
	},
	{
		description: 'should return track info if artwork is an empty array',
		funcParameters: [
			{
				metadata: {
					artist: 'Artist',
					title: 'Track',
					album: 'Album',
					artwork: [],
				},
			},
		],
		expectedValue: {
			artist: 'Artist',
			track: 'Track',
			album: 'Album',
			trackArt: null,
		},
	},
];

describeAndTestFunction(Util.getMediaSessionInfo.bind(Util), functionTestData);
