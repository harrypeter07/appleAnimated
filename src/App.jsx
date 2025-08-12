import React, { useState, useEffect, Suspense } from "react";
import AppLoader from "./components/AppLoader";
import { preloadAssets } from "./utils/assetLoader";

// Import components directly instead of lazy loading to avoid the second loader
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import HowItWorks from "./components/HowItWorks";
import Model from "./components/Model";
import Navbar from "./components/Navbar";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    // Start preloading assets immediately in the background
    preloadAssets()
      .then(() => {
        console.log('Assets preloaded successfully');
        setAssetsLoaded(true);
      })
      .catch((error) => {
        console.error('Error preloading assets:', error);
        setAssetsLoaded(true); // Continue anyway after 10 seconds
      });
  }, []);

  const handleLoadingComplete = () => {
    // Only complete loading if assets are loaded or 10 seconds have passed
    if (assetsLoaded) {
      setIsLoading(false);
    } else {
      // If assets aren't loaded yet, wait a bit more
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  if (isLoading) {
    return <AppLoader onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Highlights />
      <Model />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  );
};

export default App;
