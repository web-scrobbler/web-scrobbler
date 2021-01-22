import { Session } from '@/background/account//Session';
import { UserProperties } from '@/background/account/UserProperties';

export interface Account {
	session: Session;
	userProperties: UserProperties;
}
