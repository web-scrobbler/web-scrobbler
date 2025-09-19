const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
	{
		languageOptions: {
			globals: {
				$: 'readonly',
				Util: 'readonly',
				Connector: 'readonly',
				MetadataFilter: 'readonly',
			},
		},
	},
]);
