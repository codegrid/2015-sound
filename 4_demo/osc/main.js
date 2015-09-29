(function(global) {
  'use strict';

  var ctx = new global.AudioContext();

  var btn = global.document.getElementsByClassName('jsBtn');
  [].slice.call(btn).forEach(function(el){
    el.addEventListener('click', playOsc, false);
  });

  function playOsc(ev) {
    var osc = ctx.createOscillator();
    osc.frequency.value = ev.currentTarget.getAttribute('data-freq')|0;
    osc.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  }

}(window));
