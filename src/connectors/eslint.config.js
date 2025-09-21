import { defineConfig } from 'eslint/config';

export default defineConfig([
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
