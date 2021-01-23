import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import type { ScrobblerInfo } from '@/background/scrobbler/ScrobblerInfo';

export const libreFmScrobblerInfo: ScrobblerInfo = {
	id: ScrobblerId.LibreFm,
	label: 'Libre.fm',
	baseProfileUrl: 'https://libre.fm/user',
};
