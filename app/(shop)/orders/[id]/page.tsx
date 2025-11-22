import { prisma } from '@/lib/prisma';
import { formatPrice, formatDate, parseShippingAddress } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

async function getOrder(id: string, userId: string, isAdmin: boolean) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
        delivery: true,
      },
    });

    if (!order) {
      return null;
    }

    if (!isAdmin && order.userId !== userId) {
      return null;
    }

    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/orders/' + params.id);
  }

  const order = await getOrder(params.id, session.user.id, session.user.role === 'ADMIN');

  if (!order) {
    notFound();
  }

  const shippingAddress = parseShippingAddress(order.shippingAddress);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Order Details</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-mono text-lg font-semibold">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
              order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
              order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
              order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Order Date</p>
            <p className="font-semibold">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Payment Status</p>
            <p className="font-semibold">{order.paymentStatus}</p>
          </div>
        </div>

        {order.delivery && (
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
            <p className="font-mono font-semibold">{order.delivery.trackingNumber || 'Not assigned'}</p>
            {order.delivery.carrier && (
              <p className="text-sm text-gray-600 mt-1">Carrier: {order.delivery.carrier}</p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        <div className="text-gray-700">
          <p>{shippingAddress.street}</p>
          <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
          <p>{shippingAddress.country}</p>
          {shippingAddress.phone && <p className="mt-2">Phone: {shippingAddress.phone}</p>}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-4 last:border-b-0">
              <div>
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold">{formatPrice(Number(item.price) * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

