import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

// GET - Fetch inventory
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const lowStock = searchParams.get('lowStock') === 'true';

    const where: any = {};
    if (lowStock) {
      where.quantity = { lte: 10 };
    }

    const inventory = await prisma.inventory.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: {
        quantity: 'asc',
      },
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

