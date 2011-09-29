
// options ---------------------------------------------------------------------
$(function(){
   
   // use immediate-change checkboxes
   
   $('#use-notifications').click(function(){
      localStorage['useNotifications'] = this.checked ? 1 : 0;
   });
   
   $('#use-autocorrect').click(function(){
      localStorage['useAutocorrect'] = this.checked ? 1 : 0;
   });
   
   $('#use-youtube-inpage').click(function(){
      localStorage['useYTInpage'] = this.checked ? 1 : 0;
   });

   $('#use-napster-module').click(function () {
       localStorage['useNapsterModule'] = this.checked ? 1 : 0;
   });

   // preload options
   $('#use-notifications').attr('checked', (localStorage['useNotifications'] == 1));   
   $('#use-autocorrect').attr('checked', (localStorage['useAutocorrect'] == 1));
   $('#use-youtube-inpage').attr('checked', (localStorage['useYTInpage'] == 1));
   $('#use-napster-module').attr('checked', (localStorage['useNapsterModule'] == 1));
         
});
