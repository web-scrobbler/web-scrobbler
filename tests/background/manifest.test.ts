import { createHash } from 'node:crypto';
import { expect, it } from 'vitest';
import { chromeManifest } from '../../manifest.config';

it('keeps the published Chromium extension ID so upgrades retain existing storage', () => {
	expect(chromeManifest.key).toBeTypeOf('string');
	const digest = createHash('sha256')
		.update(Buffer.from(chromeManifest.key, 'base64'))
		.digest('hex');
	const extensionId = digest
		.slice(0, 32)
		.replace(/[0-9a-f]/g, (digit) =>
			String.fromCharCode(97 + Number.parseInt(digit, 16)),
		);
	expect(extensionId).toBe('hhinaapppaileiechjoiifaancjggfjm');
});
