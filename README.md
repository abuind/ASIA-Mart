# ASIA Mart - E-commerce Platform

A full-featured e-commerce platform built with Next.js 14, TypeScript, Prisma, and PostgreSQL. Features a customer-facing shop and a comprehensive admin panel for managing products, orders, inventory, and last-mile delivery.

## Features

### Shop Frontend
- **Homepage** with featured products and categories
- **Product Listing** with category filters and search
- **Product Detail Pages** with images and descriptions
- **Shopping Cart** with add/remove/update functionality
- **Checkout Process** with address entry
- **Order History** with status tracking
- **User Profile** management
- **Authentication** with NextAuth.js

### Admin Panel
- **Dashboard** with sales overview and statistics
- **Product Management** - CRUD operations for products
- **Order Management** - View, update, and track orders
- **Inventory Management** - Stock levels, alerts, and adjustments
- **Last-Mile Delivery** - Tracking, carrier assignment, status updates
- **Customer Management** - View customer details and order history
- **Analytics & Reports** - Sales reports and statistics

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd asia-mart-ecommerce
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL and NextAuth secret:
```
DATABASE_URL="postgresql://user:password@localhost:5432/asia_mart?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Credentials

After seeding the database, you can use these credentials:

**Admin:**
- Email: `admin@asiamart.com`
- Password: `admin123`

**Customer:**
- Email: `customer@example.com`
- Password: `customer123`

## Project Structure

```
├── app/
│   ├── (shop)/              # Customer-facing shop routes
│   │   ├── page.tsx         # Homepage
│   │   ├── products/        # Product listing & details
│   │   ├── cart/            # Shopping cart
│   │   ├── checkout/        # Checkout process
│   │   ├── orders/         # Order history
│   │   └── profile/        # User profile
│   ├── (admin)/            # Admin panel routes
│   │   ├── dashboard/      # Admin dashboard
│   │   ├── products/       # Product management
│   │   ├── orders/         # Order management
│   │   ├── inventory/      # Inventory management
│   │   ├── delivery/       # Last-mile management
│   │   ├── customers/      # Customer management
│   │   └── analytics/      # Sales analytics
│   ├── api/                # API routes
│   └── auth/               # Authentication pages
├── components/
│   ├── shop/               # Shop UI components
│   ├── admin/              # Admin UI components
│   └── shared/             # Shared components
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # Auth configuration
│   └── utils.ts            # Utility functions
└── prisma/
    ├── schema.prisma       # Database schema
    └── seed.ts             # Seed script
```

## Database Schema

The application uses the following main models:
- **User** - Customers and admins
- **Product** - Product catalog
- **Category** - Product categories
- **Cart** & **CartItem** - Shopping cart
- **Order** & **OrderItem** - Orders
- **Inventory** - Stock management
- **Delivery** - Last-mile tracking
- **Address** - User addresses

## API Routes

### Shop APIs
- `GET /api/products` - List products
- `GET /api/products/[id]` - Get product details
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart` - Update cart item
- `DELETE /api/cart` - Remove cart item
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order details

### Admin APIs
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PATCH /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `GET /api/admin/orders` - List all orders
- `PATCH /api/admin/orders/[id]` - Update order
- `GET /api/admin/inventory` - Get inventory
- `PATCH /api/admin/inventory/[id]` - Update inventory
- `GET /api/admin/delivery` - Get deliveries
- `PATCH /api/admin/delivery/[id]` - Update delivery
- `GET /api/admin/customers` - List customers
- `GET /api/admin/analytics` - Get analytics

## Features in Detail

### Inventory Management
- Real-time stock tracking
- Low stock alerts (≤10 items)
- Multi-location support
- Reserved stock for pending orders
- Stock adjustment interface

### Last-Mile Delivery
- Delivery status tracking
- Tracking number assignment
- Carrier management
- Estimated delivery dates
- Delivery history

### Order Management
- Order status workflow (Pending → Processing → Shipped → Delivered)
- Payment status tracking
- Order search and filtering
- Invoice generation ready
- Customer order history

## Development

### Database Migrations
```bash
npx prisma migrate dev
```

### Seed Database
```bash
npx prisma db seed
```

### Build for Production
```bash
npm run build
npm start
```

## Future Enhancements

- Payment gateway integration (Stripe/PayPal)
- Email notifications
- Product reviews and ratings
- Wishlist functionality
- Advanced search with filters
- Image upload with Cloudinary
- OAuth social login
- Multi-language support
- Advanced analytics with charts

## License

This project is open source and available under the MIT License.

