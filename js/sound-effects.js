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

      // A soft two-note "boop-beep" instead of a harsh camera-shutter
      // click — gentler on the ears, still reads clearly as a capture cue.
      var notes = [
        { freq: 880, start: 0, dur: 0.07 },
        { freq: 1320, start: 0.06, dur: 0.1 },
      ];
      notes.forEach(function (n) {
        var osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = n.freq;
        var gain = ctx.createGain();
        var startTime = now + n.start;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.22, startTime + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + n.dur + 0.02);
      });
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
