'use client';

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Package, Truck } from 'lucide-react';

interface Delivery {
  id: string;
  status: string;
  trackingNumber: string | null;
  carrier: string | null;
  estimatedDelivery: string | null;
  order: {
    id: string;
    total: number | string;
    user: {
      name: string | null;
      email: string;
    };
  };
}

export default function AdminDeliveryPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await fetch('/api/admin/delivery');
      if (response.ok) {
        const data = await response.json();
        setDeliveries(data);
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDelivery = async (deliveryId: string, updates: any) => {
    try {
      const response = await fetch(`/api/admin/delivery/${deliveryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        fetchDeliveries();
      } else {
        alert('Failed to update delivery');
      }
    } catch (error) {
      console.error('Error updating delivery:', error);
      alert('An error occurred');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_TRANSIT: 'bg-blue-100 text-blue-800',
      OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      RETURNED: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <p>Loading deliveries...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Last-Mile Delivery Management</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estimated Delivery</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deliveries.map((delivery) => (
              <tr key={delivery.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-gray-900">#{delivery.order.id.slice(0, 8)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{delivery.order.user.name || delivery.order.user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={delivery.status}
                    onChange={(e) => updateDelivery(delivery.id, { status: e.target.value })}
                    className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(delivery.status)} border-0`}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="FAILED">Failed</option>
                    <option value="RETURNED">Returned</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    defaultValue={delivery.trackingNumber || ''}
                    placeholder="Enter tracking number"
                    onBlur={(e) => {
                      if (e.target.value) {
                        updateDelivery(delivery.id, { trackingNumber: e.target.value });
                      }
                    }}
                    className="px-2 py-1 border rounded text-sm font-mono w-32"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    defaultValue={delivery.carrier || ''}
                    placeholder="Carrier name"
                    onBlur={(e) => {
                      if (e.target.value) {
                        updateDelivery(delivery.id, { carrier: e.target.value });
                      }
                    }}
                    className="px-2 py-1 border rounded text-sm w-32"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="date"
                    defaultValue={delivery.estimatedDelivery ? new Date(delivery.estimatedDelivery).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        updateDelivery(delivery.id, { estimatedDelivery: e.target.value });
                      }
                    }}
                    className="px-2 py-1 border rounded text-sm"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {delivery.status === 'DELIVERED' && delivery.estimatedDelivery && (
                    <button
                      onClick={() => updateDelivery(delivery.id, { actualDelivery: new Date().toISOString() })}
                      className="text-green-600 hover:text-green-800"
                    >
                      Mark Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {deliveries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No deliveries found</p>
          </div>
        )}
      </div>
    </div>
  );
}

