/**
 * Web Audio shutter + export chime — ported from photobooth-v2/hooks/use-sound-effects.ts
 */
(function (global) {
  var audioContext = null;

  function getAudioContext() {
    if (audioContext) return audioContext;
    var Ctx = window.AudioContext || window.webkitAudioContext;
    audioContext = new Ctx();
    return audioContext;
  }

  global.PB_Sound = {
    isMuted: true,

    initFromStorage: function () {
      try {
        var stored = localStorage.getItem("photobooth-sound-muted");
        if (stored !== null) this.isMuted = stored === "true";
      } catch (e) {}
    },

    setMuted: function (m) {
      this.isMuted = m;
      try {
        localStorage.setItem("photobooth-sound-muted", String(m));
      } catch (e) {}
    },

    toggleMute: function () {
      this.setMuted(!this.isMuted);
      return this.isMuted;
    },

    playShutterClick: function () {
      if (this.isMuted) return;
      var ctx = getAudioContext();
      var now = ctx.currentTime;

      var noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
      var noiseData = noiseBuffer.getChannelData(0);
      for (var i = 0; i < noiseData.length; i++) {
        noiseData[i] = Math.random() * 2 - 1;
      }
      var noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      var noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      var noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "highpass";
      noiseFilter.frequency.value = 2000;
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseSource.start(now);
      noiseSource.stop(now + 0.03);

      var oscillator = ctx.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(150, now + 0.03);
      oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.09);
      var thumpGain = ctx.createGain();
      thumpGain.gain.setValueAtTime(0.4, now + 0.03);
      thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      oscillator.connect(thumpGain);
      thumpGain.connect(ctx.destination);
      oscillator.start(now + 0.03);
      oscillator.stop(now + 0.09);
    },

    playExportChime: function () {
      if (this.isMuted) return;
      var ctx = getAudioContext();
      var now = ctx.currentTime;
      var notes = [523.25, 659.25, 783.99];
      var noteDuration = 0.12;
      for (var idx = 0; idx < notes.length; idx++) {
        (function (freq, index) {
          var oscillator = ctx.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.value = freq;
          var gainNode = ctx.createGain();
          var startTime = now + index * noteDuration;
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration + 0.15);
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          oscillator.start(startTime);
          oscillator.stop(startTime + noteDuration + 0.15);
        })(notes[idx], idx);
      }
    },
  };

  global.PB_Sound.initFromStorage();
})(typeof window !== "undefined" ? window : globalThis);
