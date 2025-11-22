import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  price: number | string;
  image: string;
  slug?: string;
}

export function ProductCard({ id, name, price, image, slug }: ProductCardProps) {
  const productLink = slug ? `/products/${slug}` : `/products/${id}`;

  return (
    <Link href={productLink} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative w-full h-64 bg-gray-200">
          <Image
            src={image || '/placeholder-product.jpg'}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{name}</h3>
          <p className="text-xl font-bold text-blue-600">{formatPrice(price)}</p>
        </div>
      </div>
    </Link>
  );
}

