import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH - Update delivery
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, trackingNumber, carrier, estimatedDelivery, actualDelivery } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (carrier !== undefined) updateData.carrier = carrier;
    if (estimatedDelivery) updateData.estimatedDelivery = new Date(estimatedDelivery);
    if (actualDelivery) updateData.actualDelivery = new Date(actualDelivery);

    const delivery = await prisma.delivery.update({
      where: { id: params.id },
      data: updateData,
      include: {
        order: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // If delivery is marked as delivered, update order status
    if (status === 'DELIVERED') {
      await prisma.order.update({
        where: { id: delivery.orderId },
        data: { status: 'DELIVERED' },
      });
    }

    return NextResponse.json(delivery);
  } catch (error) {
    console.error('Error updating delivery:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

