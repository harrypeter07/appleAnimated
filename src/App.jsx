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
    // Preload all assets in the background
    preloadAssets().then(() => {
      // Assets are loaded, but we'll let the AppLoader handle the timing
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
      <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>}>
        <Navbar />
        <Hero />
        <Highlights />
        <Model />
        <Features />
        <HowItWorks />
        <Footer />
      </React.Suspense>
    </main>
  );
};

export default App;
