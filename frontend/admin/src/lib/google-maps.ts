let isLoading = false;
let isLoaded = false;

export const loadGoogleMaps = (): Promise<void> => {
  if (isLoaded) return Promise.resolve();
  if (isLoading) return new Promise((resolve) => {
    const checkLoaded = setInterval(() => {
      if (isLoaded) {
        clearInterval(checkLoaded);
        resolve();
      }
    }, 100);
  });

  isLoading = true;

  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.addEventListener('load', () => {
        isLoaded = true;
        isLoading = false;
        resolve();
      });

      script.addEventListener('error', (error) => {
        isLoading = false;
        reject(error);
      });

      document.body.appendChild(script);
    } catch (error) {
      isLoading = false;
      reject(error);
    }
  });
}; 