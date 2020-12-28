import { MetadataFilter } from 'metadata-filter';

export interface StateProcessor {
	processState(): void;
	applyFilter(filter: MetadataFilter): void;
}
