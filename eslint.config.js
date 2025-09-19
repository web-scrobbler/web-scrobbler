import solid from '@web-scrobbler/eslint-config/solid.js';

export default [
	...solid,
	{
		ignores: ['build/**', 'node_modules/**', 'src/vendor/**', '.xcode/**'],
	},
];
