import fs from 'fs/promises';
import { createCanvas, loadImage } from 'canvas';
import { resolve } from 'path';
import { getBrowser, releaseTarget } from './util';
import colorLog from './log';
import { PluginOption } from 'vite';

/**
 * Input folder containing the original svg icons in the source.
 */
const input = resolve('', 'src', 'icons');

/**
 * Output folder where the rendered images should be output during the building.
 */
const output = resolve('', 'build', getBrowser(), 'icons');

/**
 * Resolutions to render main icon to.
 */
const mainIconResolutions = [48, 96, 128, 256, 512];

/**
 * Resolutions to render action icons to
 */
const actionIconResolutions = [16, 19, 32, 38];

/**
 * A map of filenames in the misc icon folder and the sizes we want them in PNG format
 */
const miscSizes = {
	'icon_generic.svg': [16],
};

/**
 * A map of filenames in the monochrome icon folder and the colors we want them in PNG format
 */
const monochromeColors = {
	'action_base.svg': {
		light: '#d51107',
		dark: '#fc3434',
	},
	'action_disabled.svg': {
		light: '#7f7f7f',
		dark: '#9f9f9f',
	},
	'action_error.svg': {
		light: '#fea800',
		dark: '#fea800',
	},
	'action_ignored.svg': {
		light: '#fea800',
		dark: '#fea800',
	},
	'action_loading.svg': {
		light: '#3b3b3b',
		dark: '#f7f7f7',
	},
	'action_playing.svg': {
		light: '#66a858',
		dark: '#66a858',
	},
	'action_scrobbled.svg': {
		light: '#66a858',
		dark: '#66a858',
	},
	'action_skipped.svg': {
		light: '#7f7f7f',
		dark: '#9f9f9f',
	},
	'action_unknown.svg': {
		light: '#7f7f7f',
		dark: '#9f9f9f',
	},
	'action_unsupported.svg': {
		light: '#adadad',
		dark: '#727272',
	},
};

/**
 * Safari tints icons - we only use a single color for these.
 */
const safariIconColor = '#707070';

/**
 * Vite plugin that takes the icon svgs in the icons folder, and turns them into appropriate PNGs in the build folder
 */
export default function generateIcons(): PluginOption {
	return {
		name: 'generate-icons',
		buildStart() {
			return new Promise((resolve, reject) => {
				try {
					main().then(() => {
						colorLog('Finished writing icons!', 'success');
						resolve();
					});
				} catch (err) {
					reject(err);
				}
			});
		},
	};
}

/**
 * Creates a png from a svg without making any edits to it.
 *
 * @param folder - folder containing the icon svg in src.
 * @param path - name of the svg file.
 * @param size - desired resolution of the png file.
 * @returns a PNG buffer from the svg file
 */
async function createUnmodifiedIcon(
	folder: string,
	path: string,
	size: number
) {
	const canvas = createCanvas(size, size);
	const ctx = canvas.getContext('2d');
	const image = await loadImage(resolve(input, folder, path));
	ctx.drawImage(image, 0, 0, size, size);
	return canvas.toBuffer();
}

/**
 * Creates a png from a svg, making it into a monochrome icon of a specified color
 *
 * @param path - name of the svg file.
 * @param size - desired resolution of the png file.
 * @param color - color code of the color to be used.
 * @returns a monochrome PNG buffer from the svg file.
 */
async function createMonochromeIcon(path: string, size: number, color: string) {
	const canvas = createCanvas(size, size);
	const ctx = canvas.getContext('2d');
	const image = await loadImage(resolve(input, 'monochrome', path));
	ctx.drawImage(image, 0, 0, size, size);
	ctx.globalCompositeOperation = 'source-in';
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, size, size);
	return canvas.toBuffer();
}

/**
 * Gets new PNG file name for page action icons
 *
 * @param path - original svg filename.
 * @param size - desired resolution of png.
 * @param type - type of icon (e.g. light/dark/safari)
 * @returns PNG file name to output to.
 */
function getOutputPath(path: string, size: number, type: string) {
	const name = path.split('.')[0];
	return resolve(output, `${name}_${size}_${type}.png`);
}

/**
 * Writes all the appropriate PNG files for a single monochrome svg.
 *
 * @param path - filename of svg.
 */
async function writeMonochromeIcon(
	path: keyof typeof monochromeColors
): Promise<void> {
	if (releaseTarget === 'safari') {
		for (const res of actionIconResolutions) {
			await fs.writeFile(
				getOutputPath(path, res, 'safari'),
				await createMonochromeIcon(path, res, safariIconColor)
			);
		}
		return;
	}

	for (const res of actionIconResolutions) {
		await fs.writeFile(
			getOutputPath(path, res, 'light'),
			await createMonochromeIcon(path, res, monochromeColors[path].light)
		);
		await fs.writeFile(
			getOutputPath(path, res, 'dark'),
			await createMonochromeIcon(path, res, monochromeColors[path].dark)
		);
	}
}

/**
 * Writes all the appropriate PNGs for the main extension icon for the target browser.
 */
async function writeMainIcon(): Promise<void> {
	const path = `${releaseTarget}.svg`;
	for (const res of mainIconResolutions) {
		await fs.writeFile(
			resolve(output, `icon_main_${res}.png`),
			await createUnmodifiedIcon('main', path, res)
		);
	}
}

/**
 * Gets new PNG file name for misc icons
 *
 * @param path - filename of original svg.
 * @param size - desired resolution of PNG.
 * @returns PNG file name to output to.
 */
function getMiscOutputPath(path: string, size: number) {
	const name = path.split('.')[0];
	return resolve(output, `${name}_${size}.png`);
}

/**
 * Writes all the appropriate PNG files for a single misc svg.
 *
 * @param path - filename of the svg.
 */
async function writeMiscIcon(path: keyof typeof miscSizes) {
	for (const res of miscSizes[path]) {
		await fs.writeFile(
			getMiscOutputPath(path, res),
			await createUnmodifiedIcon('misc', path, res)
		);
	}
}

/**
 * Handles calling all the functions of the script correctly.
 */
async function main() {
	await fs.mkdir(output, { recursive: true });

	//write monochrome icons
	for (const path of await fs.readdir(resolve(input, 'monochrome'))) {
		// avoid extra files (looking at you, .DS_Store)
		if (!path.endsWith('.svg')) {
			continue;
		}

		if (!assertMonochromePathValid(path)) {
			colorLog(`File ${path} is not a valid monochrome icon.`);
			throw new Error(`File ${path} is not a valid monochrome icon.`);
		}
		await writeMonochromeIcon(path);
	}

	await writeMainIcon();

	//write misc icons
	for (const path of await fs.readdir(resolve(input, 'misc'))) {
		// avoid extra files (looking at you, .DS_Store)
		if (!path.endsWith('.svg')) {
			continue;
		}

		if (!assertMiscPathValid(path)) {
			colorLog(`File ${path} is not a valid misc icon.`);
			throw new Error(`File ${path} is not a valid misc icon.`);
		}
		await writeMiscIcon(path);
	}
}

/**
 * Checks if a monochrome path has a defined color.
 *
 * @param path - filename of svg to check
 * @returns true if the file is associated with a target color, false otherwise.
 */
function assertMonochromePathValid(
	path: string
): path is keyof typeof monochromeColors {
	return path in monochromeColors;
}

/**
 * Checks if a misc path has target sizes defined.
 *
 * @param path - filename of svg to check
 * @returns true if file is associated with an array of target sizes, false otherwise.
 */
function assertMiscPathValid(path: string): path is keyof typeof miscSizes {
	return path in miscSizes;
}
