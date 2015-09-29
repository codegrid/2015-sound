(function(global) {
  'use strict';

  var ctx = new global.AudioContext();

  global.document.getElementById('btn').addEventListener('click', play, false);

  function play() {
    var osc  = ctx.createOscillator();
    var gain = ctx.createGain();

    // osc -> gain -> destination
    osc.connect(gain);
    gain.connect(ctx.destination);

    var startTime = ctx.currentTime;
    var endTime   = startTime + 2;
    // 1 -> 0とgain.gain.value(= ボリューム)を変化させる
    // 再生開始から2秒かけて変化させる
    gain.gain.setValueAtTime(1, startTime);
    gain.gain.linearRampToValueAtTime(0, endTime);

    // 2秒間鳴らすので終わるときはちょうどボリュームも0になる
    osc.start(startTime);
    osc.stop(endTime);
  }

}(window));
