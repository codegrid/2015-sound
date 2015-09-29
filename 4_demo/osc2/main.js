(function(global) {
  'use strict';

  var ctx = new global.AudioContext();

  var btn = global.document.getElementsByClassName('jsBtn');
  [].slice.call(btn).forEach(function(el){
    el.addEventListener('click', playOsc, false);
  });


  var keyFreqMap = {
    '1': [697, 1209],
    '2': [697, 1336],
    '3': [697, 1477],
    '4': [770, 1209],
    '5': [770, 1336],
    '6': [770, 1477],
    '7': [852, 1209],
    '8': [852, 1336],
    '9': [852, 1477],
    '*': [941, 1209],
    '0': [941, 1336],
    '#': [941, 1477]
  };

  function playOsc(ev) {
    var osc1 = ctx.createOscillator();
    var osc2 = ctx.createOscillator();

    var key = ev.currentTarget.getAttribute('data-key');

    osc1.frequency.value = keyFreqMap[key][0];
    osc2.frequency.value = keyFreqMap[key][1];

    osc1.connect(ctx.destination);
    osc2.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.2);
    osc2.stop(ctx.currentTime + 0.2);
  }

}(window));
