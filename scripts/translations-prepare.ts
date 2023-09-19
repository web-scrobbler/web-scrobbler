import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';
import colorLog from 'scripts/log';

async function main() {
	const translationFiles = await glob('src/_locales/**/messages.json');

	for (const filePath of translationFiles) {
		const json = JSON.parse(
			(await readFile(filePath)).toString(),
		) as Record<
			string,
			{
				message: string;
				description: string;
			}
		>;

		let modified = false;
		Object.keys(json).forEach((key) => {
			if (json[key]['message'] === '') {
				delete json[key];
				modified = true;
			}
		});

		if (modified) {
			colorLog(`Updating ${filePath}`, 'info');
			await writeFile(filePath, `${JSON.stringify(json, null, 4)}\n`);
		}
	}
}

main();
