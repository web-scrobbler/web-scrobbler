import type { ScrobbleableDto } from '@/background/scrobbler/Scrobbleable';
import type { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

export interface ScrobbleCacheEntry {
	readonly scrobblerIds: ReadonlyArray<ScrobblerId>;
	readonly scrobbleable: ScrobbleableDto;
}
