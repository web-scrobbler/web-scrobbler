
// options ---------------------------------------------------------------------
$(function(){

   // use immediate-change checkboxes

   $('#use-notifications').click(function(){
      localStorage['useNotifications'] = this.checked ? 1 : 0;
      updateDisabled();
   });
   
   $('#use-notifications-nowplaying').click(function(){
      localStorage['useNotificationsNowPlaying'] = this.checked ? 1 : 0;
   });

   $('#use-notifications-scrobbled').click(function(){
      localStorage['useNotificationsScrobbled'] = this.checked ? 1 : 0;
   });

   $('#auto-hide-notifications').click(function(){
      localStorage['autoHideNotifications'] = this.checked ? 1 : 0;
   });

   $('#use-autocorrect').click(function(){
      localStorage['useAutocorrect'] = this.checked ? 1 : 0;
   });

   $('#use-youtube-inpage').click(function(){
      localStorage['useYTInpage'] = this.checked ? 1 : 0;
   });

   // preload options
   $('#use-notifications').attr('checked', (localStorage['useNotifications'] == 1));
   $('#use-notifications-nowplaying').attr('checked', (localStorage['useNotificationsNowPlaying'] == 1));
   $('#use-notifications-scrobbled').attr('checked', (localStorage['useNotificationsScrobbled'] == 1));
   $('#auto-hide-notifications').attr('checked', (localStorage['autoHideNotifications'] == 1));
   $('#use-autocorrect').attr('checked', (localStorage['useAutocorrect'] == 1));
   $('#use-youtube-inpage').attr('checked', (localStorage['useYTInpage'] == 1));
   
   // disable subitems
   function updateDisabled() {
      $('#use-notifications-nowplaying').attr('disabled', (!$('#use-notifications').is(':checked')));
      $('#use-notifications-scrobbled').attr('disabled', (!$('#use-notifications').is(':checked')));
      $('#auto-hide-notifications').attr('disabled', (!$('#use-notifications').is(':checked')));
   }
   
});
