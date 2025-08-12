import React, { useState, useEffect, Suspense } from "react";
import AppLoader from "./components/AppLoader";
import { preloadAssets } from "./utils/assetLoader";

// Lazy load components for better performance
const Features = React.lazy(() => import("./components/Features"));
const Footer = React.lazy(() => import("./components/Footer"));
const Hero = React.lazy(() => import("./components/Hero"));
const Highlights = React.lazy(() => import("./components/Highlights"));
const HowItWorks = React.lazy(() => import("./components/HowItWorks"));
const Model = React.lazy(() => import("./components/Model"));
const Navbar = React.lazy(() => import("./components/Navbar"));

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Start preloading assets immediately in the background
    preloadAssets()
      .then(() => {
        console.log('Assets preloaded successfully');
      })
      .catch((error) => {
        console.error('Error preloading assets:', error);
        // Continue anyway - the loader will handle the timing
      });
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <AppLoader onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <main className="bg-black">
      <Suspense fallback={
        <div className="h-screen bg-black flex items-center justify-center">
          <div className="relative">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="30"
                stroke="#333"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="30"
                stroke="white"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                className="animate-spin"
                style={{
                  strokeDasharray: 188.5,
                  strokeDashoffset: 47.125
                }}
              />
            </svg>
          </div>
        </div>
      }>
        <Navbar />
        <Hero />
        <Highlights />
        <Model />
        <Features />
        <HowItWorks />
        <Footer />
      </Suspense>
    </main>
  );
};

export default App;
