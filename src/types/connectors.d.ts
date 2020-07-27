import { ConnectorEntry } from '@/common/connector-entry';

declare module 'connectors.json' {
	const value: ConnectorEntry[];
	export default value;
}
