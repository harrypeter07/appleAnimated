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
    const maxRetries = 3;

    const loadAsset = (src, retryCount = 0) => {
      return new Promise((resolveAsset) => {
        const timeout = setTimeout(() => {
          if (retryCount < maxRetries) {
            console.log(`Retrying to load ${src} (attempt ${retryCount + 1})`);
            loadAsset(src, retryCount + 1).then(resolveAsset);
          } else {
            console.warn(`Failed to load ${src} after ${maxRetries} attempts`);
            loadedCount++;
            resolveAsset(); // Continue even if some assets fail
          }
        }, 5000); // 5 second timeout

        if (src.endsWith('.mp4')) {
          // Preload video metadata only
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {
            clearTimeout(timeout);
            loadedCount++;
            console.log(`Loaded video: ${src}`);
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
          console.log(`Marked 3D model as loaded: ${src}`);
          resolveAsset();
        } else {
          // Preload images
          const img = new Image();
          img.onload = () => {
            clearTimeout(timeout);
            loadedCount++;
            console.log(`Loaded image: ${src}`);
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

    // Load all assets in parallel for faster loading
    Promise.allSettled(assets.map(loadAsset)).then((results) => {
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      console.log(`Asset loading complete: ${successful} successful, ${failed} failed`);
      
      // Add a small delay to ensure smooth transition
      setTimeout(resolve, 200);
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

// Check if assets are cached
export const checkAssetCache = () => {
  return new Promise((resolve) => {
    const testImage = new Image();
    testImage.onload = () => resolve(true);
    testImage.onerror = () => resolve(false);
    testImage.src = '/assets/images/apple.svg';
  });
};
