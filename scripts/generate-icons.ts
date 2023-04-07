import fs from 'fs/promises';
import { createCanvas, loadImage } from 'canvas';
import { resolve } from 'path';
import { getBrowser, releaseTarget } from './util';
import colorLog from './log';
import { PluginOption } from 'vite';

const input = resolve('', 'src', 'icons');
const output = resolve('', 'build', getBrowser(), 'icons');

const mainIconResolutions = [48, 96, 128, 256, 512];
const pageActionIconResolutions = [16, 19, 32, 38];

const miscSizes = {
	'icon_generic.svg': [16],
};

const monochromeColors = {
	'page_action_base.svg': {
		light: '#d51107',
		dark: '#fc3434',
	},
	'page_action_disabled.svg': {
		light: '#7f7f7f',
		dark: '#9f9f9f',
	},
	'page_action_error.svg': {
		light: '#fea800',
		dark: '#fea800',
	},
	'page_action_ignored.svg': {
		light: '#fea800',
		dark: '#fea800',
	},
	'page_action_loading.svg': {
		light: '#3b3b3b',
		dark: '#f7f7f7',
	},
	'page_action_playing.svg': {
		light: '#66a858',
		dark: '#66a858',
	},
	'page_action_scrobbled.svg': {
		light: '#66a858',
		dark: '#66a858',
	},
	'page_action_skipped.svg': {
		light: '#7f7f7f',
		dark: '#9f9f9f',
	},
	'page_action_unknown.svg': {
		light: '#7f7f7f',
		dark: '#9f9f9f',
	},
	'page_action_unsupported.svg': {
		light: '#adadad',
		dark: '#727272',
	},
};

const safariIconColor = '#707070';

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

async function createMainIcon(path: string, size: number) {
	const canvas = createCanvas(size, size);
	const ctx = canvas.getContext('2d');
	const image = await loadImage(resolve(input, 'main', path));
	ctx.drawImage(image, 0, 0, size, size);
	return canvas.toBuffer();
}

async function createMiscIcon(path: string, size: number) {
	const canvas = createCanvas(size, size);
	const ctx = canvas.getContext('2d');
	const image = await loadImage(resolve(input, 'misc', path));
	ctx.drawImage(image, 0, 0, size, size);
	return canvas.toBuffer();
}

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

function getOutputPath(path: string, size: number, type: string) {
	const name = path.split('.')[0];
	return resolve(output, `${name}_${size}_${type}.png`);
}

async function writeMonochromeIcon(path: keyof typeof monochromeColors) {
	if (releaseTarget === 'safari') {
		for (const res of pageActionIconResolutions) {
			await fs.writeFile(
				getOutputPath(path, res, 'safari'),
				await createMonochromeIcon(path, res, safariIconColor)
			);
		}
		return;
	}

	for (const res of pageActionIconResolutions) {
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

async function writeMainIcon() {
	const path = `${releaseTarget}.svg`;
	for (const res of mainIconResolutions) {
		await fs.writeFile(
			resolve(output, `icon_main_${res}.png`),
			await createMainIcon(path, res)
		);
	}
}

function getMiscOutputPath(path: string, size: number) {
	const name = path.split('.')[0];
	return resolve(output, `${name}_${size}.png`);
}

async function writeMiscIcon(path: keyof typeof miscSizes) {
	for (const res of miscSizes[path]) {
		await fs.writeFile(
			getMiscOutputPath(path, res),
			await createMiscIcon(path, res)
		);
	}
}

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

function assertMonochromePathValid(
	path: string
): path is keyof typeof monochromeColors {
	return path in monochromeColors;
}

function assertMiscPathValid(path: string): path is keyof typeof miscSizes {
	return path in miscSizes;
}
