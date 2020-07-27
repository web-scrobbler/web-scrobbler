import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

import Util from '@/content/util';

const functionTestData: FunctionTestData<typeof Util.processYtVideoTitle>[] = [
	{
		description: 'should return null for empty input',
		funcParameters: [''],
		expectedValue: { artist: null, track: null },
	},
	{
		description: 'should return null for null input',
		funcParameters: [null],
		expectedValue: { artist: null, track: null },
	},
	{
		description: 'should process YouTube title',
		funcParameters: ['Artist - Track'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description: 'should remove [genre] from the beginning of the title',
		funcParameters: ['[Genre] Artist - Track'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description: 'should remove 【genre】 from the beginning of the title',
		funcParameters: ['【Genre】 Artist - Track'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description:
			'should remove single-digit CD track number from the beginning of the title',
		funcParameters: ['1. Artist - Track'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description:
			'should remove zero-padded CD track number from the beginning of the title',
		funcParameters: ['01. Artist - Track'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description:
			'should remove CD track number up to 99 from the beginning of the title',
		funcParameters: ['99. Artist - Track'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description:
			'should not remove CD track number higher than 100 from the beginning of the title',
		funcParameters: ['100. Artist - Track'],
		expectedValue: { artist: '100. Artist', track: 'Track' },
	},
	{
		description:
			'should not remove CD track number if not suffixed by a dot and a space from the beginning of the title',
		funcParameters: ['01- Artist - Track'],
		expectedValue: { artist: '01- Artist', track: 'Track' },
	},
	{
		description:
			'should remove CD track number following space from the beginning of the title',
		funcParameters: [' 1. Artist - Track'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description:
			'should remove multiple-vinyl track number from the beginning of the title',
		funcParameters: ['C1. Artist - Track'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description:
			'should remove single-track vinyl track number from the beginning of the title',
		funcParameters: ['A. Artist - Track'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description:
			'should remove parallel groove vinyl track number from the beginning of the title',
		funcParameters: ['AB2. Artist - Track'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description:
			'should not remove mistyped vinyl track number from the beginning of the title',
		funcParameters: ['1A. Artist - Track'],
		expectedValue: { artist: '1A. Artist', track: 'Track' },
	},
	{
		description:
			'should not remove mistyped parallel groove vinyl track number from the beginning of the title',
		funcParameters: ['A11. Artist - Track'],
		expectedValue: { artist: 'A11. Artist', track: 'Track' },
	},
	{
		description: 'should process text string w/o separators',
		funcParameters: ['Artist "Track"'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description: 'should process Japanese tracks',
		funcParameters: ['Artist「Track」'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description: 'should process inverted tracks with parens',
		funcParameters: ['Track (by Artist)'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description: 'should process inverted tracks with parens and comments',
		funcParameters: ['Track (cover by Artist) Studio'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description:
			'should process inverted tracks with parens original artist',
		funcParameters: ['Original Artist - Track (cover by Artist)'],
		expectedValue: { artist: 'Artist', track: 'Track' },
	},
	{
		description: 'should process tracks with seperators and quotes',
		funcParameters: ['Artist - "Track Name"'],
		expectedValue: { artist: 'Artist', track: 'Track Name' },
	},
	{
		description:
			'should process tracks with seperators without leading whitespace and quotes',
		funcParameters: ['Artist: "Track Name"'],
		expectedValue: { artist: 'Artist', track: 'Track Name' },
	},
	{
		description: 'should use title as track title',
		funcParameters: ['Track Name'],
		expectedValue: { artist: null, track: 'Track Name' },
	},
];

describeAndTestFunction(Util.processYtVideoTitle.bind(Util), functionTestData);
