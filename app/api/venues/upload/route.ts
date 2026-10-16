import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { getVenueById, updateVenue } from '@/lib/venue-service';
import { VenueAsset } from '@/lib/venue-types';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'venues', 'uploads');

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * POST /api/venues/upload
 * Menerima upload foto, mengonversi/memvalidasi menjadi WebP berukuran ultra-ringan via sharp,
 * menyimpannya di /public/venues/uploads, dan otomatis mendaftarkannya ke aset venue.
 */
export async function POST(req: NextRequest) {
  try {
    ensureUploadDir();

    const contentType = req.headers.get('content-type') || '';
    let buffer: Buffer;
    let venueId = '';
    let description = '';
    let altText = '';
    let attribution = '';
    let originalName = 'photo';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json(
          { success: false, error: 'Berkas foto tidak ditemukan dalam formulir upload' },
          { status: 400 }
        );
      }

      venueId = (formData.get('venueId') as string) || '';
      description = (formData.get('description') as string) || '';
      altText = (formData.get('altText') as string) || '';
      attribution = (formData.get('attribution') as string) || '';
      originalName = file.name || 'photo';

      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      const json = await req.json();
      venueId = json.venueId || '';
      description = json.description || '';
      altText = json.altText || '';
      attribution = json.attribution || '';

      if (json.dataUrl) {
        const base64Data = json.dataUrl.replace(/^data:image\/\w+;base64,/, '');
        buffer = Buffer.from(base64Data, 'base64');
      } else {
        return NextResponse.json(
          { success: false, error: 'Format data foto tidak valid' },
          { status: 400 }
        );
      }
    }

    // 1. Optimasi WebP via sharp (Auto-rotate EXIF orientation, max 1400px, 82 quality)
    const processedBuffer = await sharp(buffer)
      .rotate()
      .resize({
        width: 1400,
        height: 1400,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: 82,
        effort: 6,
      })
      .toBuffer();

    // 2. Tentukan nama berkas unik
    const cleanVenuePrefix = venueId ? venueId.slice(0, 8) : 'venue';
    const timestamp = Date.now();
    const cleanOriginal = originalName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 24);
    const fileName = `${cleanVenuePrefix}-${cleanOriginal}-${timestamp}.webp`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // 3. Simpan ke direktori publik
    fs.writeFileSync(filePath, processedBuffer);
    const publicUrl = `/venues/uploads/${fileName}`;

    // 4. Jika terasosiasi dengan venueId, perbarui data assets venue
    let newAsset: VenueAsset | null = null;
    let updatedVenue = null;

    if (venueId) {
      const currentVenue = getVenueById(venueId);
      if (currentVenue) {
        newAsset = {
          assetId: `asset-${timestamp}-${Math.random().toString(36).substring(2, 7)}`,
          venueId,
          sourceUrl: publicUrl,
          filePath: publicUrl,
          capturedAt: new Date().toISOString().split('T')[0],
          uploader: 'Tim Marketing I See You',
          description: description.trim() || `Dokumentasi ${currentVenue.name}`,
          usageRights: 'public_promotional',
          authenticityStatus: 'asli',
          verificationStatus: 'verified',
          altText: altText.trim() || description.trim() || currentVenue.name,
          attribution: attribution.trim() || null,
          fileType: 'image',
        };

        const existingAssets = currentVenue.assets || [];
        const updatedAssets: VenueAsset[] = [newAsset, ...existingAssets];
        updatedVenue = updateVenue(venueId, { assets: updatedAssets });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Foto berhasil dikompresi ke WebP dan disimpan.',
      url: publicUrl,
      sizeBytes: processedBuffer.length,
      asset: newAsset,
      venue: updatedVenue,
    });
  } catch (err: any) {
    console.error('Error processing venue image upload:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Gagal memproses dan menyimpan foto venue',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/venues/upload?venueId=...&assetId=...
 * Menghapus foto dari galeri venue dan menghapus berkas upload fisik jika ada.
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const venueId = searchParams.get('venueId');
    const assetId = searchParams.get('assetId');

    if (!venueId || !assetId) {
      return NextResponse.json(
        { success: false, error: 'venueId dan assetId wajib disertakan' },
        { status: 400 }
      );
    }

    const currentVenue = getVenueById(venueId);
    if (!currentVenue) {
      return NextResponse.json(
        { success: false, error: 'Venue tidak ditemukan' },
        { status: 404 }
      );
    }

    const targetAsset = (currentVenue.assets || []).find((a) => a.assetId === assetId);
    if (!targetAsset) {
      return NextResponse.json(
        { success: false, error: 'Foto tidak ditemukan dalam venue ini' },
        { status: 404 }
      );
    }

    // Hapus berkas fisik jika tersimpan di folder uploads
    if (targetAsset.filePath && targetAsset.filePath.startsWith('/venues/uploads/')) {
      const relativeFileName = targetAsset.filePath.replace('/venues/uploads/', '');
      const absolutePath = path.join(UPLOAD_DIR, relativeFileName);
      if (fs.existsSync(absolutePath)) {
        try {
          fs.unlinkSync(absolutePath);
        } catch {
          // ignore error if file was already moved/deleted
        }
      }
    }

    // Filter aset dari daftar venue
    const updatedAssets = (currentVenue.assets || []).filter((a) => a.assetId !== assetId);
    const updatedVenue = updateVenue(venueId, { assets: updatedAssets });

    return NextResponse.json({
      success: true,
      message: 'Foto berhasil dihapus dari galeri venue.',
      data: updatedVenue,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Gagal menghapus foto venue',
      },
      { status: 500 }
    );
  }
}
