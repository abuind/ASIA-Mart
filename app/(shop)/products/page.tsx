import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/shop/ProductCard';
import { parseImages } from '@/lib/utils';
import { Suspense } from 'react';

async function getProducts(searchParams: { category?: string; search?: string; minPrice?: string; maxPrice?: string }) {
  try {
    const where: any = { status: 'active' };

    if (searchParams.category) {
      const category = await prisma.category.findUnique({
        where: { slug: searchParams.category },
      });
      if (category) {
        where.categoryId = category.id;
      }
    }

    if (searchParams.search) {
      where.OR = [
        { name: { contains: searchParams.search, mode: 'insensitive' } },
        { description: { contains: searchParams.search, mode: 'insensitive' } },
      ];
    }

    if (searchParams.minPrice || searchParams.maxPrice) {
      where.price = {};
      if (searchParams.minPrice) {
        where.price.gte = parseFloat(searchParams.minPrice);
      }
      if (searchParams.maxPrice) {
        where.price.lte = parseFloat(searchParams.maxPrice);
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; minPrice?: string; maxPrice?: string };
}) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">All Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Categories</h3>
              <div className="space-y-2">
                <a
                  href="/products"
                  className={`block px-3 py-2 rounded ${
                    !searchParams.category
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </a>
                {categories.map((category) => (
                  <a
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className={`block px-3 py-2 rounded ${
                      searchParams.category === category.slug
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const images = parseImages(product.images);
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={images[0] || '/placeholder-product.jpg'}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

