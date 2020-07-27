import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

import Util from '@/content/util';

const functionTestData: FunctionTestData<
	typeof Util.processSoundCloudTrack
>[] = [
	{
		description: 'should process SoundCloud title (hyphen)',
		funcParameters: ['Artist - Track'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description: 'should process SoundCloud title (en dash)',
		funcParameters: ['Artist \u2013 Track'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description: 'should process SoundCloud title (em dash)',
		funcParameters: ['Artist \u2014 Track'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description: 'should process SoundCloud title (horizontal bar)',
		funcParameters: ['Artist \u2015 Track'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description: 'should use title as track title',
		funcParameters: ['Track Name'],
		expectedValue: { artist: null, track: 'Track Name' },
	},
];

describeAndTestFunction(
	Util.processSoundCloudTrack.bind(Util),
	functionTestData
);
