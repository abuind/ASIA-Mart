import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';

async function getAnalytics() {
  try {
    const [totalRevenue, totalOrders, avgOrderValue, ordersByStatus, recentOrders] = await Promise.all([
      prisma.order.aggregate({
        where: { status: { not: 'CANCELLED' } },
        _sum: { total: true },
      }),
      prisma.order.count(),
      prisma.order.aggregate({
        where: { status: { not: 'CANCELLED' } },
        _avg: { total: true },
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { email: true },
          },
        },
      }),
    ]);

    return {
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      avgOrderValue: avgOrderValue._avg.total || 0,
      ordersByStatus,
      recentOrders,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
      ordersByStatus: [],
      recentOrders: [],
    };
  }
}

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalytics();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Analytics & Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-800">{formatPrice(analytics.totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-800">{analytics.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm text-gray-600 mb-2">Average Order Value</h3>
          <p className="text-3xl font-bold text-gray-800">{formatPrice(analytics.avgOrderValue)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {analytics.ordersByStatus.map((status) => (
              <div key={status.status} className="flex justify-between items-center">
                <span className="text-gray-700">{status.status}</span>
                <span className="font-semibold text-gray-800">{status._count.id}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {analytics.recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center border-b pb-3 last:border-b-0">
                <div>
                  <p className="text-sm font-mono text-gray-600">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-500">{order.user.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(order.total)}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

