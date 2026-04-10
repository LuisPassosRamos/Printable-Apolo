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
      className={`fixed inset-0 z-50 bg-primary flex flex-col items-center justify-center ${
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
      <p className="text-white font-semibold text-xl mt-4 tracking-wider animate-fade-in-delayed">
        Olympus 3D
      </p>
    </div>
  );
}
