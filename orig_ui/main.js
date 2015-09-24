;(function(global) {
  'use strict';

  if (!('Audio' in global)) {
    return global.alert('Audio非対応の環境です..');
  }

  // 起動
  global.player = new global.MyPlayer('./sample.m4a');

}(window));
