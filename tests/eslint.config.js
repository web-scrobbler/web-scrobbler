import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
	{
		languageOptions: {
			globals: {
				...globals.mocha,
				define: 'readonly',
			},
		},
	},
]);
