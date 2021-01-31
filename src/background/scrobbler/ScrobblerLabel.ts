import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

const scrobblerLabels: Record<ScrobblerId, string> = {
	[ScrobblerId.LastFm]: 'Last.fm',
	[ScrobblerId.LibreFm]: 'Libre.fm',
	[ScrobblerId.ListenBrainz]: 'ListenBrainz',
	[ScrobblerId.Maloja]: 'Maloja',
};

export function getScrobblerLabel(scrobblerId: ScrobblerId): string {
	return scrobblerLabels[scrobblerId];
}
