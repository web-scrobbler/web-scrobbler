import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

export enum ScrobblerResultType {
	OK,
	IGNORED,
	ERROR_AUTH,
	ERROR_OTHER,
}

export class ScrobblerResult {
	private type: ScrobblerResultType;
	private scrobblerId: ScrobblerId;
	private contextInfo: unknown;

	/**
	 * @constructor
	 * @param resultType Result type
	 * @param scrobblerId Scrobbler ID
	 */
	constructor(resultType: ScrobblerResultType, scrobblerId: ScrobblerId) {
		this.type = resultType;
		this.scrobblerId = scrobblerId;

		this.contextInfo = null;
	}

	/**
	 * Get an ID of a scrobbler that created the result.
	 *
	 * @return Scrobbler ID
	 */
	getScrobblerId(): ScrobblerId {
		return this.scrobblerId;
	}

	/**
	 * Get an additional information related to the result.
	 *
	 * @return Context info
	 */
	getContextInfo(): unknown {
		return this.contextInfo;
	}

	/**
	 * Check if a given result type equals the type of this result object.
	 *
	 * @param resultType Type to check
	 *
	 * @return Check result
	 */
	is(resultType: ScrobblerResultType): boolean {
		return this.type === resultType;
	}

	/**
	 * Check if a given result type is an error result.
	 *
	 * @return Check result
	 */
	isError(): boolean {
		return (
			this.type === ScrobblerResultType.ERROR_AUTH ||
			this.type === ScrobblerResultType.ERROR_OTHER
		);
	}

	/**
	 * Set an additional information related to the result.
	 *
	 * @param contextInfo Context info
	 */
	setContextInfo(contextInfo: unknown): void {
		this.contextInfo = contextInfo;
	}
}
