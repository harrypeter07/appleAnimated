// Asset preloading utility
export const preloadAssets = () => {
  return new Promise((resolve) => {
    const assets = [
      // Images
      '/assets/images/apple.svg',
      '/assets/images/bag.svg',
      '/assets/images/black.jpg',
      '/assets/images/blue.jpg',
      '/assets/images/chip.jpeg',
      '/assets/images/explore1.jpg',
      '/assets/images/explore2.jpg',
      '/assets/images/frame.png',
      '/assets/images/hero.jpeg',
      '/assets/images/pause.svg',
      '/assets/images/play.svg',
      '/assets/images/replay.svg',
      '/assets/images/right.svg',
      '/assets/images/search.svg',
      '/assets/images/watch.svg',
      '/assets/images/white.jpg',
      '/assets/images/yellow.jpg',
      
      // Videos
      '/assets/videos/explore.mp4',
      '/assets/videos/frame.mp4',
      '/assets/videos/hero.mp4',
      '/assets/videos/highlight-first.mp4',
      '/assets/videos/hightlight-fourth.mp4',
      '/assets/videos/hightlight-sec.mp4',
      '/assets/videos/hightlight-third.mp4',
      '/assets/videos/smallHero.mp4',
      
      // 3D Models
      '/models/scene.glb'
    ];

    let loadedCount = 0;
    const totalAssets = assets.length;

    const loadAsset = (src) => {
      return new Promise((resolveAsset) => {
        if (src.endsWith('.mp4')) {
          // Preload video
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {
            loadedCount++;
            resolveAsset();
          };
          video.onerror = () => {
            loadedCount++;
            resolveAsset(); // Continue even if some assets fail
          };
          video.src = src;
        } else if (src.endsWith('.glb')) {
          // For 3D models, we'll just mark as loaded since they're loaded by Three.js
          loadedCount++;
          resolveAsset();
        } else {
          // Preload images
          const img = new Image();
          img.onload = () => {
            loadedCount++;
            resolveAsset();
          };
          img.onerror = () => {
            loadedCount++;
            resolveAsset(); // Continue even if some assets fail
          };
          img.src = src;
        }
      });
    };

    // Load all assets in parallel
    Promise.all(assets.map(loadAsset)).then(() => {
      // Add a small delay to ensure smooth transition
      setTimeout(resolve, 500);
    });
  });
};

// Lazy loading for better performance
export const lazyLoadComponent = (importFunc) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      importFunc().then(resolve);
    }, 100);
  });
};
