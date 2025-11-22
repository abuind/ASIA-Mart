import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/shop/ProductCard';
import { parseImages } from '@/lib/utils';

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'active' },
      take: 8,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-12 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to ASIA Mart</h1>
        <p className="text-xl mb-8">Discover amazing products at unbeatable prices</p>
        <Link
          href="/products"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Shop Now
        </Link>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
          <Link href="/products" className="text-blue-600 hover:text-blue-800 font-semibold">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        {products.length === 0 && (
          <p className="text-center text-gray-500 py-12">No products available yet.</p>
        )}
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/products?category=electronics"
            className="bg-gray-100 rounded-lg p-8 text-center hover:bg-gray-200 transition"
          >
            <h3 className="text-2xl font-semibold text-gray-800">Electronics</h3>
            <p className="text-gray-600 mt-2">Latest gadgets and devices</p>
          </Link>
          <Link
            href="/products?category=clothing"
            className="bg-gray-100 rounded-lg p-8 text-center hover:bg-gray-200 transition"
          >
            <h3 className="text-2xl font-semibold text-gray-800">Clothing</h3>
            <p className="text-gray-600 mt-2">Fashion for everyone</p>
          </Link>
          <Link
            href="/products?category=home-garden"
            className="bg-gray-100 rounded-lg p-8 text-center hover:bg-gray-200 transition"
          >
            <h3 className="text-2xl font-semibold text-gray-800">Home & Garden</h3>
            <p className="text-gray-600 mt-2">Everything for your home</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

