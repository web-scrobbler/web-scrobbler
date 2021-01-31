import { FetchResponse, requestTimeout } from '@/background/util/fetch/Fetch';
import { timeoutPromise } from '@/background/util/util';

// TODO replace with function expression

export async function fetchJson<T>(
	input: RequestInfo,
	init?: RequestInit
): Promise<FetchResponse<T>> {
	const response = await timeoutPromise(requestTimeout, fetch(input, init));
	const { ok, status } = response;

	const data = (await response.json()) as T;

	return { ok, data, status };
}
