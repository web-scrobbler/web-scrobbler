/**
 * Export a given data to a JSON file.
 *
 * @param data Data to export
 * @param fileName File name
 */
export function exportData(data: unknown, fileName: string): void {
	const dataStr = JSON.stringify(data, null, 2);
	const blob = new Blob([dataStr], { type: 'application/octet-stream' });
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = fileName;
	a.dispatchEvent(new MouseEvent('click'));
	a.remove();

	URL.revokeObjectURL(url);
}

/**
 * Import data from a JSON file choosen by a user.
 *
 * @return The parsed data from a file
 */
export async function importData(): Promise<unknown> {
	const fileInput = document.createElement('input');
	document.body.append(fileInput);

	fileInput.accept = '.json';
	fileInput.style.display = 'none';
	fileInput.type = 'file';

	return new Promise((resolve) => {
		fileInput.addEventListener('change', readFile);
		fileInput.click();

		function readFile() {
			const file = fileInput.files[0];

			const reader = new FileReader();
			reader.onloadend = (event) => {
				const dataStr = event.target.result.toString();
				const contents = JSON.parse(dataStr) as unknown;

				resolve(contents);
				fileInput.remove();
			};
			reader.readAsText(file, 'utf-8');
		}
	});
}
