export interface DataUsage {
	getTotalSpaceSize(): number;
	getUsedSpaceSize(): Promise<number>;
}
