# NGIC Inventory Management App

This is a Next.js application for inventory management, built with TypeScript and Tailwind CSS.

## Project Structure

The project follows a feature-based structure to easily scale and manage the codebase.

- `/app`: Contains the main pages and layouts of the application (using Next.js App Router).
- `/components`: Contains reusable React components used throughout the application.
- `/lib`: Contains library code, such as database connection clients (e.g., Prisma).
- `/models`: Contains data models or schemas (e.g., for Mongoose or Prisma).
- `/public`: Contains static assets like images and fonts.
- `/styles`: This project uses Tailwind CSS, configured in `tailwind.config.ts` and `globals.css`.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Next Steps

- **Authentication**: Implement user authentication using NextAuth.js. The suggested API route would be in `app/api/auth/[...nextauth]/route.ts`.
- **Database**: Connect to a database (like PostgreSQL with Prisma, or MongoDB with Mongoose) to store and manage inventory data.
- **API Routes**: Create API endpoints to handle data fetching and mutations for products, categories, etc.
- **State Management**: For more complex client-side state, consider using a state management library like Zustand or Redux Toolkit.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
