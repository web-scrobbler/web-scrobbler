import { resolvePath } from './scripts/util';
export default {
	resolve: {
		alias: {
			'@': resolvePath(__dirname, './src'),
			'#': resolvePath(__dirname, './tests'),
		},
	},
};
