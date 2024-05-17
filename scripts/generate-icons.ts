import fs from 'fs/promises';
import { createCanvas, loadImage } from 'canvas';
import { resolve } from 'path';
import { getBrowser, releaseTarget, releaseTargets } from './util';
import colorLog from './log';
import type { PluginOption } from 'vite';

/**
 * Get the name of the main icon based on the release target.
 * @returns The name of the main icon.
 */
function mainIconName(): string {
	if (releaseTarget === releaseTargets.safari) {
		return 'safari';
	}
	return 'universal';
}

/**
 * Input folder containing the original svg icons in the source.
 */
const input = resolve('src', 'icons');

/**
 * Output folder where the rendered images should be output during the building.
 */
const output = resolve('build', getBrowser(), 'icons');

/**
 * xcode shared app folder
 */
const xcodeApp = resolve('.xcode', 'Web Scrobbler', 'Shared (App)');

/**
 * xcode assets folder
 */
const xcodeAssets = resolve(xcodeApp, 'Assets.xcassets');

/**
 * Resolutions to render xcode icons to
 */
const xcodeIconResolutions = [16, 32, 128, 256, 512];

/**
 * Resolutions to render main icon to.
 */
const mainIconResolutions = [16, 48, 96, 128, 256, 512];

/**
 * Resolutions to render action icons to
 */
const actionIconResolutions = [16, 19, 32, 38];

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
	'action_paused.svg': {
		light: '#7f7f7f',
		dark: '#9f9f9f',
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
	'action_disallowed.svg': {
		light: '#d51107',
		dark: '#fc3434',
	},
	'action_loved.svg': {
		light: '#d51107',
		dark: '#fc3434',
	},
	'action_unloved.svg': {
		light: '#d51107',
		dark: '#fc3434',
	},
};

/**
 * A map of theme names and border color to use
 */
const borderColor = {
	light: '#f7f7f7',
	dark: '#3b3b3b',
};

/**
 * enum of icon themes
 */
enum themes {
	light = 'light',
	dark = 'dark',
}

/**
 * Thickness of icon borders
 */
const borderThickness = 0.5;

/**
 * Offset adjacency matrix
 */
const adjacencies = [
	[borderThickness, 0],
	[borderThickness, borderThickness],
	[0, borderThickness],
	[-borderThickness, borderThickness],
	[-borderThickness, 0],
	[-borderThickness, -borderThickness],
	[0, -borderThickness],
	[borderThickness, -borderThickness],
];

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
	size: number,
	margin?: number,
): Promise<Buffer> {
	const canvas = createCanvas(size, size);
	const ctx = canvas.getContext('2d');
	const image = await loadImage(resolve(input, folder, path));

	const iconMargin = margin ?? 0;
	const iconSize = size - iconMargin * 2;
	image.width = iconSize;
	image.height = iconSize;
	ctx.drawImage(image, iconMargin, iconMargin, iconSize, iconSize);
	return canvas.toBuffer();
}

/**
 * Creates a png from a svg without making any edits to it.
 *
 * @param folder - folder containing the icon svg in src.
 * @param path - name of the svg file.
 * @param size - desired resolution of the png file.
 * @returns a PNG buffer from the svg file
 */
async function createUnmodifiedIconNoAlpha(
	folder: string,
	path: string,
	size: number,
	margin?: number,
): Promise<Buffer> {
	const canvas = createCanvas(size, size);
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = '#fd3148';
	ctx.fillRect(0, 0, size, size);
	const image = await loadImage(resolve(input, folder, path));

	const iconMargin = margin ?? 0;
	const iconSize = size - iconMargin * 2;
	image.width = iconSize;
	image.height = iconSize;
	ctx.drawImage(image, iconMargin, iconMargin, iconSize, iconSize);
	return canvas.toBuffer();
}

/**
 * Creates a png from a svg editing to adjust for apple's icon style
 *
 * @param folder - folder containing the icon svg in src.
 * @param path - name of the svg file.
 * @param size - desired resolution of the png file.
 * @returns a PNG buffer from the svg file
 */
async function createMacIcon(
	folder: string,
	path: string,
	size: number,
): Promise<Buffer> {
	const sizeModifier = 100 / 114;
	const canvas = createCanvas(size, size);
	const ctx = canvas.getContext('2d');
	const image = await loadImage(resolve(input, folder, path));
	const iconSize = size * sizeModifier;
	const iconOffset = (size - iconSize) / 2;
	image.width = iconSize;
	image.height = iconSize;

	/**
	 * Apply shadow
	 */
	ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
	ctx.shadowBlur = (5 * 128) / size;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = (2 * 128) / size;

	ctx.drawImage(image, iconOffset, iconOffset, iconSize, iconSize);
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
async function createMonochromeIcon(
	path: string,
	size: number,
	color: string,
	borderColor?: string,
): Promise<Buffer> {
	// If there is a border, make room for the border
	const iconSize = borderColor ? size - borderThickness * 2 : size;

	// draw the icon itself to one canvas first
	const iconCanvas = createCanvas(size, size);
	const iconCtx = iconCanvas.getContext('2d');
	const image = await loadImage(resolve(input, 'monochrome', path));
	image.width = iconSize;
	image.height = iconSize;
	iconCtx.drawImage(
		image,
		borderThickness,
		borderThickness,
		iconSize,
		iconSize,
	);
	// fill it in with the main icon color
	iconCtx.globalCompositeOperation = 'source-in';
	iconCtx.fillStyle = color;
	iconCtx.fillRect(0, 0, size, size);

	// In safari we don't need borders ever. Skip the next part and return immediately
	if (!borderColor) {
		return iconCanvas.toBuffer();
	}

	// now draw offset icons to create a border
	const canvas = createCanvas(size, size);
	const ctx = canvas.getContext('2d');
	for (const adjacency of adjacencies) {
		ctx.drawImage(
			image,
			adjacency[0] + borderThickness,
			adjacency[1] + borderThickness,
			iconSize,
			iconSize,
		);
	}
	// fill in
	ctx.globalCompositeOperation = 'source-in';
	ctx.fillStyle = borderColor;
	ctx.fillRect(0, 0, size, size);

	// draw the main icon inside the border
	ctx.globalCompositeOperation = 'source-over';
	ctx.drawImage(iconCanvas, 0, 0, size, size);

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
	path: keyof typeof monochromeColors,
): Promise<void> {
	if (releaseTarget === releaseTargets.safari) {
		for (const res of actionIconResolutions) {
			await fs.writeFile(
				getOutputPath(path, res, releaseTargets.safari),
				await createMonochromeIcon(path, res, safariIconColor),
			);
		}
		return;
	}

	for (const res of actionIconResolutions) {
		await fs.writeFile(
			getOutputPath(path, res, themes.light),
			await createMonochromeIcon(
				path,
				res,
				monochromeColors[path].light,
				borderColor.light,
			),
		);
		await fs.writeFile(
			getOutputPath(path, res, themes.dark),
			await createMonochromeIcon(
				path,
				res,
				monochromeColors[path].dark,
				borderColor.dark,
			),
		);
	}
}

/**
 * Writes all the appropriate PNGs for the main extension icon for the target browser.
 */
async function writeMainIcon(): Promise<void> {
	const path = `${mainIconName()}.svg`;
	const marginFactor = releaseTarget !== releaseTargets.safari ? 10 / 128 : 0;
	for (const res of mainIconResolutions) {
		const margin = res >= 128 ? res * marginFactor : 0;
		await fs.writeFile(
			resolve(output, `icon_main_${res}.png`),
			await createUnmodifiedIcon('main', path, res, margin),
		);
	}
}

async function writexcodeIcons(): Promise<void> {
	const mainPath = `${mainIconName()}.svg`;
	/**
	 * Write main icon
	 */
	await fs.writeFile(
		resolve(xcodeApp, 'Resources', 'Icon.png'),
		await createUnmodifiedIcon('main', mainPath, 512),
	);

	/**
	 * Write LargeIcon.imageset
	 */
	await fs.writeFile(
		resolve(xcodeAssets, 'LargeIcon.imageset', 'icon_main_256.png'),
		await createUnmodifiedIcon('main', mainPath, 256),
	);

	/**
	 * Write AppIcon.appiconset
	 */
	await fs.writeFile(
		resolve(
			xcodeAssets,
			'AppIcon.appiconset',
			'universal-icon-1024@1x.png',
		),
		await createUnmodifiedIconNoAlpha('main', mainPath, 1024),
	);

	for (const res of xcodeIconResolutions) {
		await fs.writeFile(
			resolve(
				xcodeAssets,
				'AppIcon.appiconset',
				`mac-icon-${res}@1x.png`,
			),
			await createMacIcon('main', 'safarishadow.svg', res),
		);

		await fs.writeFile(
			resolve(
				xcodeAssets,
				'AppIcon.appiconset',
				`mac-icon-${res}@2x.png`,
			),
			await createMacIcon('main', 'safarishadow.svg', res * 2),
		);
	}
}

/**
 * Handles calling all the functions of the script correctly.
 */
async function main(): Promise<void> {
	await fs.mkdir(output, { recursive: true });

	// write monochrome icons
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

	if (releaseTarget === releaseTargets.safari) {
		await writexcodeIcons();
	}
}

/**
 * Checks if a monochrome path has a defined color.
 *
 * @param path - filename of svg to check
 * @returns true if the file is associated with a target color, false otherwise.
 */
function assertMonochromePathValid(
	path: string,
): path is keyof typeof monochromeColors {
	return path in monochromeColors;
}
