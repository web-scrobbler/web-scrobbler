export {};

setupConnector();

function setupConnector() {
  const body = document.querySelector("body");
  const isNewDesign =
    body?.classList.contains("ym-font-music") &&
    (body.classList.contains("ym-dark-theme") ||
      body.classList.contains("ym-light-theme"));

  if (isNewDesign) {
    setupNewConnector();
  } else {
    setupOldConnector();
  }
}

function setupOldConnector() {
  const observer = new MutationObserver(() => {
    const el = document.querySelector(".track.track_type_player");
    if (el) {
      // catched, initializing connector
      observer.disconnect();
      Connector.playerSelector = ".track.track_type_player";
    }
  });

  const btn = document.querySelector(".player-controls__btn_play");
  if (btn) {
    const observer = new MutationObserver(() => {
      Connector.onStateChanged();
    });
    observer.observe(btn, { attributes: true, attributeFilter: ["class"] });
  } else {
  }

  // watch on changes in DOM to Connector.onStateChanged()
  const trackObserver = new MutationObserver(() => {
    Connector.onStateChanged();
  });

  const trackNode = document.querySelector(".player-controls__track-container");
  if (trackNode) {
    trackObserver.observe(trackNode, { childList: true, subtree: true });
  }

  observer.observe(document.body, { childList: true, subtree: true });
  Connector.trackSelector = ".track__title";
  Connector.artistSelector = ".d-artists.d-artists__expanded";
  Connector.getTrackArt = () => {
    const container = document.querySelector(
      ".player-controls__track-container",
    );
    if (!container) {
      return null;
    }

    const images = container.querySelectorAll("img");

    for (const img of images) {
      const src = img.getAttribute("src");
      if (src && src.includes("50x50")) {
        const absoluteUrl = new URL(src, window.location.origin).toString();

        const highResUrl = absoluteUrl.replace("50x50", "800x800");
        return highResUrl;
      }
    }

    return null;
  };

  Connector.getAlbum = () => {
    const albumLink = document.querySelector(
      'a[title^="\u0418\u0437 \u0430\u043B\u044C\u0431\u043E\u043C\u0430"]',
    );
    if (!albumLink) return null;
    const match = albumLink.title.match(/^Из альбома «(.+)»$/);
    return match ? match[1] : null;
  };
  Connector.getCurrentTime = () => {
    const el = document.querySelector(".progress__bar.progress__text");
    return el ? parseFloat(el.getAttribute("data-played-time") || "0") : null;
  };
  Connector.getDuration = () => {
    const el = document.querySelector(".progress__bar.progress__text");
    return el ? parseFloat(el.getAttribute("data-duration") || "0") : null;
  };

  Connector.isPlaying = () => {
    const btn = document.querySelector(".player-controls__btn_play");
    if (!btn) {
      return false;
    }
    return btn.classList.contains("player-controls__btn_pause");
  };
}

// NEW CONNECTOR! NEW CONNECTOR! NEW CONNECTOR! NEW CONNECTOR!
// NEW CONNECTOR! NEW CONNECTOR! NEW CONNECTOR! NEW CONNECTOR!
// NEW CONNECTOR! NEW CONNECTOR! NEW CONNECTOR! NEW CONNECTOR!
// NEW CONNECTOR! NEW CONNECTOR! NEW CONNECTOR! NEW CONNECTOR!
// NEW CONNECTOR! NEW CONNECTOR! NEW CONNECTOR! NEW CONNECTOR!
// NEW CONNECTOR! NEW CONNECTOR! NEW CONNECTOR! NEW CONNECTOR!
function setupNewConnector() {
  Connector.playerSelector = 'section[class*="PlayerBarDesktop_root"]';

  Connector.getTrack = () => {
    const playerContainer = document.querySelector(
      'section[class*="PlayerBarDesktop_root"]',
    );
    if (!playerContainer) return null;

    const titleContainer = playerContainer.querySelector(
      'div[class*="Meta_titleContainer"]',
    );
    if (!titleContainer) return null;

    const link = titleContainer.querySelector("a");
    if (!link) return null;

    const titleSpan = link.querySelector('span[class*="Meta_title__"]');
    if (!titleSpan) return null;

    let trackName = titleSpan.textContent.trim();

    const versionSpan = link.nextElementSibling;
    if (versionSpan && versionSpan.className.includes("Meta_version__")) {
      const versionText = versionSpan.textContent
        .replace(/\u00a0/g, " ")
        .trim();
      if (versionText) {
        trackName += ` (${versionText})`;
      }
    }

    return trackName || null;
  };

  Connector.getArtist = () => {
    const playerContainer = document.querySelector(
      'section[class*="PlayerBarDesktop_root"]',
    );
    if (!playerContainer) return null;

    const artistContainer = playerContainer.querySelector(
      'div[class*="SeparatedArtists_root"]',
    );
    if (!artistContainer) return null;

    const links = artistContainer.querySelectorAll("a");
    const artists = [];

    links.forEach((a) => {
      const span = a.querySelector('span[class*="Meta_artistCaption"]');
      if (span && span.textContent.trim()) {
        artists.push(span.textContent.trim());
      }
    });

    return artists.length ? artists.join(", ") : null;
  };

  Connector.getTrackArt = () => {
    const img = document.querySelector(
      'img[class*="PlayerBarDesktop_cover__"]',
    );
    if (!img) return null;

    const src = img.getAttribute("src");
    if (!src) return null;

    const highResUrl = src.replace(/\d+x\d+/, "600x600");

    return highResUrl;
  };

  Connector.getAlbum = () => {
    const albumLink = document.querySelector(
      'a[title^="\u0418\u0437 \u0430\u043B\u044C\u0431\u043E\u043C\u0430"]',
    );
    if (!albumLink) return null;
    const match = albumLink.title.match(/^Из альбома «(.+)»$/);
    return match ? match[1] : null;
  };

  Connector.getCurrentTime = () => {
    const el = document.querySelector('[class*="Timecode_root_start"]');
    if (!el) return null;

    const timeText = el.textContent.trim();
    const parts = timeText.split(":");

    if (parts.length !== 2) return null;

    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);

    if (isNaN(minutes) || isNaN(seconds)) return null;

    return minutes * 60 + seconds;
  };

  Connector.getDuration = () => {
    const el = document.querySelector('[class*="Timecode_root_end"]');
    if (!el) return null;

    const timeText = el.textContent.trim();
    const parts = timeText.split(":");

    if (parts.length !== 2) return null;

    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);

    if (isNaN(minutes) || isNaN(seconds)) return null;

    return minutes * 60 + seconds;
  };

  Connector.isPlaying = () => {
    const buttons = [...document.querySelectorAll("button")];
    for (const btn of buttons) {
      if (
        [...btn.classList].some((c) =>
          c.includes("BaseSonataControlsDesktop_sonataButton"),
        )
      ) {
        const label = btn.getAttribute("aria-label");
        if (label === "Пауза") return true;
        if (label === "Воспроизведение") return false;
      }
    }
    return false;
  };

  Connector.onStateChanged();

  const playerNode = document.querySelector(Connector.playerSelector);
  if (playerNode) {
    const observer = new MutationObserver(() => Connector.onStateChanged());
    observer.observe(playerNode, { childList: true, subtree: true });
  } else {
    setInterval(() => {
      Connector.onStateChanged();
    }, 1000);
  }
}
