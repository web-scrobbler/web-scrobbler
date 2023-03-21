import type BaseConnector from '@/core/content/connector';

declare global {
	var Connector: BaseConnector;
	var Util: typeof import('@/core/content/util');
	var MetadataFilter: typeof import('metadata-filter');
	var webScrobblerScripts: { [scriptFile: string]: boolean };
	var STARTER_LOADED: boolean | undefined;
}
