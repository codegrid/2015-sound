(function(global) {
  'use strict';

  var ctx = new global.AudioContext();

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

  global.document.getElementById('jsPlayBtn').addEventListener('click', play, false);
  global.document.getElementById('jsStopBtn').addEventListener('click', stop, false);

  var source, fa;
  var isPlaying = 0;

  function play() {
    if (isPlaying) { return; }
    isPlaying = 1;

    var url = './bgm.m4a';
    loadSound(url).then(function() {
      source = ctx.createBufferSource();
      source.buffer = bufferCache[url];
      source.loop = true;

      fa = new global.FreqAnalyser(ctx, document.getElementById('jsAnalyserCanvas'));
      source.connect(fa.analyser);
      source.connect(ctx.destination);

      source.start(ctx.currentTime);
      fa.draw();
    });
  }

  function stop() {
    if (!(source && fa)) { return; }
    source.disconnect(fa.analyser);
    source.disconnect(ctx.destination);
    isPlaying = 0;
  }

}(window));
