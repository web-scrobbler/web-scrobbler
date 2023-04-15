import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import { PluginOption } from 'vite';
import { getBrowser } from './util';
import colorLog from './log';

async function performMinification() {
	await imagemin([`build/${getBrowser()}/icons/*.png`], {
		destination: `build/${getBrowser()}/icons`,
		plugins: [imageminPngquant()],
	});
	await imagemin(['src/img/*.{jpg,png}'], {
		destination: `build/${getBrowser()}/img`,
		plugins: [imageminJpegtran(), imageminPngquant()],
	});
}

/**
 * Vite plugin that minifies images then move them to the right place
 */
export default function minifyImages(): PluginOption {
	return {
		name: 'compile-connectors',
		async buildEnd() {
			await performMinification();
			colorLog('Finished image minification', 'success');
		},
	};
}
