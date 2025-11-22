# Vercel Deployment Guide

## Important: Database Configuration

**SQLite does NOT work on Vercel** because Vercel's serverless functions use a read-only file system. You need to use a cloud database.

## Recommended Database Options

### Option 1: Vercel Postgres (Recommended)
1. Go to your Vercel project dashboard
2. Navigate to Storage → Create Database → Postgres
3. Create a new Postgres database
4. Copy the connection string

### Option 2: Supabase (Free tier available)
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (use the "Connection string" under "Connection pooling")

### Option 3: Neon (Free tier available)
1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string

## Steps to Deploy

### 1. Update Prisma Schema for PostgreSQL

The schema is already compatible with PostgreSQL. If you're using SQLite locally, you'll need to update the schema:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

Also, you can use enums with PostgreSQL:
- Change `role String @default("CUSTOMER")` back to `role UserRole @default(CUSTOMER)`
- Change `status String` back to `status OrderStatus`
- etc.

### 2. Set Environment Variables in Vercel

In your Vercel project dashboard, go to Settings → Environment Variables and add:

```
DATABASE_URL=your-postgres-connection-string
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-random-secret-key-here
```

**Important:**
- `NEXTAUTH_URL` should be your Vercel deployment URL
- `NEXTAUTH_SECRET` should be a long random string (you can generate one with: `openssl rand -base64 32`)

### 3. Update package.json

Add a postinstall script to generate Prisma client during build:

```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### 4. Deploy

1. Push your code to GitHub/GitLab/Bitbucket
2. Import the project in Vercel
3. Vercel will automatically detect Next.js and start building
4. After deployment, run database migrations:

```bash
npx prisma db push
npx prisma db seed
```

Or use Vercel's CLI:
```bash
vercel env pull .env.local
npx prisma db push
npx prisma db seed
```

## Alternative: Keep SQLite for Local, PostgreSQL for Production

You can use different databases for local and production by:

1. Keep SQLite schema for local development
2. Create a separate `schema.postgresql.prisma` for production
3. Use environment variables to switch between them

Or use a single schema that works with both (using String types instead of enums).

## Troubleshooting

### Build fails with "Prisma Client not generated"
- Add `"postinstall": "prisma generate"` to package.json scripts
- Make sure Prisma is in `dependencies`, not just `devDependencies`

### Database connection errors
- Check that `DATABASE_URL` is set correctly in Vercel
- Make sure your database allows connections from Vercel's IPs
- For Supabase/Neon, use the connection pooling URL

### Environment variables not working
- Make sure variables are set for "Production", "Preview", and "Development"
- Redeploy after adding new environment variables

## Quick Checklist

- [ ] Database provider changed to PostgreSQL in schema
- [ ] Environment variables set in Vercel dashboard
- [ ] `postinstall` script added to package.json
- [ ] Code pushed to Git repository
- [ ] Project imported/connected in Vercel
- [ ] Database migrations run after first deployment
- [ ] Database seeded with initial data

