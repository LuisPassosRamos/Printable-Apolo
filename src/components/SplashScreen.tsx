import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onHide: () => void;
}

const SPLASH_DISPLAY_DURATION_MS = 1500;

export function SplashScreen({ onHide }: SplashScreenProps) {
  const [fadingOut, setFadingOut] = useState(false);
  const logoUrl = `${import.meta.env.BASE_URL}Logo_white.png`;

  useEffect(() => {
    const timer = setTimeout(() => setFadingOut(true), SPLASH_DISPLAY_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 bg-secondary flex flex-col items-center justify-center ${
        fadingOut ? 'animate-fade-out' : ''
      }`}
      onAnimationEnd={() => {
        if (fadingOut) onHide();
      }}
    >
      <img
        src={logoUrl}
        alt="Olympus 3D"
        className="w-32 h-32 object-contain animate-fade-in-up"
      />
    </div>
  );
}
