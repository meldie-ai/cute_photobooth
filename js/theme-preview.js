/**
 * Mini canvas previews for the theme/frame picker (Step 2) — draws a small
 * version of each theme's actual corner decoration so swatches look like
 * their real frame instead of a flat color block.
 */
(function (global) {
  function drawHeartMini(ctx, cx, cy, s) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + s / 4);
    ctx.bezierCurveTo(cx, cy, cx - s / 2, cy, cx - s / 2, cy + s / 4);
    ctx.bezierCurveTo(cx - s / 2, cy + s / 2, cx, cy + s * 0.75, cx, cy + s);
    ctx.bezierCurveTo(cx, cy + s * 0.75, cx + s / 2, cy + s / 2, cx + s / 2, cy + s / 4);
    ctx.bezierCurveTo(cx + s / 2, cy, cx, cy, cx, cy + s / 4);
    ctx.fill();
  }

  function drawLeafMini(ctx, x, y, rot, s) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.beginPath();
    ctx.ellipse(0, 0, s / 2, s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawPawMini(ctx, x, y, s) {
    ctx.beginPath();
    ctx.ellipse(x, y, s * 0.6, s * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    [
      [-s * 0.5, -s * 0.6],
      [-s * 0.15, -s * 0.8],
      [s * 0.15, -s * 0.8],
      [s * 0.5, -s * 0.6],
    ].forEach(function (off) {
      ctx.beginPath();
      ctx.ellipse(x + off[0], y + off[1], s * 0.2, s * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  global.PB_drawThemePreview = function (canvas, theme) {
    var w = canvas.width;
    var h = canvas.height;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = theme.backgroundColor;
    ctx.fillRect(0, 0, w, h);

    var bw = Math.max(6, Math.round(w * 0.09));
    ctx.fillStyle = theme.borderColor;
    ctx.fillRect(0, 0, w, bw);
    ctx.fillRect(0, h - bw, w, bw);
    ctx.fillRect(0, 0, bw, h);
    ctx.fillRect(w - bw, 0, bw, h);

    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(bw + 3, bw + 3, w - (bw + 3) * 2, h - (bw + 3) * 2);

    var cx = w / 2;

    if (theme.id === "party-confetti") {
      var colors = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#95e1d3", "#f38181"];
      for (var i = 0; i < 14; i++) {
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(bw + Math.random() * (w - bw * 2), bw + Math.random() * (h - bw * 2), 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (theme.cornerDecorType === "rule") {
      ctx.strokeStyle = theme.textColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(bw + 2, bw + 2, w - (bw + 2) * 2, h - (bw + 2) * 2);
    }

    if (theme.cornerDecorType === "hearts") {
      ctx.fillStyle = theme.textColor;
      var hs = 7;
      drawHeartMini(ctx, bw, bw - 2, hs);
      drawHeartMini(ctx, w - bw, bw - 2, hs);
      drawHeartMini(ctx, bw, h - bw - 6, hs);
      drawHeartMini(ctx, w - bw, h - bw - 6, hs);
    }

    if (theme.cornerDecorType === "leaves") {
      ctx.fillStyle = theme.textColor;
      var ls = 8;
      drawLeafMini(ctx, bw + 2, bw + 2, 45, ls);
      drawLeafMini(ctx, w - bw - 2, bw + 2, 135, ls);
      drawLeafMini(ctx, bw + 2, h - bw - 2, -45, ls);
      drawLeafMini(ctx, w - bw - 2, h - bw - 2, -135, ls);
    }

    if (theme.cornerDecorType === "scalloped") {
      ctx.strokeStyle = theme.textColor;
      ctx.lineWidth = 1.5;
      var scallops = 7;
      var r = w / scallops / 2;
      for (var j = 0; j < scallops; j++) {
        var x = (w / scallops) * (j + 0.5);
        ctx.beginPath();
        ctx.arc(x, bw / 2, r, 0, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, h - bw / 2, r, Math.PI, 0);
        ctx.stroke();
      }
    }

    if (theme.cornerDecorType === "cat") {
      var earBase = Math.max(bw, 11);
      ctx.fillStyle = theme.borderColor;
      ctx.beginPath();
      ctx.moveTo(bw + 2, earBase);
      ctx.lineTo(bw + 16, earBase);
      ctx.lineTo(bw + 6, 2);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(w - bw - 2, earBase);
      ctx.lineTo(w - bw - 16, earBase);
      ctx.lineTo(w - bw - 6, 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ffb6c1";
      ctx.beginPath();
      ctx.moveTo(bw + 5, earBase);
      ctx.lineTo(bw + 13, earBase);
      ctx.lineTo(bw + 8, 6);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(w - bw - 5, earBase);
      ctx.lineTo(w - bw - 13, earBase);
      ctx.lineTo(w - bw - 8, 6);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = theme.textColor;
      ctx.lineWidth = 1;
      var wy = h / 2;
      ctx.beginPath();
      ctx.moveTo(bw, wy - 4);
      ctx.lineTo(bw - 10, wy - 7);
      ctx.moveTo(bw, wy);
      ctx.lineTo(bw - 10, wy);
      ctx.moveTo(bw, wy + 4);
      ctx.lineTo(bw - 10, wy + 7);
      ctx.moveTo(w - bw, wy - 4);
      ctx.lineTo(w - bw + 10, wy - 7);
      ctx.moveTo(w - bw, wy);
      ctx.lineTo(w - bw + 10, wy);
      ctx.moveTo(w - bw, wy + 4);
      ctx.lineTo(w - bw + 10, wy + 7);
      ctx.stroke();
    }

    if (theme.cornerDecorType === "dog") {
      var earCy = 15;
      ctx.fillStyle = theme.borderColor;
      ctx.beginPath();
      ctx.ellipse(bw, earCy, 8, 13, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(w - bw, earCy, 8, 13, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = theme.textColor;
      drawPawMini(ctx, cx, h - bw - 10, 8);
    }

    if (theme.cornerDecorType === "bunny") {
      var bunnyCy = 16;
      ctx.fillStyle = theme.borderColor;
      ctx.beginPath();
      ctx.ellipse(cx - 8, bunnyCy, 4, 14, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 8, bunnyCy, 4, 14, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffb6c1";
      ctx.beginPath();
      ctx.ellipse(cx - 8, bunnyCy + 1, 2, 9, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 8, bunnyCy + 1, 2, 9, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, h - bw - 6, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = theme.borderColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (theme.cornerDecorType === "panda") {
      var pandaCy = 10;
      ctx.fillStyle = "#333333";
      ctx.beginPath();
      ctx.arc(bw + 4, pandaCy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(w - bw - 4, pandaCy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(bw + 6, h - bw - 8, 6, 4, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(w - bw - 6, h - bw - 8, 6, 4, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    if (theme.cornerDecorType === "frog") {
      var frogCy = 9;
      ctx.fillStyle = theme.borderColor;
      ctx.beginPath();
      ctx.arc(cx - 9, frogCy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 9, frogCy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx - 9, frogCy - 1, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 9, frogCy - 1, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#333333";
      ctx.beginPath();
      ctx.arc(cx - 9, frogCy - 1, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 9, frogCy - 1, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
