/**
 * A wrapper around `fetch` function.
 *
 * @param input Input
 * @param init Options
 *
 * @return Promise resolved with the request data
 */
export type FetchWrapper<T> = (
	input: RequestInfo,
	init?: RequestInit
) => Promise<FetchResponse<T>>;

export interface FetchResponse<T = unknown> {
	ok: boolean;
	status: number;
	data: T;
}

export const requestTimeout = 15000;
