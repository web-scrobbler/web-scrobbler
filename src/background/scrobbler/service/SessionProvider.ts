import { SessionData } from '@/background/scrobbler/service/TokenBasedSessionProvider';

export interface SessionProvider {
	getAuthUrl(): string;
	requestSession(): Promise<SessionData>;
}
