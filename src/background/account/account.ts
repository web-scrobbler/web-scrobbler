import { Session } from './session';
import { UserProperties } from './user-properties';

export interface Account {
	session: Session;
	userProperties: UserProperties;
}

// export function createAccount() {}
