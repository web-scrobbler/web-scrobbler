require(['event-bus'], function(bus) {
    bus.on('audio:play', function(e) {
        console.log('playing: ' + e.sound.attributes.title);
    })
});