import type { Session } from '@/background/account/Session';
import type { SessionData } from '@/background/scrobbler/service/TokenBasedSessionProvider';

export const dummySessionData: SessionData = {
	key: 'key',
	name: 'name',
};

export const dummySession: Session = {
	sessionId: dummySessionData.key,
	sessionName: dummySessionData.name,
};
