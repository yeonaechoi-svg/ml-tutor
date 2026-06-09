export function compressImage(file, maxKB = 200) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let { width, height } = img;
      const maxDim = 1200;
      if (width > maxDim || height > maxDim) {
        const r = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * r);
        height = Math.round(height * r);
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.85;
      const compress = () => {
        canvas.toBlob(
          (blob) => {
            if (blob.size > maxKB * 1024 && quality > 0.2) {
              quality = Math.round((quality - 0.1) * 10) / 10;
              compress();
            } else {
              resolve(blob);
            }
          },
          'image/jpeg',
          quality
        );
      };
      compress();
    };

    img.src = url;
  });
}
