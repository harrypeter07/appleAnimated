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
    const maxRetries = 2;

    const loadAsset = (src, retryCount = 0) => {
      return new Promise((resolveAsset) => {
        const timeout = setTimeout(() => {
          if (retryCount < maxRetries) {
            loadAsset(src, retryCount + 1).then(resolveAsset);
          } else {
            loadedCount++;
            resolveAsset(); // Continue even if some assets fail
          }
        }, 3000); // 3 second timeout

        if (src.endsWith('.mp4')) {
          // Preload video metadata only
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {
            clearTimeout(timeout);
            loadedCount++;
            resolveAsset();
          };
          video.onerror = () => {
            clearTimeout(timeout);
            if (retryCount < maxRetries) {
              loadAsset(src, retryCount + 1).then(resolveAsset);
            } else {
              loadedCount++;
              resolveAsset();
            }
          };
          video.src = src;
        } else if (src.endsWith('.glb')) {
          // For 3D models, just mark as loaded
          clearTimeout(timeout);
          loadedCount++;
          resolveAsset();
        } else {
          // Preload images
          const img = new Image();
          img.onload = () => {
            clearTimeout(timeout);
            loadedCount++;
            resolveAsset();
          };
          img.onerror = () => {
            clearTimeout(timeout);
            if (retryCount < maxRetries) {
              loadAsset(src, retryCount + 1).then(resolveAsset);
            } else {
              loadedCount++;
              resolveAsset();
            }
          };
          img.src = src;
        }
      });
    };

    // Load assets in batches to avoid overwhelming the browser
    const batchSize = 5;
    const loadBatch = async (startIndex) => {
      const batch = assets.slice(startIndex, startIndex + batchSize);
      if (batch.length === 0) {
        resolve();
        return;
      }
      
      await Promise.allSettled(batch.map(loadAsset));
      setTimeout(() => loadBatch(startIndex + batchSize), 100);
    };

    loadBatch(0);
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

// Check if assets are cached
export const checkAssetCache = () => {
  return new Promise((resolve) => {
    const testImage = new Image();
    testImage.onload = () => resolve(true);
    testImage.onerror = () => resolve(false);
    testImage.src = '/assets/images/apple.svg';
  });
};
