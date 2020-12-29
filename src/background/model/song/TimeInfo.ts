import { ConnectorState } from '@/background/model/ConnectorState';

export interface TimeInfo {
	currentTime: number;
	duration: number;
}

export function createTimeInfo(state: ConnectorState): TimeInfo {
	const { currentTime, duration } = state;

	return { currentTime, duration };
}
