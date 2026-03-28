/**
 * Cute Photo Booth — full app (layout → theme → capture → review)
 * Parity with photobooth-v2 (JavaScript, no TypeScript).
 */
(function () {
  "use strict";

  var D = window.PB_DATA;
  var Sound = window.PB_Sound;

  var state = {
    screen: "layout",
    layoutId: "classic-strip",
    themeId: "pastel-pink",
    caption: "",
    photos: [],
    orderedPhotos: [],
    captureFilter: "none",
    stickerFrame: "none",
    countdownDuration: 5,
    reviewFilter: "none",
    stickers: [],
    placingSticker: null,
    includeQR: true,
    isCapturing: false,
    stream: null,
    draggedPhotoIndex: null,
    draggingStickerId: null,
    stickerOffset: { x: 0, y: 0 },
  };

  var hiddenCanvas = document.createElement("canvas");
  var hiddenCtx = hiddenCanvas.getContext("2d");

  function $(id) {
    return document.getElementById(id);
  }

  function showScreen(name) {
    state.screen = name;
    ["layout", "theme", "capture", "review"].forEach(function (s) {
      var el = $("screen-" + s);
      if (el) el.classList.toggle("hidden", s !== name);
    });
    document.querySelectorAll(".pb-step").forEach(function (step) {
      var steps = ["layout", "theme", "capture", "review"];
      var i = steps.indexOf(name);
      var si = steps.indexOf(step.getAttribute("data-step"));
      step.classList.remove("active", "done");
      if (si === i) step.classList.add("active");
      else if (si < i) step.classList.add("done");
    });
  }

  function getLayout() {
    return window.PB_findLayout(state.layoutId);
  }

  function getTheme() {
    return window.PB_findTheme(state.themeId);
  }

  /* ---------- Layout ---------- */
  function renderLayoutGrid() {
    var grid = $("layout-grid");
    grid.innerHTML = "";
    D.LAYOUTS.forEach(function (layout) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pb-layout-card" + (state.layoutId === layout.id ? " selected" : "");
      btn.setAttribute("aria-pressed", state.layoutId === layout.id);
      var thumb = document.createElement("div");
      thumb.className = "pb-layout-thumb";
      thumb.style.display = "grid";
      thumb.style.gridTemplateColumns = "repeat(" + layout.cols + ", 1fr)";
      thumb.style.gridTemplateRows = "repeat(" + layout.rows + ", 1fr)";
      thumb.style.gap = "4px";
      for (var i = 0; i < layout.slots; i++) {
        var cell = document.createElement("div");
        cell.className = "pb-layout-cell";
        thumb.appendChild(cell);
      }
      var title = document.createElement("strong");
      title.textContent = layout.name;
      var desc = document.createElement("span");
      desc.className = "pb-layout-desc";
      desc.textContent = layout.description;
      btn.appendChild(thumb);
      btn.appendChild(title);
      btn.appendChild(desc);
      btn.addEventListener("click", function () {
        state.layoutId = layout.id;
        renderLayoutGrid();
      });
      grid.appendChild(btn);
    });
  }

  /* ---------- Theme ---------- */
  function renderThemeGrids() {
    var classic = $("theme-grid-classic");
    var animal = $("theme-grid-animal");
    classic.innerHTML = "";
    animal.innerHTML = "";
    D.THEMES.forEach(function (theme) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pb-theme-card" + (state.themeId === theme.id ? " selected" : "");
      var prev = document.createElement("div");
      prev.className = "pb-theme-preview";
      prev.style.background = theme.backgroundColor;
      prev.style.border = "3px solid " + theme.borderColor;
      btn.appendChild(prev);
      var label = document.createElement("span");
      label.textContent = theme.name;
      btn.appendChild(label);
      btn.addEventListener("click", function () {
        state.themeId = theme.id;
        renderThemeGrids();
      });
      if (theme.isAnimalTheme) animal.appendChild(btn);
      else classic.appendChild(btn);
    });
  }

  /* ---------- Capture ---------- */
  function stopCamera() {
    if (state.stream) {
      state.stream.getTracks().forEach(function (t) {
        t.stop();
      });
      state.stream = null;
    }
    var v = $("capture-video");
    if (v) v.srcObject = null;
  }

  function startCamera() {
    var loading = $("capture-loading");
    var err = $("capture-error");
    if (loading) loading.classList.remove("hidden");
    if (err) err.classList.add("hidden");
    stopCamera();
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      .then(function (stream) {
        state.stream = stream;
        var v = $("capture-video");
        v.srcObject = stream;
        v.onloadedmetadata = function () {
          v.play();
          if (loading) loading.classList.add("hidden");
          syncVideoFilter();
        };
      })
      .catch(function () {
        if (loading) loading.classList.add("hidden");
        if (err) err.classList.remove("hidden");
      });
  }

  function syncVideoFilter() {
    var v = $("capture-video");
    if (v) v.style.filter = window.PB_getFilterCss(state.captureFilter);
  }

  function renderCaptureFilters() {
    var row = $("capture-filters");
    row.innerHTML = '<span class="pb-label">Filter</span>';
    D.QUICK_FILTER_IDS.forEach(function (fid) {
      var f = D.FILTERS.find(function (x) {
        return x.id === fid;
      });
      if (!f) return;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "filter-btn" + (state.captureFilter === fid ? " active" : "");
      b.setAttribute("aria-pressed", state.captureFilter === fid);
      b.dataset.filter = fid;
      b.innerHTML =
        '<span class="filter-swatch filter-swatch-' +
        fid +
        '"></span><span class="filter-label">' +
        f.name +
        "</span>";
      b.addEventListener("click", function () {
        state.captureFilter = fid;
        row.querySelectorAll(".filter-btn").forEach(function (el) {
          el.classList.toggle("active", el.dataset.filter === fid);
          el.setAttribute("aria-pressed", el.dataset.filter === fid);
        });
        syncVideoFilter();
      });
      row.appendChild(b);
    });
  }

  function renderCaptureStickerRow() {
    var row = $("capture-stickers");
    row.innerHTML = '<span class="pb-label">Stickers</span>';
    D.STICKER_FRAME_OPTIONS.forEach(function (opt) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "frame-btn" + (state.stickerFrame === opt.id ? " active" : "");
      b.textContent = opt.emoji + " " + opt.label;
      b.addEventListener("click", function () {
        state.stickerFrame = opt.id;
        row.querySelectorAll(".frame-btn").forEach(function (el, i) {
          el.classList.toggle("active", D.STICKER_FRAME_OPTIONS[i].id === state.stickerFrame);
        });
      });
      row.appendChild(b);
    });
  }

  function captureOnePhoto() {
    var v = $("capture-video");
    if (!v || !v.srcObject || v.readyState < 2) return null;
    var w = v.videoWidth;
    var h = v.videoHeight;
    hiddenCanvas.width = w;
    hiddenCanvas.height = h;
    var ctx = hiddenCtx;
    ctx.save();
    ctx.filter = window.PB_getFilterCss(state.captureFilter);
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0, w, h);
    ctx.restore();
    if (state.stickerFrame !== "none") {
      window.PB_drawStickerCorners(ctx, w, h, state.stickerFrame);
    }
    return hiddenCanvas.toDataURL("image/png");
  }

  function runCountdown(duration) {
    return new Promise(function (resolve) {
      var c = duration;
      var el = $("capture-countdown");
      function tick() {
        if (c <= 0) {
          el.classList.add("hidden");
          resolve();
          return;
        }
        el.textContent = String(c);
        el.classList.remove("hidden");
        c--;
        setTimeout(tick, 1000);
      }
      tick();
    });
  }

  function flashAndCheese() {
    var f = $("capture-flash");
    var ch = $("capture-cheese");
    if (f) {
      f.classList.remove("hidden");
      setTimeout(function () {
        f.classList.add("hidden");
      }, 150);
    }
    setTimeout(function () {
      if (ch) {
        ch.classList.remove("hidden");
        setTimeout(function () {
          ch.classList.add("hidden");
        }, 700);
      }
    }, 160);
  }

  function updateCaptureUI() {
    var layout = getLayout();
    var sub = $("capture-subtitle");
    var thumbs = $("capture-thumbs");
    var btnStart = $("btn-start-sequence");
    var btnNext = $("btn-capture-next");
    if (sub) {
      sub.textContent =
        "Take " +
        layout.slots +
        " photo" +
        (layout.slots > 1 ? "s" : "") +
        " — timer " +
        state.countdownDuration +
        "s";
    }
    thumbs.innerHTML = "";
    state.photos.forEach(function (url, i) {
      var img = document.createElement("img");
      img.src = url;
      img.alt = "Photo " + (i + 1);
      thumbs.appendChild(img);
    });
    var complete = state.photos.length >= layout.slots;
    if (btnStart) {
      var camErr = $("capture-error");
      var hasCamErr = camErr && !camErr.classList.contains("hidden");
      btnStart.disabled = state.isCapturing || hasCamErr;
      btnStart.classList.toggle("hidden", complete);
    }
    if (btnNext) btnNext.classList.toggle("hidden", !complete);
  }

  async function runCaptureSequence() {
    var layout = getLayout();
    state.isCapturing = true;
    state.photos = [];
    updateCaptureUI();
    for (var i = 0; i < layout.slots; i++) {
      await runCountdown(state.countdownDuration);
      Sound.playShutterClick();
      flashAndCheese();
      var dataUrl = captureOnePhoto();
      if (dataUrl) state.photos.push(dataUrl);
      updateCaptureUI();
      if (i < layout.slots - 1) await new Promise(function (r) { setTimeout(r, 500); });
    }
    state.isCapturing = false;
    updateCaptureUI();
  }

  /* ---------- Review ---------- */
  function redrawComposite() {
    return window.PB_drawComposite($("review-canvas"), {
      photos: state.orderedPhotos.slice(0, getLayout().slots),
      layout: getLayout(),
      theme: getTheme(),
      caption: state.caption,
      stickers: state.stickers,
      selectedFilter: state.reviewFilter,
      includeQR: state.includeQR,
      includeStickers: true,
    }).catch(function (e) {
      console.error(e);
    });
  }

  function renderReviewFilters() {
    var wrap = $("review-filters");
    wrap.innerHTML = "";
    D.FILTERS.forEach(function (f) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pb-filter-chip" + (state.reviewFilter === f.id ? " active" : "");
      b.textContent = f.name;
      b.addEventListener("click", function () {
        state.reviewFilter = f.id;
        renderReviewFilters();
        redrawComposite();
      });
      wrap.appendChild(b);
    });
  }

  function renderStickerPalette() {
    var wrap = $("review-sticker-palette");
    wrap.innerHTML = "<strong>Add stickers</strong><div class=\"pb-sticker-row\"></div>";
    var row = wrap.querySelector(".pb-sticker-row");
    function addChip(text, isText) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pb-sticker-chip";
      b.textContent = text;
      b.addEventListener("click", function () {
        state.placingSticker = text;
        $("review-place-hint").classList.remove("hidden");
        $("review-preview-wrap").classList.add("pb-crosshair");
      });
      row.appendChild(b);
    }
    D.STICKERS.symbols.forEach(function (s) { addChip(s); });
    D.STICKERS.text.forEach(function (s) { addChip(s, true); });
    var d = new Date();
    var months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    addChip(d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear());
    D.STICKERS.seasonal.forEach(function (s) { addChip(s); });
  }

  function renderPhotoList() {
    var ul = $("review-photo-list");
    ul.innerHTML = "";
    state.orderedPhotos.forEach(function (url, index) {
      var li = document.createElement("li");
      li.draggable = true;
      li.dataset.index = String(index);
      li.innerHTML =
        '<span class="pb-drag">⋮⋮</span><img src="' +
        url +
        '" alt=""><span>Photo ' +
        (index + 1) +
        "</span>";
      li.addEventListener("dragstart", function () {
        state.draggedPhotoIndex = index;
      });
      li.addEventListener("dragover", function (e) {
        e.preventDefault();
        var from = state.draggedPhotoIndex;
        if (from === null || from === index) return;
        var arr = state.orderedPhotos.slice();
        var item = arr.splice(from, 1)[0];
        arr.splice(index, 0, item);
        state.orderedPhotos = arr;
        state.draggedPhotoIndex = index;
        renderPhotoList();
      });
      li.addEventListener("dragend", function () {
        state.draggedPhotoIndex = null;
        redrawComposite();
      });
      ul.appendChild(li);
    });
  }

  function setupReviewCanvasClick() {
    var wrap = $("review-preview-wrap");
    var hint = $("review-place-hint");
    wrap.onclick = function (e) {
      if (!state.placingSticker) return;
      var canvas = $("review-canvas");
      var rect = canvas.getBoundingClientRect();
      var scaleX = canvas.width / rect.width;
      var scaleY = canvas.height / rect.height;
      var x = (e.clientX - rect.left) * scaleX;
      var y = (e.clientY - rect.top) * scaleY;
      state.stickers.push({
        id: "s-" + Date.now(),
        content: state.placingSticker,
        x: x,
        y: y,
        size: 40,
      });
      state.placingSticker = null;
      hint.classList.add("hidden");
      $("review-preview-wrap").classList.remove("pb-crosshair");
      redrawComposite();
    };
  }

  function downloadPNG() {
    redrawComposite().then(function () {
      Sound.playExportChime();
      var canvas = $("review-canvas");
      var link = document.createElement("a");
      link.download = "photobooth-" + new Date().toISOString().slice(0, 10) + ".png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  }

  function downloadPDF() {
    redrawComposite().then(function () {
      Sound.playExportChime();
      var dataUrl = $("review-canvas").toDataURL("image/png");
    var w = window.open("", "_blank");
    if (w) {
      w.document.write(
        "<!DOCTYPE html><html><head><title>Print</title><style>@page{margin:0.5in}body{display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0}img{max-width:100%;max-height:100%}</style></head><body><img src=\"" +
          dataUrl +
          '"><script>onload=function(){print()}<\/script></body></html>'
      );
      w.document.close();
    }
    });
  }

  function loadGifJs() {
    return new Promise(function (resolve, reject) {
      if (window.GIF) return resolve(window.GIF);
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.js";
      s.onload = function () { resolve(window.GIF); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function downloadGIF() {
    var status = $("gif-status");
    var layout = getLayout();
    var theme = getTheme();
    status.textContent = "Creating GIF…";
    status.classList.remove("hidden");
    loadGifJs()
      .then(function (GIF) {
        var dims = window.PB_getCanvasDimensions(layout, theme, state.caption, state.includeQR);
        var photos = state.orderedPhotos.slice(0, layout.slots);
        var filter = D.FILTERS.find(function (f) {
          return f.id === state.reviewFilter;
        });
        var w = Math.min(400, dims.width);
        var h = Math.round((w / dims.width) * dims.height);
        var gif = new GIF({
          workers: 2,
          quality: 10,
          width: w,
          height: h,
          workerScript: "https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js",
        });
        gif.on("progress", function (p) {
          status.textContent = "GIF " + Math.round(p * 100) + "%";
        });
        gif.on("finished", function (blob) {
          status.classList.add("hidden");
          Sound.playExportChime();
          var link = document.createElement("a");
          link.download = "photobooth-" + new Date().toISOString().slice(0, 10) + ".gif";
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        });
        var i = 0;
        function addNext() {
          if (i >= photos.length) {
            gif.render();
            return;
          }
          var img = new Image();
          img.onload = function () {
            var fc = document.createElement("canvas");
            fc.width = dims.width;
            fc.height = dims.height;
            var fctx = fc.getContext("2d");
            fctx.fillStyle = theme.backgroundColor;
            fctx.fillRect(0, 0, fc.width, fc.height);
            if (filter && filter.cssFilter !== "none") fctx.filter = filter.cssFilter;
            var imgAspect = img.width / img.height;
            var srcX = 0,
              srcY = 0,
              srcW = img.width,
              srcH = img.height;
            if (imgAspect > 1) {
              srcW = img.height;
              srcX = (img.width - srcW) / 2;
            } else {
              srcH = img.width;
              srcY = (img.height - srcH) / 2;
            }
            fctx.drawImage(img, srcX, srcY, srcW, srcH, dims.borderWidth, dims.borderWidth, dims.photoSize, dims.photoSize);
            fctx.filter = "none";
            state.stickers.forEach(function (st) {
              fctx.font = st.size + "px sans-serif";
              fctx.textAlign = "center";
              fctx.textBaseline = "middle";
              fctx.fillText(st.content, st.x, st.y);
            });
            var sc = document.createElement("canvas");
            sc.width = w;
            sc.height = h;
            sc.getContext("2d").drawImage(fc, 0, 0, w, h);
            gif.addFrame(sc, { delay: 600 });
            i++;
            status.textContent = "Frames " + i + "/" + photos.length;
            addNext();
          };
          img.onerror = function () {
            status.textContent = "GIF failed loading image";
          };
          img.src = photos[i];
        }
        addNext();
      })
      .catch(function () {
        status.textContent = "GIF failed — check network for gif.js";
      });
  }

  /* ---------- Wire ---------- */
  function init() {
    $("btn-mute").addEventListener("click", function () {
      var m = Sound.toggleMute();
      $("btn-mute").textContent = m ? "🔇" : "🔊";
    });
    $("btn-mute").textContent = Sound.isMuted ? "🔇" : "🔊";

    renderLayoutGrid();
    $("btn-layout-next").addEventListener("click", function () {
      showScreen("theme");
      renderThemeGrids();
    });

    $("btn-theme-back").addEventListener("click", function () {
      showScreen("layout");
    });
    $("btn-theme-next").addEventListener("click", function () {
      showScreen("capture");
      state.photos = [];
      state.caption = ($("caption-input") && $("caption-input").value) || "";
      renderCaptureFilters();
      renderCaptureStickerRow();
      $("capture-countdown").classList.add("hidden");
      updateCaptureUI();
      startCamera();
    });

    $("caption-input").addEventListener("input", function () {
      $("caption-len").textContent = String($("caption-input").value.length);
      state.caption = $("caption-input").value.slice(0, 30);
    });

    document.querySelectorAll(".pb-timer-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.countdownDuration = parseInt(btn.getAttribute("data-duration"), 10);
        document.querySelectorAll(".pb-timer-btn").forEach(function (b) {
          b.classList.toggle("active", b === btn);
        });
        updateCaptureUI();
      });
    });

    $("btn-retry-camera").addEventListener("click", startCamera);

    $("btn-capture-back").addEventListener("click", function () {
      stopCamera();
      showScreen("theme");
    });

    $("btn-start-sequence").addEventListener("click", function () {
      runCaptureSequence();
    });

    $("btn-capture-next").addEventListener("click", function () {
      stopCamera();
      state.orderedPhotos = state.photos.slice();
      state.stickers = [];
      state.reviewFilter = "none";
      state.placingSticker = null;
      showScreen("review");
      renderReviewFilters();
      renderStickerPalette();
      renderPhotoList();
      setupReviewCanvasClick();
      $("review-include-qr").checked = true;
      state.includeQR = true;
      $("review-include-qr").onchange = function () {
        state.includeQR = this.checked;
        redrawComposite();
      };
      setTimeout(redrawComposite, 100);
    });

    $("btn-review-back").addEventListener("click", function () {
      showScreen("capture");
      startCamera();
      updateCaptureUI();
    });

    $("btn-png").addEventListener("click", downloadPNG);
    $("btn-pdf").addEventListener("click", downloadPDF);
    $("btn-gif").addEventListener("click", downloadGIF);
    $("btn-start-over").addEventListener("click", function () {
      state.photos = [];
      state.orderedPhotos = [];
      state.stickers = [];
      state.caption = "";
      if ($("caption-input")) $("caption-input").value = "";
      if ($("caption-len")) $("caption-len").textContent = "0";
      showScreen("layout");
      renderLayoutGrid();
    });

    showScreen("layout");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
