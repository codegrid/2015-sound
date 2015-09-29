(function(global, doc) {
  'use strict';

  var ctx = new global.AudioContext();
  var q = doc.querySelectorAll.bind(doc);

  var audio;
  var audioReady = false;
  var filter = ctx.createBiquadFilter();
  filter.type = 'allpass';
  filter.connect(ctx.destination);

  _hideUI();
  q('#jsFile')[0].addEventListener('change', _loadAudio, false);
  [].slice.call(q('.jsFilterRadio')).forEach(function(el) {
    el.addEventListener('change', _changeFilter, false);
  });
  [].slice.call(q('.jsPBRadio')).forEach(function(el) {
    el.addEventListener('change', _changePBRate, false);
  });
  global.addEventListener('keydown', _handleKeyDown, false);


  function _loadAudio(ev) {
    var file = ev.currentTarget.files[0];
    if (!file) { return; }

    audio = null;
    audio = new Audio();
    audio.src = global.URL.createObjectURL(file);
    audio.controls = true;
    audio.loop = true;
    q('#jsAudio')[0].innerHTML = '';
    q('#jsAudio')[0].appendChild(audio);

    var source = ctx.createMediaElementSource(audio);
    source.connect(filter);
    _showUI();
  }

  function _hideUI() {
    audioReady = false;
    q('#jsInterviewUI')[0].style.display = 'none';
  }
  function _showUI() {
    audioReady = true;
    q('#jsInterviewUI')[0].style.display = 'block';
  }

  function _changeFilter(ev) {
    var type = ev.currentTarget.value;
    filter.type = type;
  }

  function _changePBRate(ev) {
    var rate = +ev.currentTarget.value;
    audio.playbackRate = rate;
  }

  function _handleKeyDown(ev) {
    if (!audioReady) { return; }
    if (!ev.ctrlKey) { return; }
    ev.preventDefault();

    if (ev.keyCode === 49) {
      audio.paused ? audio.play() : audio.pause();
    }
    if (ev.keyCode === 50) {
      var curTime = audio.currentTime;
      audio.currentTime = curTime - 5;
    }
  }

}(window, document));
