import {
	FetchResponse,
	FetchWrapper,
	requestTimeout,
} from '@/background/util/fetch/Fetch';
import { timeoutPromise } from '@/background/util/util';

export const fetchJson: FetchWrapper<unknown> = async (
	input: RequestInfo,
	init?: RequestInit
): Promise<FetchResponse<unknown>> => {
	const response = await timeoutPromise(requestTimeout, fetch(input, init));
	const { ok, status } = response;

	const data = (await response.json()) as unknown;

	return { ok, data, status };
};
