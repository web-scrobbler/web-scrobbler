import archiver from 'archiver';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import colorLog from './log';
import { releaseTarget } from './util';

function createSafariDistributable() {
	colorLog('TODO: Make safari distributable work', 'error');
}

async function createSrcArchive() {
	colorLog('Creating src archive', 'info');
	const curDir = path.resolve(path.dirname(''));
	const outputFile = `${curDir}/web-scrobbler-src.zip`;

	try {
		execSync(`git archive --format=zip --output="${outputFile}" HEAD`, {
			cwd: curDir,
			stdio: 'inherit',
		});
		colorLog('Created src archive', 'success');
	} catch (error) {
		colorLog('Failed to create src archive', 'error');
		throw error;
	}
}

export default async function createDistributable() {
	if (releaseTarget === 'safari') {
		createSafariDistributable();
		return;
	}

	colorLog(`Creating distributable for ${releaseTarget}`, 'info');
	const curDir = path.resolve(path.dirname(''));
	const outputFile = `${curDir}/web-scrobbler-${releaseTarget}.zip`;
	const output = fs.createWriteStream(outputFile);

	const archive = archiver('zip', {
		zlib: {
			level: 5,
		},
	});

	archive.pipe(output);

	archive.directory(`build/${releaseTarget}`, false);
	await archive.finalize();
	colorLog(`Created distributable for ${releaseTarget}`, 'success');

	if (releaseTarget === 'firefox') {
		await createSrcArchive();
	}
}
