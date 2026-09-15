import { prisma } from './prisma';
import { getBestsellerPaintingIds, withBestsellerFlag } from './bestseller';

export async function getFeaturedPaintings() {
  try {
    const [paintings, bestsellerIds] = await Promise.all([
      prisma.painting.findMany({
        where: { is_featured: true },
        include: {
          artist: true,
          category: true,
        },
        take: 8,
        orderBy: { created_at: 'desc' },
      }),
      getBestsellerPaintingIds(),
    ]);
    return withBestsellerFlag(paintings, bestsellerIds);
  } catch (error) {
    console.error('Error fetching featured paintings:', error);
    return [];
  }
}

export async function getAllPaintings(categorySlug?: string) {
  try {
    const where: Record<string, unknown> = {};
    if (categorySlug && categorySlug !== 'all') {
      where.category = { slug: categorySlug };
    }

    const [paintings, bestsellerIds] = await Promise.all([
      prisma.painting.findMany({
        where,
        include: {
          artist: true,
          category: { include: { parent: true } },
        },
        orderBy: { created_at: 'desc' },
      }),
      getBestsellerPaintingIds(),
    ]);
    return withBestsellerFlag(paintings, bestsellerIds);
  } catch (error) {
    console.error('Error fetching paintings:', error);
    return [];
  }
}

export async function getPaintingById(id: string) {
  try {
    const [painting, bestsellerIds] = await Promise.all([
      prisma.painting.findUnique({
        where: { id },
        include: {
          artist: true,
          category: { include: { parent: true } },
        },
      }),
      getBestsellerPaintingIds(),
    ]);
    if (!painting) return null;
    return { ...painting, is_bestseller: bestsellerIds.has(painting.id) };
  } catch (error) {
    console.error('Error fetching painting by id:', error);
    return null;
  }
}

// Related paintings for a painting detail page: same artist first, then
// same category, filling up to `limit` without duplicates.
export async function getRelatedPaintings(
  paintingId: string,
  artistId: string,
  categoryId: string,
  limit = 8
) {
  try {
    const byArtist = await prisma.painting.findMany({
      where: { artist_id: artistId, id: { not: paintingId } },
      include: { artist: true, category: true },
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    if (byArtist.length >= limit) return byArtist;

    const byCategory = await prisma.painting.findMany({
      where: {
        category_id: categoryId,
        id: { notIn: [paintingId, ...byArtist.map((p) => p.id)] },
      },
      include: { artist: true, category: true },
      orderBy: { created_at: 'desc' },
      take: limit - byArtist.length,
    });

    const bestsellerIds = await getBestsellerPaintingIds();
    return withBestsellerFlag([...byArtist, ...byCategory], bestsellerIds);
  } catch (error) {
    console.error('Error fetching related paintings:', error);
    return [];
  }
}

export async function getArtists() {
  try {
    return await prisma.artist.findMany({
      include: {
        paintings: {
          take: 3,
          select: {
            id: true,
            title_en: true,
            images: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching artists:', error);
    return [];
  }
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name_en: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
