# Privacy policy

This privacy policy explains what data we collect and store; how we use and disclose this data.

**Important note**: This document is applicable to Web Scrobbler v2.40.0 and newer.

## What data is collected?

The extension does not collect any of your personal data.

## What data is stored by the extension?

Data is stored within your browser. The extension stores:

 - Your credentials of scrobble services
 - Your personal Web Scrobbler settings
 - Your edited tracks
 - Your scrobbles (deleted after 30 days)
 - Your custom URL patterns for connectors
 - System information of the extension

Your credentials are used to communicate with scrobble services only. Where possible credentials are sessions, not passwords.

All data is used by the extension internally; we don't send this data to 3rd-party services.

Settings only are stored with synchronization capability, which means that they can be synchronized across browser instances you are signed into.

## Why is the extension asking for access to all websites?

### Why not ask for a subset of URLs supported by the extension?

The extension supports several self-hosted services (e.g. Funkwhale), which are supposed to have user-defined URLs. The extension could not access these URLs, that's why it is not narrowed down.

Additionally it prevents users being prompted with each update to give access to the newly added connectors' URLs.

### What happens when I don't grant it access to all websites?

The permission can be denied, in which case it will only scrobble in a tab when the extension gets activated by clicking on its icon while on the tab. The grant is per tab and doesn't persist across refreshes, but this might be your desired behaviour.

## FAQ

<details><summary><h3 style="display:inline-block;margin-top:0">
Firefox asks for data collection permissions
</h3></summary>

> The developer says the extension will collect: browsing activity, website content

Since version v3.21 users are being shown the above notice when installing or updating the extension, this section explains what that means and why**¹** it now appears.

**Browsing activity**

> Information about the websites users visit, such as specific URLs, domains, or categories of pages users view.**¹**

The extension reads the URL to determine which site-specific code to load to record music information.

**Website content**

> Covers anything visible on a website — such as text, images, videos, and links — and anything embedded, such as cookies, audio, page headers, and request and response information.**¹**

The extension reads text, images and links (DOM contents) in order to determine what song is playing.

**Changes in Mozilla's Policies**

> From November 3, 2025, all new extensions must adopt the Firefox built-in data collection consent system. Extensions must state if and what data they collect or transmit. New versions and updates for add-ons created before November 3 don’t need to use this feature, but will have to at a later date.**¹**

**¹**Quotes from Mozilla: <https://extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/>

</details>
