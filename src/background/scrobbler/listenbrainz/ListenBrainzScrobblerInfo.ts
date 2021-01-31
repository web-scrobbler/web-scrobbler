import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import type { ScrobblerInfo } from '@/background/scrobbler/ScrobblerInfo';

export const listenbrainzScrobblerInfo: ScrobblerInfo = {
	id: ScrobblerId.ListenBrainz,
	baseProfileUrl: 'https://listenbrainz.org/user',
};
