import { resolvePath } from './scripts/util';
import './scripts/set-test-env';
import ConditionalCompile from 'vite-plugin-conditional-compiler';
export default {
	resolve: {
		alias: {
			'@': resolvePath(__dirname, './src'),
			'#': resolvePath(__dirname, './tests'),
		},
	},
	plugins: [ConditionalCompile()],
};
