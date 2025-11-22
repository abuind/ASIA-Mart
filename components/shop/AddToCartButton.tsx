'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
}

export function AddToCartButton({ productId, quantity = 1 }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/products/' + productId);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        router.push('/cart');
        router.refresh();
      } else {
        alert('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center space-x-2 disabled:opacity-50"
    >
      <ShoppingCart className="w-5 h-5" />
      <span>{loading ? 'Adding...' : 'Add to Cart'}</span>
    </button>
  );
}

