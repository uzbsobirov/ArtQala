import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Paintings are photographed in wildly different resolutions; cap the longest
// edge so pages stay fast, without cropping into the artwork itself.
const MAX_DIMENSION = 1800;

export async function POST(request: Request) {
  // 1. Enforce admin authentication on uploads
  const auth = await requireAdmin();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);
    let contentType = file.type;
    let fileExt: string | null = null;

    // Validate MIME type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only image files (JPEG, PNG, WebP, SVG, GIF) are allowed' },
        { status: 400 }
      );
    }

    // Auto-correct raster uploads: normalize orientation (EXIF), cap resolution,
    // and re-encode as optimized WebP. Vector (SVG) and animated (GIF) files pass through untouched.
    if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp') {
      try {
        buffer = await sharp(buffer)
          .rotate()
          .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 88 })
          .toBuffer();
        contentType = 'image/webp';
        fileExt = '.webp';
      } catch (sharpErr) {
        console.warn('Image auto-correction failed, using original upload:', sharpErr);
      }
    }

    // 2. Option A: Cloudinary Upload (if configured in environment)
    const cloudinaryCloudName =
      process.env.CLOUDINARY_CLOUD_NAME ||
      (process.env.CLOUDINARY_URL ? process.env.CLOUDINARY_URL.split('@')[1] : null);
    const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
    const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudinaryPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'artqala_preset';

    if (cloudinaryCloudName) {
      try {
        const formData = new FormData();
        formData.append('file', new Blob([buffer], { type: contentType }), file.name);

        if (cloudinaryApiKey && cloudinaryApiSecret) {
          // Signed Cloudinary upload
          const timestamp = Math.floor(Date.now() / 1000).toString();
          const paramsToSign = `folder=artqala&timestamp=${timestamp}${cloudinaryApiSecret}`;
          const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

          formData.append('api_key', cloudinaryApiKey);
          formData.append('timestamp', timestamp);
          formData.append('signature', signature);
          formData.append('folder', 'artqala');
        } else {
          // Unsigned Cloudinary upload
          formData.append('upload_preset', cloudinaryPreset);
          formData.append('folder', 'artqala');
        }

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
          { method: 'POST', body: formData }
        );

        if (cloudRes.ok) {
          const cloudData = await cloudRes.json();
          return NextResponse.json({
            success: true,
            url: cloudData.secure_url || cloudData.url,
            provider: 'cloudinary',
            fileName: file.name,
          });
        }
      } catch (cloudErr) {
        console.warn('Cloudinary upload failed, checking fallbacks:', cloudErr);
      }
    }

    // 3. Option B: Vercel Blob Storage (if BLOB_READ_WRITE_TOKEN is configured)
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (blobToken) {
      try {
        const ext = fileExt || path.extname(file.name) || '.jpg';
        const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
        const fileName = `artqala_${Date.now()}_${cleanName}${ext}`;

        const blobRes = await fetch(
          `https://blob.vercel-storage.com/${fileName}`,
          {
            method: 'PUT',
            headers: {
              authorization: `Bearer ${blobToken}`,
              'x-api-version': '7',
              'content-type': contentType,
            },
            body: buffer,
          }
        );

        if (blobRes.ok) {
          const blobData = await blobRes.json();
          return NextResponse.json({
            success: true,
            url: blobData.url,
            provider: 'vercel-blob',
            fileName,
          });
        }
      } catch (blobErr) {
        console.warn('Vercel blob upload failed, checking local fallback:', blobErr);
      }
    }

    // 4. Option C: Local Development Fallback (for localhost)
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true });

      const ext = fileExt || path.extname(file.name) || '.jpg';
      const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
      const fileName = `${Date.now()}_${cleanName}${ext}`;
      const filePath = path.join(uploadsDir, fileName);

      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${fileName}`,
        provider: 'local',
        fileName,
      });
    } catch (fsErr) {
      // In read-only serverless environment without cloud storage keys, safely return optimized Base64 data URL
      console.warn('Filesystem read-only (Serverless), falling back to Data URL');
      const base64Data = `data:${contentType};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        url: base64Data,
        provider: 'data-url',
        fileName: file.name,
      });
    }
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
