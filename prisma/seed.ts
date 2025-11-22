import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@asiamart.com' },
    update: {},
    create: {
      email: 'admin@asiamart.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      phone: '+1234567890',
    },
  });

  // Create sample customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      name: 'John Doe',
      role: 'CUSTOMER',
      phone: '+1234567891',
    },
  });

  // Create categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
    },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
    },
  });

  const home = await prisma.category.upsert({
    where: { slug: 'home-garden' },
    update: {},
    create: {
      name: 'Home & Garden',
      slug: 'home-garden',
    },
  });

  // Create sample products
  const products = [
    {
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 99.99,
      images: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500']),
      categoryId: electronics.id,
      stock: 50,
      sku: 'ELEC-001',
      status: 'active',
    },
    {
      name: 'Smart Watch',
      description: 'Feature-rich smartwatch with fitness tracking',
      price: 199.99,
      images: JSON.stringify(['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500']),
      categoryId: electronics.id,
      stock: 30,
      sku: 'ELEC-002',
      status: 'active',
    },
    {
      name: 'Cotton T-Shirt',
      description: 'Comfortable 100% cotton t-shirt',
      price: 19.99,
      images: JSON.stringify(['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500']),
      categoryId: clothing.id,
      stock: 100,
      sku: 'CLOTH-001',
      status: 'active',
    },
    {
      name: 'Denim Jeans',
      description: 'Classic fit denim jeans',
      price: 49.99,
      images: JSON.stringify(['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500']),
      categoryId: clothing.id,
      stock: 75,
      sku: 'CLOTH-002',
      status: 'active',
    },
    {
      name: 'Coffee Maker',
      description: 'Programmable coffee maker with timer',
      price: 79.99,
      images: JSON.stringify(['https://images.unsplash.com/photo-1517668808823-f8c76b4864b1?w=500']),
      categoryId: home.id,
      stock: 40,
      sku: 'HOME-001',
      status: 'active',
    },
    {
      name: 'Garden Tools Set',
      description: 'Complete set of gardening tools',
      price: 59.99,
      images: JSON.stringify(['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500']),
      categoryId: home.id,
      stock: 25,
      sku: 'HOME-002',
      status: 'active',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
  }

  // Create inventory records
  const allProducts = await prisma.product.findMany();
  for (const product of allProducts) {
    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        quantity: product.stock,
        location: 'Main Warehouse',
      },
    });
  }

  console.log('Seed data created successfully!');
  console.log('Admin credentials: admin@asiamart.com / admin123');
  console.log('Customer credentials: customer@example.com / customer123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

