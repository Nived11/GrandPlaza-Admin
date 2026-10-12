let googleMapsPromise: Promise<any> | null = null;

export const loadGoogleMaps = (): Promise<any> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is not defined"));
  }

  if ((window as any).google && (window as any).google.maps) {
    return Promise.resolve((window as any).google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key is not configured"));
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve((window as any).google));
      existingScript.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if ((window as any).google && (window as any).google.maps) {
        resolve((window as any).google);
      } else {
        reject(new Error("Google Maps object not found on window"));
      }
    };

    script.onerror = (err) => {
      googleMapsPromise = null;
      reject(err);
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
};
