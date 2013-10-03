
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

   // preload options
   $('#use-notifications').attr('checked', (localStorage['useNotifications'] == 1));
   $('#use-notifications-nowplaying').attr('checked', (localStorage['useNotificationsNowPlaying'] == 1));
   $('#use-notifications-scrobbled').attr('checked', (localStorage['useNotificationsScrobbled'] == 1));
   $('#auto-hide-notifications').attr('checked', (localStorage['autoHideNotifications'] == 1));
   $('#use-autocorrect').attr('checked', (localStorage['useAutocorrect'] == 1));
      
   // disable subitems
   function updateDisabled() {
      $('#use-notifications-nowplaying').attr('disabled', (!$('#use-notifications').is(':checked')));
      $('#use-notifications-scrobbled').attr('disabled', (!$('#use-notifications').is(':checked')));
      $('#auto-hide-notifications').attr('disabled', (!$('#use-notifications').is(':checked')));
   }
   
   
   $('button#authorize').click(function() {
      authorize();
   });
   
   
   // generate connectors and their checkboxes
   createConnectors();
});


function createConnectors() {
   var parent = $('ul#connectors');
   
   // prevent mutation of original
   var conns = connectors.slice(0);
   
   // sort alphabetically
   conns.sort(function(a, b){ return a.label.localeCompare(b.label); });
   
   conns.forEach(function(connector, index){
      var newEl = $('<li><input type="checkbox" id="conn-' + index + '"> \n\
                      <label for="conn-' + index + '">' + connector.label + '</label>\n\
                  </li>');
      
      var domEl = newEl.appendTo(parent);
      var checkbox = domEl.find('input');
                    
      checkbox.attr('checked', isConnectorEnabled(connector.label));
      
      checkbox.click(function(){
         var box = $(this);
         var disabledArray = JSON.parse(localStorage.disabledConnectors);
         
         // always remove, to prevent duplicates
         var index = disabledArray.indexOf(connector.label);
         if (index > -1) {
            disabledArray.splice(index, 1);
         }
         
         if (!box.is(':checked')) {
            disabledArray.push(connector.label);
         }
         
         localStorage.disabledConnectors = JSON.stringify(disabledArray);
         console.log(localStorage.disabledConnectors);
      });
   });
}
