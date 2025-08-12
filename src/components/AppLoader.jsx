import { useState, useEffect } from 'react';

const AppLoader = ({ onLoadingComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const loadingSteps = [
      { progress: 10, text: 'Loading assets...' },
      { progress: 25, text: 'Preparing videos...' },
      { progress: 40, text: 'Loading 3D models...' },
      { progress: 60, text: 'Optimizing performance...' },
      { progress: 80, text: 'Finalizing setup...' },
      { progress: 95, text: 'Almost ready...' },
      { progress: 100, text: 'Welcome to iPhone 15 Pro' }
    ];

    let currentStep = 0;
    const totalDuration = 3000; // 3 seconds total
    const stepDuration = totalDuration / loadingSteps.length;

    const progressInterval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setLoadingProgress(step.progress);
        setLoadingText(step.text);
        currentStep++;
      } else {
        clearInterval(progressInterval);
        setTimeout(() => {
          onLoadingComplete();
        }, 500);
      }
    }, stepDuration);

    return () => clearInterval(progressInterval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Apple Logo Animation */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center animate-pulse">
              <svg 
                className="w-8 h-8 text-black" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-80 h-1 bg-gray-800 rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>

        {/* Loading Text */}
        <div className="text-white mb-4">
          <h2 className="text-2xl font-semibold mb-2 tracking-wide">
            {loadingText}
          </h2>
          <p className="text-gray-400 text-sm">
            {loadingProgress}% Complete
          </p>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* iPhone 15 Pro Text */}
        <div className="mt-8 text-gray-500 text-xs tracking-wider">
          iPhone 15 Pro
        </div>
      </div>
    </div>
  );
};

export default AppLoader;
