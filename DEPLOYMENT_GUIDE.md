# 🚀 5 Alive - Free Deployment Guide

Deploy your multiplayer card game for **FREE** using this step-by-step guide!

## 📦 What You'll Use (All FREE Tiers)

- **Frontend**: [Vercel](https://vercel.com) - Best for React/Vite apps
- **Backend**: [Render](https://render.com) - Supports Node.js + WebSockets
- **Database**: [Supabase](https://supabase.com) - Free PostgreSQL
- **Redis**: [Upstash](https://upstash.com) - Free Redis for sessions
- **Voice**: Agora (already configured)

---

## 🎯 STEP 1: Initialize Git & Push to GitHub

1. **Initialize Git** (if not done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - 5 Alive game"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com/new](https://github.com/new)
   - Name it `5alive-game`
   - Make it **Public** or **Private** (your choice)
   - Don't initialize with README

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/5alive-game.git
   git branch -M main
   git push -u origin main
   ```

---

## 💾 STEP 2: Set Up Supabase (Database)

1. **Sign up**: Go to [supabase.com](https://supabase.com) (free)
2. **Create New Project**:
   - Project name: `5alive`
   - Database Password: **Save this!**
   - Region: Choose closest to you
3. **Get Connection String**:
   - Go to Project Settings → Database
   - Copy the **Connection Pooling** string (URI mode)
   - It looks like: `postgresql://postgres.xxx:PASSWORD@xxx.supabase.co:5432/postgres`
4. **Save for later** - you'll need this for Render

---

## 🔴 STEP 3: Set Up Upstash (Redis)

1. **Sign up**: Go to [upstash.com](https://upstash.com) (free with GitHub)
2. **Create Database**:
   - Click "Create Database"
   - Name: `5alive-redis`
   - Type: Regional
   - Region: Choose closest to you
3. **Get Connection URL**:
   - Click on your database
   - Copy the **REST URL** (or Redis URL)
   - Format: `redis://default:PASSWORD@endpoint.upstash.io:PORT`
4. **Save for later**

---

## 🖥️ STEP 4: Deploy Backend to Render

1. **Sign up**: Go to [render.com](https://render.com) (connect with GitHub)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `5alive-game`
   - Configure:
     - **Name**: `5alive-backend`
     - **Region**: Choose closest to you
     - **Branch**: `main`
     - **Root Directory**: `backend`
     - **Runtime**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

3. **Add Environment Variables** (very important!):
   Click "Advanced" → Add Environment Variables:

   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<paste your Supabase connection string>
   REDIS_URL=<paste your Upstash Redis URL>
   JWT_SECRET=<generate random string - use any password generator>
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-app.vercel.app
   AGORA_APP_ID=a017a84c07a846eda3bb5b0466e88f73
   AGORA_APP_CERTIFICATE=9020f4c8d6234bab9b0b3dce11bbc7f4
   ```

   **Note**: You'll update `CORS_ORIGIN` after deploying frontend

4. **Deploy**: Click "Create Web Service"

5. **Wait for deployment** (5-10 minutes first time)

6. **Save your backend URL**:
   - It will look like: `https://5alive-backend.onrender.com`

---

## 🌐 STEP 5: Deploy Frontend to Vercel

1. **Sign up**: Go to [vercel.com](https://vercel.com) (connect with GitHub)

2. **Import Project**:
   - Click "Add New" → "Project"
   - Import your `5alive-game` repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Add Environment Variables**:
   Click "Environment Variables" → Add:

   ```
   VITE_API_URL=https://5alive-backend.onrender.com
   VITE_SOCKET_URL=https://5alive-backend.onrender.com
   VITE_AGORA_APP_ID=a017a84c07a846eda3bb5b0466e88f73
   ```

   **Replace** `5alive-backend` with your actual Render backend URL!

4. **Deploy**: Click "Deploy"

5. **Wait for deployment** (2-5 minutes)

6. **Your game is live!**
   - URL will be like: `https://5alive-game.vercel.app`

---

## 🔄 STEP 6: Update Backend CORS

Now that you have your frontend URL, update your backend:

1. Go back to **Render Dashboard**
2. Click on your `5alive-backend` service
3. Go to **Environment**
4. Update `CORS_ORIGIN` to your Vercel URL:
   ```
   CORS_ORIGIN=https://5alive-game.vercel.app
   ```
5. Save (backend will auto-redeploy)

---

## 🎮 STEP 7: Run Database Migrations

Your backend needs to set up database tables:

1. Go to **Render Dashboard** → Your backend service
2. Click "Shell" tab
3. Run:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

---

## ✅ STEP 8: Test Your Game!

1. Open your Vercel URL: `https://5alive-game.vercel.app`
2. Create a room
3. Share the link with friends
4. Play! 🎉

---

## 📊 Free Tier Limits

- **Vercel**: Unlimited deployments, 100GB bandwidth/month
- **Render**: 750 hours/month (sleeps after 15 min inactivity)
- **Supabase**: 500MB database, 2GB bandwidth/month
- **Upstash**: 10,000 commands/day

**Note**: Render free tier sleeps after inactivity. First request after sleep takes ~30 seconds to wake up.

---

## 🔧 Troubleshooting

### Backend won't start?
- Check Render logs for errors
- Verify all environment variables are set correctly
- Make sure DATABASE_URL and REDIS_URL are correct

### Frontend can't connect to backend?
- Check VITE_API_URL in Vercel environment variables
- Make sure CORS_ORIGIN is set correctly in Render backend
- Check browser console for errors

### Database errors?
- Make sure you ran Prisma migrations
- Check Supabase connection string is correct

---

## 🚀 Future Scaling (When You Need It)

When your game gets popular and free tiers aren't enough:

1. **Render**: Upgrade to $7/month (no sleep, better performance)
2. **Supabase**: Upgrade to Pro $25/month (8GB database)
3. **Vercel**: Pro $20/month (more bandwidth)
4. **Or move to**: AWS, DigitalOcean, or Railway for more control

---

## 🎉 You're Live!

Share your game URL with friends and start playing!

**Need help?** Check the logs in Render and Vercel dashboards.
