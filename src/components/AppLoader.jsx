import { useState, useEffect, useRef } from 'react';
import { loadingVideo } from '../utils';

const AppLoader = ({ onLoadingComplete }) => {
  const [isComplete, setIsComplete] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const duration = 10000; // 10 seconds total

    const timer = setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => {
        onLoadingComplete();
      }, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  const handleVideoEnd = () => {
    // If video ends before timer, complete loading
    if (!isComplete) {
      setIsComplete(true);
      setTimeout(() => {
        onLoadingComplete();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Loading Video */}
        <video 
          ref={videoRef}
          className="loading-video"
          autoPlay 
          muted 
          playsInline
          loop={false}
          onEnded={handleVideoEnd}
        >
          <source src={loadingVideo} type="video/mp4" />
        </video>
        
      </div>
    </div>
  );
};

export default AppLoader;
