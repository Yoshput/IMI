/**
 * Image Compression Utility (Client-side WebP Engine)
 * Mengompresi foto apapun secara instan di browser menjadi WebP beresolusi optimal.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface CompressionResult {
  blob: Blob;
  dataUrl: string;
  file: File;
  originalSize: number;
  compressedSize: number;
  savingsPercent: number;
  width: number;
  height: number;
}

/**
 * Mengompresi file foto (JPEG, PNG, HEIC, WebP, dll.) menjadi format WebP berkualitas tinggi
 * langsung di client-side (HTML5 Canvas) dalam hitungan milidetik.
 */
export async function compressImageToWebP(
  inputFile: File,
  options: CompressOptions = {}
): Promise<CompressionResult> {
  const { maxWidth = 1400, maxHeight = 1400, quality = 0.82 } = options;

  return new Promise((resolve, reject) => {
    // 1. Buat object URL untuk memuat file gambar ke HTML Image
    const objectUrl = URL.createObjectURL(inputFile);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let targetWidth = img.naturalWidth || img.width;
      let targetHeight = img.naturalHeight || img.height;

      // 2. Hitung dimensi proporsional dengan batas maxWidth & maxHeight
      if (targetWidth > maxWidth || targetHeight > maxHeight) {
        const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
        targetWidth = Math.round(targetWidth * ratio);
        targetHeight = Math.round(targetHeight * ratio);
      }

      // 3. Render ke Canvas
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Gagal menginisialisasi canvas context 2D'));
        return;
      }

      // Aktifkan image smoothing berkualitas tinggi
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // 4. Konversi ke Blob WebP
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Gagal mengekspor WebP dari canvas'));
            return;
          }

          const cleanBaseName = inputFile.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-');
          const webpFileName = `${cleanBaseName}.webp`;
          const compressedFile = new File([blob], webpFileName, { type: 'image/webp' });
          const originalSize = inputFile.size;
          const compressedSize = blob.size;
          const savingsPercent = originalSize > 0 
            ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
            : 0;

          // Buat Data URL untuk preview instan
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              blob,
              dataUrl: reader.result as string,
              file: compressedFile,
              originalSize,
              compressedSize,
              savingsPercent,
              width: targetWidth,
              height: targetHeight,
            });
          };
          reader.onerror = () => reject(new Error('Gagal membaca data URL hasil kompresi'));
          reader.readAsDataURL(blob);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Gagal memuat file gambar untuk dikompres'));
    };

    img.src = objectUrl;
  });
}

/**
 * Format ukuran byte menjadi teks ramah pengguna (KB / MB)
 */
export function formatByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
