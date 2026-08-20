/**
 * Review/export composite — ported from photobooth-v2/components/photobooth/review-screen.tsx
 */
(function (global) {
  function drawAnimalDecorations(ctx, theme, canvasWidth, canvasHeight, borderWidth, captionHeight) {
    var contentHeight = canvasHeight - captionHeight;

    if (theme.cornerDecorType === "cat") {
      ctx.fillStyle = theme.borderColor;
      ctx.beginPath();
      ctx.moveTo(borderWidth - 10, borderWidth);
      ctx.lineTo(borderWidth + 20, borderWidth);
      ctx.lineTo(borderWidth + 5, borderWidth - 35);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ffb6c1";
      ctx.beginPath();
      ctx.moveTo(borderWidth - 2, borderWidth);
      ctx.lineTo(borderWidth + 14, borderWidth);
      ctx.lineTo(borderWidth + 6, borderWidth - 20);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = theme.borderColor;
      ctx.beginPath();
      ctx.moveTo(canvasWidth - borderWidth + 10, borderWidth);
      ctx.lineTo(canvasWidth - borderWidth - 20, borderWidth);
      ctx.lineTo(canvasWidth - borderWidth - 5, borderWidth - 35);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ffb6c1";
      ctx.beginPath();
      ctx.moveTo(canvasWidth - borderWidth + 2, borderWidth);
      ctx.lineTo(canvasWidth - borderWidth - 14, borderWidth);
      ctx.lineTo(canvasWidth - borderWidth - 6, borderWidth - 20);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = theme.textColor;
      ctx.lineWidth = 1.5;
      var whiskerY = contentHeight - borderWidth / 2;
      ctx.beginPath();
      ctx.moveTo(borderWidth, whiskerY);
      ctx.lineTo(borderWidth - 25, whiskerY - 8);
      ctx.moveTo(borderWidth, whiskerY + 5);
      ctx.lineTo(borderWidth - 25, whiskerY + 5);
      ctx.moveTo(borderWidth, whiskerY + 10);
      ctx.lineTo(borderWidth - 25, whiskerY + 18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(canvasWidth - borderWidth, whiskerY);
      ctx.lineTo(canvasWidth - borderWidth + 25, whiskerY - 8);
      ctx.moveTo(canvasWidth - borderWidth, whiskerY + 5);
      ctx.lineTo(canvasWidth - borderWidth + 25, whiskerY + 5);
      ctx.moveTo(canvasWidth - borderWidth, whiskerY + 10);
      ctx.lineTo(canvasWidth - borderWidth + 25, whiskerY + 18);
      ctx.stroke();
    }

    if (theme.cornerDecorType === "dog") {
      ctx.fillStyle = theme.borderColor;
      ctx.beginPath();
      ctx.ellipse(borderWidth, borderWidth + 20, 25, 40, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(canvasWidth - borderWidth, borderWidth + 20, 25, 40, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = theme.textColor;
      function drawPaw(x, y, size) {
        ctx.beginPath();
        ctx.ellipse(x, y, size * 0.6, size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        [[-size * 0.5, -size * 0.6], [-size * 0.15, -size * 0.8], [size * 0.15, -size * 0.8], [size * 0.5, -size * 0.6]].forEach(function (off) {
          ctx.beginPath();
          ctx.ellipse(x + off[0], y + off[1], size * 0.2, size * 0.25, 0, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      drawPaw(borderWidth / 2, contentHeight - borderWidth / 2, 12);
      drawPaw(canvasWidth - borderWidth / 2, contentHeight - borderWidth / 2, 12);
    }

    if (theme.cornerDecorType === "bunny") {
      ctx.fillStyle = theme.borderColor;
      var centerX = canvasWidth / 2;
      ctx.beginPath();
      ctx.ellipse(centerX - 15, borderWidth - 30, 12, 45, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffb6c1";
      ctx.beginPath();
      ctx.ellipse(centerX - 15, borderWidth - 25, 6, 30, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = theme.borderColor;
      ctx.beginPath();
      ctx.ellipse(centerX + 15, borderWidth - 30, 12, 45, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffb6c1";
      ctx.beginPath();
      ctx.ellipse(centerX + 15, borderWidth - 25, 6, 30, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(centerX, contentHeight + 5, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = theme.borderColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (theme.cornerDecorType === "panda") {
      ctx.fillStyle = "#333333";
      ctx.beginPath();
      ctx.arc(borderWidth + 5, borderWidth - 10, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(canvasWidth - borderWidth - 5, borderWidth - 10, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#333333";
      ctx.beginPath();
      ctx.ellipse(borderWidth + 10, contentHeight - borderWidth / 2, 15, 10, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(canvasWidth - borderWidth - 10, contentHeight - borderWidth / 2, 15, 10, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    if (theme.cornerDecorType === "frog") {
      var cx = canvasWidth / 2;
      ctx.fillStyle = theme.borderColor;
      ctx.beginPath();
      ctx.arc(cx - 20, borderWidth - 15, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 20, borderWidth - 15, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx - 20, borderWidth - 18, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 20, borderWidth - 18, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#333333";
      ctx.beginPath();
      ctx.arc(cx - 20, borderWidth - 18, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 20, borderWidth - 18, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = theme.borderColor;
      ctx.globalAlpha = 0.3;
      for (var i = 0; i < 8; i++) {
        var x = (canvasWidth / 8) * i + canvasWidth / 16;
        ctx.beginPath();
        ctx.ellipse(x, contentHeight + 5, 20, 10, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }

  function drawHeart(ctx, cx, cy, decorSize) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + decorSize / 4);
    ctx.bezierCurveTo(cx, cy, cx - decorSize / 2, cy, cx - decorSize / 2, cy + decorSize / 4);
    ctx.bezierCurveTo(cx - decorSize / 2, cy + decorSize / 2, cx, cy + decorSize * 0.75, cx, cy + decorSize);
    ctx.bezierCurveTo(cx, cy + decorSize * 0.75, cx + decorSize / 2, cy + decorSize / 2, cx + decorSize / 2, cy + decorSize / 4);
    ctx.bezierCurveTo(cx + decorSize / 2, cy, cx, cy, cx, cy + decorSize / 4);
    ctx.fill();
  }

  function getCanvasDimensions(layout, theme, caption, includeStamp) {
    var photoSize = 300;
    var borderWidth = theme.borderWidth;
    var captionHeight = caption ? 40 : 0;
    var stampSpace = includeStamp ? 80 : 0;
    var contentWidth = photoSize * layout.cols + (layout.cols - 1) * 8;
    var contentHeight = photoSize * layout.rows + (layout.rows - 1) * 8;
    return {
      width: contentWidth + borderWidth * 2,
      height: contentHeight + borderWidth * 2 + captionHeight + stampSpace,
      photoSize: photoSize,
      borderWidth: borderWidth,
      captionHeight: captionHeight,
      stampSpace: stampSpace,
      contentWidth: contentWidth,
      contentHeight: contentHeight,
    };
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} options
   */
  global.PB_drawComposite = function (canvas, options) {
    return new Promise(function (resolve, reject) {
      var photos = options.photos;
      var layout = options.layout;
      var theme = options.theme;
      var caption = options.caption || "";
      var stickers = options.stickers || [];
      var selectedFilter = options.selectedFilter || "none";
      var includeStamp = options.includeStamp !== false;
      var includeStickers = options.includeStickers !== false;
      var selectedStickerId = options.selectedStickerId || null;

      var filterObj = global.PB_DATA.FILTERS.find(function (f) {
        return f.id === selectedFilter;
      });
      var filterCss = filterObj && filterObj.cssFilter !== "none" ? filterObj.cssFilter : "none";

      var dims = getCanvasDimensions(layout, theme, caption, includeStamp);
      var ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("no context"));
        return;
      }

      canvas.width = dims.width;
      canvas.height = dims.height;

      ctx.fillStyle = theme.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (theme.id === "party-confetti") {
        var confettiColors = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#95e1d3", "#f38181"];
        for (var c = 0; c < 100; c++) {
          ctx.fillStyle = confettiColors[c % confettiColors.length];
          ctx.beginPath();
          ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 4 + 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      var loadPromises = photos.map(function (src) {
        return new Promise(function (res) {
          var img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = function () {
            res(img);
          };
          img.onerror = function () {
            res(null);
          };
          img.src = src;
        });
      });

      Promise.all(loadPromises)
        .then(function (loadedPhotos) {
          if (filterCss !== "none") ctx.filter = filterCss;

          loadedPhotos.forEach(function (img, index) {
            if (!img) return;
            var col = index % layout.cols;
            var row = Math.floor(index / layout.cols);
            var x = dims.borderWidth + col * (dims.photoSize + 8);
            var y = dims.borderWidth + row * (dims.photoSize + 8);
            var imgAspect = img.width / img.height;
            var boxAspect = 1;
            var srcX = 0;
            var srcY = 0;
            var srcW = img.width;
            var srcH = img.height;
            if (imgAspect > boxAspect) {
              srcW = img.height;
              srcX = (img.width - srcW) / 2;
            } else {
              srcH = img.width;
              srcY = (img.height - srcH) / 2;
            }
            ctx.drawImage(img, srcX, srcY, srcW, srcH, x, y, dims.photoSize, dims.photoSize);
          });

          ctx.filter = "none";

          if (theme.hasCornerDecor && theme.cornerDecorType === "rule") {
            ctx.strokeStyle = theme.textColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(dims.borderWidth - 4, dims.borderWidth - 4, dims.contentWidth + 8, dims.contentHeight + 8);
          }

          if (theme.hasCornerDecor) {
            var decorSize = 16;
            if (theme.cornerDecorType === "hearts") {
              ctx.fillStyle = theme.textColor;
              drawHeart(ctx, dims.borderWidth / 2, dims.borderWidth / 2 - decorSize / 2, decorSize);
              drawHeart(ctx, canvas.width - dims.borderWidth / 2, dims.borderWidth / 2 - decorSize / 2, decorSize);
              drawHeart(ctx, dims.borderWidth / 2, dims.contentHeight + dims.borderWidth - decorSize, decorSize);
              drawHeart(ctx, canvas.width - dims.borderWidth / 2, dims.contentHeight + dims.borderWidth - decorSize, decorSize);
            }
            if (theme.cornerDecorType === "leaves") {
              ctx.fillStyle = theme.textColor;
              function drawLeaf(x, y, rot) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate((rot * Math.PI) / 180);
                ctx.beginPath();
                ctx.ellipse(0, 0, decorSize / 2, decorSize, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
              }
              drawLeaf(dims.borderWidth / 2 + 4, dims.borderWidth / 2 + 4, 45);
              drawLeaf(canvas.width - dims.borderWidth / 2 - 4, dims.borderWidth / 2 + 4, 135);
              drawLeaf(dims.borderWidth / 2 + 4, dims.contentHeight + dims.borderWidth - 4, -45);
              drawLeaf(canvas.width - dims.borderWidth / 2 - 4, dims.contentHeight + dims.borderWidth - 4, -135);
            }
            if (theme.cornerDecorType === "scalloped") {
              ctx.strokeStyle = theme.textColor;
              ctx.lineWidth = 2;
              var scallops = 20;
              var topY = dims.borderWidth / 2;
              var bottomY = dims.contentHeight + dims.borderWidth + dims.borderWidth / 2;
              for (var i = 0; i < scallops; i++) {
                var x2 = (canvas.width / scallops) * (i + 0.5);
                ctx.beginPath();
                ctx.arc(x2, topY, canvas.width / scallops / 4, 0, Math.PI);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(x2, bottomY, canvas.width / scallops / 4, Math.PI, 0);
                ctx.stroke();
              }
            }
            if (theme.isAnimalTheme && theme.cornerDecorType) {
              drawAnimalDecorations(ctx, theme, canvas.width, canvas.height - dims.stampSpace, dims.borderWidth, dims.captionHeight);
            }
          }

          if (caption || theme.labelStyle !== "none") {
            var labelText =
              caption ||
              (theme.labelStyle === "kodak" ? "KODAK 400" : new Date().toLocaleDateString());
            ctx.fillStyle = theme.textColor;
            ctx.font = theme.labelStyle === "kodak" ? "bold 14px monospace" : "14px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(labelText, canvas.width / 2, dims.contentHeight + dims.borderWidth * 2 + 20);
          }

          if (includeStickers) {
            global.PB_drawPlacedStickers(ctx, stickers, selectedStickerId);
          }

          if (includeStamp) {
            try {
              var stampR = 34;
              var stampX = canvas.width - stampR - 20;
              var stampY = canvas.height - stampR - 20;
              ctx.save();
              ctx.fillStyle = theme.backgroundColor;
              ctx.beginPath();
              ctx.arc(stampX, stampY, stampR, 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = theme.textColor;
              ctx.lineWidth = 1.5;
              var scallopCount = 16;
              var scallopR = 3.5;
              for (var sc2 = 0; sc2 < scallopCount; sc2++) {
                var ang = (sc2 / scallopCount) * Math.PI * 2;
                ctx.beginPath();
                ctx.arc(stampX + Math.cos(ang) * stampR, stampY + Math.sin(ang) * stampR, scallopR, 0, Math.PI * 2);
                ctx.stroke();
              }
              ctx.beginPath();
              ctx.arc(stampX, stampY, stampR - 6, 0, Math.PI * 2);
              ctx.stroke();
              ctx.fillStyle = theme.textColor;
              drawHeart(ctx, stampX, stampY - stampR * 0.55, 8);
              var stampDate = new Date();
              var stampMonths = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
              ctx.font = "bold 10px sans-serif";
              ctx.textAlign = "center";
              ctx.fillText(String(stampDate.getDate()), stampX, stampY + 1);
              ctx.font = "8px sans-serif";
              ctx.fillText(stampMonths[stampDate.getMonth()] + " " + stampDate.getFullYear(), stampX, stampY + 13);
              ctx.restore();
            } catch (e) {
              console.error(e);
            }
          }

          resolve();
        })
        .catch(reject);
    });
  };

  global.PB_getCanvasDimensions = getCanvasDimensions;
})(typeof window !== "undefined" ? window : globalThis);
