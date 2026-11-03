# YouTube background playback and local updates

## Background-tab scrobbling fix in 3.23.2

A YouTube video opened paused in a background tab could appear as **Scrobbling
now** on Last.fm after the tab was activated, but never become a saved scrobble.
The extension could also place that play in **Disallowed Scrobbles**.

YouTube's player can expose its `playing-mode` CSS class before the video
actually plays. The connector previously treated that class as playback, while
separately blocking a video whose playback position was still zero. The listening
timer could therefore expire during the block. Clearing the block sent another
Now Playing update without retrying the missed scrobble.

The fix changes the following behavior:

-   Playback starts counting once the video has advanced beyond zero and is
    neither paused nor ended. Paused time does not count toward the threshold.
-   Captured `timeupdate`, `play`, `pause`, and `ended` events update playback
    detection even when YouTube creates or replaces its video element.
-   If the listening threshold has already been reached, an eligible play can
    recover its missed scrobble when a block clears. Repeated playback updates
    do not submit that recovery more than once while it is in progress.
-   A successful recovery removes the old disallowed cache entry and keeps the
    scrobbled indicator when playback pauses or resumes.

Category, channel, tag, advertisement, and recognition restrictions still apply.
Clearing a block before the listening threshold does not cause an early scrobble.

## Updating a local build in Chrome or Opera

The Chromium build includes the published Chrome Web Store public key. Its
extension ID is:

```text
hhinaapppaileiechjoiifaancjggfjm
```

Keeping the same extension ID lets the browser use the original extension's
local and synced storage, including settings, saved edits, accounts, and the
scrobble cache. A build with a different ID receives separate storage and can
look like a fresh installation. This applies to the Chrome Web Store version;
other stores can use different IDs.

1. Keep the original extension installed. Uninstalling it can delete its stored
   data. If an earlier local build created a second copy with a different ID,
   disable that extra copy while checking the update.
2. Run `npm ci`, then `npm run dist chrome` from the source directory.
3. On the browser's Extensions page, use **Load unpacked** and select
   `build/chrome`, the folder containing the generated `manifest.json`.
4. Confirm that the loaded extension reports version **3.23.2** and the ID above.
   Check that the original settings and scrobble cache are visible.
5. Refresh any YouTube tabs that were open during the update so they use the
   updated content script.

**Load unpacked** does not require a private signing key. The manifest's `key`
field is a public identity key, not a private key. See Chrome's documentation on
[consistent extension IDs][ManifestKey] and [loading unpacked extensions][LoadUnpacked].

### Pack extension reports an existing private key

The message **A private key for specified extension already exists** means the
packager is trying to create a signing-key file where one already exists. Keep
the existing key file and use **Load unpacked** for this local build.

Packing a CRX requires a private signing key. A newly generated key does not
provide the signing identity of the published extension; the public key in the
manifest does not let a local build sign official store updates.

## Verification

Run the automated checks with:

```sh
npm run test -- --run
npm run checkts
npm run lint
npm run dist chrome
```

Regression tests cover background playback detection, paused listening time,
temporary blocks clearing before and after the threshold, recovery on resume,
existing restrictions, manual recovery, duplicate playback updates, and the
Chromium extension ID derived from the public key.

For a browser check, open a YouTube music video paused in a background tab and
leave it there longer than the normal scrobbling threshold. Activate the tab
and start playback. The extension should wait for the required listening time,
then show its scrobbled indicator; Last.fm should retain the play in listening
history after the Now Playing status ends. Also pause and resume a play to
confirm that paused time is excluded.

The user reported that the original scrobbling issue was resolved in Opera with
the 3.23.2 build. Automated tests use simulated browser and service responses;
they do not submit test plays to a live Last.fm account.

[ManifestKey]: https://developer.chrome.com/docs/extensions/reference/manifest/key
[LoadUnpacked]: https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked
