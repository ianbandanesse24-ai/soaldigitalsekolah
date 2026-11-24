export async function readAndCompressImageFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Berkas harus berupa gambar (PNG, JPG, WebP, atau SVG).');
  }

  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Gagal membaca data gambar.'));
    };
    reader.onerror = () => reject(new Error('Gagal membaca berkas gambar.'));
    reader.readAsDataURL(file);
  });

  // Pertahankan SVG kecil secara utuh agar garis diagram/rumus tetap tajam
  if (file.type === 'image/svg+xml' && rawDataUrl.length < 180_000) {
    return rawDataUrl;
  }

  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxW = 960;
      const maxH = 720;
      let targetW = img.naturalWidth || img.width || 640;
      let targetH = img.naturalHeight || img.height || 480;

      if (targetW <= maxW && targetH <= maxH && rawDataUrl.length < 320_000) {
        resolve(rawDataUrl);
        return;
      }

      const ratio = Math.min(maxW / targetW, maxH / targetH, 1);
      targetW = Math.max(1, Math.round(targetW * ratio));
      targetH = Math.max(1, Math.round(targetH * ratio));

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(rawDataUrl);
        return;
      }

      if (file.type !== 'image/png') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);
      }
      ctx.drawImage(img, 0, 0, targetW, targetH);

      const outputMime =
        file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      resolve(canvas.toDataURL(outputMime, 0.86));
    };
    img.onerror = () => resolve(rawDataUrl);
    img.src = rawDataUrl;
  });
}

export interface PdfImagePayload {
  dataUrl: string;
  format: 'PNG' | 'JPEG';
  width: number;
  height: number;
}

export function measureImageForPdf(
  src: string
): Promise<PdfImagePayload | null> {
  return new Promise((resolve) => {
    if (!src || !src.trim()) {
      resolve(null);
      return;
    }

    const img = new Image();
    if (!src.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      const w = img.naturalWidth || img.width || 400;
      const h = img.naturalHeight || img.height || 300;
      const isJpeg = /^data:image\/jpe?g/i.test(src);
      const isPng = /^data:image\/png/i.test(src);

      if (isJpeg || isPng) {
        resolve({
          dataUrl: src,
          format: isJpeg ? 'JPEG' : 'PNG',
          width: w,
          height: h,
        });
        return;
      }

      // Konversi SVG / WebP / URL eksternal ke PNG lewat canvas agar jsPDF memprosesnya dengan aman
      try {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve({
          dataUrl: canvas.toDataURL('image/png'),
          format: 'PNG',
          width: w,
          height: h,
        });
      } catch {
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);
    img.src = src;
  });
}
