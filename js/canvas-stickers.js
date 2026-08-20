/**
 * Corner flower/star/heart/sparkle/bow stickers on captured frames,
 * plus the shared draw routine for review-step placed stickers.
 */
(function (global) {
  function drawFlower(ctx, x, y, size) {
    var r = size * 0.5;
    var petalR = size * 0.35;
    ctx.strokeStyle = "rgba(233, 30, 140, 0.35)";
    ctx.lineWidth = 1;
    for (var i = 0; i < 6; i++) {
      var a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      var px = x + Math.cos(a) * r * 0.7;
      var py = y + Math.sin(a) * r * 0.7;
      var petalGrad = ctx.createRadialGradient(
        px - petalR * 0.35, py - petalR * 0.35, petalR * 0.1,
        px, py, petalR
      );
      petalGrad.addColorStop(0, "#FFE6F1");
      petalGrad.addColorStop(1, "#FF9EC4");
      ctx.fillStyle = petalGrad;
      ctx.beginPath();
      ctx.arc(px, py, petalR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // glossy highlight
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(px - petalR * 0.3, py - petalR * 0.35, petalR * 0.28, petalR * 0.18, -0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    var centerGrad = ctx.createRadialGradient(
      x - petalR * 0.15, y - petalR * 0.15, petalR * 0.05,
      x, y, petalR * 0.6
    );
    centerGrad.addColorStop(0, "#FFFACD");
    centerGrad.addColorStop(1, "#F5D76E");
    ctx.fillStyle = centerGrad;
    ctx.beginPath();
    ctx.arc(x, y, petalR * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  function starPath(ctx, x, y, outer, inner, points, rotation) {
    ctx.beginPath();
    for (var i = 0; i < points * 2; i++) {
      var radius = i % 2 === 0 ? outer : inner;
      var a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2 + (rotation || 0);
      var px = x + Math.cos(a) * radius;
      var py = y + Math.sin(a) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function drawStar(ctx, x, y, size) {
    var outer = size;
    var inner = size * 0.45;

    // soft glow halo behind the star
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#FFD700";
    starPath(ctx, x, y, outer * 1.35, inner * 1.35, 5, 0.15);
    ctx.fill();
    ctx.restore();

    var grad = ctx.createLinearGradient(x - outer, y - outer, x + outer, y + outer);
    grad.addColorStop(0, "#FFD700");
    grad.addColorStop(1, "#FFA500");
    ctx.fillStyle = grad;
    ctx.strokeStyle = "rgba(255, 165, 0, 0.7)";
    ctx.lineWidth = 1;
    starPath(ctx, x, y, outer, inner, 5, 0);
    ctx.fill();
    ctx.stroke();

    // tiny sparkle accent near the top point
    drawSparkle(ctx, x + outer * 0.55, y - outer * 0.55, size * 0.28);
  }

  function drawHeart(ctx, x, y, size) {
    var s = size * 0.9;
    var grad = ctx.createLinearGradient(x - s, y - s * 0.4, x + s, y + s);
    grad.addColorStop(0, "#FFB6D9");
    grad.addColorStop(1, "#E91E8C");
    ctx.fillStyle = grad;
    ctx.strokeStyle = "rgba(194, 24, 91, 0.6)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y - s * 0.4, x - s, y - s * 0.4, x - s * 0.5, y + s * 0.2);
    ctx.bezierCurveTo(x, y + s * 0.6, x, y + s * 0.6, x, y + s);
    ctx.bezierCurveTo(x, y + s * 0.6, x, y + s * 0.6, x + s * 0.5, y + s * 0.2);
    ctx.bezierCurveTo(x + s, y - s * 0.4, x, y - s * 0.4, x, y + s * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // glossy highlight in the upper-left lobe
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(x - s * 0.35, y - s * 0.05, s * 0.18, s * 0.12, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawSparkle(ctx, x, y, size) {
    var grad = ctx.createRadialGradient(x, y, 0, x, y, size);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(1, "#FF9EC4");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.quadraticCurveTo(x + size * 0.15, y - size * 0.15, x + size, y);
    ctx.quadraticCurveTo(x + size * 0.15, y + size * 0.15, x, y + size);
    ctx.quadraticCurveTo(x - size * 0.15, y + size * 0.15, x - size, y);
    ctx.quadraticCurveTo(x - size * 0.15, y - size * 0.15, x, y - size);
    ctx.closePath();
    ctx.fill();
    // small perpendicular cross-glint
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, size * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawBow(ctx, x, y, size) {
    var loopR = size * 0.55;
    ctx.strokeStyle = "rgba(197, 197, 232, 0.8)";
    ctx.lineWidth = 1;
    [-1, 1].forEach(function (side) {
      var grad = ctx.createLinearGradient(x, y - loopR, x + side * loopR * 1.4, y + loopR);
      grad.addColorStop(0, "#F0EBFF");
      grad.addColorStop(1, "#C5C5E8");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + side * loopR * 1.6, y - loopR * 1.1, x + side * loopR * 1.7, y);
      ctx.quadraticCurveTo(x + side * loopR * 1.6, y + loopR * 1.1, x, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
    // center knot
    var knotGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 0.32);
    knotGrad.addColorStop(0, "#E6E6FA");
    knotGrad.addColorStop(1, "#9b8fd6");
    ctx.fillStyle = knotGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.28, size * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  var DRAWERS = {
    flower: drawFlower,
    star: drawStar,
    heart: drawHeart,
    sparkle: drawSparkle,
    bow: drawBow,
  };

  global.PB_StickerDrawers = DRAWERS;

  global.PB_drawStickerCorners = function (ctx, width, height, frame) {
    var drawer = frame && DRAWERS[frame];
    if (!drawer) return;
    ctx.save();
    var pad = width * 0.08;
    var size = Math.min(width, height) * 0.14;
    var positions = [
      [pad + size, pad + size],
      [width - pad - size, pad + size],
      [pad + size, height - pad - size],
      [width - pad - size, height - pad - size],
    ];
    for (var p = 0; p < positions.length; p++) {
      drawer(ctx, positions[p][0], positions[p][1], size);
    }
    ctx.restore();
  };

  /**
   * Shared draw routine for review-step placed stickers (emoji/text),
   * used by both the live composite preview/export and the GIF exporter
   * so the two paths can never drift out of sync.
   */
  global.PB_drawPlacedStickers = function (ctx, stickers, selectedStickerId) {
    if (!stickers || !stickers.length) return;
    stickers.forEach(function (sticker) {
      ctx.font = sticker.size + "px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(sticker.content, sticker.x, sticker.y);
      if (selectedStickerId && sticker.id === selectedStickerId) {
        ctx.save();
        ctx.strokeStyle = "rgba(233, 30, 140, 0.85)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.arc(sticker.x, sticker.y, sticker.size * 0.62, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    });
  };
})(typeof window !== "undefined" ? window : globalThis);
