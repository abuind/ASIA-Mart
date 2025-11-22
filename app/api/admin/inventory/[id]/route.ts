import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

// PATCH - Update inventory quantity
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quantity } = await request.json();

    if (quantity === undefined || quantity < 0) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    const inventory = await prisma.inventory.update({
      where: { id: params.id },
      data: { quantity },
      include: {
        product: true,
      },
    });

    // Update product stock as well
    await prisma.product.update({
      where: { id: inventory.productId },
      data: { stock: quantity },
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

