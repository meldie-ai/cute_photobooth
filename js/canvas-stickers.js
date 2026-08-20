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
    ctx.strokeStyle = "#9b8fd6";
    ctx.lineWidth = 1.2;
    // two triangular ribbon loops, pinched at the center knot — reads as a
    // bow silhouette even at small sizes, unlike softly-curved blobs.
    [-1, 1].forEach(function (side) {
      var grad = ctx.createLinearGradient(x, y - size * 0.5, x + side * size * 0.85, y + size * 0.5);
      grad.addColorStop(0, "#F0EBFF");
      grad.addColorStop(1, "#C5C5E8");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + side * size * 0.85, y - size * 0.55);
      ctx.lineTo(x + side * size * 0.85, y + size * 0.55);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
    // small ribbon tails hanging below the knot
    ctx.fillStyle = "#C5C5E8";
    [-1, 1].forEach(function (side) {
      ctx.beginPath();
      ctx.moveTo(x + side * size * 0.1, y + size * 0.15);
      ctx.lineTo(x + side * size * 0.2, y + size * 0.7);
      ctx.lineTo(x + side * size * 0.02, y + size * 0.5);
      ctx.closePath();
      ctx.fill();
    });
    // center knot
    var knotGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 0.3);
    knotGrad.addColorStop(0, "#E6E6FA");
    knotGrad.addColorStop(1, "#9b8fd6");
    ctx.fillStyle = knotGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.24, size * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  function drawCloud(ctx, x, y, size) {
    var grad = ctx.createLinearGradient(x, y - size * 0.5, x, y + size * 0.35);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(1, "#DCEBFF");
    ctx.fillStyle = grad;
    // A cluster of overlapping puffs, no separate flat base — reads as a
    // rounder, more distinctly "cloud" silhouette at small sizes.
    var puffs = [
      [x - size * 0.5, y + size * 0.12, size * 0.34],
      [x - size * 0.16, y - size * 0.16, size * 0.44],
      [x + size * 0.24, y - size * 0.08, size * 0.4],
      [x + size * 0.58, y + size * 0.12, size * 0.3],
    ];
    ctx.beginPath();
    puffs.forEach(function (p) {
      ctx.moveTo(p[0] + p[2], p[1]);
      ctx.arc(p[0], p[1], p[2], 0, Math.PI * 2);
    });
    ctx.fill();
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = "#A9C6EA";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x - size * 0.75, y + size * 0.2);
    ctx.quadraticCurveTo(x - size * 0.16, y - size * 0.55, x + size * 0.24, y - size * 0.42);
    ctx.quadraticCurveTo(x + size * 0.75, y - size * 0.3, x + size * 0.85, y + size * 0.15);
    ctx.stroke();
    ctx.restore();
  }

  function drawSun(ctx, x, y, size) {
    ctx.save();
    ctx.strokeStyle = "#FFD54F";
    ctx.lineWidth = size * 0.14;
    ctx.lineCap = "round";
    for (var i = 0; i < 8; i++) {
      var a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * size * 0.65, y + Math.sin(a) * size * 0.65);
      ctx.lineTo(x + Math.cos(a) * size * 0.95, y + Math.sin(a) * size * 0.95);
      ctx.stroke();
    }
    var grad = ctx.createRadialGradient(x - size * 0.15, y - size * 0.15, size * 0.05, x, y, size * 0.55);
    grad.addColorStop(0, "#FFF3B0");
    grad.addColorStop(1, "#FFB300");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawSnowman(ctx, x, y, size) {
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#B0BEC5";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(x, y + size * 0.32, size * 0.48, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y - size * 0.28, size * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // top hat — a strong dark silhouette makes the whole icon read as
    // "snowman" at a glance, even where the white body has low contrast.
    ctx.fillStyle = "#37474F";
    ctx.beginPath();
    ctx.ellipse(x, y - size * 0.55, size * 0.32, size * 0.07, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - size * 0.18, y - size * 0.85, size * 0.36, size * 0.32);
    ctx.fillStyle = "#FF7043";
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.28);
    ctx.lineTo(x + size * 0.3, y - size * 0.22);
    ctx.lineTo(x, y - size * 0.17);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#263238";
    ctx.beginPath();
    ctx.arc(x - size * 0.1, y - size * 0.35, size * 0.055, 0, Math.PI * 2);
    ctx.arc(x + size * 0.08, y - size * 0.35, size * 0.055, 0, Math.PI * 2);
    ctx.arc(x, y + size * 0.18, size * 0.055, 0, Math.PI * 2);
    ctx.arc(x, y + size * 0.42, size * 0.055, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawPumpkin(ctx, x, y, size) {
    ctx.fillStyle = "#7CB342";
    ctx.fillRect(x - size * 0.05, y - size * 0.65, size * 0.1, size * 0.22);
    var grad = ctx.createLinearGradient(x - size * 0.55, y, x + size * 0.55, y);
    grad.addColorStop(0, "#FB8C00");
    grad.addColorStop(0.5, "#FFA726");
    grad.addColorStop(1, "#FB8C00");
    ctx.fillStyle = grad;
    ctx.strokeStyle = "rgba(194, 100, 0, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.6, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    [-0.35, 0, 0.35].forEach(function (off) {
      ctx.moveTo(x + off * size, y - size * 0.5);
      ctx.lineTo(x + off * size, y + size * 0.5);
    });
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x, y, size * 0.6, size * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawTree(ctx, x, y, size) {
    ctx.fillStyle = "#8D6E63";
    ctx.fillRect(x - size * 0.08, y + size * 0.35, size * 0.16, size * 0.2);
    var grad = ctx.createLinearGradient(x, y - size * 0.6, x, y + size * 0.4);
    grad.addColorStop(0, "#81C784");
    grad.addColorStop(1, "#2E7D32");
    ctx.fillStyle = grad;
    [0.35, 0.1, -0.2].forEach(function (topOffset, i) {
      var w = size * (0.65 - i * 0.12);
      var tY = y + topOffset * size;
      ctx.beginPath();
      ctx.moveTo(x, tY - size * 0.32);
      ctx.lineTo(x - w, tY + size * 0.18);
      ctx.lineTo(x + w, tY + size * 0.18);
      ctx.closePath();
      ctx.fill();
    });
    ctx.fillStyle = "#FFD54F";
    drawSparkle(ctx, x, y - size * 0.68, size * 0.16);
  }

  var DRAWERS = {
    flower: drawFlower,
    star: drawStar,
    heart: drawHeart,
    sparkle: drawSparkle,
    bow: drawBow,
    cloud: drawCloud,
    sun: drawSun,
    snowman: drawSnowman,
    pumpkin: drawPumpkin,
    tree: drawTree,
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
   * Shared draw routine for review-step placed stickers — either a
   * custom-drawn icon (via PB_StickerDrawers) or plain text — used by both
   * the live composite preview/export and the GIF exporter so the two
   * paths can never drift out of sync.
   */
  global.PB_drawPlacedStickers = function (ctx, stickers, selectedStickerId) {
    if (!stickers || !stickers.length) return;
    stickers.forEach(function (sticker) {
      if (sticker.type === "icon" && DRAWERS[sticker.value]) {
        DRAWERS[sticker.value](ctx, sticker.x, sticker.y, sticker.size * 0.45);
      } else {
        ctx.font = "bold " + sticker.size + "px 'Quicksand', sans-serif";
        ctx.fillStyle = "#e91e8c";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(sticker.value, sticker.x, sticker.y);
      }
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
