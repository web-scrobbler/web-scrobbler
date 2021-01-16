import {
	FetchResponse,
	FetchWrapper,
	requestTimeout,
} from '@/background/util/fetch/Fetch';
import { timeoutPromise } from '@/background/util/util';

export const fetchDocument: FetchWrapper<Document> = async (
	input: RequestInfo,
	init?: RequestInit
): Promise<FetchResponse<Document>> => {
	const response = await timeoutPromise(requestTimeout, fetch(input, init));
	const { ok, status } = response;

	const rawHtml = await response.text();
	const data = new DOMParser().parseFromString(rawHtml, 'text/html');

	return { ok, data, status };
};
