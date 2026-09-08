import { prisma } from './prisma';

export async function getFeaturedPaintings() {
  try {
    return await prisma.painting.findMany({
      where: { is_featured: true },
      include: {
        artist: true,
        category: true,
      },
      take: 8,
      orderBy: { created_at: 'desc' },
    });
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

    return await prisma.painting.findMany({
      where,
      include: {
        artist: true,
        category: true,
      },
      orderBy: { created_at: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching paintings:', error);
    return [];
  }
}

export async function getPaintingById(id: string) {
  try {
    return await prisma.painting.findUnique({
      where: { id },
      include: {
        artist: true,
        category: true,
      },
    });
  } catch (error) {
    console.error('Error fetching painting by id:', error);
    return null;
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
