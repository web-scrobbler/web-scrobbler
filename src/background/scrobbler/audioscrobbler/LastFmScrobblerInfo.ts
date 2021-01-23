import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import type { ScrobblerInfo } from '@/background/scrobbler/ScrobblerInfo';

export const lastFmScrobblerInfo: ScrobblerInfo = {
	id: ScrobblerId.LastFm,
	label: 'Last.fm',
	baseProfileUrl: 'https://last.fm/user/',
};
