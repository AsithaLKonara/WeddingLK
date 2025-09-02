# 🔧 Environment Variables Setup Guide

## MongoDB Atlas Connection String Format:
```
mongodb+srv://weddinglk-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/weddinglk?retryWrites=true&w=majority
```

## For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Go to "Settings" → "Environment Variables"
3. Add these variables:

### Required Environment Variables:
```
MONGODB_URI=mongodb+srv://weddinglk-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/weddinglk?retryWrites=true&w=majority
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_FRONTEND_URL=https://your-vercel-url.vercel.app
NODE_ENV=production
```

## For Netlify Deployment:
1. Go to your Netlify project dashboard
2. Go to "Site settings" → "Environment variables"
3. Add the same variables as above

## For Local Development:
Create a `.env.local` file in your project root:
```
MONGODB_URI=mongodb+srv://weddinglk-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/weddinglk?retryWrites=true&w=majority
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## Important Notes:
- Replace `YOUR_PASSWORD` with your actual database user password
- Replace `cluster0.xxxxx` with your actual cluster URL
- The database name `weddinglk` will be created automatically
- Make sure to keep your connection string secure and never commit it to Git
