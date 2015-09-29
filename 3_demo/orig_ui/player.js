;(function(global) {
  'use strict';

  function MyPlayer(src) {
    this.audio = null;
    this.ui = {};

    this.init(src);
  }

  MyPlayer.prototype = {
    constructor:      MyPlayer,
    init:             init,
    bindUI:           bindUI,
    handlePlayPause:  handlePlayPause,
    handlePlay:       handlePlay,
    handlePause:      handlePause,
    handleStop:       handleStop,
    handleMute:       handleMute,
    handleVolume:     handleVolume,
    handleSeek:       handleSeek,
    handleTimeupdate: handleTimeupdate,
    handleEnded:      handleEnded
  };

  function init(src) {
    this.audio = new Audio();
    // 音源のロードができたらプレーヤーを使えるように
    this.audio.addEventListener('loadeddata', this.bindUI.bind(this), false);
    // 音源ロード！
    this.audio.src = src;
  }

  function bindUI() {
    var audio = this.audio;

    this.ui.playPauseBtn = document.getElementById('js-play_pause');
    this.ui.stopBtn      = document.getElementById('js-stop');
    this.ui.muteBtn      = document.getElementById('js-mute');
    this.ui.volumeRange  = document.getElementById('js-volume');
    this.ui.seekRange    = document.getElementById('js-seek');
    this.ui.currentTime  = document.getElementById('js-current_time');
    this.ui.duration     = document.getElementById('js-duration');

    this.ui.playPauseBtn.addEventListener('click', this.handlePlayPause.bind(this), false);
    this.ui.stopBtn.addEventListener('click', this.handleStop.bind(this), false);
    this.ui.muteBtn.addEventListener('click', this.handleMute.bind(this), false);
    this.ui.volumeRange.addEventListener('change', this.handleVolume.bind(this), false);
    this.ui.volumeRange.addEventListener('input', this.handleVolume.bind(this), false);
    this.ui.seekRange.addEventListener('input', this.handleSeek.bind(this), false);
    this.ui.seekRange.addEventListener('change', this.handleSeek.bind(this), false);

    this.ui.duration.textContent = audio.duration|0;
    this.ui.seekRange.setAttribute('max', audio.duration|0);

    audio.addEventListener('timeupdate', this.handleTimeupdate.bind(this), false);
    audio.addEventListener('ended', this.handleEnded.bind(this), false);
  }

  function handlePlayPause() {
    var audio = this.audio;
    var isPaused = audio.paused;

    if (isPaused) {
      this.handlePlay();
    } else {
      this.handlePause();
    }
  }

  function handlePlay() {
    var audio = this.audio;
    this.ui.playPauseBtn.firstElementChild.style.display = 'none';
    this.ui.playPauseBtn.lastElementChild.style.display = '';
    audio.play();
    console.log('play');
  }

  function handlePause() {
    var audio = this.audio;
    this.ui.playPauseBtn.firstElementChild.style.display = '';
    this.ui.playPauseBtn.lastElementChild.style.display = 'none';
    audio.pause();
    console.log('pause');
  }

  function handleStop() {
    var audio = this.audio;

    this.handlePause();
    audio.currentTime = 0;
    console.log('stop');
  }

  function handleMute() {
    var audio = this.audio;
    var isMuted = audio.muted;

    if (isMuted) {
      this.ui.muteBtn.firstElementChild.style.display = '';
      this.ui.muteBtn.lastElementChild.style.display = 'none';
      audio.muted = false;
    } else {
      this.ui.muteBtn.firstElementChild.style.display = 'none';
      this.ui.muteBtn.lastElementChild.style.display = '';
      audio.muted = true;
    }
    console.log(isMuted ? 'unmute' : 'mute');
  }

  function handleVolume() {
    var audio = this.audio;
    audio.volume = this.ui.volumeRange.value;
    console.log('vol change');
  }

  function handleSeek() {
    var audio = this.audio;
    audio.currentTime = this.ui.seekRange.value;
    console.log('seek');
  }

  function handleTimeupdate() {
    var audio = this.audio;

    this.ui.seekRange.value = audio.currentTime|0;
    this.ui.currentTime.textContent = audio.currentTime|0;
  }

  function handleEnded() {
    this.handleStop();
  }

  global.MyPlayer = MyPlayer;

}(window));
