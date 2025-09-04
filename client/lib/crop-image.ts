import { Area } from 'react-easy-crop';

export default function getCroppedImg(
  imageSrc: string,
  crop: Area,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject();
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height,
      );
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject();
      }, 'image/jpeg');
    };
    image.onerror = reject;
  });
}
