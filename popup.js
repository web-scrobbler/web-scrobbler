$(function(){
   /*
   var o = '<pre>';
   for (var x in chrome.extension.getBackgroundPage().song) {
      o += x + ' : ' + chrome.extension.getBackgroundPage().song[x] + '\n';
   }
   o += '</pre>';
   $(o).appendTo('body');
   */

   if (chrome.extension.getBackgroundPage().song.artist != '')
      $('#artist').val(chrome.extension.getBackgroundPage().song.artist);

   if (chrome.extension.getBackgroundPage().song.track != '')
      $('#track').val(chrome.extension.getBackgroundPage().song.track);

   // attempts to fix issue #74 for windows - does not work
   // but does seem to work properly for Chrome Canary Windows NT
   $('#artist').bind('blur', function(){
	  $('#track').focus();
   });
   $('#track').bind('blur', function(){
 	  $('#submit').focus();
   });

   $('#artist').focus();


   $('#submit').click(function(){
      $(this).attr('disabled', true);
      $(this).siblings().remove();

      var artist = $('#artist').val();
      var track = $('#track').val();
      var res = chrome.extension.getBackgroundPage().validate( artist, track );

      if (res == false) {
         $(this).attr('disabled', false);
         $(this).siblings().remove();
         $(this).parent().append('<span class="note">Not valid</span>');
      }
      else {
         // did the content script recognize at least the duration?
         if (!chrome.extension.getBackgroundPage().song.duration)
            chrome.extension.getBackgroundPage().song.duration = res.duration;

         // fill other data
         chrome.extension.getBackgroundPage().song.artist = res.artist;
         chrome.extension.getBackgroundPage().song.track = res.track;
         //chrome.extension.getBackgroundPage().song.album = res.album;

         // make the connection to last.fm service to notify
         chrome.extension.getBackgroundPage().nowPlaying();

         // The minimum time is 240 seconds or half the track's total length
         // minus the time that already past
         var past = parseInt(new Date().getTime() / 1000.0) - chrome.extension.getBackgroundPage().song.startTime;
         var min_time = Math.min(240, chrome.extension.getBackgroundPage().song.duration / 2) - past;

         // Set up the timer to scrobble
         chrome.extension.getBackgroundPage().scrobbleTimeout = chrome.extension.getBackgroundPage().setTimeout(chrome.extension.getBackgroundPage().submit, min_time * 1000);

         $('#form').fadeOut(0);
         $('#valid').fadeIn(0);
      }

   });

});