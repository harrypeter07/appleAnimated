import { useState, useEffect } from 'react';

const AppLoader = ({ onLoadingComplete }) => {
  const [counter, setCounter] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const duration = 10000; // 10 seconds total
    const interval = 50; // Update every 50ms
    const totalSteps = duration / interval;
    const increment = 100 / totalSteps;

    const timer = setInterval(() => {
      setCounter(prev => {
        const newValue = prev + increment;
        if (newValue >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          setTimeout(() => {
            onLoadingComplete();
          }, 500);
          return 100;
        }
        return newValue;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  const radius = 80; // Increased from 60
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (counter / 100) * circumference;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative">
        {/* Circular Progress Ring */}
        <svg className="w-60 h-60 transform -rotate-90" viewBox="0 0 200 200">
          {/* Background Circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#333"
            strokeWidth="4"
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-100 ease-out"
          />
        </svg>
      </div>
    </div>
  );
};

export default AppLoader;
