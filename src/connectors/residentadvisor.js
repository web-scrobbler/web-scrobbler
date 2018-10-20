'use strict';

Connector.playerSelector = '.plus8 .pr8 .strip ul.list, #tracks-in-archive';

Connector.playButtonSelector = '.controls .play';

function getTrackContainer() {
  let track = $('.play.paused').parent().parent().parent();
  if (track.is('article')) {
    return track; // recommended track
  } else {
    return track.parent(); // archive track
  }
}

function isTrackInRecommended() {
  return getTrackContainer().is('article');
}

Connector.getTrackContainerArt = () => {
  let artPath = getTrackContainer().find('a img').attr('src'); // /images/cover/tr-929172.jpg
  return 'https://www.residentadvisor.net' + artPath
}

Connector.getArtistTrack = () => {
  if (isTrackInRecommended()) {
    return Util.splitArtistTrack(getTrackContainer().find('div a').text());
  } else {
    return $(getTrackContainer).find('li:last-child .pr8 .f24')
  }
}

Connector.getUniqueId = () => {
  return getTrackContainer().find('.play.player').attr('data-trackid');
}

Connector.isPlaying = () => $('.play.paused').length > 0;
