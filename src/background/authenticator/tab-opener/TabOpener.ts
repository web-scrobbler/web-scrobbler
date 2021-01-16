/**
 * Function that opens a given URL in a new tab.
 *
 * @param url URL to open
 *
 * @return Promise that resolved when the tab is closed.
 */
export type TabOpener = (url: string) => Promise<void>;
