# 🚀 MongoDB Atlas Setup for Vercel Deployment

## ✅ Your MongoDB Connection String:
```
mongodb+srv://asithalakmalkonara11992081:YOUR_PASSWORD@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0
```

## 🔧 Steps to Complete Setup:

### 1. Replace YOUR_PASSWORD
- Go to your MongoDB Atlas dashboard
- Go to "Database Access"
- Find your user `asithalakmalkonara11992081`
- Click "Edit" to see/reset the password
- Replace `YOUR_PASSWORD` in the connection string above

### 2. Create .env.local file
Create a file named `.env.local` in your project root with:
```
MONGODB_URI=mongodb+srv://asithalakmalkonara11992081:YOUR_ACTUAL_PASSWORD@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Set up Vercel Environment Variables
1. Go to your Vercel project dashboard
2. Go to "Settings" → "Environment Variables"
3. Add these variables:

**MONGODB_URI:**
```
mongodb+srv://asithalakmalkonara11992081:YOUR_ACTUAL_PASSWORD@cluster0.ezztfbi.mongodb.net/weddinglk?retryWrites=true&w=majority&appName=Cluster0
```

**OPENAI_API_KEY:**
```
your_openai_api_key_here
```

**NEXT_PUBLIC_FRONTEND_URL:**
```
https://your-vercel-url.vercel.app
```

**NODE_ENV:**
```
production
```

### 4. Test Local Connection
Run this command to test your MongoDB connection:
```bash
npm run dev
```

### 5. Deploy to Vercel
```bash
vercel --prod
```

## 🔒 Security Notes:
- Never commit your `.env.local` file to Git
- Keep your MongoDB password secure
- The `.env.local` file is already in `.gitignore`

## 🎯 Next Steps:
1. Complete the password replacement
2. Create the `.env.local` file
3. Test locally with `npm run dev`
4. Set up Vercel environment variables
5. Deploy with `vercel --prod`
