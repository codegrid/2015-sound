(function(global) {
  'use strict';

  var ctx = new global.AudioContext();

  global.document.getElementById('btn').addEventListener('click', play, false);

  function play() {
    // 実際に鳴らす音
    var osc  = ctx.createOscillator();
    // マスターボリューム(今回はつなぐだけで何もしない)
    var gain  = ctx.createGain();
    // 音に揺らぎを与えるためのオシレーター
    var lfo  = ctx.createOscillator();
    // lfoの揺らぎを増幅するためのゲイン
    var depth = ctx.createGain();

    // これらの値を変更すると音色が変わります
    osc.type = 'triangle';
    lfo.type = 'sawtooth';
    depth.gain.value = 70;
    lfo.frequency.value = 7;

    // osc -> gain -> destination
    osc.connect(gain);
    gain.connect(ctx.destination);

    // lfo -> depth -> osc.frequency
    lfo.connect(depth);
    depth.connect(osc.frequency);

    // 2秒間音を出す
    var startTime = ctx.currentTime;
    var endTime   = startTime + 2;

    osc.start(startTime);
    osc.stop(endTime);
    lfo.start(startTime);
    lfo.stop(endTime);
  }

}(window));
