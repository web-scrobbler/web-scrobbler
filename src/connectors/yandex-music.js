"use strict";
(() => {
  // src/connectors/yandex-music.ts
  (() => {
    setupConnector();
    function setupConnector() {
      if (isOldPlayer()) {
        setupOldConnector();
      } else {
        setupNewConnector();
      }
    }
    function isOldPlayer() {
      return window.externalAPI !== void 0;
    }
    
    function setupNewConnector() {

      const observer = new MutationObserver(() => {
          const el = document.querySelector('.track.track_type_player');
          if (el) {
              // catched, initializing connector
              observer.disconnect();
              Connector.playerSelector = '.track.track_type_player';
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

      const trackNode = document.querySelector('.player-controls__track-container');
      if (trackNode) {
        trackObserver.observe(trackNode, { childList: true, subtree: true });
      }

      observer.observe(document.body, { childList: true, subtree: true });
      Connector.trackSelector = ".track__title";
      Connector.artistSelector = ".d-artists.d-artists__expanded";
      // Connector.trackArtSelector = ".entity-cover__image";
      Connector.getTrackArt = () => {
        const container = document.querySelector('.player-controls__track-container');
        if (!container) {
          return null;
        }

        const images = container.querySelectorAll('img');

        for (const img of images) {
          const src = img.getAttribute('src');
          if (src && src.includes('50x50')) {
            const absoluteUrl = new URL(src, window.location.origin).toString();

            const highResUrl = absoluteUrl.replace('50x50', '800x800');
            return highResUrl;
          }
        }

        return null;
      };

      Connector.getAlbum = () => {
        const albumLink = document.querySelector('a[title^="\u0418\u0437 \u0430\u043B\u044C\u0431\u043E\u043C\u0430"]');
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



      // Don't work now. CUTTED OUT
      // Connector.loveButtonSelector = [
      //   ".bar__content button" 
      // ];

      // Connector.isLoved = () => {
      //   const buttons = document.querySelectorAll(Connector.loveButtonSelector.join(", "));
      //   for (const btn of buttons) {
      //     const icon = btn.querySelector("div.d-icon");
      //     if (!icon) continue;
      //  
      //     if (icon.classList.contains("d-icon_heart-full")) {
      //       return true;
      //     }
      //    
      //     if (icon.classList.contains("d-icon_heart")) {
      //       return false;
      //     }
      //     console.log(isLoved())
      //   }
      //   console.log(isLoved())
      //   return null; 
      // };
    }

    function setupOldConnector() {
      let trackInfo = {};
      let isPlaying = false;
      Connector.isPlaying = () => isPlaying;
      Connector.getTrackInfo = () => trackInfo;
      Connector.onScriptEvent = (e) => {
        switch (e.data.type) {
          case "YANDEX_MUSIC_STATE":
            trackInfo = e.data.trackInfo;
            isPlaying = e.data.isPlaying;
            Connector.onStateChanged();
            break;
          default:
            break;
        }
      };
      Connector.injectScript("connectors/yandex-music-dom-inject.js");
    }
  })();
})();
