import { Session } from './Session';
import { UserProperties } from './UserProperties';

export interface Account {
	session: Session;
	userProperties: UserProperties;
}
