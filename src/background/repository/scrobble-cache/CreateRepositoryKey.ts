export function createRepositoryKey(): string {
	const currentTimestamp = Date.now();
	return `id-${currentTimestamp}`;
}
