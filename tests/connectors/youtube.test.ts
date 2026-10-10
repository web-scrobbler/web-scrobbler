import { afterEach, describe, expect, it, vi } from 'vitest';

function setupConnector(getOption: ReturnType<typeof vi.fn>) {
	const video = { currentTime: 1, addEventListener: vi.fn() };
	const connector = {
		onStateChanged: vi.fn(),
		scrobblingDisallowedReason: () => null as string | null,
		scrobbleInfoStyle: {},
		applyFilter: vi.fn(),
	};
	const util = {
		getOption,
		debugLog: vi.fn(),
	};
	const metadataFilter = {
		createYouTubeFilter: () => ({ append: vi.fn(() => ({})) }),
		filterWithFilterRules: vi.fn(),
	};

	vi.stubGlobal('Connector', connector);
	vi.stubGlobal('Util', util);
	vi.stubGlobal('MetadataFilter', metadataFilter);
	vi.stubGlobal('document', {
		querySelector: vi.fn((selector: string) =>
			selector === '.html5-main-video' ? video : null,
		),
	});

	return { connector, util, video };
}

async function loadConnector() {
	await import('@/connectors/youtube');
}

describe('YouTube connector initialization', () => {
	afterEach(() => {
		vi.resetModules();
		vi.unstubAllGlobals();
	});

	it('waits for options before allowing scrobbles and reevaluates once', async () => {
		let resolveFirstOption!: (value: boolean) => void;
		const firstOption = new Promise<boolean>((resolve) => {
			resolveFirstOption = resolve;
		});
		const getOption = vi
			.fn()
			.mockReturnValueOnce(firstOption)
			.mockResolvedValue(false);
		const { connector, video } = setupConnector(getOption);

		await loadConnector();
		await loadConnector();
		expect(video.addEventListener).toHaveBeenCalledTimes(1);
		expect(connector.onStateChanged).not.toHaveBeenCalled();
		expect(connector.scrobblingDisallowedReason()).toBe('IsLoading');

		resolveFirstOption(false);
		await vi.waitFor(() => {
			expect(connector.onStateChanged).toHaveBeenCalledTimes(1);
		});

		expect(connector.scrobblingDisallowedReason()).toBeNull();
		expect(getOption).toHaveBeenCalledTimes(4);
		expect(video.addEventListener).toHaveBeenCalledWith(
			'timeupdate',
			connector.onStateChanged,
		);
	});

	it('logs option read failures and resumes with default options', async () => {
		const error = new Error('storage unavailable');
		const getOption = vi.fn().mockRejectedValue(error);
		const { connector, util, video } = setupConnector(getOption);

		await loadConnector();
		await vi.waitFor(() => {
			expect(connector.onStateChanged).toHaveBeenCalledTimes(1);
		});

		expect(util.debugLog).toHaveBeenCalledWith(
			`Failed to read YouTube connector options: ${error}`,
			'warn',
		);
		expect(getOption).toHaveBeenCalledTimes(1);
		expect(connector.scrobblingDisallowedReason()).toBeNull();
		expect(video.addEventListener).toHaveBeenCalledTimes(1);
		expect(video.addEventListener).toHaveBeenCalledWith(
			'timeupdate',
			connector.onStateChanged,
		);
	});
});
