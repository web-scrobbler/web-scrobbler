export type MessageType = string;

export interface Message<T> {
	type: MessageType;
	data?: T;
}
