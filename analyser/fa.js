(function(global) {
  'use strict';

  var FreqAnalyser = function(ctx, el) {
    this.analyser = ctx.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.4;
    this.analyser.fftSize = 1024;
    this.freqs = new Uint8Array(this.analyser.frequencyBinCount);

    this.canvas = el;
    this.WIDTH  = window.innerWidth;
    this.HEIGHT = el.height;
    this.drawContext = this.canvas.getContext('2d');
    this.canvas.height = this.HEIGHT;
    this.canvas.width  = this.WIDTH;
  };

  FreqAnalyser.prototype = {
    constructor: FreqAnalyser,
    draw: function() {
      var fbc = this.analyser.frequencyBinCount;
      this.analyser.getByteFrequencyData(this.freqs);

      this.drawContext.clearRect(0, 0, this.WIDTH, this.HEIGHT);
      for (var i = 0; i < fbc; i++) {
        var barWidth = this.WIDTH / fbc;
        var height = this.HEIGHT * (this.freqs[i] / 256);
        var offset = this.HEIGHT - height;
        this.drawContext.fillStyle = 'hsl(' + (i / fbc * 360) + ', 100%, 50%)';
        this.drawContext.fillRect(i * barWidth, offset, barWidth + 1, height);
      }
      requestAnimationFrame(this.draw.bind(this));
    }
  };

  global.FreqAnalyser = FreqAnalyser;

}(window));
