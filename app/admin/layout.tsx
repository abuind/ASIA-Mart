'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Warehouse, 
  Truck, 
  Users,
  BarChart3,
  LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=' + pathname);
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router, pathname]);

  if (status === 'loading' || !session || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/inventory', label: 'Inventory', icon: Warehouse },
    { href: '/admin/delivery', label: 'Last-Mile', icon: Truck },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-bold">ASIA Mart Admin</h1>
            <p className="text-gray-400 text-sm mt-1">Management Panel</p>
          </div>
          <nav className="mt-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-6 py-3 hover:bg-gray-700 transition ${
                    isActive ? 'bg-gray-700 border-r-4 border-blue-500' : ''
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 w-64 p-6 border-t border-gray-700">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center w-full px-6 py-3 hover:bg-gray-700 transition rounded"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {navItems.find(item => pathname === item.href || pathname.startsWith(item.href + '/'))?.label || 'Admin'}
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{session.user.email}</span>
                <Link href="/" className="text-blue-600 hover:text-blue-800">
                  View Shop
                </Link>
              </div>
            </div>
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

