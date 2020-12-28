import { Connector } from '@/content/connector/Connector';
import { Starter } from '@/content/starter/Starter';

export class StarterImpl implements Starter {
	constructor(private connector: Connector) {}

	startConnector(): void {
		throw new Error('Method not implemented.');
	}
}
