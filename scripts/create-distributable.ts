import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import colorLog from './log';

async function createSafariDistributable() {
	colorLog('TODO: Make safari distributable work', 'error');
}

async function createSrcArchive() {
	const curDir = path.resolve(path.dirname(''));
	const outputFile = `${curDir}/web-scrobbler-src.zip`;

	const output = fs.createWriteStream(outputFile);

	const archive = archiver('zip', {
		zlib: { level: 0 },
	});

	archive.pipe(output);

	archive
		.directory('src', 'src')
		.directory('scripts', 'scripts')
		.directory('tests', 'tests')
		.glob('*', {
			ignore: ['web-scrobbler-*.zip', '*/'],
		});

	archive.finalize();
}

export default async function createDistributable() {
	if (process.env.BROWSER === 'safari') {
		await createSafariDistributable();
		return;
	}

	const curDir = path.resolve(path.dirname(''));
	const outputFile = `${curDir}/web-scrobbler-${process.env.BROWSER}.zip`;
	const output = fs.createWriteStream(outputFile);

	const archive = archiver('zip', {
		zlib: { level: 0 },
	});

	archive.pipe(output);

	archive.directory(`build/${process.env.BROWSER}`, false);
	archive.finalize();

	if (process.env.BROWSER === 'firefox') {
		await createSrcArchive();
	}
}
