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
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw current video frame
  context.drawImage(video, 0, 0);

  // If a frame (sticker theme) is selected, draw simple stickers on top
  if (currentFrame) {
    drawStickers(currentFrame, canvas.width, canvas.height);
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

// Draw simple emoji-like stickers (flowers / stars / hearts) on the photo
function drawStickers(frameName, width, height) {
  context.save();

  // Common style for all stickers
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  let emoji = '✨';
  let color = '#ffffff';

  if (frameName === 'flower') {
    emoji = '🌸';
    color = 'rgba(255, 255, 255, 0.7)';
  } else if (frameName === 'star') {
    emoji = '⭐';
    color = 'rgba(255, 255, 200, 0.7)';
  } else if (frameName === 'heart') {
    emoji = '💖';
    color = 'rgba(255, 240, 245, 0.8)';
  }

  // Soft glow circles under stickers
  function drawGlow(x, y, radius) {
    const g = context.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(255, 255, 255, 0)');
    context.fillStyle = g;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  const pad = width * 0.08;
  const radius = Math.min(width, height) * 0.12;
  const positions = [
    [pad, pad], // top-left
    [width - pad, pad], // top-right
    [pad, height - pad], // bottom-left
    [width - pad, height - pad], // bottom-right
  ];

  positions.forEach(([x, y]) => {
    drawGlow(x, y, radius);
  });

  // Draw the emojis on top of glows
  const fontSize = Math.min(width, height) * 0.12;
  context.font = `${fontSize}px system-ui, Apple Color Emoji, Segoe UI Emoji, sans-serif`;

  positions.forEach(([x, y]) => {
    context.fillText(emoji, x, y);
  });

  context.restore();
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
