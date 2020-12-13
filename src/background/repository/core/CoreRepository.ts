export interface CoreRepository {
	getExtensionVersion(): Promise<string>;
	setExtensionVersion(version: string): Promise<void>;
}
