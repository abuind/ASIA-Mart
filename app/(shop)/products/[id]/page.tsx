import { prisma } from '@/lib/prisma';
import { formatPrice, parseImages } from '@/lib/utils';
import Image from 'next/image';
import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { notFound } from 'next/navigation';

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        inventory: true,
      },
    });
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getRelatedProducts(categoryId: string, productId: string) {
  try {
    return await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: productId },
        status: 'active',
      },
      take: 4,
    });
  } catch (error) {
    return [];
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);
  const availableStock = product.inventory?.quantity || product.stock;
  const images = parseImages(product.images);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
            <Image
              src={images[0] || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1, 5).map((image, index) => (
                <div key={index} className="relative w-full h-24 bg-gray-200 rounded overflow-hidden">
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-blue-600 mb-6">{formatPrice(product.price)}</p>

          <div className="mb-6">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {product.category.name}
            </span>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              SKU: <span className="font-mono">{product.sku}</span>
            </p>
            <p className="text-sm text-gray-600">
              Stock: <span className={availableStock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {availableStock > 0 ? `${availableStock} available` : 'Out of stock'}
              </span>
            </p>
          </div>

          {availableStock > 0 ? (
            <AddToCartButton productId={product.id} />
          ) : (
            <button
              disabled
              className="w-full bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => {
              const relatedImages = parseImages(relatedProduct.images);
              return (
                <div key={relatedProduct.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <a href={`/products/${relatedProduct.id}`} className="block">
                    <div className="relative w-full h-48 bg-gray-200">
                      <Image
                        src={relatedImages[0] || '/placeholder-product.jpg'}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{relatedProduct.name}</h3>
                    <p className="text-blue-600 font-bold">{formatPrice(relatedProduct.price)}</p>
                  </div>
                </a>
              </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

