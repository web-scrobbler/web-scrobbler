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

	// TODO: make a glob that gets the top level files and doesnt nuke the system
	archive
		.directory('src', 'src')
		.directory('scripts', 'scripts')
		.directory('tests', 'tests')
		.file('.eslintrc.yml', { name: '.eslintrc.yml' })
		.file('.eslintignore', { name: '.eslintignore' })
		.file('build.ts', { name: 'build.ts' })
		.file('manifest.config.ts', { name: 'manifest.config.ts' })
		.file('vite.configs.ts', { name: 'vite.configs.ts' })
		.file('vitest.config.ts', { name: 'vitest.config.ts' })
		.file('package.json', { name: 'package.json' })
		.file('package-lock.json', { name: 'package-lock.json' })
		.file('tsconfig.json', { name: 'tsconfig.json' })
		.file('tsconfig.connectors.json', { name: 'tsconfig.connectors.json' })
		.file('safari.sh', { name: 'safari.sh' })
		.file('.prettierignore', { name: '.prettierignore' })
		.file('LICENSE.md', { name: 'LICENSE.md' })
		.file('README.md', { name: 'README.md' });

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
