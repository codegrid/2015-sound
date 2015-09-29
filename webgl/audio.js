(function(global) {
  'use strict';

  var camera = global.camera;
  var scene  = global.scene;
  var ctx = new global.AudioContext();

  var sound = new Audio();
  sound.loop = true;
  sound.autoplay = true;
  sound.onloadeddata = _soundLoaded;
  sound.src = './firecracking.m4a';

  var master, panner;

  function _soundLoaded() {
    var source = ctx.createMediaElementSource(sound);
    panner = ctx.createStereoPanner();
    master = ctx.createGain();

    source.connect(panner);
    panner.connect(master);
    master.connect(ctx.destination);

    _loop();
  }

  function _loop() {
    // xで左右のパンを変える(xは-5~5)
    var x = camera.position.x / 5;
    panner.pan.value = -x;

    // 音量は距離で変える(dstは2.29~7.87)
    var dst = scene.position.distanceTo(camera.position);
    master.gain.value = 2.5 / dst;

    global.requestAnimationFrame(_loop);
  }

}(window));
