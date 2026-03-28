"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  type Layout,
  type CountdownDuration,
  type FilterType,
  type StickerFrameType,
  FILTERS,
  QUICK_FILTER_IDS,
  STICKER_FRAME_OPTIONS,
} from "@/lib/photobooth-types";
import { drawStickerCorners } from "@/lib/canvas-stickers";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Camera, RotateCcw } from "lucide-react";

interface CaptureScreenProps {
  layout: Layout;
  onCapture: (photos: string[]) => void;
  onBack: () => void;
  onNext: () => void;
  onShutter: () => void;
}

function filterCss(filterId: FilterType): string {
  return FILTERS.find((f) => f.id === filterId)?.cssFilter ?? "none";
}

export function CaptureScreen({ layout, onCapture, onBack, onNext, onShutter }: CaptureScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [currentShot, setCurrentShot] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [countdownDuration, setCountdownDuration] = useState<CountdownDuration>(3);
  const [showGetReady, setShowGetReady] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("none");
  const [stickerFrame, setStickerFrame] = useState<StickerFrameType>("none");
  const [showCheese, setShowCheese] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Unable to access camera. Please ensure you have granted camera permissions.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [startCamera]);

  /** Live preview: mirror + filter (matches capture pipeline) */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.style.filter = filterCss(selectedFilter);
  }, [selectedFilter]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;

    ctx.save();
    ctx.filter = filterCss(selectedFilter);
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    ctx.restore();

    if (stickerFrame !== "none") {
      drawStickerCorners(ctx, w, h, stickerFrame);
    }

    return canvas.toDataURL("image/png");
  }, [selectedFilter, stickerFrame]);

  const runCountdown = useCallback(async (duration: CountdownDuration) => {
    if (duration === 10) {
      setShowGetReady(true);
      for (let i = duration; i > 5; i--) {
        setCountdown(i);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setShowGetReady(false);
      for (let i = 5; i > 0; i--) {
        setCountdown(i);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } else {
      for (let i = duration; i > 0; i--) {
        setCountdown(i);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    setCountdown(null);
  }, []);

  const takePhoto = useCallback(async () => {
    await runCountdown(countdownDuration);

    setShowFlash(true);
    onShutter();
    setTimeout(() => setShowFlash(false), 150);

    setTimeout(() => {
      setShowCheese(true);
      setTimeout(() => setShowCheese(false), 700);
    }, 160);

    const photo = capturePhoto();
    if (photo) {
      setPhotos((prev) => [...prev, photo]);
    }
  }, [runCountdown, countdownDuration, onShutter, capturePhoto]);

  const startSequence = useCallback(async () => {
    setIsCapturing(true);
    setPhotos([]);
    setCurrentShot(0);

    for (let i = 0; i < layout.slots; i++) {
      setCurrentShot(i + 1);
      await takePhoto();
      if (i < layout.slots - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    setIsCapturing(false);
  }, [layout.slots, takePhoto]);

  const retakeAll = useCallback(() => {
    setPhotos([]);
    setCurrentShot(0);
  }, []);

  const handleNext = useCallback(() => {
    onCapture(photos);
    onNext();
  }, [photos, onCapture, onNext]);

  const isComplete = photos.length >= layout.slots;

  const quickFilters = QUICK_FILTER_IDS.map((id) => FILTERS.find((f) => f.id === id)!);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-foreground mb-2 text-balance font-[family-name:var(--font-display)]">
              Strike a Pose!
            </h1>
            <p className="text-muted-foreground text-lg">
              {isComplete
                ? "All photos captured! Review them below."
                : isCapturing
                  ? `Taking photo ${currentShot} of ${layout.slots}`
                  : `Ready to take ${layout.slots} photo${layout.slots > 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Filters + stickers (from vanilla cute photobooth) */}
          {!isCapturing && !isComplete && (
            <div className="flex flex-col gap-3 mb-4 max-w-2xl mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Photo filter">
                <span className="text-xs font-medium text-muted-foreground w-full text-center sm:w-auto sm:mr-2">
                  Filter
                </span>
                {quickFilters.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFilter(f.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                      selectedFilter === f.id
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:bg-muted/80"
                    )}
                    aria-pressed={selectedFilter === f.id}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-border/80 shrink-0"
                      style={{
                        background:
                          f.id === "none"
                            ? "linear-gradient(135deg,#fff,#f0f0f0)"
                            : f.id === "bw"
                              ? "linear-gradient(135deg,#000,#fff)"
                              : f.id === "warm"
                                ? "linear-gradient(135deg,#ffb199,#ff0844)"
                                : "linear-gradient(135deg,#a1c4fd,#c2e9fb)",
                      }}
                      aria-hidden
                    />
                    {f.name}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Corner stickers">
                <span className="text-xs font-medium text-muted-foreground w-full text-center sm:w-auto sm:mr-2">
                  Stickers
                </span>
                {STICKER_FRAME_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStickerFrame(opt.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                      stickerFrame === opt.id
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:bg-muted/80"
                    )}
                    aria-pressed={stickerFrame === opt.id}
                  >
                    <span aria-hidden>{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Camera Preview */}
          <div className="relative w-full max-w-2xl mx-auto mb-6 rounded-2xl overflow-hidden bg-muted aspect-video border-4 border-white shadow-xl">
            {cameraError ? (
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{cameraError}</p>
                  <Button onClick={startCamera} variant="outline" className="mt-4">
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            )}

            {countdown !== null && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-20">
                <span
                  className="text-9xl font-bold text-primary font-[family-name:var(--font-display)]"
                  style={{
                    animation: "countdown-pulse 1s ease-out infinite",
                  }}
                >
                  {countdown}
                </span>
                {showGetReady && (
                  <span className="text-xl text-foreground mt-4 animate-pulse">Get ready!</span>
                )}
              </div>
            )}

            {showFlash && <div className="absolute inset-0 bg-white z-30 pointer-events-none" />}

            {showCheese && (
              <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
                <span className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg font-[family-name:var(--font-display)]">
                  Cheese! 🧀
                </span>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {!isCapturing && !isComplete && (
            <div className="flex justify-center gap-2 mb-6">
              {([3, 5, 10] as CountdownDuration[]).map((duration) => (
                <button
                  key={duration}
                  type="button"
                  onClick={() => setCountdownDuration(duration)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    countdownDuration === duration
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {duration}s
                </button>
              ))}
            </div>
          )}

          {photos.length > 0 && (
            <div className="flex justify-center gap-2 mb-6 flex-wrap">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-primary bg-muted"
                >
                  <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
              {Array.from({ length: layout.slots - photos.length }).map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/50"
                >
                  <span className="text-muted-foreground text-xs">{photos.length + index + 1}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center gap-4 flex-wrap">
            <Button variant="outline" size="lg" onClick={onBack} className="px-6 gap-2" disabled={isCapturing}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {!isComplete ? (
              <Button size="lg" onClick={startSequence} className="px-8 gap-2" disabled={isCapturing || !!cameraError}>
                <Camera className="w-4 h-4" />
                {isCapturing ? "Capturing..." : "Start"}
              </Button>
            ) : (
              <>
                <Button variant="outline" size="lg" onClick={retakeAll} className="px-6 gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Retake All
                </Button>
                <Button size="lg" onClick={handleNext} className="px-8 gap-2">
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes countdown-pulse {
          0% {
            transform: scale(1.5);
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
