import {
	FunctionTestData,
	describeAndTestFunction,
} from '#/helpers/test-function';

import Util from '@/content/util';

const functionTestData: FunctionTestData<typeof Util.getYtVideoIdFromUrl>[] = [
	{
		description: 'should return null for null input',
		funcParameters: [null],
		expectedValue: null,
	},
	{
		description: 'should return null for empty input',
		funcParameters: [''],
		expectedValue: null,
	},
	{
		description: 'should return null for invalid input',
		funcParameters: ['Invalid input'],
		expectedValue: null,
	},
	{
		description: 'should return video ID from URL',
		funcParameters: ['https://www.youtube.com/watch?v=JJYxNSRX6Oc'],
		expectedValue: 'JJYxNSRX6Oc',
	},
	{
		description: 'should return video ID from URL with several params',
		funcParameters: ['https://www.youtube.com/watch?v=JJYxNSRX6Oc&t=92s'],
		expectedValue: 'JJYxNSRX6Oc',
	},
	{
		description:
			'should return video ID from URL when "v" param is in the end of query',
		funcParameters: [
			'https://www.youtube.com/watch?list=PLjTdkvaV6GM-J-6PHx9Cw5Cg2tI5utWe7&v=ALZHF5UqnU4',
		],
		expectedValue: 'ALZHF5UqnU4',
	},
	{
		description: 'should return video ID from short URL',
		funcParameters: ['https://youtu.be/Mssm8Ml5sOo'],
		expectedValue: 'Mssm8Ml5sOo',
	},
	{
		description: 'should return video ID from embed video URL',
		funcParameters: [
			'https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com',
		],
		expectedValue: 'M7lc1UVf-VE',
	},
];

describeAndTestFunction(Util.getYtVideoIdFromUrl.bind(Util), functionTestData);
