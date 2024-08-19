import { vi } from 'vitest';

const createFetchResponse = (data: unknown) => ({
	json: () => Promise.resolve(data),
	ok: Boolean(data),
});

const responses = {
	'https://musicbrainz.org/ws/2/release?fmt=json&query=title:+"Re:start"^3 Re:start artistname:+"フミンニッキ"^4フミンニッキ':
		{
			count: 14693,
			releases: [{ id: '3e3d2a0f-3fce-4cdb-b6a1-b8c070ce9580' }],
		},

	'https://coverartarchive.org/release/3e3d2a0f-3fce-4cdb-b6a1-b8c070ce9580/front-500':
		true,
	'https://coverartarchive.org/release/674ccc28-5a18-4154-b0f7-e984420b0fc6/front-500':
		false,
	'https://musicbrainz.org/ws/2/release-group?fmt=json&query=title:+"Re:start"^3 Re:start artistname:+"フミンニッキ2"^4フミンニッキ2':
		{
			count: 10000,
			releases: [{ id: '32e00a5f-7542-4be0-ad65-a18f8b3df58d' }],
		},
	'https://coverartarchive.org/release/32e00a5f-7542-4be0-ad65-a18f8b3df58d/front-500':
		false,
	'https://musicbrainz.org/ws/2/release?fmt=json&query=title:+"8a27256b6e2dfb99569bc035c7c0de159d36d6bb4e6a4b866f4bd90c95aebf0f"^3 8a27256b6e2dfb99569bc035c7c0de159d36d6bb4e6a4b866f4bd90c95aebf0f artistname:+"d21308b23b135a46b72024f1233f4942d8e294e11c1f4ba05f718bb80b50a44f1"^4d21308b23b135a46b72024f1233f4942d8e294e11c1f4ba05f718bb80b50a44f1':
		{
			count: 4127,
			releases: [{ id: '84e4f664-5113-453e-a333-a4fba8022db8' }],
		},
	'https://coverartarchive.org/release/84e4f664-5113-453e-a333-a4fba8022db8/front-500':
		true,
	'https://musicbrainz.org/ws/2/release?fmt=json&query=title:+"Re:start"^3 Re:start artistname:+"Fuminnikki"^4Fuminnikki':
		{
			count: 14690,
			releases: [{ id: '674ccc28-5a18-4154-b0f7-e984420b0fc6' }],
		},
};

class FetchMocker {
	constructor() {
		(global.fetch as unknown) = vi.fn((input: string) => {
			if (!(input in responses)) {
				throw new Error(`${input} not mocked`);
			}
			return Promise.resolve(
				createFetchResponse(responses[input as keyof typeof responses]),
			);
		});
	}
}

export default new FetchMocker();
