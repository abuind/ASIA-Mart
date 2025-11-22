'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              ASIA Mart
            </Link>
            <div className="hidden md:flex md:ml-10 md:space-x-8">
              <Link href="/products" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                Products
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                Categories
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600">
              <ShoppingCart className="w-6 h-6" />
            </Link>

            {session ? (
              <>
                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/admin/dashboard"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Admin
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                    <User className="w-5 h-5" />
                    <span className="hidden md:inline">{session.user.name || session.user.email}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Orders
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
              >
                Sign In
              </Link>
            )}

            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link href="/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Products
            </Link>
            <Link href="/categories" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Categories
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

