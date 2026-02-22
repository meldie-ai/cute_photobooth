/**
 * Cute Photo Booth - Main script
 * Handles camera, capture, frames, download, and UI feedback.
 */

// ============ Constants & Variables ============
const video = document.getElementById('video');
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

let capturedImageDataUrl = null;
let currentFrame = null;

// DOM elements
const captureBtn = document.getElementById('capture-btn');
const downloadBtn = document.getElementById('download-btn');
const capturedImageEl = document.getElementById('captured-image');
const noPhotoYet = document.getElementById('no-photo-yet');
const cameraLoading = document.getElementById('camera-loading');
const cameraError = document.getElementById('camera-error');
const cheesePopup = document.getElementById('cheese-popup');
const frameButtons = document.querySelectorAll('.frame-btn');

// ============ Camera ============

/**
 * Initialize the camera using getUserMedia.
 * Shows loading state, then video or error.
 */
function initCamera() {
  const constraints = { video: { facingMode: 'user' }, audio: false };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
        hideLoading();
      };
    })
    .catch((err) => {
      console.warn('Camera error:', err);
      hideLoading();
      showError();
    });
}

function hideLoading() {
  if (cameraLoading) cameraLoading.classList.add('hidden');
}

function showError() {
  if (cameraError) cameraError.classList.remove('hidden');
}

// ============ Capture ============

/**
 * Take a photo from the video feed, optionally with frame overlay.
 * Shows "Cheese!" popup, plays sound, enables download.
 */
function takePhoto() {
  if (!video.srcObject || video.readyState < 2) return;

  // Set canvas to video dimensions
  const w = video.videoWidth;
  const h = video.videoHeight;
  canvas.width = w;
  canvas.height = h;

  // Draw current video frame mirrored (like a selfie mirror)
  context.save();
  context.translate(w, 0);
  context.scale(-1, 1);
  context.drawImage(video, 0, 0, w, h);
  context.restore();

  // If a frame (sticker theme) is selected, draw simple stickers on top
  if (currentFrame) {
    drawStickers(currentFrame, w, h);
  }

  // Convert to data URL and display
  capturedImageDataUrl = canvas.toDataURL('image/png');

  capturedImageEl.src = capturedImageDataUrl;
  capturedImageEl.classList.remove('hidden');
  if (noPhotoYet) noPhotoYet.classList.add('hidden');
  downloadBtn.disabled = false;

  // Cute touches: sound + cheese popup + button animation
  playSound();
  showCheesePopup();
  animateCaptureButton();
}

function showCheesePopup() {
  if (!cheesePopup) return;
  cheesePopup.classList.remove('hidden');
  cheesePopup.offsetHeight; // reflow
  setTimeout(() => cheesePopup.classList.add('hidden'), 1000);
}

function animateCaptureButton() {
  if (!captureBtn) return;
  captureBtn.style.transform = 'scale(0.95)';
  setTimeout(() => {
    captureBtn.style.transform = '';
  }, 150);
}

// ============ Download ============

/**
 * Download the latest captured photo as PNG.
 * Filename: cute-photo-{timestamp}.png
 */
function downloadPhoto() {
  if (!capturedImageDataUrl) return;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `cute-photo-${timestamp}.png`;

  const link = document.createElement('a');
  link.href = capturedImageDataUrl;
  link.download = filename;
  link.click();
}

// ============ Frames ============

/**
 * Set the current frame (flower, star, heart).
 * Toggle off if the same frame is clicked again.
 */
function setFrame(frameName) {
  const sameFrame = currentFrame === frameName;
  currentFrame = sameFrame ? null : frameName;

  // Update active state on buttons
  frameButtons.forEach((btn) => {
    const isActive = btn.dataset.frame === currentFrame;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });
}

// Draw simple shape stickers (flowers / stars / hearts) on the photo — no emoji, so they render on canvas
function drawStickers(frameName, width, height) {
  context.save();

  const pad = width * 0.08;
  const size = Math.min(width, height) * 0.14;
  const positions = [
    [pad + size, pad + size],
    [width - pad - size, pad + size],
    [pad + size, height - pad - size],
    [width - pad - size, height - pad - size],
  ];

  positions.forEach(([x, y]) => {
    if (frameName === 'flower') drawFlower(x, y, size);
    else if (frameName === 'star') drawStar(x, y, size);
    else if (frameName === 'heart') drawHeart(x, y, size);
  });

  context.restore();
}

function drawFlower(x, y, size) {
  const r = size * 0.5;
  const petalR = size * 0.35;
  context.fillStyle = 'rgba(255, 182, 193, 0.95)';
  context.strokeStyle = 'rgba(255, 105, 180, 0.6)';
  context.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const px = x + Math.cos(a) * r * 0.7;
    const py = y + Math.sin(a) * r * 0.7;
    context.beginPath();
    context.arc(px, py, petalR, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }
  context.fillStyle = 'rgba(255, 255, 200, 0.95)';
  context.beginPath();
  context.arc(x, y, petalR * 0.6, 0, Math.PI * 2);
  context.fill();
  context.stroke();
}

function drawStar(x, y, size) {
  const outer = size;
  const inner = size * 0.45;
  const points = 5;
  context.fillStyle = 'rgba(255, 215, 0, 0.9)';
  context.strokeStyle = 'rgba(255, 165, 0, 0.7)';
  context.lineWidth = 1;
  context.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const px = x + Math.cos(a) * radius;
    const py = y + Math.sin(a) * radius;
    if (i === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.closePath();
  context.fill();
  context.stroke();
}

function drawHeart(x, y, size) {
  const s = size * 0.9;
  context.fillStyle = 'rgba(255, 105, 180, 0.9)';
  context.strokeStyle = 'rgba(219, 112, 147, 0.8)';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(x, y + s * 0.3);
  context.bezierCurveTo(x, y - s * 0.4, x - s, y - s * 0.4, x - s * 0.5, y + s * 0.2);
  context.bezierCurveTo(x, y + s * 0.6, x, y + s * 0.6, x, y + s);
  context.bezierCurveTo(x, y + s * 0.6, x, y + s * 0.6, x + s * 0.5, y + s * 0.2);
  context.bezierCurveTo(x + s, y - s * 0.4, x, y - s * 0.4, x, y + s * 0.3);
  context.closePath();
  context.fill();
  context.stroke();
}

// ============ Sound ============

/**
 * Play camera pop sound if the file is available.
 * Fails silently (no error) if not.
 */
function playSound() {
  try {
    const audio = new Audio('assets/sounds/camera-pop.mp3');
    audio.volume = 0.5;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch (_) {
    // Fail silently
  }
}

// ============ Event Listeners ============

if (captureBtn) {
  captureBtn.addEventListener('click', takePhoto);
}

if (downloadBtn) {
  downloadBtn.addEventListener('click', downloadPhoto);
}

frameButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const frame = btn.dataset.frame;
    if (frame) setFrame(frame);
  });
});

// ============ Start ============

// Initialize camera when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCamera);
} else {
  initCamera();
}
