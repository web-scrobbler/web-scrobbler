import type { ConnectorMeta } from '@/core/connectors';

export interface ControllerUIConnector {
	meta: ConnectorMeta;
	scrobbleInfoLocationSelector: string | null;
	scrobbleInfoStyle: Partial<CSSStyleDeclaration> &
		Partial<
			Record<'box-orient' | '-webkit-line-clamp' | 'text-wrap', string>
		>;
}
