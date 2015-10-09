(function(global) {
  'use strict';

  var ctx = new global.AudioContext();

  global.document.getElementById('jsPlayBtn').addEventListener('click', play, false);
  global.document.getElementById('jsStopBtn').addEventListener('click', stop, false);
  [].slice.call(global.document.getElementsByClassName('jsFilterRadio'))
    .forEach(function(el) {
      el.addEventListener('change', toggleFilter, false);
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


  var source, convolver;
  var hasPlayed = false;
  var isFilterEnable = 0;

  function toggleFilter() {
    isFilterEnable = !isFilterEnable;

    if (hasPlayed) {
      _switchFilter();
    }
  }

  function play() {
    var voUrl = './vo.m4a';
    var fiUrl = './fi.m4a';
    Promise
      .all([loadSound(voUrl), loadSound(fiUrl)])
      .then(function() {
        _prepareFilter(fiUrl);
        _playNormal(voUrl);

        _switchFilter();
        hasPlayed = true;
      });
  }

  function stop() {
    if (!source) { return; }
    source.stop(ctx.currentTime);
  }

  function _switchFilter() {
    if (isFilterEnable) {
      source.disconnect();
      source.connect(convolver);
      convolver.connect(ctx.destination);
    } else {
      source.disconnect();
      source.connect(ctx.destination);
    }
  }

  function _prepareFilter(url) {
    convolver = ctx.createConvolver();
    convolver.buffer = bufferCache[url];
  }

  function _playNormal(url) {
    source = ctx.createBufferSource();
    source.buffer = bufferCache[url];
    source.connect(ctx.destination);
    source.start(ctx.currentTime, 5); // 先頭に空白があるのでスキップ
    source.stop(ctx.currentTime + source.buffer.duration);
  }

}(window));
