(function(global) {
  'use strict';

  var ctx = new global.AudioContext();

  var btn = global.document.getElementsByClassName('jsBtn');
  [].slice.call(btn).forEach(function(el){
    el.addEventListener('click', playSound, false);
  });

  var bufferCache = {};

  function loadSound(url) {
    return new Promise(function(resolve, reject) {
      if (url in bufferCache) { return resolve(); }
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      request.onload = function() {
        ctx.decodeAudioData(request.response, function(buffer) {
          bufferCache[url] = buffer;
          resolve();
        });
      };
      request.onerror = function(err) {
        reject(err);
      };
      request.send();
    });
  }

  function playSound(ev) {
    var key = ev.currentTarget.getAttribute('data-key');
    var url = './' + key + '.m4a';
    loadSound(url).then(function() {
      var source = ctx.createBufferSource();
      source.buffer = bufferCache[url];
      source.connect(ctx.destination);
      source.start(ctx.currentTime);
      source.stop(ctx.currentTime + source.buffer.duration);
    });
  }

}(window));
