/*
 * Some connectors don't implement `Connector.getUniqueId` function, so we
 * need to generate the ID key manually by using raw song info as a seed value.
 *
 * Since unique IDs are created with song info, there could be a case,
 * when this info is changed (e.g. a new getter was added to a connector),
 * and we can't calculate the same ID again, since the song info is not
 * the same. Therefore, we should provide all possible unique IDs.
 *
 * This is done via ES6 generators.
 */

const minSeedValues = 2;

/**
 * Return a generator generates all possible unique IDs using the given seed
 * values.
 *
 * @param seed Array of seed values used to generate ID
 * @param hashFn Hash function used to generate ID
 *
 * @yields Unique ID
 */
export function* generateId(seed: string[], hashFn: HashFunction): IdGenerator {
	if (seed.length < minSeedValues) {
		throw new Error('seed should contain at least two elements');
	}

	let endSeedLength = seed.length;
	while (endSeedLength > 1) {
		let inputStr = '';

		for (let j = 0; j < endSeedLength; ++j) {
			const seedValue = seed[j];
			if (seedValue) {
				inputStr += seedValue;
			}
		}

		if (!inputStr) {
			throw new Error(
				'Unable to create a unique ID for empty seed values'
			);
		}

		endSeedLength--;

		yield hashFn(inputStr);
	}
}

export interface HashFunction {
	(input: string): string;
}

export type IdGenerator = Generator<string, void, unknown>;
