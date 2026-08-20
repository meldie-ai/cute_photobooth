/**
 * Mini canvas previews for the capture-step corner-sticker picker — draws
 * the exact same art (via PB_StickerDrawers, from canvas-stickers.js) that
 * gets baked into captured photos, just scaled down to swatch size.
 */
(function (global) {
  global.PB_drawStickerFramePreview = function (canvas, optionId) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#FFF5F8";
    ctx.fillRect(0, 0, w, h);
    var drawer = global.PB_StickerDrawers && global.PB_StickerDrawers[optionId];
    if (drawer) {
      drawer(ctx, w / 2, h / 2, Math.min(w, h) * 0.32);
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
