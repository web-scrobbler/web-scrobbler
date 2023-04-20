import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';
import colorLog from 'scripts/log';

const translationFiles = await glob('src/_locales/**/messages.json');

for (const index in translationFiles) {
	const filePath = translationFiles[index];

	const json = JSON.parse(await readFile(filePath));

	let modified = false;
	Object.keys(json).forEach((key) => {
		if (json[key]['message'] === '') {
			delete json[key];
			modified = true;
		}
	});

	if (modified) {
		colorLog(`Updating ${filePath}`, 'info');
		await writeFile(filePath, JSON.stringify(json, null, 4) + '\n');
	}
}
