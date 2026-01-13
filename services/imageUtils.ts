
/**
 * Resizes a base64 image to a thumbnail for storage in localStorage.
 */
export const createThumbnail = (base64: string, maxWidth = 300): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = img.height / img.width;
      canvas.width = maxWidth;
      canvas.height = maxWidth * ratio;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compressed JPEG
      } else {
        resolve(base64);
      }
    };
    img.src = base64;
  });
};
