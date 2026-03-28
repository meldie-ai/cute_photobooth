"use client";

import { useState, useCallback } from "react";
import { 
  type LayoutType, 
  type ThemeType, 
  LAYOUTS, 
  THEMES 
} from "@/lib/photobooth-types";
import { useSoundEffects } from "@/hooks/use-sound-effects";
import { LayoutPicker } from "./layout-picker";
import { ThemePicker } from "./theme-picker";
import { CaptureScreen } from "./capture-screen";
import { ReviewScreen } from "./review-screen";
import { Volume2, VolumeX } from "lucide-react";

type Screen = "layout" | "theme" | "capture" | "review";

export function Photobooth() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("layout");
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>("classic-strip");
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>("classic-white");
  const [caption, setCaption] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  
  const { isMuted, toggleMute, playShutterClick, playExportChime } = useSoundEffects();

  const layout = LAYOUTS.find(l => l.id === selectedLayout)!;
  const theme = THEMES.find(t => t.id === selectedTheme)!;

  const handleCapture = useCallback((capturedPhotos: string[]) => {
    setPhotos(capturedPhotos);
  }, []);

  const handleStartOver = useCallback(() => {
    setCurrentScreen("layout");
    setSelectedLayout("classic-strip");
    setSelectedTheme("classic-white");
    setCaption("");
    setPhotos([]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFD1DC]/35 via-background to-background">
      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground font-[family-name:var(--font-display)]">
                🌸 Cute Photo Booth
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Photobooth v2</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Sound Toggle */}
              <button
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-5 h-5 text-foreground" />
                )}
              </button>
              
              {/* Progress Steps */}
              <div className="flex items-center gap-2">
                {(["layout", "theme", "capture", "review"] as Screen[]).map((screen, index) => (
                  <div key={screen} className="flex items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        currentScreen === screen 
                          ? "bg-primary text-primary-foreground" 
                          : index < ["layout", "theme", "capture", "review"].indexOf(currentScreen)
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < 3 && (
                      <div className={`w-8 h-0.5 ${
                        index < ["layout", "theme", "capture", "review"].indexOf(currentScreen)
                          ? "bg-primary"
                          : "bg-muted"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Content */}
      <div className="pt-16">
        {currentScreen === "layout" && (
          <LayoutPicker
            selectedLayout={selectedLayout}
            onSelectLayout={setSelectedLayout}
            onNext={() => setCurrentScreen("theme")}
          />
        )}

        {currentScreen === "theme" && (
          <ThemePicker
            selectedTheme={selectedTheme}
            onSelectTheme={setSelectedTheme}
            caption={caption}
            onCaptionChange={setCaption}
            onNext={() => setCurrentScreen("capture")}
            onBack={() => setCurrentScreen("layout")}
          />
        )}

        {currentScreen === "capture" && (
          <CaptureScreen
            layout={layout}
            onCapture={handleCapture}
            onBack={() => setCurrentScreen("theme")}
            onNext={() => setCurrentScreen("review")}
            onShutter={playShutterClick}
          />
        )}

        {currentScreen === "review" && (
          <ReviewScreen
            layout={layout}
            theme={theme}
            caption={caption}
            photos={photos}
            onStartOver={handleStartOver}
            onBack={() => setCurrentScreen("capture")}
            onExport={playExportChime}
          />
        )}
      </div>
    </div>
  );
}
