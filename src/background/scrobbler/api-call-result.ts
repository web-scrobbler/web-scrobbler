export type ApiCallResultType = 'ok' | 'ignored' | 'error-auth' | 'error-other';

export class ApiCallResult {
	private type: ApiCallResultType;
	private scrobblerId: string;
	private contextInfo: unknown;

	/**
	 * Successfull result.
	 */
	static readonly RESULT_OK = 'ok';

	/**
	 * Song is ignored by scrobbling service.
	 */
	static readonly RESULT_IGNORE = 'ignored';

	/**
	 * Authorization error.
	 */
	static readonly ERROR_AUTH = 'error-auth';

	/**
	 * Another error.
	 */
	static readonly ERROR_OTHER = 'error-other';

	/**
	 * @constructor
	 * @param resultType Result type
	 * @param scrobblerId Scrobbler ID
	 */
	constructor(resultType: ApiCallResultType, scrobblerId: string) {
		this.type = resultType;
		this.scrobblerId = scrobblerId;

		this.contextInfo = null;
	}

	/**
	 * Get an ID of a scrobbler that created the result.
	 *
	 * @return Scrobbler ID
	 */
	getScrobblerId(): string {
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
	is(resultType: string): boolean {
		return this.type === resultType;
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
