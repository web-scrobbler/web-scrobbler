import { glob } from 'glob';
import fs from 'fs-extra';
import path from 'node:path';
import sharp from 'sharp';
import type { PluginOption } from 'vite';
import { getBrowser, releaseTarget, releaseTargets } from './util';
import colorLog from './log';

const pngOptions: sharp.PngOptions = {
	palette: true,
	quality: 80,
	dither: 1.0,
};

const jpegOptions: sharp.JpegOptions = {
	mozjpeg: true,
	quality: 85,
};

async function minifyImage(sourcePath: string, destinationDir?: string) {
	const isPng = path.extname(sourcePath).toLowerCase() === '.png';
	const data = isPng
		? await sharp(sourcePath).png(pngOptions).toBuffer()
		: await sharp(sourcePath).jpeg(jpegOptions).toBuffer();

	const destinationPath = destinationDir
		? path.join(destinationDir, path.basename(sourcePath))
		: sourcePath;

	await fs.outputFile(destinationPath, data);
}

async function minifyImagesIn(pattern: string, destinationDir?: string) {
	const files = await glob(pattern);
	await Promise.all(files.map((file) => minifyImage(file, destinationDir)));
}

async function performMinification() {
	await minifyImagesIn(`build/${getBrowser()}/icons/*.png`);
	await minifyImagesIn(
		'src/img/main/*.{jpg,png}',
		`build/${getBrowser()}/img`,
	);
	if (releaseTarget === releaseTargets.safari) {
		await minifyImagesIn(
			'src/img/safari/*.{jpg,png}',
			'.xcode/Web Scrobbler/Shared (App)/Resources',
		);
	}
}

/**
 * Vite plugin that minifies images then move them to the right place
 */
export default function minifyImages(options: {
	isDev: boolean;
}): PluginOption {
	return {
		name: 'minify-images',
		buildEnd: async () => {
			if (options.isDev) {
				colorLog('Skipping image minification for dev build', 'info');
				return;
			}

			await performMinification();
			colorLog('Finished image minification', 'success');
		},
	};
}
